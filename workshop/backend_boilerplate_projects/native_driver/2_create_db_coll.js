const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function createCollection() {
    try {
        await client.connect();
        const db = client.db('school');
        await db.createCollection('students');
        await db.createCollection('departments');
        await db.createCollection('teachers');
    } finally {
        await client.close();
    }
}

createCollection();
