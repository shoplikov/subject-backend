const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register
app.post("/signup", async (req, res) => {

    const data = {
        username: req.body.username,
        password: req.body.password
    }

    const existingUser = await collection.findOne({ username: data.username });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
    
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; 

        const userdata = await collection.insertMany(data);
        res.render("login");

        console.log(userdata);
    }

});


app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ username: req.body.username });

        if (!user) {
            res.send("User username not found");
            return;
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordMatch) {
            res.send("Wrong password");
            return;
        }

        res.render("home", { username: user.username });

    } catch (error) {
        console.error(error);
        res.send("Error while processing login");
    }
});


const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/signup`)
});