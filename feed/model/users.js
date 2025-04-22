const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: String,
        default: 'https://th.bing.com/th/id/R.9e4bb18cf7df721c7d619b8817283529?rik=bseqybH4uD3Yug&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fBF1PfVs.jpg&ehk=cML0CdsP354Z3MEhhj64nwsiTeu4k82kqDpLYiyb0Ms%3d&risl=&pid=ImgRaw&r=0'
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
