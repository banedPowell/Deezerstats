import { ref } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/types';

export const useAlbumsStats = async (
	userId: string | undefined,
	orderBy: 'listening_time' | 'streams' = 'listening_time',
	order: 'DESC' | 'ASC' = 'DESC',
	limit: 1 | 10 | 30 = 10,
	page: number = 1,
) => {
	const supabase = useSupabaseClient<Database>();

	const albumsStats = ref<any[]>([]);
	const error = ref<string | null>(null);

	if (!userId) {
		error.value = "L'utilisateur n'est pas connecté";
		return { albumsStats, error };
	}

	useAsyncData(
		'albumsStats',
		async () => {
			const { data, error: supabaseError } = await supabase.rpc(
				'get_top_albums_by_user',
				{
					p_user_id: userId,
					p_order_by: orderBy,
					p_order: order,
					p_limit: limit,
					p_page: page,
				},
			);
			if (supabaseError) {
				error.value = 'Erreur lors de la récupération des données';
				return [];
			}
			return data ?? [];
		},
		{
			lazy: true,
			default: () => null,
			transform: (data) => {
				albumsStats.value = data;
				return data;
			},
		},
	);

	return { albumsStats, error };
};
