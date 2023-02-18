const mongoose = require('mongoose')

const promoterReviewSchema = new mongoose.Schema({
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

module.exports = mongoose.model('PromoterReview', promoterReviewSchema)