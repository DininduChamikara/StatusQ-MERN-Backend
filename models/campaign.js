const mongoose = require('mongoose')

const campaignSchema = new mongoose.Schema({
    clientId: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    selectedAdvertisements: {
        type: Array(),
        required: true
    },
    finalizedExpectedViewsAmount: {
        type: Intl,
        required: true
    },
    viewsFromEach: {
        type: Intl,
        required: true
    },
    numberOfPromoterSelections: {
        type: Intl,
        required: true
    },
    selectedPromoterIdList: {
        type: Array(),
        required: true
    },
    systemFee: {
        type: Intl,
        required: true
    },
    campaignCost: {
        type: Intl,
        required: true
    },
    createdTime: {
        type: Date,
        required: true
    },
    state: {
        type: String,
        required: true
    }    
})

module.exports = mongoose.model('Campaign', campaignSchema)