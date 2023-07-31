/**
 * Check if the password is valid through regex validation
 * @param {*} password The password of the user
 * @param {*} confirmPassword The confirmation password of the user
 * @returns True if the password is valid, false otherwise
 */
export const checkPassword = (password, confirmPassword) => {
	if (confirmPassword) return password === confirmPassword;

	const passwordRegex =
		/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{12,64}$/;
	return passwordRegex.test(password);
};

/**
 * Validate data through regex validation
 * @param {*} firstName The first name of the user
 * @param {*} lastName The last name of the user
 * @param {*} phoneNumber The phone number of the user
 * @param {*} email The email of the user
 * @returns True if the data is valid, false otherwise
 */
export const validateData = (firstName, lastName, phoneNumber, email) => {
	const nameRegex = /^[\w\s\u00C0-\u017F]{2,}$/;
	const phoneRegex = /^\s*09\d{9}\s*$/;
	const emailRegex =
		/^[\w.\-]+[a-zA-Z0-9]*@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

	return (
		nameRegex.test(firstName) &&
		nameRegex.test(lastName) &&
		phoneRegex.test(phoneNumber) &&
		emailRegex.test(email)
	);
};

export const sanitizeObject = (object) => {
	for (const key in object) object[key] = sanitizeHtml(object[key].trim());
	return object;
};
