const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function insertData() {
    try {
        await client.connect(); // server
        const db = client.db('school'); // switch to db
        const students = db.collection('students');
        const teachers = db.collection('teachers');

        await students.insertMany([
            { name: 'Abdul', age: 21, subjects: ['English','Math','Science','Social'] },
            { name: 'Manoj', age: 20, subjects: ['English','Math','Science','Social'] },
            { name: 'Suraj', age: 17, subjects: ['English','Math','Science','Social'] }
        ]);

        await teachers.insertOne({ name: 'Vikram', age: 32, experience: "9 years" });

    } finally {
        await client.close();
    }
}

insertData();
