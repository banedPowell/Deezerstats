export interface AlbumsStatsDatas {
	album_id: number;
	album_title: string;
	artist_id: number;
	artist_name: string;
	total_listening_time: number;
	total_streams: number;
}

export interface ArtistsStatsDatas {
	artist_id: number;
	artist_name: string;
	total_streams: number;
	total_listening_time: number;
}

export interface TracksStatsDatas {
	track_id: number;
	track_isrc: string;
	track_name: string;
	artist_id: number[];
	artist_names: string[];
	total_streams: number;
	total_listening_time: number;
}
