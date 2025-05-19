import { serverSupabaseServiceRole } from '#supabase/server';
import { H3Event } from 'h3';
import type { Database } from '~/types/supabase';
import crypto from 'crypto';

export interface RawFileDatas {
	'Song Title': string;
	Artist: string;
	ISRC: string;
	'Album Title': string;
	'IP Address': string;
	'Listening Time': string;
	'Platform Name': string;
	'Platform Model': string;
	Date: string;
}

export interface FileDatas {
	songTitle: string;
	artist: string;
	isrc: string;
	albumTitle: string;
	ipAddress: string;
	listeningTime: number;
	platformName: string;
	platformModel: string;
	date: Date;
}

interface Album {
	id: number;
	title: string;
	artist_id: number;
}

export function transformRawDataToFileData(rawData: RawFileDatas): FileDatas {
	return {
		songTitle: rawData['Song Title'],
		artist: rawData.Artist,
		isrc: rawData.ISRC,
		albumTitle: rawData['Album Title'],
		ipAddress: rawData['IP Address'],
		listeningTime: parseInt(rawData['Listening Time'], 10),
		platformName: rawData['Platform Name'],
		platformModel: rawData['Platform Model'],
		date: new Date(rawData.Date),
	};
}

function splitAndNormalizeArtistNames(
	rawName: string,
	separators: string[],
): string[] {
	let names = [rawName];
	for (const separator of separators) {
		names = names.flatMap((name) =>
			name.toLowerCase().includes(separator.toLowerCase())
				? name.split(new RegExp(separator, 'i'))
				: [name],
		);
	}
	return names.map((name) => name.trim()).filter((name) => name);
}

export function extractArtistsNames(
	file: FileDatas[],
	featSeparators: string[],
) {
	const artistNamesSet = new Set<string>();
	for (const record of file) {
		const names = splitAndNormalizeArtistNames(
			record.artist,
			featSeparators,
		);

		for (const name of names) {
			const trimmedName = name.trim();
			if (trimmedName) artistNamesSet.add(trimmedName);
		}
	}

	return Array.from(artistNamesSet);
}

export function extractAlbumsTitlesAndArtistIds(
	file: FileDatas[],
	artistsMap: Map<number, string>,
	separators: string[],
) {
	const artistNameToId = new Map(
		[...artistsMap.entries()].map(([id, name]) => [name.toLowerCase(), id]),
	);

	const albumsMap = new Map<
		string,
		{ albumTitle: string; artistId: number }
	>();

	for (const record of file) {
		const possibleArtists = splitAndNormalizeArtistNames(
			record.artist,
			separators,
		);
		const artistId = possibleArtists
			.map((name) => artistNameToId.get(name.toLowerCase()))
			.find((id) => id !== undefined);

		if (artistId !== undefined) {
			const uniqueKey = `${record.albumTitle}-${artistId}`;
			albumsMap.set(uniqueKey, {
				albumTitle: record.albumTitle,
				artistId,
			});
		}
	}

	return Array.from(albumsMap.values());
}

export function extractSongsAssociatedWithAlbumsAndArtists(
	file: FileDatas[],
	artistsMap: Map<number, string>,
	albumsMap: Map<string, Album>,
	separators: string[],
) {
	const artistNameToId = new Map(
		[...artistsMap.entries()].map(([id, name]) => [name.toLowerCase(), id]),
	);

	const songsMap = new Map<
		string,
		{ title: string; albumId: number; isrc: string; artistIds: number[] }
	>();

	for (const record of file) {
		const possibleArtists = splitAndNormalizeArtistNames(
			record.artist,
			separators,
		);

		// Find all artist IDs instead of just the first one
		const artistIds = possibleArtists
			.map((name) => artistNameToId.get(name.toLowerCase()))
			.filter((id): id is number => id !== undefined);

		if (artistIds.length === 0) {
			console.warn(`No artists found for: ${record.artist}`);
			continue;
		}

		// For album, we'll still use the first artist ID for now
		const primaryArtistId = artistIds[0];
		const albumKey = `${record.albumTitle}-${primaryArtistId}`;
		const album = albumsMap.get(albumKey);
		if (!album) {
			console.warn(
				`Album not found: ${record.albumTitle} (Artist ID: ${primaryArtistId})`,
			);
			continue;
		}

		const songKey = record.isrc;
		if (!songsMap.has(songKey)) {
			songsMap.set(songKey, {
				title: record.songTitle,
				albumId: album.id,
				isrc: record.isrc,
				artistIds: artistIds,
			});
		} else {
			// If the song already exists, add any new artist IDs
			const existingSong = songsMap.get(songKey)!;
			const existingArtistIdsSet = new Set(existingSong.artistIds);

			// Add any new artist IDs
			for (const id of artistIds) {
				existingArtistIdsSet.add(id);
			}

			existingSong.artistIds = Array.from(existingArtistIdsSet);
		}
	}

	return Array.from(songsMap.values());
}

