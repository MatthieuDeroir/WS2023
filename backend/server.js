const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// use dotenv to hide the password
require("dotenv").config();
const {IP} = require('./config');

// use fetchExpirationDateFromWebsite
const fetchExpirationDateFromWebsite = require("./WebsiteAutomation");
const {addProduct} = require("./Controllers/ProductController");


// fetchExpirationDateFromWebsite('5CD110Q11P', 'HP');


const app = express();
const PORT = 4000;

// Disable the x-powered-by header to improve security.
app.disable("x-powered-by");

// Connect to MongoDB using Mongoose.
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${IP}/WS2023DB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connexion à MongoDB:"));
db.once("open", () => {
    console.log("Connecté à MongoDB");
});

// Set up middleware.
// ... vos autres imports ...

const corsOptions = {
    origin: '*',  // Vous pouvez remplacer '*' par l'URL de votre frontend pour plus de sécurité
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const productRouter = require("./Routes/ProductRoutes");
const authRouter = require('./Routes/UserRoutes');
app.use('/', authRouter);
app.use('/', productRouter);

// Start the server.
app.listen(PORT, () => {
    console.log(`Serveur Express écoutant sur le port ${PORT}`);
});
app.get("/", (req, res) =>
    res.send(`Le serveur fonctionne sur le port : ${PORT}`)
);