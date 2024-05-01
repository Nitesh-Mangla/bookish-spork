const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    birth_date: {
        type: Date,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at:{
        type: Date,
        default: Date.now()
    },
    created_by:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Author", AuthorSchema)