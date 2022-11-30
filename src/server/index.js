const express = require('express');
const mongoose = require('mongoose');
const mongoString = "mongodb+srv://admin:iBzgYkDnMFXUJJWs@cluster0.hckdkha.mongodb.net/Prod?retryWrites=true&w=majority";
const routes = require('./routes/routes');
const cors = require('cors')
mongoose.connect(mongoString);
const database = mongoose.connection;
const hostname = 'ec2-18-117-130-121.us-east-2.compute.amazonaws.com'

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();
const bodyParser = require('body-parser');
const { data } = require('autoprefixer');

// create application/json parser
const jsonParser = bodyParser.json()


// app.configure(function () {
//     app.use(express.bodyParser());
// });

const corsOptions = {
    origin: 'https://0a56-54-82-84-176.ngrok.io',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}


app.use(cors(corsOptions));
app.use('/api', routes)

app.listen(8080, '0.0.0.0', () => {
    console.log(`Server Started at port ${8080}`)
})
