const express = require("express")
const { getAllUsersController, getAllDoctorController, changeAccountStatusConroller } = require("../controllers/adminController")
const authmiddleware = require("../middlewares/authmiddleware")



const router = express.Router()

//GETmethod
router.get('/getAllUsers', authmiddleware, getAllUsersController)

router.get('/getAllDoctors', authmiddleware, getAllDoctorController)

//post method
router.post('/changeAccountStatus', authmiddleware, changeAccountStatusConroller)

module.exports = router