const mongoose = require('mongoose')

const Users = mongoose.Schema({
    name: {
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
    contact_no: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 1
    },
    profile:{
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model("User", Users)