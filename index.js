require('dotenv').config()
const express = require('express')
const sequelize =  require('./db')
const models = require('./models/models')
const errorHandler  = require('./middlewaires/ErrorHandlerMiddlewaire')
const cors = require('cors')
const router = require('./routes/index')
const PORT = process.env.PORT||5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use(errorHandler)

const start  = async () => {
    try {
       await sequelize.authenticate()
       await sequelize.sync()
        app.listen(PORT,()=> console.log(`server run !!! ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}


start()

