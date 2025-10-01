export default defineEventHandler(async (event) => {
	const name = getRouterParam(event, 'name');

	if (!name) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Name parameter is required',
		});
	}

	const artistName = name;

	try {
		const artistDatas = await getArtistDeezerDatas(artistName);
		return artistDatas;
	} catch (error) {
		console.error('Deezer API error:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch data from Deezer API',
		});
	}
});
