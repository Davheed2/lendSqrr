import { AppError } from '@/common/utils';

/**
 * Validates and trims a phone number.
 * The phone number must contain only digits and be between 10 and 15 characters long.
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {string} - The trimmed and validated phone number.
 * @throws {AppError} - If the phone number format is invalid.
 */
export const validatePhoneNumber = (phoneNumber: string): string => {
	const trimmedPhoneNumber = phoneNumber.trim();
	if (!/^\d{10,15}$/.test(trimmedPhoneNumber)) {
		throw new AppError('Phone number must be between 10 and 15 digits long and contain only numbers.', 400);
	}
	return trimmedPhoneNumber;
};

/**
 * Validates and trims an email.
 * The email must follow the general pattern of email addresses: `example@domain.com`.
 * @param {string} email - The email to validate.
 * @returns {string} - The trimmed and validated email.
 * @throws {AppError} - If the email format is invalid.
 */
export const validateEmail = (email: string): string => {
	const trimmedEmail = email.trim();
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(trimmedEmail)) {
		throw new AppError(
			'Email must be in a valid format, e.g., user@example.com. It should not contain spaces and must include an "@" symbol and a domain.',
			400
		);
	}
	return trimmedEmail;
};

/**
 * Validates and trims a username.
 * The username must contain only alphanumeric characters, and be between 3 and 10 characters long.
 * @param {string} username - The username to validate.
 * @returns {string} - The trimmed and validated username.
 * @throws {AppError} - If the username format is invalid.
 */
export const validateUsername = (username: string): string => {
	const trimmedUsername = username.trim();
	const usernameRegex = /^[a-zA-Z0-9]{3,10}$/;
	if (!usernameRegex.test(trimmedUsername)) {
		throw new AppError(
			'Username must be between 3 and 10 characters long and can only contain letters and numbers (a-z, A-Z, 0-9).',
			400
		);
	}
	return trimmedUsername;
};

/**
 * Validates and trims a password.
 * The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.
 * @param {string} password - The password to validate.
 * @returns {string} - The trimmed and validated password.
 * @throws {AppError} - If the password format is invalid.
 */
export const validatePassword = (password: string): string => {
	const trimmedPassword = password.trim();
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
	if (!passwordRegex.test(trimmedPassword)) {
		throw new AppError(
			'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character',
			400
		);
	}
	return trimmedPassword;
};

/**
 * Trims and returns the given name (first or last name).
 * @param {string} name - The name to trim.
 * @returns {string} - The trimmed name.
 */
export const trim = (name: string): string => {
	return name.trim();
};

/**
 * Validates that the input is a number.
 * If the input is not a number, it throws an error.
 *
 * @param {number} value - The value to validate.
 * @returns {number} - The validated number.
 */
export const validateAmount = (value: number): number => {
	if (typeof value !== 'number' || isNaN(value)) {
		throw new AppError('Invalid number', 400);
	}

	return value;
};
