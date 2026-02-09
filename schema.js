const Joi = require('joi');

const listingschema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().allow(''),
    location: Joi.string().allow(''),
    country: Joi.string().allow(''),
    image: Joi.object({
      url: Joi.string().uri().allow('')
    }).optional()
  }).required()
});

const reviewschema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required()
});

module.exports.listingschema = listingschema;
module.exports.reviewschema = reviewschema;   