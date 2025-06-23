export interface IEnvironment {
	APP: {
		NAME?: string;
		PORT: number;
		ENV?: string;
	};
	DB: {
		HOST: string;
		USER: string;
		PASSWORD: string;
		DATABASE: string;
		PORT: string;
	};
	JWT: {
		AUTH_SECRET: string;
		ACCESS_SECRET: string;
		REFRESH_SECRET: string;
	};
	JWT_EXPIRES_IN: {
		ACCESS: string;
		REFRESH: string;
	};
	ADJUTOR_TOKEN: {
		TOKEN: string;
	}
}
