const jwt = require("jsonwebtoken")
require('dotenv').config()

exports.tokenValidate = async (req, res, next) => {
    try {
        let token = req.headers?.authorization && req.headers?.authorization.replace("Bearer", "");
        if(!token){
            return res.status(401).json({
                success: false,
                data: [],
                status: 401,
                message: "Validate Header."
            });
        }

        const userDetails = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!userDetails?.id){
            return res.status(401).json({
                success: false,
                data: [],
                status: 401,
                message: "Validate Header."
            });
        }

        req.body.user_details = userDetails
        next()
    } catch(e){
        return res.status(500).json({
            success: false,
            data: [],
            status: 500,
            message: e.message
        })
    }
}

exports.validateHeader = (req, res, next) => {
    try {
        if(!req.headers?.authorization){
            return res.status(401).json({
                success: false,
                data: [],
                status: 401,
                message: "Validate Header."
            })
        }
        next();
    } catch(e){
        return res.status(500).json({
            success: false,
            data: [],
            status: 500,
            message: e.message
        })
    }
}