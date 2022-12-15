const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType:{
        type: String,
        required: true,
        default:"NORMAL_USER"
    },
    state: {
        type: String,
        required: true,
        default:"ACTIVE"
    },
})

module.exports = mongoose.model('User', userSchema)