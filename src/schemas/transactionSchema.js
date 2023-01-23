import joi from 'joi'

export const transactionSchema = joi.object({
  type: joi.string().required(),
  description: joi.string().required(),
  value: joi.number().required()
});