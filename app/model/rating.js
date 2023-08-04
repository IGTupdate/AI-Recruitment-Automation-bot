const mongoose = require("mongoose")
const { Schema } = mongoose

const chatbotSchema = Schema({
    user_id: {
        type: String,
    },
    rating: {
        type: String,
    },
},
    {
        timestamps: true
    })


module.exports = mongoose.model("Rating", chatbotSchema)