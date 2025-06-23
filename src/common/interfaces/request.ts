import { IUser } from "./user";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			 user?: IUser; // uncomment this if you want to use user in your routes , note: IUser is the interface of your user model
			file?: Express.Multer.File;
		}
	}
}

export {};
