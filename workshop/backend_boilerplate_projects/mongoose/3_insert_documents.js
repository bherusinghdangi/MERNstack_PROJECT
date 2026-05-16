const mongoose = require('mongoose');
const StudentModel = require('./models/student')
const TeacherModel = require('./models/teacher')

async function insertData() {
    try {
        await mongoose.connect('mongodb://localhost:27017/school');
        
        await StudentModel.create([
            { name: 'Abdul', age: "20",  subjects:['English']}, // will fail (no subjects)
            { name: 'Manoj', age: 21, subjects: ['English','Math','Science','Social'] },
            { name: 'Ramya', age: 15, subjects: ['English','Math','Science','Social'] }
        ]);

        await TeacherModel.create({
            name: 'Vikram',
            age: 33,
            experience: "10 years"
        });

    } catch (error) {
        console.error("Validation Error:");
        console.error(error.message);
    } finally {
        await mongoose.disconnect();
    }
}

insertData();