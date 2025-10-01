export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	const artistName = query.name as string;

	if (!artistName) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Artist name parameter is required',
		});
	}

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
