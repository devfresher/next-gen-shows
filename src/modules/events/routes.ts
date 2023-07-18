import { Router } from "express"

import ValidationMiddleware from "../../middleware/validate"
import AuthMiddleware from "../../middleware/auth"
import EventValidator from "./event.validate"
import EventController from "./event.controller"

const router = Router()

router.post(
	"/",
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateRequest(EventValidator.newEvent),
	EventController.createEvent
)

router.post(
	"/join/:eventId",
	AuthMiddleware.authenticateToken,
	ValidationMiddleware.validateRequest(EventValidator.joinEvent),
	EventController.joinAsParticipant
)

router.put(
	"/:eventId",
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds("eventId"),
	ValidationMiddleware.validateRequest(EventValidator.updateEvent),
	EventController.updateEvent
)

router.delete(
	"/:eventId",
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds("eventId"),
	EventController.deleteEvent
)

router.get("/", EventController.getAll)

export default router
