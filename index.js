const express = require("express");
const app = express();
const userModel = require("./database/user");
const bcrypt = require("bcrypt");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");

//middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//creating a session
app.use(
  session({
    secret: "thiscanbeanything",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/passportjsfromstarting",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //ONE DAY
    },  
  })
);

//requiring passport file from there
require("./database/passport");

app.use(passport.initialize());
app.use(passport.session());

//HOMEPAGE GET
app.get("/", (req, res) => {
  res.send("Homepage");
});

//LOGIN GET
app.get("/login", (req, res) => {
  res.render("login");
});

//REGISTER GET
app.get("/register", (req, res) => {
  res.render("register");
});

//LOGIN POST
app.post(
  "/login",
  passport.authenticate("local", { successRedirect: "protected" })
); //here passport will do the work

//REGISTER (POST)
app.post("/register", async (req, res) => {
  let { username, password } = req.body;
  const newPassword = await bcrypt.hash(password, 10);
  const user = new userModel({
    username,
    password: newPassword,
  });
  user.save();
  res.json({ success: "registered successfully" });
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

//if user is authenticated then only it can go to this route
app.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("secret page");
  } else {
    res.send("bhai shai s login krle na");
  }
});

app.listen(4000, () => {
  console.log("server starts");
});
