const fs = require("fs");

const pdf = require("pdf-parse");
let reader = require("any-text");

const axios = require("axios");
const path = require("path");

const { BotMsgs, Questions } = require("../model");
const { getFileType } = require("../utils/helper");

axios.defaults.headers.common[
    "Authorization"
] = `Bearer ${process.env.API_KEY}`;

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
        id: 6,
        question: "Tell me something about your serlf.",
    },
    {
        id: 7,
        question: "How do you handle challenging situations in the workplace?",
    },
];

exports.botReply = async (message, client, formData) => {
    let x = false
    const maxFileSize = 2 * 1024 * 1024;
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

    if (client.getData.length === 4) {

        client['getData'].map((item) => {

            dataArray.push({
                questionId: item.id,
                answer: item.answer,
                question: item.question,
            })
        })

        await Questions.insertMany(dataArray)
    }

    // if (client.getData.length > 4) {
    // if (message?.file) {
    //     const fileBuffer = message?.file;

    //     const binaryData = Buffer.from(fileBuffer, 'base64');
    //     const name = Date.now();
    //     let filePath = ''

    //     var type = getFileType(binaryData);
    //     if (type === 'pdf') {
    //         filePath = path.join(__dirname, '..', 'upload', `${name}.pdf`);
    //     }
    //     else if (type === 'docx') {
    //         filePath = path.join(__dirname, '..', 'upload', `${name}.docx`);
    //     }

    //     fs.writeFileSync(filePath, binaryData);
    //     let dataBuffer = fs.readFileSync(filePath);

    //     try {
    //         let data
    //         if (type === 'pdf') {
    //             data = await pdf(dataBuffer);
    //             resp = data.text;
    //         }
    //         else if (type === 'docx') {
    //             const data = await reader.getText(filePath);
    //             resp = data
    //         }
    //         // const prompt = `As a skilled human resource chatbot, your task is to Based on the candidate's information, create a set of advanced interview 10  Multiple choice questions. The selection of interview 10 multiple choice questions  should be tailored to the candidate's experience and skills. If the candidate is a fresher, the question list should be prepared accordingly. \n ${resp}`;
    //         const prompt = `As a intelligent human resource chatbot, please create a set of technical and soft skills  multiple-choice questions tailored to a candidateExperience candidate with skills in ${resp}.\n I want to get response in question and options key value pairs`;


    //     }
    //     catch (error) {
    //         console.error('Error reading PDF:', error.message);
    //         return error && error.message;
    //     }
    // }


    // const response = await axios.post(process.env.QUESTION_API, {
    //     headers: {
    //         'Content-Type': 'multipart/form-data',
    //     },
    //     file
    // });
    console.log('formData>>>>>>>>.', formData);
    // let config = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: 'https://jowry.click/generate-questions',
    //     headers: {
    //         'Content-Type': 'multipart/form-data'
    //     },
    //     data: formData
    // };

    // axios.request(config)
    //     .then((response) => {
    //         console.log('JSON.stringify(response.data)>>>>>>>>>>', response.data);
    //     })
    //     .catch((error) => {
    //         console.log('error>>>>>>>>error>>>>>>>>>', error.message);
    //     });


    return questions[client.count++]
    //     const maxFileSize = 2 * 1024 * 1024;

    //     let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //     let resp = ''

    //     const steps = ['greetings', 'email', 'visa', 'full_name', 'purpose', 'professions', 'status', 'positions', 'candidateCV', 'thankyou', 'end']

    //     let userInputa = {
    //         greetings: ['hi', 'Hi', 'hello'],

    //         email: '',
    //         visa: '',
    //         full_name: '',

    //         purpose: ['general inquiry', 'career options'],

    //         professions: ['human resource', 'developer', 'ui/ux designer', 'marketing', 'manager'],
    //         status: ['experience', 'fresher'],
    //         positions: ['node developer', 'react developer', 'mern developer', 'react native developer', 'flutter'],

    //         candidateCV: '',
    //         thankyou: ''
    //     };

    //     let response = {
    //         greetings: ['Hello there! 👋', 'Could you please provide your email address?'],

    //         email: ['Do you have Visa card?', 'Please enter you visa card number'],
    //         visa: ['Could you please provide your full name?'],

    //         full_name: [`Please select your popuse`, 'General inquiry', 'Career options'],
    //         purpose: ['Human resource', 'Developer', 'UI/UX designer', 'Marketing', 'Manager'],

    //         professions: [`Are you ...?`, 'Experience', 'Fresher'],

    //         status: [`Could you please provide your position?`, 'Node developer', 'React Developer', 'MERN developer', 'React native developer', 'Flutter'],
    //         positions: [`Please upload your CV`],

    //         chatgptRespons: [''],
    //         thankyou: [{ end: `Thank you for your time! Before we wrap up, is there anything else you would like to share with us that we haven't discussed yet?` }],

    //         end: [{ end: `Thank you for submitting your information. We will be in contact soon.` }],
    //     }

    //     const getResp = (key) => {
    //         return response[key]
    //     }

    //     const getKeysByValue = async (obj, value) => {
    //         if (uuid.count === steps.length) {
    //             uuid.count = 0
    //         }

    //         if (value?.message === 'skip') {
    //             let response = steps[uuid.count];
    //             uuid.count++;
    //             return getResp(response);
    //         }

    //         if (uuid.count === 1) {
    //             if (value?.message?.match(mailformat)) {
    //                 uuid.data.email = value.message

    //             } else {
    //                 return 'Please Enter vailid email and email is require!'
    //             }
    //         }

    //         if (uuid.count === 2) {
    //             uuid.data.visa = value.message
    //         }

    //         if (uuid.count === 3) {
    //             uuid.data.full_name = value.message
    //             const newBotMsg = new BotMsgs(uuid.data)
    //             newBotMsg.save();
    //         };

    //         if (arg?.file) {
    //             const fileBuffer = arg?.file;

    //             const binaryData = Buffer.from(fileBuffer, 'base64');
    //             const name = Date.now();
    //             let filePath = ''

    //             var type = getFileType(binaryData);
    //             if (type === 'pdf') {
    //                 filePath = path.join(__dirname, '..', 'upload', `${name}.pdf`);
    //             }
    //             else if (type === 'docx') {
    //                 filePath = path.join(__dirname, '..', 'upload', `${name}.docx`);
    //             }

    //             fs.writeFileSync(filePath, binaryData);
    //             let dataBuffer = fs.readFileSync(filePath);

    //             try {
    //                 let data
    //                 if (type === 'pdf') {
    //                     data = await pdf(dataBuffer);
    //                     resp = data.text;
    //                 }
    //                 else if (type === 'docx') {
    //                     const data = await reader.getText(filePath);
    //                     resp = data
    //                 }

    //                 // const prompt = `As a skilled human resource chatbot, your task is to Based on the candidate's information, create a set of advanced interview 10  Multiple choice questions. The selection of interview 10 multiple choice questions  should be tailored to the candidate's experience and skills. If the candidate is a fresher, the question list should be prepared accordingly. \n ${resp}`;
    //                 const prompt = `As a intelligent human resource chatbot, please create a set of technical and soft skills  multiple-choice questions tailored to a candidateExperience candidate with skills in ${resp}.\n I want to get response in question and options key value pairs`;

    //                 const newprompt = {
    //                     model: "gpt-3.5-turbo",
    //                     messages: [
    //                         {
    //                             role: "system",
    //                             content: prompt
    //                         }
    //                     ]
    //                 };

    //                 try {
    //                     const chatGptresponse = await generateResponse(newprompt);
    //                     response.chatgptRespons = chatGptresponse?.message?.content.split('\n');
    //                     let result = response.chatgptRespons
    //                     result = result.filter(line => line.trim() !== '');
    //                     console.log('uuid>>>>>>>>', result);

    //                     // Store the generated questions and options in the database
    //                     // if (result.length > 0) {
    //                     // const questionObjects = result.map(line => {
    //                     //     const [questionText, ...options] = line.split(' | ');
    //                     //     return {
    //                     //         user_id: 'your_user_id_here', // Set the user ID accordingly
    //                     //         question: questionText,
    //                     //         options
    //                     //     };
    //                     // });

    //                     // await Questions.insertMany(questionObjects); // Save multiple questions to the database
    //                     // }

    //                     return result;

    //                 } catch (error) {
    //                     console.error('Error:', error.message);
    //                     return error && error.message;
    //                 }
    //             }
    //             catch (error) {
    //                 console.error('Error reading PDF:', error.message);
    //                 return error && error.message;
    //             }
    //         }

    //         let response1 = steps[uuid.count];
    //         uuid.count++;

    //         return getResp(response1);
    //     };

    //     return getKeysByValue(userInputa, arg);
};

const generateResponse = async (newprompt) => {
    try {
        const response = await axios.post(process.env.QUESTION_API, {
        });

        return response
    } catch (error) {
        throw error;
    }
};
