export default defineEventHandler(async (event) => {
	const userId = event.context.auth;
	if (!userId) {
		setResponseStatus(event, 401, 'Utilisateur non authentifié');
		return 'Utilisateur non authentifié';
	}

	const body = await readBody(event);
	const rawFile: RawFileDatas[] = Array.isArray(body.files)
		? body.files
		: body;
	const file: FileDatas[] = rawFile.map(transformRawDataToFileData);

	// Réponse immédiate
	setResponseStatus(event, 200, 'Fichier téléchargé avec succès !');

	// Traitement asynchrone en arrière-plan
	(async () => {
		try {
			await updateUploadFileInformations(file, userId, event);

			const separators = [',', 'featuring', 'feat.', 'feat'];

			const artistsNames = extractArtistsNames(file, separators);
			const artistsMap = await batchInsertArtists(
				artistsNames,
				500,
				event,
			);

			const albumsTitlesAndArtistIds = extractAlbumsTitlesAndArtistIds(
				file,
				artistsMap,
				separators,
			);
			const albumsAndArtistsId = await batchInsertAlbums(
				albumsTitlesAndArtistIds,
				300,
				event,
			);

			const songs = extractSongsAssociatedWithAlbumsAndArtists(
				file,
				artistsMap,
				albumsAndArtistsId,
				separators,
			);
			const songsMap = await batchInsertSongs(songs, 400, event);

			await batchInsertPlays(
				file,
				songsMap,
				artistsMap,
				albumsAndArtistsId,
				500,
				separators,
				event,
			);

			console.log('Traitement des données terminé avec succès');
		} catch (err) {
			console.error('Erreur lors du traitement des données :', err);
		}
	})();

	// On retourne immédiatement la réponse
	return 'Fichier téléchargé avec succès !';
});
