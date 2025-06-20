import { FileDatas, Album } from '~/types';

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

export function extractTracksAssociatedWithAlbumsAndArtists(
	file: FileDatas[],
	artistsMap: Map<number, string>,
	albumsMap: Map<string, Album>,
	separators: string[],
) {
	const artistNameToId = new Map(
		[...artistsMap.entries()].map(([id, name]) => [name.toLowerCase(), id]),
	);

	const tracksMap = new Map<
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

		const trackKey = record.isrc;
		if (!tracksMap.has(trackKey)) {
			tracksMap.set(trackKey, {
				title: record.trackTitle,
				albumId: album.id,
				isrc: record.isrc,
				artistIds: artistIds,
			});
		} else {
			// If the track already exists, add any new artist IDs
			const existingTrack = tracksMap.get(trackKey)!;
			const existingArtistIdsSet = new Set(existingTrack.artistIds);

			// Add any new artist IDs
			for (const id of artistIds) {
				existingArtistIdsSet.add(id);
			}

			existingTrack.artistIds = Array.from(existingArtistIdsSet);
		}
	}

	return Array.from(tracksMap.values());
}

export function extractSortedYearsAvailable(file: FileDatas[]) {
	return Array.from(
		new Set(file.map((stream) => stream.date.getFullYear())),
	).sort((a, b) => b - a);
}
