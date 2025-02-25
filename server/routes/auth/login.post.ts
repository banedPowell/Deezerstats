import type { UserPayload } from '~/stores/authStore';

export default defineEventHandler(async (event) => {
	const { username, password }: UserPayload = await readBody(event);

	try {
		if (!username || !password) {
			setResponseStatus(event, 400, 'Username and password are required');
			return { error: 'Username and password are required' };
		}

		const user = await useDrizzle()
			.select()
			.from(tables.users)
			.where(eq(tables.users.username, username));

		if (!user) {
			setResponseStatus(event, 404, 'User not found');
			return { error: 'User not found' };
		}

		const userObject = user[0];

		const isPasswordValid = await useComparePassword(
			password,
			userObject.password,
		);

		if (!isPasswordValid) {
			setResponseStatus(event, 401, 'Invalid credentials');
			return { error: 'Invalid credentials' };
		}

		return {
			name: userObject.name,
			username: userObject.username,
			token: await useGenerateJwt(userObject),
		};
	} catch (e) {
		console.error(e); // Ajoutez cette ligne pour loguer l'erreur
		setResponseStatus(event, 500, 'Internal server error');
		return { error: (e as Error).message };
	}
});
