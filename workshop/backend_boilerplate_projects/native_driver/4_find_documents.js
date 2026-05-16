const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
async function findData() {
    try {
        await client.connect();
        const db = client.db('school');
        const students = db.collection('students');
        const results = await students.find({ age: { $gte: 20 } }).toArray();
        console.log(results)
    } finally {
        await client.close();
    }
}

findData();
