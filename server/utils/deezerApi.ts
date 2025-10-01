type ShortTrack = {
	id: number;
	readable: true;
	title: string;
	title_short: string;
	title_version: string;
	link: string;
	duration: number;
	rank: number;
	explicit_lyrics: true;
	explicit_content_lyrics: number;
	explicit_content_cover: number;
	preview: string;
	md5_image: string;
	type: 'track';
};

type TrackFromFullAlbum = ShortTrack & {
	artist: ShortArtist;
	album: ShortAlbum;
};

type SearchTrack = ShortTrack & {
	artist: MediumArtist;
	album: ShortAlbum;
};

export type FullTrack = SearchTrack & {
	isrc: string;
	share: string;
	duration: number;
	track_position: number;
	disk_number: number;
	release_date: string;
	bpm: number;
	gain: number;
	available_countries: string[];
	track_token: string;
	contributors: Contributor[];
	artist: ArtistFromFullTrack;
	album: AlbumFromFullTrack;
};

type ShortAlbum = {
	id: number;
	title: string;
	cover: string;
	cover_small: string;
	cover_medium: string;
	cover_big: string;
	cover_xl: string;
	md5_image: string;
	tracklist: string;
	type: 'album';
};

export type SearchAlbum = ShortAlbum & {
	link: string;
	genre_id: number;
	nb_tracks: number;
	record_type: string;
	explicit_lyrics: boolean;
	artist: MediumArtist;
};

type AlbumFromFullTrack = ShortAlbum & {
	link: string;
	release_date: string;
};

export type FullAlbum = SearchAlbum & {
	fans: number;
	release_date: string;
	available: boolean;
	explicit_content_lyrics: number;
	explicit_content_cover: number;
	duration: number;
	label: string;
	share: string;
	upc: string;
	contributors: Contributor[];
	artist: MediumArtist;
	tracks: {
		data: TrackFromFullAlbum[];
	};
	genres: {
		data: Genre[];
	};
};

export type Genre = {
	id: number;
	name: string;
	picture: string;
	type: 'genre';
};

type ShortArtist = {
	id: number;
	name: string;
	tracklist: string;
	type: 'artist';
};

type MediumArtist = ShortArtist & {
	picture: string;
	picture_small: string;
	picture_medium: string;
	picture_big: string;
	picture_xl: string;
};

type ArtistFromFullTrack = MediumArtist & {
	link: string;
	radio: boolean;
};

export type SearchArtist = MediumArtist & {
	link: string;
	nb_album: number;
	nb_fan: number;
	radio: boolean;
};

export type FullArtist = SearchArtist & {
	share: string;
};

type Contributor = MediumArtist & {
	link: string;
	share: string;
	radio: boolean;
	role: string;
};

export const getArtistDeezerDatas = async (artistName: string) => {
	const datas = await $fetch<{ data: SearchArtist[] }>(
		`https://api.deezer.com/search/artist?q=${artistName}`,
	);

	let artistDatas = null;

	for (const artist of datas.data) {
		if (artist.name.toLowerCase() === artistName.replace(/-/g, ' ')) {
			artistDatas = artist;
			break;
		} else {
			console.log(
				`artistName not found : ${artistName} != ${artist.name}`,
			);
		}
	}

	return artistDatas;
};

export const getAlbumDeezerId = async (
	albumTitle: string,
	artistName: string,
) => {
	const datas = await $fetch<{ data: SearchAlbum[] }>(
		`https://api.deezer.com/search/album?q=${albumTitle}-${artistName}`,
	);

	let albumId = null;

	for (const album of datas.data) {
		if (
			album.title.toLowerCase() === albumTitle.replace(/-/g, ' ') &&
			album.artist.name.toLowerCase() === artistName.replace(/-/g, ' ')
		) {
			albumId = album.id;
			break;
		} else {
			console.log(
				`albumId not found for : ${albumTitle} != ${album.title} or artistName not found : ${artistName} != ${album.artist.name}`,
			);
		}
	}

	return albumId;
};

export const getFullAlbumDeezerDatas = async (albumId: number) => {
	const datas = await $fetch<FullAlbum>(
		`https://api.deezer.com/album/${albumId}`,
	);

	return datas;
};

export const getTrackDeezerId = async (
	trackTitle: string,
	artistName: string,
) => {
	let trackId = null;

	try {
		const datas = await $fetch<{ data: SearchTrack[] }>(
			`https://api.deezer.com/search/track?q=${trackTitle}-${artistName}`,
		);

		for (const track of datas.data) {
			if (
				track.title.toLowerCase() === trackTitle.replace(/-/g, ' ') &&
				track.artist.name.toLowerCase() ===
					artistName.replace(/-/g, ' ')
			) {
				trackId = track.id;
				break;
			}
		}
	} catch (error) {
		console.error('Deezer API error:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch data from Deezer API',
		});
	}

	return trackId;
};

export const getFullTrackDeezerDatas = async (trackId: number) => {
	console.log('id : ', trackId);
	const datas = await $fetch<FullTrack>(
		`https://api.deezer.com/track/${trackId}`,
	);

	return datas;
};
