const express = require('express')
const app = express()

const cors = require('cors');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const path = require("path");


require("dotenv").config({ path: __dirname + '/.env' });

const { authJWT } = require('./app/middleware/middleware');
const { createUUID } = require('./app/utils/helper');

const messages = [];


app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Allow all origins, methods, and headers
app.use(cors({
    origin: ['https://ai-astoria-staging.netlify.app', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    credentials: true, // Add this line
}));


const payloadLimit = '5mb';
app.use(bodyParser.json({ limit: payloadLimit }));
app.use(bodyParser.urlencoded({ extended: true, limit: payloadLimit }));

// app.use(authJWT)


require('./app/router/user')(app);
require('./app/router/auth')(app);
require('./app/router/botMsg')(app)
require('./app/router/rating')(app)


app.get('/api/chat', (req, res) => {
    res.render('chat', { messages: messages });
});


app.get('*', (req, res) => {
    res.status(400).send({
        error: true,
        message: 'Hunn Smart!'
    })
});


const PORT = process.env.PORT || 5200

const server = app.listen(PORT, () => console.log(`Server is running port on ${PORT}`))
const io = socket(server, {
    cors: {
        origin: ['https://ai-astoria-staging.netlify.app', 'http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: '*',
        credentials: true,
    },
});

const { botReply, calculatResult } = require('./app/controller/botMsg');

io.on("connection", function (socket) {
    const uid = createUUID()

    const client = {
        uid: uid,
        count: 0,
        getData: []
    }

    const intro = `Greetings! I am your friendly AI agent from Astoria AI, here to assist you in any way possible. As a cutting-edge artificial intelligence, I have been meticulously crafted by the brilliant minds at Astoria AI to provide you with seamless and intuitive interactions. Equipped with the latest advancements in natural language processing and machine learning, I am designed to comprehend human language and deliver relevant and accurate responses.`
    socket.emit('serverMessage', intro)

    socket.on('clientMessage', async (data) => {
        let serverResp = '';

        if (data?.file) {
            const blob = new Blob([data.file], { type: 'application/pdf' });
            serverResp = await botReply(data, client, blob)
            messages.push(serverResp && serverResp);
        }
        else {
            serverResp = await botReply(data, client)
            messages.push(serverResp && serverResp);
        };

        setTimeout(() => {
            socket.emit('serverMessage', serverResp,)
        }, 1000)
    });

    socket.on('clientmcq', async (data) => {
        let serverResult = await calculatResult(data)
        socket.emit('serverresult', serverResult,)
    })
});