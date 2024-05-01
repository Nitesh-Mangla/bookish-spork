const AuthorModel = require('../Models/Author')
const Log = require('../config/logsCreation')
const util = require("util");

exports.save = async (req, res) => {
    try{
        Log("debug", "author", "create author request body", util.inspect(req.body, {depth: null}))
        const {isValidationFailed, msg} = validation(req.body);

        if(isValidationFailed){
            return res.status(400).json({
                success: false,
                status: 400,
                message: msg,
                data: []
            })
        }

        const {name, country, birth_date, user_details} = req.body
        const userId = user_details?.id
        const result = await AuthorModel.create({name, country, birth_date, created_by: userId})

        if(!result){
            res.status(400).json({
                success: false,
                status: 400,
                message: "Failed to create author.",
                data: []
            })
        }

        return res.status(200).json({
            success: true,
            status: 200,
            data: result,
            message: "Auth is created successfully."
        })

    } catch(e){
        Log('error', 'author', "failed to create author", util.inspect(e, {depth: null}))
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

const validation = (req) => {
    const errors = [];

    if(!req?.name){
        errors.push("Author name is missing");
    }

    if(!req?.country){
        errors.push("Author country is missing");
    }

    if(!req?.birth_date){
        errors.push("Author dob is missing");
    }

    const isValidationFailed = errors.length > 0;
    const msg = isValidationFailed ? errors[0] : '';

     console.log(msg)
    return {isValidationFailed, msg};
}

exports.getAllAuthor = async (req, res) => {
    try {
        const bookDetails = await AuthorModel.find()
        return res.status(200).json({
            success: false,
            status: 200,
            message: "Authers fetched.",
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