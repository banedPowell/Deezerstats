import jwt from 'jsonwebtoken';

const useGenerateJwt = async (user: User) => {
	const config = useRuntimeConfig();

	return jwt.sign(
		{
			id: user.id,
			username: user.username,
		},

		config.jwtSecret,

		{
			expiresIn: '30d',
		},
	);
};

const useVerifyJwt = async (token: string) => {
	const config = useRuntimeConfig();

	return jwt.verify(token, config.jwtSecret);
};

export { useGenerateJwt, useVerifyJwt };
