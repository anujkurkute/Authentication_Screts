//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://0.0.0.0:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });



  userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

  const User = mongoose.model('User', userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) =>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

   newUser.save()
  .then(() => {
    res.render("secrets");
  })
  .catch((error) => {
    console.error('Failed to save user to MongoDB:', error);
  });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .then((foundUser) => {
        if(foundUser.password === password){
        res.render("secrets");
        }
    })
    .catch((err) => {
        console.log(err);
    });
});

app.listen(3000, () =>{
    console.log("Server started on port 3000.");
});