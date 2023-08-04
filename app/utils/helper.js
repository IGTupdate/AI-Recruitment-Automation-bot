const nodemailer = require('nodemailer');

// const Sib = require('sib-api-v3-sdk');
// const client = Sib.ApiClient.instance;


exports.handleResponse = (res, data, status = 200) => res.status(status).json({ data, error: false });

exports.handleError = (error, status = 400, res,) => {
    if (error.details) {
        const data = {};
        error?.details.forEach(v => {
            data[v.context?.key] = [v.message.replace(/"/g, '')];
        })

        return res.status(status).send({ error: data })
    }
    else {
        return res.status(400).send({
            message: error, error: true
        })
    }
}

exports.sendMailer = async (email, subject, message, res) => {

    const transporter = nodemailer.createTransport({
        host: `${process.env.SMPT_EMAIL_HOST}`,
        port: `${process.env.SMPT_EMAIL_PORT}`,
        auth: {
            user: `${process.env.SMPT_EMAIL_USER}`,
            pass: `${process.env.SMPT_EMAIL_PASSWORD}`
        },
        // secure: false
    })

    const data = {
        from: `${process.env.SMPT_EMAIL_FROM}`,
        to: `${email}`,
        subject: `${subject} - Jowry.click`,
        html: `${message}`,
    }

    transporter.sendMail(data, (error, info) => {
        if (error) {
            // console.log('error>>>>>>', error);
            res.status(error.responseCode).send(error)
        }
    })

    return
}

exports.createUUID = () => {
    var dt = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    return uuid
}

var magicNumbers = {
    pdf: [0x25, 0x50, 0x44, 0x46],
    png: [0x89, 0x50, 0x4E, 0x47],
    jpeg: [0xFF, 0xD8, 0xFF],
    doc: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1],
    docx: [0x50, 0x4B, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00]
};


// Function to check if the buffer starts with a specific byte sequence
function startsWith(buffer, bytes) {
    if (buffer.length < bytes.length) return false;
    for (var i = 0; i < bytes.length; i++) {
        if (buffer[i] !== bytes[i]) return false;
    }
    return true;
}

// Function to determine the file type from the buffer
exports.getFileType = (buffer) => {
    for (var type in magicNumbers) {
        if (startsWith(buffer, magicNumbers[type])) {
            return type;
        }
    }
    return null; // File type not recognized
}

// Get the file type from the buffer

