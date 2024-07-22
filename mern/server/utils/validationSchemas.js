import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const reservationSchema = Joi.object({
  bedId: Joi.string().required(),
  date: Joi.date().iso().required(), // YYYY-MM-DD
  time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required() // HH:MM
});

export const bedSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
});

export const availabilitySchema = Joi.object({
  bedId: Joi.string().optional(),
  date: Joi.date().iso().required(), // YYYY-MM-DD
  time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(), // HH:MM
  isAvailable: Joi.boolean().optional()
});