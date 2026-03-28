const { run, get, query } = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public / Patient / Admin
const getDoctors = async (req, res) => {
    try {
        const doctors = await query(`
            SELECT d.id as doctor_id, u.id as user_id, u.name, u.email, d.specialization 
            FROM Doctors d
            JOIN Users u ON d.user_id = u.id
        `);
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a doctor (User + Doctor record)
// @route   POST /api/doctors
// @access  Admin
const createDoctor = async (req, res) => {
    const { name, email, password, specialization } = req.body;

    if (!name || !email || !password || !specialization) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

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
        const userResult = await run(
            'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'doctor']
        );

        // Create doctor
        if (userResult.id) {
            const doctorResult = await run(
                'INSERT INTO Doctors (user_id, specialization) VALUES (?, ?)',
                [userResult.id, specialization]
            );
            res.status(201).json({
                doctor_id: doctorResult.id,
                user_id: userResult.id,
                name,
                email,
                specialization
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a doctor
// @route   PUT /api/doctors/:id
// @access  Admin
const updateDoctor = async (req, res) => {
    const { id } = req.params; // doctor id
    const { name, specialization } = req.body;

    try {
        const doctor = await get('SELECT * FROM Doctors WHERE id = ?', [id]);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (specialization) {
            await run('UPDATE Doctors SET specialization = ? WHERE id = ?', [specialization, id]);
        }
        
        if (name) {
            await run('UPDATE Users SET name = ? WHERE id = ?', [name, doctor.user_id]);
        }
        
        res.json({ message: 'Doctor updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Admin
const deleteDoctor = async (req, res) => {
    const { id } = req.params; // doctor id

    try {
        const doctor = await get('SELECT * FROM Doctors WHERE id = ?', [id]);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Cascading delete is set up, but sqlite needs foreign keys enforced if using CASCADE
        // For safety, let's delete both, or deleting User deletes Doctor.
        // We delete the user, and CASCADE should delete doctor. If not, delete doctor explicitely.
        await run('DELETE FROM Users WHERE id = ?', [doctor.user_id]);
        
        res.json({ message: 'Doctor removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
};
