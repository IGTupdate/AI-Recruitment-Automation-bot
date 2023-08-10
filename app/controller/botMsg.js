const fs = require('fs')

const pdf = require('pdf-parse');
let reader = require('any-text');

const axios = require('axios');
const path = require('path');

const { BotMsgs, Questions } = require("../model");
const { getFileType } = require("../utils/helper");

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.API_KEY}`;


exports.botMsg = async (req, res) => {
    const botmsg = BotMsgs.find()
}


exports.botReply = async (arg, uuid,) => {
    const maxFileSize = 2 * 1024 * 1024;

    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let resp = ''

    const steps = ['greetings', 'email', 'visa', 'full_name', 'purpose', 'professions', 'status', 'positions', 'candidateCV', 'thankyou', 'end']

    let userInputa = {
        greetings: ['hi', 'Hi', 'hello'],

        email: '',
        visa: '',
        full_name: '',

        purpose: ['general inquiry', 'career options'],

        professions: ['human resource', 'developer', 'ui/ux designer', 'marketing', 'manager'],
        status: ['experience', 'fresher'],
        positions: ['node developer', 'react developer', 'mern developer', 'react native developer', 'flutter'],

        candidateCV: '',
        thankyou: ''
    };

    let response = {
        greetings: ['Hello there! 👋', 'Welcome to company name', 'Could you please provide your email address?'],

        email: ['Do you have Visa card?', 'Please enter you visa card number'],
        visa: ['Could you please provide your full name?'],

        full_name: [`Please select your popuse`, 'General inquiry', 'Career options'],
        purpose: ['Human resource', 'Developer', 'UI/UX designer', 'Marketing', 'Manager'],

        professions: [`Are you ...?`, 'Experience', 'Fresher'],

        status: [`Could you please provide your position?`, 'Node developer', 'React Developer', 'MERN developer', 'React native developer', 'Flutter'],
        positions: [`Please upload your CV`],

        chatgptRespons: [''],
        thankyou: [{ end: `Thank you for your time! Before we wrap up, is there anything else you would like to share with us that we haven't discussed yet?` }],

        end: [{ end: `Thank you for submitting your information. We will be in contact soon.` }],
    }

    const getResp = (key) => {
        return response[key]
    }

    const getKeysByValue = async (obj, value) => {
        if (uuid.count === steps.length) {
            uuid.count = 0
        }

        if (value?.message === 'skip') {
            let response = steps[uuid.count];
            uuid.count++;
            return getResp(response);
        }

        if (uuid.count === 1) {
            if (value?.message?.match(mailformat)) {
                uuid.data.email = value.message

            } else {
                return 'Please Enter vailid email and email is require!'
            }
        }

        if (uuid.count === 2) {
            uuid.data.visa = value.message
        }

        if (uuid.count === 3) {
            uuid.data.full_name = value.message
            const newBotMsg = new BotMsgs(uuid.data)
            newBotMsg.save();
        };

        if (arg?.file) {
            const fileBuffer = arg?.file;

            const binaryData = Buffer.from(fileBuffer, 'base64');
            const name = Date.now();
            let filePath = ''

            var type = getFileType(binaryData);
            if (type === 'pdf') {
                filePath = path.join(__dirname, '..', 'upload', `${name}.pdf`);
            }
            else if (type === 'docx') {
                filePath = path.join(__dirname, '..', 'upload', `${name}.docx`);
            }

            fs.writeFileSync(filePath, binaryData);
            let dataBuffer = fs.readFileSync(filePath);

            try {
                let data
                if (type === 'pdf') {
                    data = await pdf(dataBuffer);
                    resp = data.text;
                }
                else if (type === 'docx') {
                    const data = await reader.getText(filePath);
                    resp = data
                }

                // const prompt = `As a skilled human resource chatbot, your task is to Based on the candidate's information, create a set of advanced interview 10  Multiple choice questions. The selection of interview 10 multiple choice questions  should be tailored to the candidate's experience and skills. If the candidate is a fresher, the question list should be prepared accordingly. \n ${resp}`;
                const prompt = `As a intelligent human resource chatbot, please create a set of technical and soft skills  multiple-choice questions tailored to a candidateExperience candidate with skills in ${resp}.\n I want to get response in question and options key value pairs`;

                const newprompt = {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: prompt
                        }
                    ]
                };

                try {
                    const chatGptresponse = await generateResponse(newprompt);
                    response.chatgptRespons = chatGptresponse?.message?.content.split('\n');
                    let result = response.chatgptRespons
                    result = result.filter(line => line.trim() !== '');
                    console.log('uuid>>>>>>>>', result);

                    // Store the generated questions and options in the database
                    // if (result.length > 0) {
                    // const questionObjects = result.map(line => {
                    //     const [questionText, ...options] = line.split(' | ');
                    //     return {
                    //         user_id: 'your_user_id_here', // Set the user ID accordingly
                    //         question: questionText,
                    //         options
                    //     };
                    // });

                    // await Questions.insertMany(questionObjects); // Save multiple questions to the database
                    // }

                    return result;

                } catch (error) {
                    console.error('Error:', error.message);
                    return error && error.message;
                }
            }
            catch (error) {
                console.error('Error reading PDF:', error.message);
                return error && error.message;
            }
        }

        let response1 = steps[uuid.count];
        uuid.count++;

        return getResp(response1);
    };

    return getKeysByValue(userInputa, arg);
};

const generateResponse = async (newprompt) => {
    try {
        const response = await axios.post(process.env.API_URL, {
            model: 'gpt-3.5-turbo',
            messages: newprompt.messages,
            max_tokens: 150,
            temperature: 0.7,
        });
        return response.data.choices[0];

    } catch (error) {
        throw error;
    }
}