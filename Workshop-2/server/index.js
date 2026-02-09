const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Course = require('./models/course');
const database = mongoose.connection;
const path = require("path");

const mongo_uri =
    "mongodb://admin:123@" +
    "ac-5ldoxmw-shard-00-00.uiecxd9.mongodb.net:27017," +
    "ac-5ldoxmw-shard-00-01.uiecxd9.mongodb.net:27017," +
    "ac-5ldoxmw-shard-00-02.uiecxd9.mongodb.net:27017/" +
    "test?ssl=true&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(mongo_uri);

database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database Connected');
});


const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cors({
    domains: '*',
    methods: '*'
}));
app.use(express.static(path.join(__dirname, "../client/")))

//routes
app.post('/course', async (req, res) => {
    const course = new Course({
        name: req.body.name,
        credits: req.body.credits
    })

    try {
        const courseCreated = await course.save();
        //add header location to the response
        res.header('Location', `/course?id=${courseCreated._id}`);
        res.status(201).json(courseCreated)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

app.get('/course', async (req, res) => {
    try {
        //if id is passed as query param, return single course else return all courses
        if (!req.query.id) {
            const data = await Course.find();
            return res.status(200).json(data)
        }
        const data = await Course.findById(req.query.id);
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PATCH Method
app.patch('/course', async (req, res) => {
    try {
        const id = req.query.id;
        const newData = req.body.name;
        const newCredits = req.body.credits;
        const options = { new: true };

        const result = await Course.findByIdAndUpdate(id, { name: newData, credits: newCredits }, options);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.delete('/course', async (req, res) => {
    try {
        const id = req.query.id;
        const result = await Course.findByIdAndDelete(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


//start the app
app.listen(3001, () => console.log(`UTN API service listening on port 3001!`))
