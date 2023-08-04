const Joi = require('joi')

const registerUser = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
    role: Joi.string(),
    mobile: Joi.number(),
    gender: Joi.string(),
})

const login = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),

})

const resetEmail = Joi.object().keys({
    email: Joi.string().email().required(),

})

const createCource = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    about_cource: Joi.string(),
    language: Joi.string(),
})

const updateCource = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    about_cource: Joi.string(),
    language: Joi.string(),
})

//**************** Comments ****************/
const createComment = Joi.object().keys({
    title: Joi.string().required(),
    timeStamp: Joi.string().required(),
    message: Joi.string().required(),
    video_id: Joi.string().required(),
})

//**************** Reply ****************/
const createReply = Joi.object().keys({
    comment_id: Joi.string().required(),
    message: Joi.string().required(),
    video_id: Joi.string().required(),
})


//**************** Questions ****************//
const createQuestion = Joi.object().keys({
    question: Joi.string().required(),
    video_id: Joi.string().required(),
    option1: Joi.string().required(),
    option2: Joi.string().required(),
    option3: Joi.string().required(),
    option4: Joi.string().required(),
    currectAnswer: Joi.string().required(),
})


//**************** Questions ****************//
const createAnswer = Joi.object().keys({
    answers: Joi.array().required(),
    video_id: Joi.string().required(),

})

//**************** Options ****************//

const createOption = Joi.object().keys({
    option: Joi.string().required(),

    isCorrect: Joi.boolean().required(),

    question_id: Joi.string().required(),
    video_id: Joi.string().required(),

})


module.exports = {
    registerUser,
    login,
    resetEmail,



    createCource,
    updateCource,

    createComment,
    createReply,

    createQuestion,
    createAnswer,
    createOption
}