const UserModel = require('../Models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Log = require("../Config/logsCreation");
const util = require("util");
require('dotenv').config()

const validateUserRequest = async (body) => {
    const errors = [];

    if (Object.keys(body).length === 0) {
        errors.push("Required params are missing");
    }

    if (!body.name || body.name.length <= 1) {
        errors.push("Name is missing or too short");
    }

    if (!body.email || body.email.length <= 1) {
        errors.push("Email is missing or too short");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        errors.push("Enter valid email.");
    }

    if (!body.contact_no) {
        errors.push("Contact No is missing");
    } else if (!/[1-9]{1}[0-9]{9}/.test(body.contact_no)) {
        errors.push("Enter valid number");
    }

    const userDetails = await UserModel.findOne({email: body?.email});
    if(userDetails){
        errors.push("Email is already exits.Please choose another.");
    }

    const isValidationFailed = errors.length > 0;
    const msg = isValidationFailed ? errors[0] : '';

    return {isValidationFailed, msg};
};

exports.userCreate = async (req, res) => {
    try {
        let {isValidationFailed, msg} = await validateUserRequest(req.body);
        if (isValidationFailed) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: msg,
                data: []
            });
        }

        const {email, name, contact_no, password} = req.body;
        const encryptPass = await encryptPassword(password);
        const response = await UserModel.create({
            email,
            name,
            password: encryptPass,
            contact_no
        })

        return res.status(200).json({
            success: true,
            status: 200,
            data: response,
            message: "User register successfully."
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

const encryptPassword = async (password) => {
    try {
        if (!password) {
            throw new Error("Password is required to encrypt.")
        }

        return await bcrypt.hash(password, 10);
    } catch (e) {
        throw e.message
    }
}

exports.userLogin = async (req, res) => {
    try {
        const {email, password, role_id} = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Email is required.",
                data: []
            })
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Password is required.",
                data: []
            })
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Enter valid email.",
                data: []
            });
        }

        const isEmailExist = await UserModel.findOne({email})
        if (!isEmailExist) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Email doesn't exits.",
                data: []
            });
        }

        if (await bcrypt.compare(password, isEmailExist.password)) {
            const token = jwt.sign({
                id: isEmailExist?._id,
                name: isEmailExist?.name,
                email: isEmailExist?.email,
                contact_no: isEmailExist?.contact_no,
            }, process.env.JWT_SECRET_KEY, {expiresIn: '30d',});

            if (!token) {
                return res.status(403).json({
                    success: false,
                    status: 403,
                    message: "Failed to authorize user.",
                    data: []
                });
            }
            const userDetails = isEmailExist.toObject();
            delete userDetails?.password;
            userDetails.token = token
            return res.status(200).json({
                success: false,
                status: 200,
                message: "User authorized successfully",
                data: userDetails
            });
        }

        return res.status(401).json({
            success: false,
            status: 401,
            message: "Unauthorized user.",
            data: []
        });

    } catch (e) {
        Log('error', 'user', "failed to create user", util.inspect(e, {depth: null}))
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}