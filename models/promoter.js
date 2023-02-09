const mongoose = require('mongoose')

const promoterSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    updatedTime: {
        type: Date,
        require: true
    },
    fullName: {
        type: String,
        required: true
    },
    nameWithInit: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
    },
    gender:{
        type: String,
        required: true,
    },
    nic: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    postcode: {
        type: String,
    },
    province: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    educationalCategory: {
        type: String,
        required: true
    },
    socialMediaList: {
        type: Array(),
        required: true
    },
    promoterGenderAudienceList: {
        type: Array(),
    },
    promoterAudienceCategoryList: {
        type: Array(),
    },
    state: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Promoter', promoterSchema)