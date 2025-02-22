import type { UserPayload } from '~/stores/authStore';

export default defineEventHandler(async (event) => {
	try {
		const { username, password }: UserPayload = await readBody(event);

		if (!username || !password) {
			setResponseStatus(event, 400, 'Username and password are required');
			return { error: 'Username and password are required' };
		}

		const id = useRandomId(100);
		const hash = await useHashPassword(password);

		const newUserObject: User = {
			id,
			name: username,
			username,
			password: hash,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await useDrizzle()
			.insert(tables.users)
			.values({
				...newUserObject,
			});

		return {
			userId: newUserObject.id,
			name: newUserObject.name,
			username: newUserObject.username,
			token: await useGenerateJwt(newUserObject),
		};
	} catch (e) {
		console.error(e); // Ajoutez cette ligne pour loguer l'erreur
		setResponseStatus(event, 500, 'Internal server error');
		return { error: (e as Error).message };
	}
});
