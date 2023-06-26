const express = require("express");
const { logincontroller,
    registercontroller,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDocotrsController,
    bookeAppointmnetController,
    bookingAvailabilityController,
    userAppointmentsController
} = require("../controllers/userController");
const authmiddleware = require("../middlewares/authmiddleware");

const router = express.Router();
//login
router.post('/login', logincontroller)

//register
router.post("/register", registercontroller)

//Auth
router.post('/getUserData', authmiddleware, authController)

//apply-doctor
router.post('/apply-doctor', authmiddleware, applyDoctorController)

//get notification
router.post('/get-all-notification', authmiddleware, getAllNotificationController)

//delete notification
router.post('/delete-all-notification', authmiddleware, deleteAllNotificationController)

router.get("/getAllDoctors", authmiddleware, getAllDocotrsController);

//BOOK APPOINTMENT
router.post("/book-appointment", authmiddleware, bookeAppointmnetController);

//Booking Avliability
router.post(
    "/booking-availbility",
    authController,
    bookingAvailabilityController
);

//Appointments List
router.get("/user-appointments", authmiddleware, userAppointmentsController);
module.exports = router