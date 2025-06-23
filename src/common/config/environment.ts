import type { IEnvironment } from '@/common/interfaces';

export const ENVIRONMENT: IEnvironment = {
	APP: {
		NAME: process.env.APP_NAME,
		PORT: parseInt(process.env.PORT || process.env.APP_PORT || '3000'),
		ENV: process.env.NODE_ENV,
	},
	DB: {
		HOST: process.env.DB_HOST!,
		USER: process.env.DB_USER!,
		PASSWORD: process.env.DB_PASSWORD!,
		DATABASE: process.env.DB_DATABASE!,
		PORT: process.env.DB_PORT!,
	},
	JWT: {
		AUTH_SECRET: process.env.AUTH_SECRET!,
		ACCESS_SECRET: process.env.ACCESS_TOKEN!,
		REFRESH_SECRET: process.env.REFRESH_TOKEN!,
	},
	JWT_EXPIRES_IN: {
		ACCESS: process.env.ACCESS_TOKEN_EXPIRES_IN!,
		REFRESH: process.env.REFRESH_TOKEN_EXPIRES_IN!,
	},
	ADJUTOR_TOKEN: {
		TOKEN: process.env.ADJUTOR_TOKEN!,
	},
};
