export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	const albumTitle = query.title as string;
	const artistName = query.artist as string;

	if (!albumTitle || !artistName) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Title and artist parameters are required',
		});
	}

	try {
		const albumId = await getAlbumDeezerId(albumTitle, artistName);
		if (!albumId) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Album not found',
			});
		}
		const albumDatas = await getFullAlbumDeezerDatas(albumId);
		return albumDatas;
	} catch (error) {
		console.error('Deezer API error:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch data from Deezer API',
		});
	}
});
