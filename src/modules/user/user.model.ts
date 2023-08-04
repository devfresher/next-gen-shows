import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { User } from '../../types/user';

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	fullName: {
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
	isVoter: { type: Boolean, default: false },
	reason: String,
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
});

userSchema.plugin(paginate);
userSchema.pre('save', function (next) {
	this.fullName = `${this.firstName || ''} ${this.lastName || ''}`.trim();
	next();
});
const UserModel = mongoose.model<User>('User', userSchema);
export default UserModel;
