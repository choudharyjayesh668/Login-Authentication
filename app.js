const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const User=require ("./models/user.js");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/LoginAuthentication")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });
app.get("/", (req, res) => {
    res.render("signup.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs", {
        error: null
    });
})

app.post("/signup", async (req, res) => {
    let {email,password}=req.body;
    const newUser= new User({
        email,
        password
    });
    await newUser.save();
    res.redirect("/login");
});

app.post("/login",async (req,res)=>{
   let {email,password}=req.body;
   const foundUser= await User.findOne({email:email});
   if(!foundUser){
       return res.render("login.ejs", {
           error: "Email not found"
       });
   }
    if(foundUser.password !== password){
        return res.render("login.ejs", {
            error: "Password does not match"
        });
   }
   return res.render("homepage.ejs");
});
app.listen(8080, () => {
    console.log("http://localhost:8080/");
});