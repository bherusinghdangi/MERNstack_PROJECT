const mongoose = require('mongoose');

async function createSchemaAndModel() {
    try {
        
        await mongoose.connect('mongodb://localhost:27017/school');

        const studentSchema = new mongoose.Schema({
            name: String,
            age: Number,
            subjects: Array
        });
        
        const StudentModel = mongoose.model('Student', studentSchema);

        const teacherSchema = new mongoose.Schema({
            name: String,
            age: Number,
            experience: String
        });
        
        const TeacherModel = mongoose.model('Teacher', teacherSchema);

        await StudentModel.createCollection();
        await TeacherModel.createCollection();
        
    } finally {
        await mongoose.disconnect();
    }
}

createSchemaAndModel(); 