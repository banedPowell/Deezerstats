export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			artists: {
				Row: {
					id: number;
					name: string;
					created_at: string;
				};
				Insert: {
					id?: number;
					name: string;
					created_at?: string;
				};
				Update: {
					id?: number;
					name?: string;
					created_at?: string;
				};
			};
			albums: {
				Row: {
					id: number;
					artist_id: number;
					title: string;
					created_at: string;
					release_date: string | null;
				};
				Insert: {
					id?: number;
					artist_id: number;
					title: string;
					created_at?: string;
					release_date?: string | null;
				};
				Update: {
					id?: number;
					artist_id?: number;
					title?: string;
					created_at?: string;
					release_date?: string | null;
				};
			};
			songs: {
				Row: {
					id: number;
					artist_id: number;
					album_id: number;
					title: string;
					isrc: string;
					created_at: string;
					release_date: string | null;
				};
				Insert: {
					id?: number;
					artist_id: number;
					album_id: number;
					title: string;
					isrc: string;
					created_at?: string;
					release_date?: string | null;
				};
				Update: {
					id?: number;
					artist_id?: number;
					album_id?: number;
					title?: string;
					isrc?: string;
					created_at?: string;
					release_date?: string | null;
				};
			};
		};
	};
}
