const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { isLoggedIn, isowner, validateListing } = require("../middleware");
const {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  deleteListing,
} = require("../controllers/listing");
const multer = require("multer");
const { storage } = require("../cloudconfig");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(createListing),
  );
router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(isLoggedIn, isowner, validateListing, wrapAsync(updateListing))
  .delete(isLoggedIn, isowner, wrapAsync(deleteListing));

router.get("/:id/edit", isLoggedIn, isowner, wrapAsync(renderEditForm));

module.exports = router;
