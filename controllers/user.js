 const User = require("../models/user");
 



 module.exports.renderSignup = (req,res) => {
    res.render("user/signup.ejs");
};

module.exports.renderLogin = (req,res) => {
    res.render("user/login.ejs");
};

module.exports.signup = async (req,res, next) => {    
    try {
      const { username, email, password } = req.body;   
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => { //automatically login user after signup
            if (err) return next(err);  
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        }
        );
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
};  

module.exports.login = async (req,res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl ||  "/listings"; 
    res.redirect(redirectUrl);
};


module.exports.logout = (req,res,next) => {
    req.logout(function(err) { // req.logout() is asynchronous function which accepts a callback argument and implemet functioanlity to logout user
        if (err) { return next(err); }
        req.flash("success", "Logged you out!");
        res.redirect("/listings");
      });
};
