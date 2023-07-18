import { Router } from "express"

import AuthController from "./auth.controller"
import AuthValidator from "./auth.validate"
import ValidationMiddleware from "../../middleware/validate"
import AuthMiddleware from "../../middleware/auth"

const router = Router()

router.post(
	"/signup",
	ValidationMiddleware.validateRequest(AuthValidator.newParticipant),
	AuthController.signup
)

router.post(
	"/login",
	ValidationMiddleware.validateRequest(AuthValidator.login),
	AuthController.login
)

router.get("/me", AuthMiddleware.authenticateToken, AuthController.me)

export default router
