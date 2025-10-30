const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema, userSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
module.exports.isLoggedIn = (req, res, next) => {
  //   if (!req.isAuthenticated()) {
  //     req.session.redirectUrl = req.originalUrl;
  //     req.flash("error", "you must be logged in to create Listing");
  //     return res.redirect("/login");
  //   }
  if (!req.isAuthenticated()) {
    // Only save the original URL if the request method is GET
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    } else {
      // For non-GET requests (POST, DELETE, etc.), set a safe default.
      // The listing page is the best place to return to after a failed review action.
      req.session.redirectUrl = req.get("referer") || "/";
    }

    req.flash("error", "You must be signed in to perform that action!");
    return res.redirect("/login");
  }

  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let newlisting = await Listing.findById(id);
  if (!newlisting.owner._id.equals(req.user._id)) {
    req.flash("error", "You are not the owner of the listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  // 1. Validate the request body against your schema
  const { error } = listingSchema.validate(req.body);
  if (error) {
    // 2. If there is an error, extract the message and throw it
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    // 3. If there is no error, call next() to proceed to the route handler
    next();
  }
};
module.exports.validateReview = (req, res, next) => {
  // 1. Validate the request body against your schema
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // 2. If there is an error, extract the message and throw it
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    // 3. If there is no error, call next() to proceed to the route handler
    next();
  }
};

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.isreviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "You don't have access to delete this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateSearch = (schema, property) => {
  return (req, res, next) => {
    // 'property' will be 'body', 'query', or 'params'
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      req.flash("error", "search lenght should be below length 100");
      res.redirect("/listings");
      return;
    }

    // IMPORTANT: Overwrite the req property with the validated and
    // sanitized value (e.g., the trimmed string)
    req[property] = schema.validate(req[property]).value;

    next();
  };
};
