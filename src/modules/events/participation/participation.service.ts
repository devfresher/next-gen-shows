import { BadRequestError } from "../../../errors"
import { JoinEventInput } from "../../../types/event"
import { Participation } from "../../../types/participation"

import UserService from "../../user/user.service"
import EventService from "../event.service"
import ParticipationModel from "./participation.model"

export default class ParticipationService {
    private static model = ParticipationModel

    public static async create(
		userId: string,
		eventId: string,
		data: JoinEventInput
	): Promise<Participation> {
		const user = await UserService.getOne({_id: userId})
		const event = await EventService.getOne({_id: eventId})

        if (!user) throw new BadRequestError("Invalid User")
        if(!event) throw new BadRequestError("Invalid Event")

        const newParticipation = new this.model({
            user: userId,
            event: eventId,
            registeredData: {
                name: data.fullName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                portfolio: data.portfolio
            }
        })
        await newParticipation.save()
        return newParticipation
	}
} 