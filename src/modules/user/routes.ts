import { Router } from "express"

import ValidationMiddleware from "../../middleware/validate"
import UserController from "./user.controller"
import UserValidator from "./user.validate"
import AuthMiddleware from "../../middleware/auth"

const router = Router()

router.put(
	"/onboarding",
	AuthMiddleware.authenticateToken,
	ValidationMiddleware.validateRequest(UserValidator.onboarding),
	UserController.onboarding
)

router.get(
	'/participants',
	AuthMiddleware.authenticateToken,
	UserController.getAllParticipants
);
export default router
