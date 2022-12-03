
const express = require('express');
const Model = require('../model/model');
const bodyParser = require('body-parser')



const router = express.Router()

// create application/json parser
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = router;

router.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


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

router.get('/name/getall', async (req, res) => {

    try {
        const data = await Model.nameData.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// used get users liked names based on email
router.get('/name/like/getbyemail/:email', jsonParser, async (req, res) => {
    try {
        const data = await Model.LikedData.find({ email: req.params.email })
        // assuming data is returned
        const result = data.map(async obj => {
            return {
                likeid: obj,
                data: await Model.nameData.findById(obj.nameid).exec()

            }
        }
        )
        await Promise.all(result).then(completed => {
            res.json(completed)
        })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }

})
// used to create a user to name 1:many like relationship
router.post('/name/like/post', jsonParser, async (req, res) => {
    const LikedData = new Model.LikedData({
        nameid: req.body.nameid,
        email: req.body.email,
    })

    try {
        const dataToSave = await LikedData.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//used to delete the users 'like' of a name
router.delete('/name/like/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.LikedData.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// used get users disliked names based on email
router.get('/name/dislike/getbyemail/:email', jsonParser, async (req, res) => {
    try {
        const data = await Model.DisLikedData.find({ email: req.params.email })
        // assuming data is returned
        const result = data.map(async obj => {
            return {
                likeid: obj,
                data: await Model.nameData.findById(obj.nameid).exec()

            }
        }
        )
        await Promise.all(result).then(completed => {
            res.json(completed)
        })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }

})

//used to delete the users 'dislikelike' of a name
router.delete('/name/dislike/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.DisLikedData.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/name/dislike/post', jsonParser, async (req, res) => {
    const dislikedData = new Model.DisLikedData({
        nameid: req.body.nameid,
        email: req.body.email,
    })

    try {
        const dataToSave = await dislikedData.save();
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

// when a new user is created, set their boy and girl index's to 0
router.post('/listIndex/create/:email', async (req, res) => {
    const listData = new Model.listIndex({
        email: req.params.email,
        boyIndex: 0,
        girlIndex: 0,

    })
    try {
        const dataToSave = await listData.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// to get the users boy and girl indexs
router.get('/listIndex/get/:email', async (req, res) => {
    const email = req.params;
    try {
        const data = await Model.listIndex.find(email);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// used to increment the boy and girl index, depending on user action
router.post('/listIndex/update/:email', jsonParser, async (req, res) => {
    try {
        const filter = { email: req.params.email };
        console.log(req.body)
        const update = req.body;
        console.log(update)
        const result = await Model.listIndex.findOneAndUpdate(filter, update, {
            new: true
        })

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})