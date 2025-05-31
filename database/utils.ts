export function validateUsername(username: string): boolean
{
	return /^[a-zA-Z0-9_-]{3,18}$/.test(username);
}

export function validateEmail(email: string): boolean
{
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean
{
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
}