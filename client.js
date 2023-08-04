const io = require("socket.io-client");
const socket = io("http://localhost:5200"); // Connect to the server

const { ConsoleConnector } = require('@nlpjs/console-connector');

const connector = new ConsoleConnector();

connector.onHear = (self, text) => {
    askQuestion(text)
    self.say(text);
};


// Handle incoming server messages
socket.on("serverMessage", (message) => {
    console.log("Server response:", message);
});

// Send a question to the server
function askQuestion(question) {
    socket.emit("clientMessage", question);

};

