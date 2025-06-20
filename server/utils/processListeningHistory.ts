import { RawFileDatas, FileDatas } from '~/types';

export const processListeningHistoryDatas = async (
	rawFile: RawFileDatas[],
	userId: string,
) => {
	const file: FileDatas[] = rawFile.map((rawData) =>
		transformRawDataToFileData(rawData),
	);

	try {
		await updateUploadFileInformations(file, userId);
		await updateProcessingStatus({
			userId,
			status: 'pending',
			currentStep: {
				title: 'Pending',
				description: 'Traitement des données envoyées',
			},
		});

		const separators = [',', 'featuring', 'feat.', 'feat'];

		await updateProcessingStatus({
			userId,
			status: 'processing',
			currentStep: {
				title: 'Artistes',
				description: 'Ajout des artistes à la base de données',
			},
		});

		const artistsNames = extractArtistsNames(file, separators);

		const artistsMap = await batchInsertArtists(userId, artistsNames, 500);

		await updateProcessingStatus({
			userId,
			status: 'processing',
			currentStep: {
				title: 'Albums',
				description: 'Ajout des albums à la base de données',
			},
		});

		const albumsTitlesAndArtistIds = extractAlbumsTitlesAndArtistIds(
			file,
			artistsMap,
			separators,
		);

		const albumsAndArtistsId = await batchInsertAlbums(
			userId,
			albumsTitlesAndArtistIds,
			300,
		);

		await updateProcessingStatus({
			userId,
			status: 'processing',
			currentStep: {
				title: 'Morceaux',
				description: 'Ajout des morceaux à la base de données',
			},
		});

		const tracks = extractTracksAssociatedWithAlbumsAndArtists(
			file,
			artistsMap,
			albumsAndArtistsId,
			separators,
		);

		const tracksMap = await batchInsertTracks(userId, tracks, 400);

		await updateProcessingStatus({
			userId,
			status: 'processing',
			currentStep: {
				title: 'Historique',
				description:
					"Ajout de l'historique de lectures à la base de données",
			},
		});

		await batchInsertStreams(
			userId,
			file,
			tracksMap,
			artistsMap,
			albumsAndArtistsId,
			500,
			separators,
		);

		await updateProcessingStatus({
			userId,
			status: 'done',
			currentStep: {
				title: 'Fin',
				description: 'Traitement des données terminé',
			},
		});
	} catch (err) {
		console.log('Erreur lors du traitement des données :', err);
		await updateProcessingStatus({
			userId,
			status: 'error',
			currentStep: {
				title: 'Erreur',
				description: `Erreur lors du traitement des données : ${err}`,
			},
		});
	}
};
