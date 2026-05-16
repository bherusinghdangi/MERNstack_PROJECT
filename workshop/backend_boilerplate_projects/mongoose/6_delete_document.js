const mongoose = require('mongoose');
const StudentModel = require('./models/student')
async function deleteData() {
        await mongoose.connect('mongodb://localhost:27017/school');      
        await StudentModel.deleteOne({ name: 'Abdul' });
        await mongoose.disconnect();
}
deleteData();

