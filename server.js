const express = require('express')
const cors = require("cors")
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connectdb = require('./config/db')
const path = require("path")
const router = require('./routes/userRoutes')
const adminrouter = require("./routes/adminRoutes")
const doctorRouter = require('./routes/doctorRoutes')

//rest object
const app = express()

//env config
dotenv.config()
app.use(cors())

//mongodb connection
connectdb()



//middlewares
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/user', router)
app.use('/api/admin', adminrouter)
app.use('/api/doctor', doctorRouter)

// port
const port = process.env.PORT
const hostname = process.env.HOSTNAME
//listen port
app.listen(port, "0.0.0.0", () => {
    console.log(`server Running In ${process.env.NODE_MODE} Mode on port ${port}`.bgCyan.white)
})

