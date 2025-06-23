import { ENVIRONMENT } from '@/common/config';
import { AppError } from '@/common/utils';
import axios from 'axios';

export const checkBlacklistedUser = async (identity: string): Promise<boolean> => {
	try {
		const response = await axios.get(`https://adjutor.lendsqr.com/v2/verification/karma/${identity}`, {
			headers: {
				Authorization: `Bearer ${ENVIRONMENT.ADJUTOR_TOKEN.TOKEN}`,
				'Content-Type': 'application/json',
			},
		});

		return response.status === 200;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			// Not blacklisted
			return false;
		}
		throw new AppError('Error checking blacklist status', 500);
	}
};
