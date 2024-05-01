const BookModel = require("../Models/Book")
const Log = require('../config/logsCreation')
const util = require("util");
const AuthorModel = require("../Models/Author");

exports.saveBook = async (req, res) =>
{
    try{
        Log("debug", "book", "create book request body", util.inspect(req.body, {depth: null}))
        const {isValidationFailed, msg} = await validation(req.body);

        if(isValidationFailed){
            return res.status(400).json({
                success: false,
                status: 400,
                message: msg,
                data: []
            })
        }

        const {title, author_id, published_date, user_details, isbn} = req.body
        const userId = user_details?.id
        const result = await BookModel.create({title, author_id: author_id, published_date, created_by: userId, isbn})

        if(!result){
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Failed to create book.",
                data: []
            })
        }

        return res.status(200).json({
            success: true,
            status: 200,
            data: result,
            message: "Book is created successfully."
        })

    } catch(e){
        Log('error', 'book', "failed to create book", util.inspect(e, {depth: null}))
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

const validation = async (req, isUpdate = true) => {
    const errors = [];

    if(!req?.title){
        errors.push("Title is missing");
    }

    if(!req?.author_id){
        errors.push("Author is missing");
    }

    if(!req?.published_date){
        errors.push("Publish Date is missing");
    }

    const auth = await AuthorModel.findById(req?.author_id)
    if(!auth){
        errors.push("Invalid auth id");
    }

    if(isUpdate){
        if(!req?.isbn){
            errors.push("Book isbn is missing");
        }

        const isbn = await BookModel.findOne({isbn: req?.isbn})
        if(isbn){
            errors.push("Isbn no can't be duplicate");
        }
    }
    const isValidationFailed = errors.length > 0;
    const msg = isValidationFailed ? errors[0] : '';

    return {isValidationFailed, msg};
}

exports.updateBook = async (req, res) => {
    try {
        Log("debug", "book", "update book request body", util.inspect(req.body, {depth: null}))
        const {isValidationFailed, msg} = await validation(req.body, false);

        if (isValidationFailed) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: msg,
                data: []
            })
        }

        const {title, author_id, published_date} = req.body
        const bookId = req?.params?.id
        const bookDetails = await BookModel.findById(bookId)
        console.log(bookDetails)
        if (!bookDetails) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid book",
                data: []
            })
        }

        const updateData = await BookModel.findByIdAndUpdate(bookId, {
            $set: {
                title: title,
                author_id: author_id,
                published_date: published_date,
            }
        }, {new: true})
        if (!updateData) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Failed to update book.",
                data: []
            })
        }

        return res.status(200).json({
            success: false,
            status: 400,
            message: "Book updated.",
            data: updateData
        })

    } catch (e) {
        Log('error', 'book', "failed to update book", util.inspect(e, {depth: null}))
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

exports.byId = async (req, res) => {
    try {
       const bookId = req?.params?.id
        const bookDetails = await BookModel.findById(bookId)
        if (!bookDetails) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid book",
                data: []
            })
        }

        return res.status(200).json({
            success: false,
            status: 200,
            message: "Book fetched.",
            data: bookDetails
        })

    } catch(e){
        Log('error', 'book', "failed to get book", util.inspect(e, {depth: null}))
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

exports.inActiveBook = async (req, res) => {
    try {
        const bookId = req?.params?.id
        const bookDetails = await BookModel.findById(bookId)
        if (!bookDetails) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid book",
                data: []
            })
        }

        const updateValue = await BookModel.findByIdAndUpdate(bookId, {$set: {status: 2}}, {new: true})
        return res.status(200).json({
            success: false,
            status: 200,
            message: "Book is inactive.",
            data: updateValue
        })

    } catch(e){
        Log('error', 'book', "failed to inactive book", util.inspect(e, {depth: null}))
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

exports.getAll = async (req, res) => {
    try {
        const bookDetails = await BookModel.find()
        return res.status(200).json({
            success: false,
            status: 200,
            message: "Book fetched.",
            data: bookDetails
        })

    } catch(e){
        Log('error', 'book', "failed to get book", util.inspect(e, {depth: null}))
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

exports.filter = async (req, res) => {
    try {
        const { year, author } = req.query;
        if (year) {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31);
            const result = await BookModel.find({published_date: { $gte: startOfYear, $lte: endOfYear }})
            return res.status(200).json({
                success: false,
                status: 200,
                message: "Book fetched.",
                data: result
            })
        }

        // console.log(result);
        //
        if (author) {
            const authorObj = await AuthorModel.findOne({ name: author });
            if (!authorObj) return res.status(200).json({
                success: false,
                status: 200,
                message: "Author not found.",
                data: []
            });
        }
    } catch(e){
        Log('error', 'book', "failed to filter book", util.inspect(e, {depth: null}))
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

