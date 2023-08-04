const jwt = require('jsonwebtoken')
const { User } = require("../model");
const { handleResponse, handleError } = require("../utils/helper");
const { registerUser } = require("../utils/vailidation");
const md5 = require('md5');

exports.register = async (req, res) => {
    try {
        const { error } = registerUser.validate(req.body, { abortEarly: false })
        if (error) { return handleError(error, 400, res) };

        const { first_name, last_name, email, password, mobile } = req.body;
        const data = { first_name, last_name, email, password: md5(password), mobile }

        const newUser = new User(data);
        const token = await jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRY });
        await newUser.save();
        const result = { ...newUser._doc, token }
        handleResponse(res, result, 201)

    }
    catch (error) {
        handleError(error.message, req, res)
    }
};

exports.findAll = async (req, res) => {
    await User.find()
        .then(data => {
            handleResponse(res, data, 200);
        })
        .catch(err => {
            handleError(err.message, req, res)
        })
};
