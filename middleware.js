const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingschema } = require("./schema");
const expressError = require("./utils/ExpressError");
const { reviewschema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // check if user is logged in 
        console.log(req.originalUrl);
    req.flash("error", "You must be signed in to access that page!");
    req.session.redirectUrl = req.originalUrl;
    return res.redirect("/login");
  }
    next();
};

module.exports.saveReturnTo = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  } 
    next();
};

module.exports.isowner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id); 
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }   
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);   
    if (!review.author.equals(res.locals.currentUser._id)) {    

        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.validateListing = (req, res, next) => {
  const { error } = listingschema.validate(req.body);   
  if (error) {
    let msg = error.details.map(el => el.message).join(",");
    throw new expressError(400, msg);
  } else {
    next();
  }
}; 

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewschema.validate(req.body);            
    if (error) {
        let msg = error.details.map(el => el.message).join(",");    
        throw new expressError(400, msg);
    } else {
        next(); 
    }   
};
