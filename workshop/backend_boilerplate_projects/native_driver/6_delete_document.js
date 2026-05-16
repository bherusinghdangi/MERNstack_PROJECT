const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
async function deleteData() {
    try {
        await client.connect();
        const db = client.db('school');
        const students = db.collection('students');
        const result = await students.deleteOne({ name: 'Abdul' });
    } finally {
        await client.close();
    }
}

deleteData();
