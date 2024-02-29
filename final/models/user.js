const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    articles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
