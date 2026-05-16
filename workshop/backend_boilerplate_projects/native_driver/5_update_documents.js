const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
async function updateData() {
    try {
        await client.connect();
        const db = client.db('school');
        const students = db.collection('students');

        const result = await students.updateOne(
            { name: 'Abdul' },
            { $set: { age: 19 } }
        );
        console.log(result)

    } finally {
        await client.close();
    }
}

updateData();
