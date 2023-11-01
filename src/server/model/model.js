const mongoose = require('mongoose');


//-----------NAME SCHEMA-----------------
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

//-----------listIndexSchema SCHEMA-----------------
const listIndexSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    boyIndex: {
        required: true,
        type: Number
    },
    girlIndex: {
        required: true,
        type: Number
    }
},
    { collection: 'nameDataIndex' }

)


//-----------USER SCHEMA-----------------
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



//-----------FRIEND SCHEMA-----------------
const friendSchema = new mongoose.Schema({
    status: {
        required: true,
        type: String

    },
    email: {
        required: true,
        type: String
    },
    friend_email: {
        required: true,
        type: String
    },
    friend_nickname: {
        required: false,
        type: String
    }

},
    { collection: 'Friends' }

)

//-----------LIKED NAME SCHEMA-----------------
const LikedNameSchema = new mongoose.Schema({
    nameid: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    }
},
    { collection: 'LikedData' }

)

//-----------DISLIKE NAME SCHEMA-----------------
const DisLikedDataSchema = new mongoose.Schema({
    nameid: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    }
},
    { collection: 'DisLikedData' }

)


const NameActionSchema = new mongoose.Schema({
    nameid: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'nameData'  // Reference to the collection you're populating from
    },
    email: {
        required: true,
        type: String
    },
    status: {
        required: true,
        type: String, // 'liked' or 'disliked'
    },
    gender: {
        required: true,
        type: String, // 'boy' or 'girl'
    }
},
    { collection: 'NameActions' }
);


const DisLikedData = mongoose.model('diLiked-data', DisLikedDataSchema)
const LikedData = mongoose.model('liked-data', LikedNameSchema)
const Friend = mongoose.model('friend', friendSchema)
const nameData = mongoose.model('nameData', nameDataSchema);
const User = mongoose.model('user', userSchema)
const listIndex = mongoose.model('listIndex', listIndexSchema)
const NameAction = mongoose.model('NameAction', NameActionSchema);


module.exports = {
    User, nameData, Friend, LikedData, DisLikedData, listIndex, NameAction
}

// Liked-name = {list-data-ID, userID}
// Friends = {userID, friends []}
// List-data = {list-data-id, list-id, title}
