const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')
const url = 'mongodb://localhost/StatusQ_DB_New'

const app = express()

mongoose.connect(url, {useNewUrlParser: true})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})

app.use(express.json())
app.use(cors())
app.use(cookieParser())

const alienRouter = require('./routes/aliens')
app.use('/aliens', alienRouter)

const userRouter = require('./routes/users')
app.use('/users', userRouter)

const reviewRouter = require('./routes/reviews')
app.use('/reviews', reviewRouter)

const promoterRouter = require('./routes/promoters')
app.use('/promoters', promoterRouter)

app.listen(9000, () => {
    console.log('Server started')
})