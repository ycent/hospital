const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointment, cancelAppointment } = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAppointments)
    .post(protect, restrictTo('patient'), createAppointment);

router.route('/:id')
    .put(protect, restrictTo('doctor'), updateAppointment)
    .delete(protect, restrictTo('patient'), cancelAppointment);

module.exports = router;
