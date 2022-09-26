////////////////////////
//DEPENDENCIES
////////////////////////
require("dotenv").config();
// pull PORT from .env,  give default value of 4000
const { PORT = 4000, DATABASE_URL } = process.env
// Import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middleware
const cors = require("cors");
const morgan = require("morgan");

////////////////////////
//DATABASE CONNECTION
////////////////////////
// Establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// Connection events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

////////////////////////
//MODELS
////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});

const People = mongoose.model("People", PeopleSchema);

////////////////////////
//MIDDLEWARE
////////////////////////
app.use(cors());
app.use(morgan("dev")); //logging
app.use(express.json()); //parse json bodies

////////////////////////
//ROUTES
////////////////////////
app.get("/", (req, res) => {
    res.send("Hello world");
})

// Index
app.get("/people", async (req, res) => {
    try {
        res.json(await People.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

// Delete
app.delete("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndDelete(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});

// Update
app.put("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}));
    } catch (error) {
        res.status(400).json(error);
    }
});

// Create
app.post("/people", async (req, res) => {
    try {
        res.json(await People.create(req.body));
    } catch (error) {
        res.status(400).json(error);   
    }
}) 


////////////////////////
//LISTENER
////////////////////////
app.listen(PORT, (req, res) => {
    console.log(`Hello we are listening on port: ${PORT}`)
})
