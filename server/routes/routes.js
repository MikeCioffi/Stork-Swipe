
const express = require('express');
const Model = require('../model/model');
const bodyParser = require('body-parser')



const router = express.Router()

// create application/json parser
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = router;

//Post Method to create new NAME in DB
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


//Post Method to create new FRIEND in DB
router.post('/friend/post', jsonParser, async (req, res) => {
    const friendData = new Model.Friend({
        status: req.body.status,
        email: req.body.email,
        friend_email: req.body.friend_email,
        friend_nickname: req.body.friend_nickname
    })

    try {
        const dataToSave = await friendData.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
//Delete a friend relationship
router.delete('/friend/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.Friend.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})



//Get user's friends by their email
router.get('/friend/getOne/:email', async (req, res) => {
    try {
        console.log(req.params)
        const data = await Model.Friend.find(
            {
                email: req.params.email
            });
        const data2 = await Model.Friend.find(
            {
                friend_email: req.params.email
            });
        if (data2.length > 0) {
            data2.map(element => {
                data.push(element)
            })
        }
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/friend/accept/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        console.log(req.body)
        const result = await Model.Friend.findByIdAndUpdate(
            id, { status: 'accepted' }, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, {
            status: 'accepted',
        }, options
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