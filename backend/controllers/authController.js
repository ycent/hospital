const { run, get } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_key_for_academic_project', {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Role can only be 'patient' or 'doctor' during regular registration, but doctors should prob be created by admin
    // For simplicity, let's allow patient registration. If role is provided as admin, block it.
    const userRole = (role === 'doctor' || role === 'patient') ? role : 'patient';

    try {
        // Check if user exists
        const userExists = await get('SELECT * FROM Users WHERE email = ?', [email]);
        
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const result = await run(
            'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, userRole]
        );

        if (result) {
            res.status(201).json({
                _id: result.id,
                name,
                email,
                role: userRole,
                token: generateToken(result.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user email
        const user = await get('SELECT * FROM Users WHERE email = ?', [email]);

        if (user && (await bcrypt.compare(password, user.password))) {
            let doctorId = null;
            if (user.role === 'doctor') {
                const doctor = await get('SELECT id FROM Doctors WHERE user_id = ?', [user.id]);
                if (doctor) {
                    doctorId = doctor.id;
                }
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                doctorId: doctorId,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
