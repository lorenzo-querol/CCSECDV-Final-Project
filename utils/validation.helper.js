import sanitizeHtml from "sanitize-html";

export const checkPassword = (password, confirmPassword) => {
	if (confirmPassword) return password === confirmPassword;

	const passwordRegex =
		/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{12,64}$/;
	return passwordRegex.test(password);
};

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
