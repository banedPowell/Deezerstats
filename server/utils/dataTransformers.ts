import type { RawFileDatas, FileDatas } from '~/types';

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

export function splitAndNormalizeArtistNames(
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
