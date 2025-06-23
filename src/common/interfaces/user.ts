import { Role } from '../constants';

export interface IUser {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	phoneNumber: string;
	password: string;
	role: Role;
	ipAddress: string;
	isSuspended: boolean;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
