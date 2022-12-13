const cookieParser = require('cookie-parser')
const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/StatusQ_DB_New'

const app = express()

mongoose.connect(url, {useNewUrlParser: true})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})

app.use(express.json())
app.use(cookieParser())

const alienRouter = require('./routes/aliens')
app.use('/aliens', alienRouter)

const userRouter = require('./routes/users')
app.use('/users', userRouter)

app.listen(9000, () => {
    console.log('Server started')
})