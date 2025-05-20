import { RawFileDatas, FileDatas } from '~/types';

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

			console.time("insertion d'artistes");

			await updateProcessingStatus({
				userId,
				status: 'processing',
				currentStep: {
					title: 'Artistes',
					description: 'Ajout des artistes à la base de données',
				},
				event,
			});

			const artistsNames = extractArtistsNames(file, separators);

			const artistsMap = await batchInsertArtists(
				artistsNames,
				500,
				event,
			);

			console.timeLog("insertion d'artistes");

			console.time("insertion d'albums");

			await updateProcessingStatus({
				userId,
				status: 'processing',
				currentStep: {
					title: 'Albums',
					description: 'Ajout des albums à la base de données',
				},
				event,
			});

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
			console.timeLog("insertion d'albums");

			console.time('Insertion des chansons en base de données');
			await updateProcessingStatus({
				userId,
				status: 'processing',
				currentStep: {
					title: 'Morceaux',
					description: 'Ajout des morceaux à la base de données',
				},
				event,
			});

			const songs = extractSongsAssociatedWithAlbumsAndArtists(
				file,
				artistsMap,
				albumsAndArtistsId,
				separators,
			);

			const songsMap = await batchInsertSongs(songs, 400, event);

			console.timeLog('Insertion des chansons en base de données');

			console.time('insertion de lectures');
			await updateProcessingStatus({
				userId,
				status: 'processing',
				currentStep: {
					title: 'Historique',
					description:
						"Ajout de l'historique de lectures à la base de données",
				},
				event,
			});
			await batchInsertPlays(
				file,
				songsMap,
				artistsMap,
				albumsAndArtistsId,
				500,
				separators,
				event,
			);

			console.timeLog('insertion de lectures');

			await updateProcessingStatus({
				userId,
				status: 'done',
				currentStep: {
					title: 'Fin',
					description: 'Traitement des données terminé',
				},
				event,
			});
		} catch (err) {
			console.error('Erreur lors du traitement des données :', err);
			await updateProcessingStatus({
				userId,
				status: 'error',
				currentStep: {
					title: 'Erreur',
					description: 'Erreur lors du traitement des données',
				},
				event,
			});
		}
	})();

	// On retourne immédiatement la réponse
	return 'Fichier téléchargé avec succès !';
});
