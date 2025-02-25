import * as jose from 'jose';

const useGenerateJwt = async (user: User) => {
	const config = useRuntimeConfig();

	const secret = new TextEncoder().encode(config.jwtSecret);

	return await new jose.SignJWT({
		name: user.name,
		username: user.username,
		id: user.id,
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('30d')
		.sign(secret);
};

const useVerifyJwt = async (token: string) => {
	const config = useRuntimeConfig();

	const secret = new TextEncoder().encode(config.jwtSecret);

	const { payload, protectedHeader } = await jose.jwtVerify(token, secret);
	console.log('payload', payload);

	return payload;
};

export { useGenerateJwt, useVerifyJwt };
