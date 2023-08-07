import Joi from "joi";

const userSignupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
});

const userSigninSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
});

const userUpdateSchemas = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});

export default {
  userSignupSchema,
  userSigninSchema,
  userUpdateSchemas,
};
