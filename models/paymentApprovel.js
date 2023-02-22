const mongoose = require('mongoose')

const paymentApprovelSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
    },
    promoterId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    paymentAmount: {
        type: Intl,
        required: true,
    },
    paymentType: {
        type: String,
        required: true
    },    
    state: {
        type: String,
        required: true,
        default:"ACTIVE"
    },
})

module.exports = mongoose.model('PaymentApprovel', paymentApprovelSchema)