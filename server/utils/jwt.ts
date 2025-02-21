import jwt from 'jsonwebtoken';

const useGenerateJwt = (user: User) => {
	const config = useRuntimeConfig();

	return jwt.sign(
		{
			userId: user.id,
			username: user.username,
		},
		config.jwtSecret,
		{
			expiresIn: '30d',
		},
	);
};

const useVerifyJwt = (token: string) => {
	const config = useRuntimeConfig();

	return jwt.verify(token, config.jwtSecret);
};

export { useGenerateJwt, useVerifyJwt };
