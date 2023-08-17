const axios = require("axios");
const { BotMsgs, Questions, CVQuestions } = require("../model");


exports.botMsg = async (req, res) => {
    const botmsg = BotMsgs.find();
};

const questions = [
    {
        id: 1,
        question: "Please enter your email.",
    },
    {
        id: 2,
        question: "What is your name?",
    },
    {
        id: 3,
        question: "Where are you from?",
    },
    {
        id: 4,
        question: "which position are you interested.",
        options: [
            "human resource",
            "node developer",
            "react js developer",
            "react native developer",
            "ui/ux designer",
            "marketing",
            "manager",
        ],
    },
    {
        id: 5,
        question: "Do you have experience",
        options: ["fresher", "0-1", "1-2", "2-3", "3-4", "4-5", "5++"],
    },
    {
        id: 7,
        question: "Please upload your cv.",
    },
];

exports.botReply = async (message, client, blob) => {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let resp = '';

    if (message === 'skip') {
        return questions[client.count++]
    };

    if (client.getData.length > 0) {

        if (message['id'] === 1 && client.count === 1) {
            if (message.message.match(mailformat)) {
                message = message;
            }
            else {
                client.count = 0
                return 'Please Enter vailid email and email is require!';
            }
        }
    }

    client['getData'].push(message);
    const dataArray = [];

    if (client.getData.length === 5) {
        client['getData'].map((item) => {
            dataArray.push({
                user_id: client?.uid,
                questionId: item?.id,
                answer: item?.message ? item?.message : item?.selectedOption,
                question: item?.question,
            })
        })


        await Questions.insertMany(dataArray)
    }

    if (client.getData.length > 5) {
        if (blob) {
            const formData = new FormData();
            formData.append('tags', 'multichoice');
            formData.append('file', blob, 'kuldeepsen2023.pdf');

            const question = await Questions.findOne({ user_id: client?.uid, questionId: 4 })

            const result = await axios.post(`https://www.jowry.click/generate-questions?role=${question.answer}&question_count=5`, formData, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                },
            });

            const data = result.data.map((d) => {
                return {
                    ...d, user_id: question['user_id']
                }
            })

            await CVQuestions.insertMany(data)
            const cvQuestionsData = await CVQuestions.find({ user_id: question?.user_id })
            const x = {
                cvQuestionsData,
                candidateQuestion: 'CV related questions'
            }

            return x

        }
    }

    return questions[client.count++]
};

