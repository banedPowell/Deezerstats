import { serverSupabaseServiceRole } from '#supabase/server';
import { H3Event } from 'h3';
import type { Database, Album, Track, FileDatas } from '~/types';

export const updateProcessingStatus = async ({
	userId,
	status,
	currentStep,
}: {
	userId: string;
	status: 'waiting' | 'pending' | 'processing' | 'done' | 'error';
	currentStep: { title: string; description: string };
}) => {
	if (!userId) {
		console.error(401, 'Utilisateur non authentifié');
	}

	const supabaseClient = supabaseAdmin();

	await supabaseClient.from('history_processing_status').upsert(
		{
			user_id: userId,
			status,
			current_step: JSON.stringify(currentStep),
			updated_at: new Date().toISOString(),
		},
		{ onConflict: 'user_id' },
	);
};

export const batchInsertArtists = async (
	userId: string,
	names: string[],
	chunkSize: number,
) => {
	if (!userId) {
		console.error(401, 'Utilisateur non authentifié');
	}

	const supabaseClient = supabaseAdmin();

	const artistMap = new Map<number, string>();

	// Diviser les noms en chunks de manière fonctionnelle
	const chunks = names.reduce<string[][]>((acc, name, index) => {
		const chunkIndex = Math.floor(index / chunkSize);
		if (!acc[chunkIndex]) {
			acc[chunkIndex] = [];
		}
		acc[chunkIndex].push(name);
		return acc;
	}, []);

	// Traiter chaque chunk
	for (const chunk of chunks) {
		// Récupérer les artistes existants pour ce chunk
		const { data: existingArtists, error: selectError } =
			await supabaseClient
				.from('artists')
				.select('id, name')
				.in('name', chunk);

		if (selectError) {
			console.warn(
				'Erreur lors de la récupération des artistes:',
				selectError,
			);
		}

		// Créer un map des artistes existants pour ce chunk
		const existingArtistMap = new Map(
			existingArtists?.map((artist) => [artist.name, artist.id]) || [],
		);

		// Filtrer les noms qui n'existent pas encore
		const newNames = chunk.filter((name) => !existingArtistMap.has(name));

		// Ajouter les artistes existants au map de résultat
		existingArtistMap.forEach((id, name) => artistMap.set(id, name));

		// Si aucun nouvel artiste à créer, passer au chunk suivant
		if (newNames.length === 0) {
			continue;
		}

		// Insérer les nouveaux artistes
		const { data: newArtists, error: insertError } = await supabaseClient
			.from('artists')
			.insert(newNames.map((name) => ({ name })))
			.select('id, name');

		if (insertError) {
			console.error(
				"Erreur lors de l'insertion des artistes:",
				insertError,
			);
			continue;
		}

		// Ajouter les nouveaux artistes au map de résultat
		newArtists?.forEach((artist) => artistMap.set(artist.id, artist.name));
	}

	return artistMap;
};

export const batchInsertAlbums = async (
	userId: string,
	albumsArray: Array<{ albumTitle: string; artistId: number }>,
	chunkSize: number,
) => {
	if (!userId) {
		console.error(401, 'Utilisateur non authentifié');
	}

	const supabaseClient = supabaseAdmin();
	const albumsReturned: Map<string, Album> = new Map();

	// Diviser les albums en chunks
	const chunks = albumsArray.reduce<
		Array<{ albumTitle: string; artistId: number }>[]
	>((acc, album, index) => {
		const chunkIndex = Math.floor(index / chunkSize);
		if (!acc[chunkIndex]) {
			acc[chunkIndex] = [];
		}
		acc[chunkIndex].push(album);
		return acc;
	}, []);

	// Traiter chaque chunk
	for (const chunk of chunks) {
		// Récupérer les albums existants pour ce chunk

		const { data: existingAlbums, error: selectError } =
			await supabaseClient
				.from('albums')
				.select('id, title, artist_id')
				.in(
					'title',
					chunk.map((album) => album.albumTitle),
				);

		if (selectError) {
			console.warn(
				'Erreur lors de la récupération des albums:',
				selectError,
			);
			continue;
		}

		// Créer un map des artistes existants pour ce chunk
		const existingAlbumsMap = new Map(
			existingAlbums?.map((album) => [
				`${album.title}-${album.artist_id}`,
				album,
			]) || [],
		);

		// Filtrer les noms qui n'existent pas encore
		const newAlbums = chunk.filter(
			(album) =>
				!existingAlbumsMap.has(`${album.albumTitle}-${album.artistId}`),
		);

		// Ajouter les albums existants au map de résultat
		for (const album of existingAlbums) {
			albumsReturned.set(`${album.title}-${album.artist_id}`, {
				id: album.id,
				title: album.title,
				artist_id: album.artist_id,
			});
		}

		// Si aucun nouvel album à créer, passer au chunk suivant
		if (newAlbums.length === 0) {
			continue;
		}

		// Insérer les nouveaux albums
		const { data: insertedAlbums, error: insertError } =
			await supabaseClient
				.from('albums')
				.insert(
					newAlbums.map((album) => ({
						title: album.albumTitle,
						artist_id: album.artistId,
					})),
				)
				.select('id, title, artist_id');

		if (insertError) {
			console.error(
				"Erreur lors de l'insertion des albums:",
				insertError,
			);
			continue;
		}

		// Ajouter les nouveaux albums au map de résultat
		insertedAlbums?.forEach((album) => {
			albumsReturned.set(`${album.title}-${album.artist_id}`, {
				id: album.id,
				title: album.title,
				artist_id: album.artist_id,
			});
		});
	}

	return albumsReturned;
};

