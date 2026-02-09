if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const expressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
app.use(express.json());
const path = require("path");
const ejsmate = require("ejs-mate");
const methodOverride = require("method-override");
const reviewrouter= require("./routes/review");
const userrouter= require("./routes/user");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const listingrouter= require("./routes/listing");
const session = require("express-session");
const flash = require("connect-flash");

app.engine("ejs", ejsmate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const sessionOptions = {
  secret: "thisisasecret!",
  resave: false, // don't save session if unmodified
  saveUninitialized: true, // don't create session until something stored
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // one week
    maxAge: 1000 * 60 * 60 * 24 * 7, // one week
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());// persistent login sessions to each tabs and browser
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());// store user in session
passport.deserializeUser(User.deserializeUser());// get user from session 
 
const mongo_url = process.env.MONGO_URI ;

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error", err);
  });
async function main() {
  await mongoose.connect(mongo_url);
}


app.get("/", (req, res) => {
  res.send("Hello World from MongoDB project");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});


app.use("/listings", listingrouter);
app.use("/listings/:id/reviews", reviewrouter);
app.use("/", userrouter);
app.all(/(.*)/, (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) =>{
  let {statusCode = 500, message ="Something went Wrong !"} = err;
  // res.send("Something went wrong !")
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{err});
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});











