const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// use dotenv to hide the password
require("dotenv").config();

// use fetchExpirationDateFromWebsite
const fetchExpirationDateFromWebsite = require("./WebsiteAutomation");

fetchExpirationDateFromWebsite('5CD110Q11P', 'HP');


const app = express();
const PORT = 4000;

// Disable the x-powered-by header to improve security.
app.disable("x-powered-by");

// Connect to MongoDB using Mongoose.
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/WS2023DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connexion à MongoDB:"));
db.once("open", () => {
    console.log("Connecté à MongoDB");
});

// Set up middleware.
app.use(cors());
app.use(express.json());

// Start the server.
app.listen(PORT, () => {
    console.log(`Serveur Express écoutant sur le port ${PORT}`);
});
app.get("/", (req, res) =>
    res.send(`Le serveur fonctionne sur le port : ${PORT}`)
);