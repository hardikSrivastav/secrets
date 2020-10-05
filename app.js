require('dotenv').config(); 
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const mongooseEncryption = require('mongoose-encryption');

mongoose.connect("mongodb://localhost:27017/userDb", {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false})

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(mongooseEncryption, {secret: process.env.CODE_SECRET, excludeFromEncryption: ['email'], encryptedFields: ['password']})

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
})

app.get("/login", function(req, res) {
    res.render("login");
})

app.get("/register", function(req, res) {
    res.render("register");
})

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username, 
        password: req.body.password
    })

    newUser.save(function(err) {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets")
            console.log("Successfully saved all the items"); 
        }
    });
})

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email : username}, function(err, foundUser) {
        if (foundUser) {
            if (foundUser.password === password) {
                res.render("secrets")
            }
        } else {
            console.log(err)
        }
    })
})

app.listen(3000, function() {
    console.log("server started at port 3000");
})