const mongoose = require("mongoose")
const { Schema } = mongoose

const questionSchema = Schema({
    user_id: String,
    question: String,
    answer: String,
    selectedAnser: String,
    questionId: String
},
    {
        timestamps: true
    })


module.exports = mongoose.model("Question", questionSchema)