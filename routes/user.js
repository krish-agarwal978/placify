const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveReturnTo } = require("../middleware");
const {renderSignup, renderLogin, signup, login, logout} = require("../controllers/user");


router.route( "/signup")
.get(renderSignup)
.post(wrapAsync(signup));

router.route("/login")
.get(renderLogin)
.post(saveReturnTo,
  passport.authenticate("local", {  
    failureFlash: true,
    failureRedirect: "/login",
  }), // syntax use passport.authenticate(strategy, options) 
    login
);

router.route("/logout")
.get( logout);

module.exports = router;

