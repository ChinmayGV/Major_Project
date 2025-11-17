const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  price: Joi.number().required().min(0),
  image: Joi.string().allow("", null),
  geometry: Joi.object({
    type: Joi.string().valid("Point"),
    coordinates: Joi.array().items(Joi.number()).required().length(2),
  }),
  category: Joi.string()
    .required()
    .valid(
      "Trending",
      "Rooms",
      "Mountains",
      "Iconic Cities",
      "Castles",
      "Pools",
      "Camping",
      "Farms",
      "Arctic",
      "Domes",
      "Boats"
    ),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required().min(20).max(1000),
  }).required(),
});

module.exports.userSchema = Joi.object({
  email: Joi.string().pattern(/.+@.+/).required().messages({
    "string.pattern.base": 'Email must contain an "@" symbol.',
  }),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$")
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  username: Joi.string().required(),
});

module.exports.searchSchema = Joi.object({
  // 'q' is the name of your query parameter (e.g., /search?q=hello)
  q: Joi.string()
    .trim() // Removes leading/trailing whitespace
    .max(100) // Prevents super long queries (DoS attack)
    .allow(""), // Allows an empty search (e.g., /search?q=)
});

module.exports.searchSuggestionSchema = Joi.object({
  q: Joi.string()
    .trim()
    .max(50) // Keep it short for suggestions
    .allow(""),
});
