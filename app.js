const express = require('express')
const app = express()

const cors = require('cors');
const bodyParser = require('body-parser');


const socket = require('socket.io');
const path = require("path")

require("dotenv").config({ path: __dirname + '/.env' });

const { authJWT } = require('./app/middleware/middleware');
const { createUUID } = require('./app/utils/helper');

const messages = [];


app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

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
const io = socket(server);

const { botReply } = require('./app/controller/botMsg');

io.on("connection", function (socket) {
    const uid = createUUID()

    const obj = {
        data: {
            uid: uid,
            first_name: '',
            last_name: '',
            email: '',
            purpose: '',

            professions: '',
            status: '',
            positions: ''
        },

        count: 0
    }

    const intro = `Greetings! I am your friendly AI agent from Astoria AI, here to assist you in any way possible. As a cutting-edge artificial intelligence, I have been meticulously crafted by the brilliant minds at Astoria AI to provide you with seamless and intuitive interactions. Equipped with the latest advancements in natural language processing and machine learning, I am designed to comprehend human language and deliver relevant and accurate responses.`
    setTimeout(() => {
        socket.emit('serverMessage', intro)
    }, 2000)

    socket.on('clientMessage', async (msg) => {
        let serverResp = await botReply(msg, obj)

        messages.push(serverResp && serverResp);

        socket.emit('serverMessage', serverResp,)
    });
});