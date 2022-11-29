const mongoose = require('mongoose');

const nameDataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    ismale: {
        required: false,
        type: Boolean
    },
    isfemale: {
        required: false,
        type: Boolean
    }
},
    { collection: 'nameData' })


const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    first_name: {
        required: false,
        type: String
    },
    last_name: {
        required: false,
        type: String
    },
    image_url: {
        required: false,
        type: String
    }

},
    { collection: 'Users' }

)



const nameData = mongoose.model('list-data', nameDataSchema)
const User = mongoose.model('user', userSchema)


module.exports = {
    User, nameData
}

// Liked-name = {list-data-ID, userID}
// Friends = {userID, friends []}
// List-data = {list-data-id, list-id, title}
