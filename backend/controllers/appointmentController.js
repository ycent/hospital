const { run, query, get } = require('../config/db');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Patient
const createAppointment = async (req, res) => {
    const { doctor_id, date, time } = req.body;
    const patient_id = req.user.id;

    if (!doctor_id || !date || !time) {
        return res.status(400).json({ message: 'Please provide all details' });
    }

    try {
        // Prevent double booking for same doctor/date/time
        // We only check if status is Scheduled or Completed (allow booking if cancelled)
        const existing = await get(
            'SELECT * FROM Appointments WHERE doctor_id = ? AND date = ? AND time = ? AND status != "Cancelled"',
            [doctor_id, date, time]
        );

        if (existing) {
            return res.status(400).json({ message: 'Doctor is already booked for this time' });
        }

        const result = await run(
            'INSERT INTO Appointments (patient_id, doctor_id, date, time, status) VALUES (?, ?, ?, ?, ?)',
            [patient_id, doctor_id, date, time, 'Scheduled']
        );

        res.status(201).json({ id: result.id, patient_id, doctor_id, date, time, status: 'Scheduled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all appointments (Filtered by Role)
// @route   GET /api/appointments
// @access  Patient / Doctor / Admin
const getAppointments = async (req, res) => {
    const role = req.user.role;
    const userId = req.user.id;

    let sql = `
        SELECT a.id, a.date, a.time, a.status, 
               p.name as patient_name, 
               d.specialization, 
               du.name as doctor_name
        FROM Appointments a
        JOIN Users p ON a.patient_id = p.id
        JOIN Doctors d ON a.doctor_id = d.id
        JOIN Users du ON d.user_id = du.id
    `;
    let params = [];

    if (role === 'patient') {
        sql += ' WHERE a.patient_id = ?';
        params.push(userId);
    } else if (role === 'doctor') {
        // Find doctor_id for this user
        const doctor = await get('SELECT id FROM Doctors WHERE user_id = ?', [userId]);
        if (doctor) {
            sql += ' WHERE a.doctor_id = ?';
            params.push(doctor.id);
        } else {
            return res.json([]); 
        }
    }
    // admin gets all

    sql += ' ORDER BY a.date DESC, a.time DESC';

    try {
        const appointments = await query(sql, params);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Doctor
const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Scheduled, Completed, Cancelled
    const userId = req.user.id;

    if (!['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const appointment = await get('SELECT * FROM Appointments WHERE id = ?', [id]);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Only the assigned doctor can update the status
        const doctor = await get('SELECT id FROM Doctors WHERE user_id = ?', [userId]);
        if (!doctor || doctor.id !== appointment.doctor_id) {
             return res.status(403).json({ message: 'Not authorized to update this appointment' });
        }

        await run('UPDATE Appointments SET status = ? WHERE id = ?', [status, id]);
        
        res.json({ message: 'Appointment updated successfully', status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel an appointment
// @route   DELETE /api/appointments/:id
// @access  Patient
const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const appointment = await get('SELECT * FROM Appointments WHERE id = ?', [id]);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Only the patient who booked can cancel
        if (appointment.patient_id !== userId) {
            return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
        }

        await run('UPDATE Appointments SET status = "Cancelled" WHERE id = ?', [id]);
        
        res.json({ message: 'Appointment cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointment,
    cancelAppointment
};
