const Joi = require("joi-browser");
// import { duration } from 'moment';

export const formValidation = Joi.object({
  senderNetwork: Joi.string().required().empty(""),
  senderNumber: Joi.string()
    .required()
    .regex(/^(054|024|055|059|020|050|057|027)/)
    .empty("")
    .length(10),
  receiverNetwork: Joi.string().required().empty(""),
  receiverNumber: Joi.string()
    .regex(/^(054|024|055|059|020|050|057|027)/)
    .required()
    .empty("")
    .length(10),
  amount: Joi.number().min(0.01).required().empty(""),
});
