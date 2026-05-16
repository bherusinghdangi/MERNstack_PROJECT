 const mongoose = require('mongoose');

 const teacherSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            age: {
                type: Number,
                required: true
            },
            experience: {
                type: String
            }
        });

const TeacherModel = mongoose.model('Teacher', teacherSchema);

module.exports = TeacherModel