export async function batchInsertArtists(
	names: string[],
	chunkSize: number,
	event: H3Event,
) {
	const userId = event.context.auth;
	if (!userId) {
		console.error(401, 'Utilisateur non authentifié', event);
	}

	const supabaseClient = serverSupabaseServiceRole<Database>(event);
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
}

export async function batchInsertAlbums(
	albumsArray: Array<{ albumTitle: string; artistId: number }>,
	chunkSize: number,
	event: H3Event,
) {
	const userId = event.context.auth;
	if (!userId) {
		console.error(401, 'Utilisateur non authentifié', event);
	}

	const supabaseClient = serverSupabaseServiceRole<Database>(event);
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
}

export interface Song {
	id: number;
	title: string;
	album_id: number;
	isrc: string;
}

export async function batchInsertSongs(
	songs: Array<{
		title: string;
		albumId: number;
		isrc: string;
		artistIds: number[];
	}>,
	chunkSize: number,
	event: H3Event,
) {
	const userId = event.context.auth;
	if (!userId) {
		console.error(401, 'Utilisateur non authentifié', event);
	}

	const supabaseClient = serverSupabaseServiceRole<Database>(event);
	const songsReturned: Map<string, Song> = new Map();

	// Découpage en chunks
	const chunks = songs.reduce<(typeof songs)[]>((acc, song, index) => {
		const chunkIndex = Math.floor(index / chunkSize);
		if (!acc[chunkIndex]) acc[chunkIndex] = [];
		acc[chunkIndex].push(song);
		return acc;
	}, []);

	for (const chunk of chunks) {
		// Récupérer tous les isrc par chunk
		const isrcs = Array.from(new Set(chunk.map((s) => s.isrc)));

		const { data: existingSongs, error: selectError } = await supabaseClient
			.from('songs')
			.select('id, title, album_id, isrc')
			.in('isrc', isrcs);

		const existingISRCs = new Set(existingSongs?.map((s) => s.isrc) ?? []);

		if (selectError) {
			console.warn(
				'Erreur lors de la récupération des chansons:',
				selectError,
			);
			continue;
		}

		// Marquer les chansons déjà présentes
		for (const existing of existingSongs || []) {
			songsReturned.set(existing.isrc, existing);
		}

		// Filtrer uniquement les morceaux qui n'existent pas encore
		const newSongs = chunk.filter((song) => !existingISRCs.has(song.isrc));

		if (newSongs.length === 0) continue;

		// Insérer les nouveaux morceaux (sans artist_id)
		const { data: insertedSongs, error: insertError } = await supabaseClient
			.from('songs')
			.insert(
				newSongs.map((song) => ({
					title: song.title,
					album_id: song.albumId,
					isrc: song.isrc,
				})),
			)
			.select('id, title, album_id, isrc');

		if (insertError) {
			console.error(
				"Erreur lors de l'insertion des morceaux:",
				insertError,
			);
			continue;
		}

		// Ajouter les chansons insérées à notre map de retour
		for (const song of insertedSongs || []) {
			songsReturned.set(song.isrc, song);
		}

		// Maintenant, créons les relations artiste-chanson pour les nouveaux morceaux
		for (const song of insertedSongs || []) {
			// Trouver les artistIds correspondants dans notre input
			const originalSong = newSongs.find((s) => s.isrc === song.isrc);
			if (!originalSong) continue;

			// Préparer l'insertion des relations
			const songArtistRelations = originalSong.artistIds.map(
				(artistId) => ({
					song_id: song.id,
					artist_id: artistId,
				}),
			);

			// Insérer les relations
			if (songArtistRelations.length > 0) {
				const { error: relationsError } = await supabaseClient
					.from('song_artists')
					.insert(songArtistRelations);

				if (relationsError) {
					console.error(
						"Erreur lors de l'insertion des relations artiste-chanson:",
						relationsError,
					);
				}
			}
		}
	}

	return songsReturned;
}

