import { tables, useDrizzle } from '#imports';

export default defineEventHandler(async (event) => {
	try {
		const { username, password } = await readBody(event);
		const hash = await useHashPassword(password);

		const user = await useDrizzle().insert(tables.users).values({
			name: username,
			username,
			password: hash,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		console.log(user);

		const token = useGenerateJwt(user);
		setResponseStatus(event, 201, 'User created');

		return {
			name,
			username,
			token,
		};
	} catch (e) {
		setResponseStatus(event, 500, 'Internal server error');
		return { error: (e as Error).message };
	}
});
