const Listing = require("../models/listing");   
const Review = require("../models/review");

module.exports.createReview = async (req, res,next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id); 
    const review = new Review(req.body.review);
    review.author = res.locals.currentUser._id; 
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Successfully added a review!");
    res.redirect(`/listings/${listing._id}`);
  } catch (e) {
    next(e);
  }
};

module.exports.deleteReview = async (req, res,next) => {
  try {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
    } catch (e) {
        next(e);
    }
};