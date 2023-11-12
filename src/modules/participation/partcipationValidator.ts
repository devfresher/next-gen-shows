import { Request } from 'express';
import Joi, { ValidationResult, options } from '../../utils/joi';

export default class ParticipationValidator {
	static markShortlist(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			stage: Joi.number().valid(1, 2, 3).label('Stage Number'),
		});

		return validationSchema.validate(req.body, options);
	}
}
