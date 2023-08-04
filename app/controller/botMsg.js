const fs = require('fs')

const pdf = require('pdf-parse');
let reader = require('any-text');

const axios = require('axios');
const path = require('path');

const { BotMsgs } = require("../model");
const { getFileType } = require("../utils/helper");

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.API_KEY}`;


exports.botMsg = async (req, res) => {
    const botmsg = BotMsgs.find()
}


exports.botReply = async (arg, uuid,) => {
    const maxFileSize = 2 * 1024 * 1024;


    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let resp = ''

    const steps = ['greetings', 'first_name', 'last_name', 'email', 'purpose', 'professions', 'status', 'positions', 'candidateCV']

    let userInputa = {
        greetings: ['hi', 'Hi', 'hello'],

        first_name: '',
        last_name: '',
        email: '',

        purpose: ['general inquiry', 'career options'],

        professions: ['human resource', 'developer', 'ui/ux designer', 'marketing', 'manager'],
        status: ['experience', 'fresher'],
        positions: ['node developer', 'react developer', 'mern developer', 'react native developer', 'flutter'],

        candidateCV: ''
    };

    let response = {
        greetings: ['Hello there! 👋', 'Welcome to company name', 'Could you please provide your first name?'],

        first_name: ['Could you please provide your last name?'],
        last_name: ['Could you please provide your email address?'],

        email: [`Please select your popuse`, 'General inquiry', 'Career options'],
        purpose: ['Human resource', 'Developer', 'UI/UX designer', 'Marketing', 'Manager'],

        professions: [`Are you ...?`, 'Experience', 'Fresher'],

        status: [`Could you please provide your position?`, 'Node developer', 'React Developer', 'MERN developer', 'React native developer', 'Flutter'],
        positions: [`Please upload your CV`],



        thankyou: `Thank you for your time! Before we wrap up, is there anything else you would like to share with us that we haven't discussed yet?`,

        end: `Thank you for submitting your information. We will be in contact soon.`,
        chatgptRespons: ''
    }

    const getResp = (index) => {
        return response[index]
    }

    const getKeysByValue = async (obj, value) => {

        if (value?.message === 'skip') {
            let response = steps[uuid.count];
            uuid.count++;
            return getResp(response);
        }

        if (uuid.count === 1) {
            uuid.data.first_name = value.message

        }

        if (uuid.count === 2) {
            uuid.data.last_name = value.message
        }

        if (uuid.count === 3) {
            if (value?.message?.match(mailformat)) {
                uuid.data.email = value.message
                const newBotMsg = new BotMsgs(uuid.data)
                newBotMsg.save();
            } else {
                return 'Please Enter vailid email and email is require!'
            }
        };
        
        if (!arg?.message && arg?.file) {
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

                const prompt = `act as an human resource chat bot ask me related 10 MCQs with respect to my information below\n ${resp}`;

                const newprompt = {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                };

                try {
                    const chatGptresponse = await generateResponse(newprompt);
                    response.chatgptRespons = chatGptresponse?.message?.content;
                    let result = response.chatgptRespons
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