export default defineEventHandler((event) => {
	if (!event._path?.startsWith('/api/_hub')) {
		setResponseHeaders(event, {
			'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Headers': '*',
			'Access-Control-Expose-Headers': '*',
		});

		if (event.method === 'OPTIONS') {
			event.node.res.statusCode = 204;
			event.node.res.statusMessage = 'No Content.';
			return 'OK';
		}
	}
});
