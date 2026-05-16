const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true,
                trim: true
            },
            age: {
                type: Number,
                required: true,
                min: 5,
                max: 100
            },
            subjects: {
                type: [String],
                required: true,
                validate: {
                    validator: function(arr) {
                        return arr.length > 0;
                    },
                    message: 'At least one subject is required'
                }
            }
});

studentSchema.index({ name: 1 }, { unique: true })

const StudentModel = mongoose.model('Student', studentSchema);


module.exports = StudentModel