// require("dotenv").config();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const hashRound = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");
mongoose.set("strictQuery", true);

mongoose.connect("mongodb://127.0.0.1:27017/userdb");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const user = mongoose.model("usercol", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/registration", (req, res) => {
  res.render("registration");
});

app.post("/registration", (req, res) => {
  const uemail = req.body.email;
  const upassword = req.body.password;

  //...........find Condition......projection............function

  user.findOne({ email: uemail }, (err, db) => {
    // execute below if no error
    if (err) {
      //if error found
      res.send(err);
    } else if (db !== null) {
      //if db found means no empty
      res.render("success", {
        title: "Email already registerd.",
        subtitle: "go and login",
      });
    } else {
      //if data not found
      bcrypt.hash(upassword,hashRound,(err,hash)=>{

        const newUser = new user({
          email: uemail,
          password: hash,
        });
        newUser.save((err) => {
          if (!err) {
            res.render("success", {
              title: "Successfully registered",
              subtitle: "go and login",
            });
          }
        });
      })
      
    }
  });
});

app.post("/login", (req, res) => {
  const uemail = req.body.email;
  const upassword = req.body.password;
  user.findOne({ email: uemail }, (err, db) => {
    if (err) {
      res.send(err);
    } else if (db !== null) {

      bcrypt.compare(upassword,db.password,(err,result)=>{

        if(result===true){

          res.render("secret", {
          title: "welcome to Secret page",
          username: "Email:  " + uemail,
          pass: "Password:  " + upassword,
        });

        }
        else if(result===false){

          res.render("secret", {
          title: "Incorrect password",
          username: "",
          pass: "",
        });

        }

      });
      
      // if ( db.password === md5(upassword)) {
      //   res.render("secret", {
      //     title: "welcome to Secret page",
      //     username: "Email:  " + uemail,
      //     pass: "Password:  " + upassword,
      //   });
      // } else if (db.password !== md5(upassword)) {
      //   res.render("secret", {
      //     title: "Incorrect password",
      //     username: "",
      //     pass: "",
      //   });
      // }
    } else {
      res.render("secret", {
        title: "Invalid Credential",
        username: "",
        pass: "",
      });
    }
  });
});

app.listen(3000, () => {
  console.log("server:3000");
});