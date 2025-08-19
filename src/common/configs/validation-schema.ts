import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number(),
  DATABASE_HOST: Joi.string(),
  DATABASE_PORT: Joi.number().min(1000),
  DATABASE_USERNAME: Joi.string(),
  DATABASE_PASSWORD: Joi.string(),
  DATABASE_NAME: Joi.string(),
  DATABASE_SYNCHRONIZE: Joi.boolean(),
});
