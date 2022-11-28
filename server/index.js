const express = require('express');
const mongoose = require('mongoose');
const mongoString = "mongodb+srv://admin:iBzgYkDnMFXUJJWs@cluster0.hckdkha.mongodb.net/?retryWrites=true&w=majority";
const routes = require('./routes/routes');




mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();
const bodyParser = require('body-parser')

// create application/json parser
const jsonParser = bodyParser.json()


// app.configure(function () {
//     app.use(express.bodyParser());
// });

app.use('/api', routes)

app.listen(3001, () => {
    console.log(`Server Started at ${3001}`)
})



// const { MongoClient } = require('mongodb');

// async function main() {
//     /**
//      * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//      * See https://docs.mongodb.com/drivers/node/ for more details
//      */
//     const uri = "mongodb+srv://admin:iBzgYkDnMFXUJJWs@cluster0.hckdkha.mongodb.net/?retryWrites=true&w=majority";

//     /**
//      * The Mongo Client you will use to interact with your database
//      * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
//      * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
//      * pass option { useUnifiedTopology: true } to the MongoClient constructor.
//      * const client =  new MongoClient(uri, {useUnifiedTopology: true})
//      */
//     const client = new MongoClient(uri);

//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();
//         console.log('Database Connected');


//         // Make the appropriate DB calls

//     } finally {
//         // Close the connection to the MongoDB cluster
//         await client.close();
//     }
// }

// main().catch(console.error);

// // Add functions that make DB calls here



