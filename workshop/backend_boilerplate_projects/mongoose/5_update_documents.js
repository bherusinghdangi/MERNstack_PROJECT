const mongoose = require('mongoose');
const StudentModel = require('./models/student')

async function updateData() {
    try {
        await mongoose.connect('mongodb://localhost:27017/school');

        const student = await StudentModel.findOne({ name: 'Manoj' });

        if (!student) {
            console.log("Student not found");
            return;
        }

        student.age = 101;  // violates max: 60

        await student.save();

    } catch (error) {
        console.error("Validation Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

updateData();