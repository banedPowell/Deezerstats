export default defineEventHandler(async (event) => {
	const url = getRequestURL(event);

	if (!url.pathname.startsWith('/api')) {
		return;
	}

	try {
		const token = getHeader(event, 'Authorization')?.split(' ')[1];
		if (!token) {
			return sendError(
				event,
				createError({
					statusCode: 401,
					statusMessage: 'Unauthorized',
				}),
			);
		}

		const decoded = useVerifyJwt(token);
		event.context.auth = decoded.userId;
	} catch (error) {
		console.error('error', error);

		return sendError(
			event,
			createError({
				statusCode: 401,
				statusMessage: 'Unauthorized',
			}),
		);
	}

	return;
});
