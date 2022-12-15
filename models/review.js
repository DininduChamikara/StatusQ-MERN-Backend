const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    ratingCount: {
        type: Intl,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
    },
})

module.exports = mongoose.model('Review', reviewSchema)