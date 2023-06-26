const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const doctorModel = require("../models/doctorModel")
const appointmentModel = require("../models/appointmentModel")
const moment = require("moment")

//register
const registercontroller = async (req, res) => {
    try {
        const exisituser = await userModel.findOne({ email: req.body.email })
        if (exisituser) {
            return res.status(200).send({ message: "user already exist", success: false })
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)
        req.body.password = hashedpassword
        const newuser = new userModel(req.body)
        await newuser.save()
        res.status(201).send({ message: 'Register successfullt', success: true })
    } catch (error) {
        res.status(500).send({ success: false, message: 'Register controller error' })
    }
}




const logincontroller = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: 'user not found', success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({ message: "Invaliad Email or Password", success: false })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).send({ message: 'Login Successfully', success: true, token })
    } catch (error) {
        res.status(500).send({ message: `Error In Login controller ${error.message}` })
    }
}


const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId })
        user.password = undefined
        if (!user) {
            return res.status(200).send({
                message: "User Not Found",
                success: false
            })
        } else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (error) {
        res.status(500).send({
            message: "auth error",
            success: false,
            error
        })
    }
}

//apply doctor controller
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: 'pending' })
        await newDoctor.save()
        const adminUser = await userModel.findOne({ isAdmin: true })
        const notification = adminUser.notification
        notification.push({
            type: 'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: '/admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, { notification })
        res.status(201).send({
            success: true,
            message: "doctor account applied succesfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error applying for doctor"
        })
    }
}

const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        const seennotification = user.seennotification
        const notification = user.notification
        seennotification.push(...notification)
        user.notification = []
        user.seennotification = notification
        const updateduser = await user.save()
        res.status(200).send({
            success: true,
            message: "all notification read",
            data: updateduser
        })
    } catch (error) {
        res.status(500).send({
            message: "error in notification",
            success: false,
            error
        })
    }
}

const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        user.notification = []
        user.seennotification = []
        const updateuser = await user.save()
        updateuser.password = undefined
        res.status(200).send({
            success: true,
            message: "notification delete successfully",
            data: updateuser
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'unable to delete all notification',
            error
        })
    }
}

const getAllDocotrsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "approved" });
        res.status(200).send({
            success: true,
            message: "Docots Lists Fetched Successfully",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Errro WHile Fetching DOcotr",
        });
    }
};

const bookeAppointmnetController = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        req.body.status = "pending";
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        user.notification.push({
            type: "New-appointment-request",
            message: `A new Appointment Request from ${req.body.userInfo.name}`,
            onCLickPath: "/user/appointments",
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment Book succesfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Booking Appointment",
        });
    }
};

const bookingAvailabilityController = async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YY").toISOString();
        const fromTime = moment(req.body.time, "HH:mm")
            .subtract(1, "hours")
            .toISOString();
        const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: {
                $gte: fromTime,
                $lte: toTime,
            },
        });
        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointments not Availibale at this time",
                success: true,
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointments available",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In Booking",
        });
    }
};

const userAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({
            userId: req.body.userId,
        });
        res.status(200).send({
            success: true,
            message: "Users Appointments Fetch SUccessfully",
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In User Appointments",
        });
    }
};


module.exports = {
    logincontroller,
    registercontroller,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDocotrsController,
    bookeAppointmnetController,
    bookingAvailabilityController,
    userAppointmentsController
}