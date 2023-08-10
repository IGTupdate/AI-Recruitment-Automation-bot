const { Ratings, User } = require("../model");
const { handleResponse, handleError } = require("../utils/helper");
const responseMsg = require("../utils/responseMsg");

exports.create = async (req, res) => {
    try {
        const { rating, feedback_message } = req.body;
        const data = { user_id: req.user._id, rating, feedback_message }
        const newRating = new Ratings(data)
        await newRating.save()
        handleResponse(res, responseMsg.Rating, 201)
    } catch (error) {
        handleError(error.message, req, res)
    }
};

exports.findAll = async (req, res) => {
    try {
        const ratings = await Ratings.find()
        // const getAllRatings = []
        // for (let i = 0; i < ratings.length; i++) {
        //     ratings[i]
        //     const user = User.findOne({ _id: ratings[i].user_id })
        // }

        handleResponse(res, ratings, 200);
    } catch (error) {
        handleError(error.message, req, res)
    }
};