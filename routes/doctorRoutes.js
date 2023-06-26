const express = require('express')
const authmiddleware = require('../middlewares/authmiddleware')
const { getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
    doctorAppointmentsController,
    updateStatusController
} = require('../controllers/doctorController')
const router = express.Router()

router.post('/getDoctorInfo', authmiddleware, getDoctorInfoController)

router.post('/updateProfile', authmiddleware, updateProfileController)

router.post("/getDoctorById", authmiddleware, getDoctorByIdController);

router.get(
    "/doctor-appointments",
    authmiddleware,
    doctorAppointmentsController
);

router.post("/update-status", authmiddleware, updateStatusController);


module.exports = router