import { Event } from "./event";
import { User } from "./user";

export interface Participation {
	user: User
    event: Event
    createdAt: Date
}
