const express = require("express");
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

const app = express();
app.use(express.json());


app.get("/findProducts", async (request, response) => {
  try {
    const productName = request.query.productName;
    await client.connect();
    const db = client.db('ecommdb');
    const Products = db.collection('products');

    const allProducts = await Products.find({"name":productName}).toArray();

    response.status(200).send(allProducts)
  } catch(error){
    response.status(500).send("Something went wrong")
  } finally{
    await client.close();
  }
})

app.post("/signup", async (request, response) => {
    try {
        const email = request.body.email;
        const password = request.body.password;

        await client.connect();
        const db = client.db('ecommdb');
        const UsersCollection = db.collection('users');
        await UsersCollection.insertOne({ "email": email, "password": password });
        response.status(200).send("Signup Success")
    } catch(error){
        response.status(500).send("Something went wrong")
    } finally{
        await client.close(); 
    }
});


app.post("/login", async (request, response) => {
    try {
        const email = request.body.email;
        const password = request.body.password;

        await client.connect();
        const db = client.db('ecommdb');
        const UsersCollection = db.collection('users');
        const userDoc = await UsersCollection.findOne({ "email": email });
        if(!userDoc){
            response.status(401).send("Invalid Credentials")
        }
        if(password !== userDoc.password){
            response.status(401).send("Invalid Credentials")
        }
        response.status(200).send(userDoc)
    } catch(error){
        response.status(500).send("Something went wrong")
    } finally {
        await client.close(); 
    }

});

app.delete("/deleteStudent", async (request, response) => {
    try {
        const email = request.body.email;

        await client.connect();
        const db = client.db('ecommdb');
        const usersCollection = db.collection('users');
        await usersCollection.deleteOne({ "email": email });
        response.status(200).send("user deleted")
    } catch(error){
        response.status(500).send("Something went wrong")
    } finally{
        await client.close();
    }

});

app.put("/changePassword", async (request, response) => {
    try {
        const email = request.body.email;
        const currentPassword = request.body.currentPassword;
        const newPassword = request.body.newPassword;

        await client.connect();
        const db = client.db('ecommdb');
        const UsersCollection = db.collection('users');
        const userDoc = await UsersCollection.findOne({ "email": email });
        if(userDoc.password != currentPassword){
            response.status(401).send("Invalid Credentials")
        }
        await UsersCollection.updateOne(
              { "email": email },
              { $set: { "password": newPassword } }
        ); 
        response.status(200).send("password updated")
    } catch(error){
        response.status(500).send("Something went wrong")
    } finally{
        await client.close();
    }

});

app.listen(3000, () => console.log(`Server running on port 3000`));


