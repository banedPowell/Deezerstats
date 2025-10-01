export type DeezerSearchDatas = {
	data: DeezerTrackDatas[];
};

export type DeezerTrackDatas = {
	id: string;
	readable: boolean;
	title: string;
	title_short: string;
	title_version: string;
	link: string;
	duration: string;
	rank: string;
	explicit_lyrics: boolean;
	explicit_content_lyrics: number;
	explicit_content_cover: number;
	preview: string;
	md5_image: string;
	type: 'track';
	artist: DeezerArtistDatas;
	album: DeezerAlbumDatas;
};

export type DeezerAlbumDatas = {
	id: string;
	title: string;
	cover: string;
	cover_small: string;
	cover_medium: string;
	cover_big: string;
	cover_xl: string;
	md5_image: string;
	tracklist: boolean;
	type: 'album';
};

export type DeezerArtistDatas = {
	id: number;
	name: string;
	link: string;
	picture: string;
	picture_small: string;
	picture_medium: string;
	picture_big: string;
	picture_xl: string;
	tracklist: boolean;
	type: 'artist';
};

export const getArtistDeezerDatas = async (artistName: string) => {
	const datas = await $fetch<{ data: DeezerArtistDatas[] }>(
		`https://api.deezer.com/search/artist?q=${artistName}`,
	);

	let artistDatas: DeezerArtistDatas | null = null;

	for (const artist of datas.data) {
		if (artist.name === artistName.replace(/-/g, ' ')) {
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
