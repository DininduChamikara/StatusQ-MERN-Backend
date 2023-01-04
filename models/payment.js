const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    dateTime: {
        type: Date,
        required: true
    },
    senderRole: {
        type: String,
        required: true
    },
    senderID: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    campaignId:{
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
    },
    amount: {
        type: Intl,
        required: true,
    },
    state: {
        type: String,
        required: true,
        default:"ACTIVE"
    },
})

module.exports = mongoose.model('Payment', paymentSchema)