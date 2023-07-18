import { Router } from "express"
import AuthController from "../auth/auth.controller"

const router = Router()

router.get("/activate/:activationToken", AuthController.activateEmail)

export default router
