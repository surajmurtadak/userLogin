const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");
mongoose.set("strictQuery", true);

mongoose.connect("mongodb://localhost:27017/userdb");

const userSchema = {
  email: { type: String, required: true },
  password: { type: String, required: true },
};

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

  user.findOne({ email: uemail }, { _id: 0, password: 0 }, (err, db) => {
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
      const newUser = new user({
        email: uemail,
        password: upassword,
      });
      newUser.save((err) => {
        if (!err) {
          res.render("success", {
            title: "Successfully registered",
            subtitle: "go and login",
          });
        }
      });
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
      if (db.password === upassword) {
        res.render("secret", {
          title: "welcome to Secret page",
          username: "Email:  " + uemail,
          pass: "Password:  " + upassword,
        });
      } else if (db.password !== upassword) {
        res.render("secret", {
          title: "Incorrect password",
          username: "",
          pass: "",
        });
      }
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
