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

		const karmaData = response.data?.data;
		const isBlacklisted = !!karmaData?.karma_type?.is_blacklisted;

		// console.log('Karma Check Result:', {
		// 	isBlacklisted,
		// 	identity: karmaData?.karma_identity,
		// 	reason: karmaData?.reason,
		// 	amountInContention: karmaData?.amount_in_contention,
		// });

		return isBlacklisted;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			// Not blacklisted
			return false;
		}
		throw new AppError('Error checking blacklist status', 500);
	}
};
