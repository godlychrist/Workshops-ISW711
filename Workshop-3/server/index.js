const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Course = require('./models/course');
const Teacher = require('./models/teacher');
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
        code: req.body.code,
        description: req.body.description,
        teacher: req.body.teacher
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
        const newCode = req.body.code;
        const newDescription = req.body.description;
        const newTeacher = req.body.teacher;
        const options = { new: true };

        const result = await Course.findByIdAndUpdate(id, { name: newData, code: newCode, description: newDescription, teacher: newTeacher }, options);
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

// * Workshop-3 APIs

app.post('/teacher', async (req, res) => {
    const teacher = new Teacher({
        name: req.body.name,
        lastName: req.body.lastName,
        cedula: req.body.cedula,
        age: req.body.age
    })

    try {
        const teacherCreated = await teacher.save();
        //add header location to the response
        res.header('Location', `/teacher?id=${teacherCreated._id}`);
        res.status(201).json(teacherCreated)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

app.get('/teacher', async (req, res) => {
    try {
        //if id is passed as query param, return single course else return all courses
        if (!req.query.id) {
            const data = await Teacher.find();
            return res.status(200).json(data)
        }
        const data = await Teacher.findById(req.query.id);
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PATCH Method
app.patch('/teacher', async (req, res) => {
    try {
        const id = req.query.id;
        const newData = req.body.name;
        const newLastName = req.body.lastName;
        const newCedula = req.body.cedula;
        const newAge = req.body.age;
        const options = { new: true };

        const result = await Teacher.findByIdAndUpdate(id, { name: newData, lastName: newLastName, cedula: newCedula, age: newAge }, options);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.delete('/teacher', async (req, res) => {
    try {
        const id = req.query.id;
        const result = await Teacher.findByIdAndDelete(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


//start the app
app.listen(3001, () => console.log(`UTN API service listening on port 3001!`))