function computePlayHash(
	userId: string,
	songId: number,
	listeningTime: number,
	listeningDate: string,
	lineIndex: number,
): string {
	const raw = `${userId}-${songId}-${listeningTime}-${listeningDate}-${lineIndex}`;
	return crypto.createHash('sha256').update(raw).digest('hex');
}

export async function batchInsertPlays(
	file: FileDatas[],
	songsMap: Map<string, Song>,
	artistsMap: Map<number, string>,
	albumsMap: Map<string, Album>,
	chunkSize: number,
	separators: string[],
	event: H3Event,
) {
	const userId = event.context.auth;
	if (!userId) {
		console.error(401, 'Utilisateur non authentifié', event);
		return;
	}

	const supabaseClient = serverSupabaseServiceRole<Database>(event);
	const artistNameToId = new Map(
		[...artistsMap.entries()].map(([id, name]) => [name.toLowerCase(), id]),
	);

	const playsToInsert: {
		user_id: string;
		song_id: number;
		listening_time: number;
		listening_date: string;
		hash: string;
	}[] = [];

	for (const [index, record] of file.entries()) {
		// Trouver l’artistId
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
		const song = songsMap.get(record.isrc);

		if (!song) {
			console.warn(
				`Chanson introuvable : "${record.songTitle}" (isrc: ${record.isrc})`,
			);
			continue;
		}

		// Préparer l’entrée play
		const hash = computePlayHash(
			userId,
			song.id,
			record.listeningTime,
			record.date.toISOString(),
			index,
		);

		playsToInsert.push({
			user_id: userId,
			song_id: song.id,
			listening_time: record.listeningTime,
			listening_date: record.date.toISOString(),
			hash,
		});
	}

	// Insertion en batch
	const chunks = playsToInsert.reduce<(typeof playsToInsert)[]>(
		(acc, play, index) => {
			const chunkIndex = Math.floor(index / chunkSize);
			if (!acc[chunkIndex]) acc[chunkIndex] = [];
			acc[chunkIndex].push(play);
			return acc;
		},
		[],
	);

	for (const chunk of chunks) {
		const { error } = await supabaseClient
			.from('plays')
			.upsert(chunk, { onConflict: 'hash' });

		if (error) {
			console.error("Erreur lors de l'insertion des lectures:", error);
		}
	}

	return { inserted: playsToInsert.length };
}

export function extractSortedYearsAvailable(file: FileDatas[]) {
	return Array.from(
		new Set(file.map((play) => play.date.getFullYear())),
	).sort((a, b) => b - a);
}

export async function updateUploadFileInformations(
	file: FileDatas[],
	userId: string,
	event: H3Event,
) {
	const supabaseClient = serverSupabaseServiceRole<Database>(event);

	const { data: updateData, error: updateError } = await supabaseClient
		.from('listening_history_file_infos')
		.update({
			has_uploaded_history_file: true,
			years_available: extractSortedYearsAvailable(file),
			upload_date: new Date(),
		})
		.eq('user_id', userId);

	if (updateError) {
		console.error(
			'Erreur lors de la mise à jour des informations:',
			updateError,
		);
	}

	return { updateData };
}
