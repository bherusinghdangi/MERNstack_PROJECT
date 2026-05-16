const mongoose = require('mongoose');
const StudentModel = require('./models/student')

async function findData() {
    try {
        await mongoose.connect('mongodb://localhost:27017/school');

        const result = await StudentModel.find({ age: { $gte: 20 } }).lean();
        console.log(result)
    } catch (error) {
        console.error(error);
    } finally {
                await mongoose.disconnect();
    }
}

findData();
