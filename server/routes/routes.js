
const express = require('express');
const Model = require('../model/model');
const bodyParser = require('body-parser')



const router = express.Router()

// create application/json parser
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = router;

//Post Method to create new names in DB
router.post('/name/post', jsonParser, async (req, res) => {
    const listData = new Model.nameData({
        name: req.body.name,
        ismale: req.body.ismale,
        isfemale: req.body.isfemale
    })

    try {
        const dataToSave = await listData.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Post Method to create new USER in DB
router.post('/user/post', jsonParser, async (req, res) => {
    const listData = new Model.User({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        image_url: req.body.image_url
    })

    try {
        const dataToSave = await listData.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// //Get all users in db
// router.get('/user/getAll', async (req, res) => {
//     try {
//         const data = await Model.User.find();
//         res.json(data)
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

//Get a user by their email
router.get('/user/getOne/:email', async (req, res) => {

    const email = req.params;
    try {
        const data = await Model.User.find(email);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})