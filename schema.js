const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  price: Joi.number().required().min(0),
  image: Joi.string().allow("", null),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required().min(20),
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
