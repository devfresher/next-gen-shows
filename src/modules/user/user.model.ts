import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"
import { User } from "../../types/user"

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	stageName: {
		type: String,
	},
	talent: { type: String },
	portfolio: { type: String },
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	emailVerified: {
		type: Boolean,
		default: false,
	},
	isAdmin: { type: Boolean, default: false },
	phoneNumber: String,
	passwordReset: {
		type: {
			token: String,
			expiry: Date,
			_id: false,
		},
	},
	profileImage: {
		type: {
			url: String,
			imageId: String,
			_id: false,
		},
	},
	createdAt: { type: Date, default: Date.now },
})

userSchema.plugin(paginate)
const UserModel = mongoose.model<User>("User", userSchema)
export default UserModel
