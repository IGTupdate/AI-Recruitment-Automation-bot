const mongoose = require("mongoose")
const { Schema } = mongoose

const questionSchema = Schema({
    user_id: {
        type: String,
    },

    question: String,
    options: [String],
},
    {
        timestamps: true
    })


module.exports = mongoose.model("Question", questionSchema)