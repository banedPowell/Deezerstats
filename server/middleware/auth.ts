import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
	const url = getRequestURL(event);

	if (
		!url.pathname.startsWith('/api') ||
		url.pathname.startsWith('/api/deezer/')
	) {
		return;
	}

	const config = useRuntimeConfig();
	const supabase = createClient(config.supabaseUrl, config.supabaseKey);

	const authHeader = getHeader(event, 'Authorization');
	if (!authHeader) {
		setResponseStatus(event, 401, 'Unauthorized - Token missing');
		return;
	}

	const token = authHeader.split(' ')[1];

	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (error || !user) {
			setResponseStatus(event, 401, 'Unauthorized - Invalid token');
		} else {
			// Ajouter l'ID de l'utilisateur au contexte de la requête
			event.context.auth = user.id;
		}
	} catch (error) {
		setResponseStatus(event, 401, 'Unauthorized - Error checking token');
	}
});
