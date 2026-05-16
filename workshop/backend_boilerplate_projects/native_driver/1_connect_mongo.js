const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:37017';
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Connection failed', error);
    } finally {
        await client.close();
    }
}

connectDB();