export const batchInsertTracks = async (
	userId: string,
	tracks: Array<{
		title: string;
		albumId: number;
		isrc: string;
		artistIds: number[];
	}>,
	chunkSize: number,
) => {
	if (!userId) {
		console.error(401, 'Utilisateur non authentifié');
	}

	const supabaseClient = supabaseAdmin();

	// on va découper notre traitement en chunks/batchs
	const chunks = tracks.reduce<(typeof tracks)[]>((acc, track, index) => {
		const chunkIndex = Math.floor(index / chunkSize);
		if (!acc[chunkIndex]) acc[chunkIndex] = [];
		acc[chunkIndex].push(track);
		return acc;
	}, []);

	// Retourner une map ISRC => chanson
	const tracksReturned = new Map<
		string,
		{ id: number; title: string; album_id: number; isrc: string }
	>();

	// Pour chaque chunk
	for (const chunk of chunks) {
		// Filtrer les chansons déjà existantes par ISRC
		const isrcs = chunk.map((track) => track.isrc);
		const { data: existingTracks, error: existingError } =
			await supabaseClient
				.from('tracks')
				.select('id, title, album_id, isrc')
				.in('isrc', isrcs);

		if (existingError) {
			console.error(
				'Erreur lors de la récupération des chansons existantes:',
				existingError,
			);
			continue;
		}

		// Ajouter les chansons existantes à notre map
		for (const track of existingTracks || []) {
			tracksReturned.set(track.isrc, track);
		}

		// Identifier les nouvelles chansons à insérer
		const existingIsrcs = new Set(
			(existingTracks || []).map((track) => track.isrc),
		);
		const newTracks = chunk.filter(
			(track) => !existingIsrcs.has(track.isrc),
		);

		// S'il n'y a pas de nouvelles chansons, passer au chunk suivant
		if (newTracks.length === 0) continue;

		// Créer une map pour un accès rapide aux originalTracks par ISRC
		const tracksMap = new Map(
			newTracks.map((track) => [track.isrc, track]),
		);

		// Insérer les nouvelles chansons
		const { data: insertedTracks, error: insertError } =
			await supabaseClient
				.from('tracks')
				.insert(
					newTracks.map((track) => ({
						title: track.title,
						album_id: track.albumId,
						isrc: track.isrc,
					})),
				)
				.select('id, title, album_id, isrc');

		if (insertError) {
			console.error(
				"Erreur lors de l'insertion des chansons:",
				insertError,
			);
			continue;
		}

		// Ajouter les chansons insérées à notre map de retour
		for (const track of insertedTracks || []) {
			tracksReturned.set(track.isrc, track);
		}

		// Préparer toutes les relations artiste-chanson en une seule fois
		const allTrackArtistRelations: {
			track_id: number;
			artist_id: number;
		}[] = [];

		// Maintenant, créons les relations artiste-chanson pour les nouveaux morceaux
		for (const track of insertedTracks || []) {
			// Trouver les artistIds correspondants dans notre map par ISRC (O(1) au lieu de O(n))
			const originalTrack = tracksMap.get(track.isrc);
			if (!originalTrack) continue;

			// Ajouter les relations à notre collection
			originalTrack.artistIds.forEach((artistId) => {
				allTrackArtistRelations.push({
					track_id: track.id,
					artist_id: artistId,
				});
			});
		}

		// Insérer toutes les relations en une seule requête
		if (allTrackArtistRelations.length > 0) {
			const { error: relationsError } = await supabaseClient
				.from('track_artists')
				.insert(allTrackArtistRelations);

			if (relationsError) {
				console.error(
					"Erreur lors de l'insertion des relations artiste-chanson:",
					relationsError,
				);
			}
		}
	}

	return tracksReturned;
};

