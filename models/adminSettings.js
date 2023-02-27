const { Decimal128 } = require('mongodb')
const mongoose = require('mongoose')

const adminSettingsSchema = new mongoose.Schema({
    maxAdPostsForCampaign: {
        type: Intl,
    },
    costPerView:{
        type: Number,
    },
    systemFee:{
        type: Number,
    },
    minimumThreshold: {
        type: Number,
    },
    acceptTimeDuration: {
        type: Intl,
    },
    completeTimeDuration: {
        type: Intl,
    },
    updatedDate: {
        type: Date,
        required: true
    },
})

module.exports = mongoose.model('AdminSettings', adminSettingsSchema)