const mongoose = require('mongoose')

const promoterCampaignSchema = new mongoose.Schema({
    clientId: {
        type: String,
        required: true
    },
    promoterId: {
        type: String,
        required: true
    },
    campaignId: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    paymentApproved: {
        type: Boolean,
        required: true,
        default: false
    }  
})

module.exports = mongoose.model('PromoterCampaign', promoterCampaignSchema)