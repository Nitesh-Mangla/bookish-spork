const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author"
    },
    published_date: {
        type: Date,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    status: {
      type: Number,
      default: 1
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

module.exports = mongoose.model("Book", BookSchema);