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
    createdTime: {
        type: Date,
        required: true,
    },
    imgUrl: {
        type: String,
    },
    contactName: {
        type: String,
    },
    contactEmail: {
        type: String,
    },
    contactPhone: {
        type: String,
    },
    accountStatus: {
        type: String,
    },
    bankName: {
        type: String,
    },
    branchName: {
        type: String,
    },
    branchCode: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    accountHolderName: {
        type: String,
    },
    state: {
        type: String,
        required: true,
        default:"ACTIVE"
    },
})

module.exports = mongoose.model('User', userSchema)