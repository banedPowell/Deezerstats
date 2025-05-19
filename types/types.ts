// Interfaces pour les données brutes et transformées

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

export interface Album {
	id: number;
	title: string;
	artist_id: number;
}

export interface Song {
	id: number;
	title: string;
	album_id: number;
	isrc: string;
}