const computeStreamHash = (
	userId: string,
	trackId: number,
	listeningTime: number,
	listeningDate: string,
	lineIndex: number,
): string => {
	const raw = `${userId}-${trackId}-${listeningTime}-${listeningDate}-${lineIndex}`;

	return raw;
};

export const batchInsertStreams = async (
	userId: string,
	file: FileDatas[],
	tracksMap: Map<string, Track>,
	artistsMap: Map<number, string>,
	albumsMap: Map<string, Album>,
	chunkSize: number,
	separators: string[],
) => {
	if (!userId) {
		console.error(401, 'Utilisateur non authentifié');
		return;
	}

	const supabaseClient = supabaseAdmin();
	const artistNameToId = new Map(
		[...artistsMap.entries()].map(([id, name]) => [name.toLowerCase(), id]),
	);

	const streamsToInsert: {
		user_id: string;
		track_id: number;
		listening_time: number;
		listening_date: string;
		hash: string;
	}[] = [];

	for (const [index, record] of file.entries()) {
		// Trouver l'artistId
		const possibleArtists = splitAndNormalizeArtistNames(
			record.artist,
			separators,
		);
		const artistIds = possibleArtists
			.map((name) => artistNameToId.get(name.toLowerCase()))
			.filter((id): id is number => id !== undefined);

		if (artistIds.length === 0) {
			console.warn(`Aucun artiste trouvé pour "${record.artist}"`);
			continue;
		}

		// Pour trouver l'album, utiliser le premier artiste (principal)
		const primaryArtistId = artistIds[0];
		const albumKey = `${record.albumTitle}-${primaryArtistId}`;
		const album = albumsMap.get(albumKey);
		if (!album) {
			console.warn(
				`Album introuvable : "${record.albumTitle}" (artistId: ${primaryArtistId})`,
			);
			continue;
		}

		// Clé pour la chanson
		const track = tracksMap.get(record.isrc);

		if (!track) {
			console.warn(
				`Chanson introuvable : "${record.trackTitle}" (isrc: ${record.isrc})`,
			);
			continue;
		}

		// Préparer l'entrée stream
		const hash = computeStreamHash(
			userId,
			track.id,
			record.listeningTime,
			record.date.toISOString(),
			index,
		);

		streamsToInsert.push({
			user_id: userId,
			track_id: track.id,
			listening_time: record.listeningTime,
			listening_date: record.date.toISOString(),
			hash,
		});
	}

	// Insertion en batch
	const chunks = streamsToInsert.reduce<(typeof streamsToInsert)[]>(
		(acc, stream, index) => {
			const chunkIndex = Math.floor(index / chunkSize);
			if (!acc[chunkIndex]) acc[chunkIndex] = [];
			acc[chunkIndex].push(stream);
			return acc;
		},
		[],
	);

	for (const chunk of chunks) {
		const { error } = await supabaseClient
			.from('streams')
			.upsert(chunk, { onConflict: 'hash' });

		if (error) {
			console.error("Erreur lors de l'insertion des lectures:", error);
		}
	}

	return { inserted: streamsToInsert.length };
};

export const updateUploadFileInformations = async (
	file: FileDatas[],
	userId: string,
) => {
	const supabaseClient = supabaseAdmin();

	const { data: updateData, error: updateError } = await supabaseClient
		.from('listening_history_file_infos')
		.update({
			has_uploaded_history_file: true,
			years_available: extractSortedYearsAvailable(file),
			upload_date: new Date().toISOString(),
		})
		.eq('user_id', userId);

	if (updateError) {
		console.error(
			'Erreur lors de la mise à jour des informations:',
			updateError,
		);
	}

	return { updateData };
};
