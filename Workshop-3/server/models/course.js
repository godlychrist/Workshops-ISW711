const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    code: {
        required: true,
        type: Number
    },
    description: {
        required: true,
        type: String
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
})

module.exports = mongoose.model('Course', courseSchema)