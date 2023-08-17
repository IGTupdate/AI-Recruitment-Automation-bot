const mongoose = require("mongoose")
const { Schema } = mongoose

const cvQuestionSchema = Schema({
    user_id: String,
    question: String,
    choices: [String],
    correct_choice: String,
},
    {
        timestamps: true
    })


module.exports = mongoose.model("CVQuestion", cvQuestionSchema)