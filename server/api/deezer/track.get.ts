export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	const trackTitle = query.title as string;
	const artistName = query.artist as string;

	if (!trackTitle || !artistName) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Title and artist parameters are required',
		});
	}

	try {
		const trackId = await getTrackDeezerId(trackTitle, artistName);
		if (!trackId) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Track not found',
			});
		}
		const trackDatas = await getFullTrackDeezerDatas(trackId);
		return trackDatas;
	} catch (error) {
		console.error('Deezer API error:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch data from Deezer API',
		});
	}
});
