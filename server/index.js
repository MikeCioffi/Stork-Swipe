const express = require('express');
const mongoose = require('mongoose');
const mongoString = "mongodb+srv://admin:iBzgYkDnMFXUJJWs@cluster0.hckdkha.mongodb.net/Prod?retryWrites=true&w=majority";
const routes = require('./routes/routes');
const cors = require('cors')
mongoose.connect(mongoString);
const database = mongoose.connection;


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
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}


app.use(cors(corsOptions));
app.use('/api', routes)

app.listen(3001, () => {
    console.log(`Server Started at ${3001}`)
})
