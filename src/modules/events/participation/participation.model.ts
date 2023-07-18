import mongoose, { Types } from "mongoose"
import { Participation } from "../../../types/participation"

const ParticipationSchema = new mongoose.Schema({
	user: { type: Types.ObjectId, ref: "User", required: true },
	event: { type: Types.ObjectId, ref: "Event", required: true },
	registeredData: { type: Object },
	multimedia: {
		type: {
			url: String,
			id: String,
			_id: false,
		},
	},
	createdAt: { type: Date, default: Date.now },
})

const ParticipationModel = mongoose.model<Participation>("Participation", ParticipationSchema)
export default ParticipationModel
