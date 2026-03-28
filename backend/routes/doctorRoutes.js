const express = require('express');
const router = express.Router();
const { getDoctors, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getDoctors)
    .post(protect, restrictTo('admin'), createDoctor);

router.route('/:id')
    .put(protect, restrictTo('admin'), updateDoctor)
    .delete(protect, restrictTo('admin'), deleteDoctor);

module.exports = router;
