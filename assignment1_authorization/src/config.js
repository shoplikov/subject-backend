const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/auth");

connect.then(() => {
    console.log("db connection is established");
})
.catch(() => {
    console.log("couldn't connect to the database");
})

const Loginschema = new mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection = new mongoose.model("users", Loginschema);

module.exports = collection;