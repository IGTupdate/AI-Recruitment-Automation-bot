const mongoose = require("mongoose")
const { Schema } = mongoose

const botMsgSchema = Schema({
    uid: {
        type: String,
    },
    full_name: {
        type: String,
    },
    visa: {
        type: String,
    },
    email: {
        type: String,
    },
    purpose: {
        type: String,
    },
    professions: {
        type: String,
    },
    status: {
        type: String,
    },
    professions: {
        type: String,
    },
    positions: {
        type: String,
    },
},
    {
        timestamps: true
    })


module.exports = mongoose.model("Botmsg", botMsgSchema)