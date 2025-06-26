import type { Database } from '~/types';

export const useTracksStats = async (
	userId: string | undefined,
	orderBy: 'listening_time' | 'streams' = 'listening_time',
	order: 'DESC' | 'ASC' = 'DESC',
	limit: 1 | 10 | 30 = 10,
	page: number = 1,
) => {
	const supabase = useSupabaseClient<Database>();
	const key = `tracksStats:${userId}:${orderBy}:${order}:${limit}:${page}`;

	const { data: tracksStats, error } = await useAsyncData(
		key,
		async () => {
			if (!userId) {
				return [];
			}

			const { data, error: supabaseError } = await supabase.rpc(
				'get_tracks_stats_by_user',
				{
					p_user_id: userId,
					p_order_by: orderBy,
					p_order: order,
					p_limit: limit,
					p_page: page,
				},
			);

			if (supabaseError) {
				throw new Error(
					'Erreur lors de la récupération des statistiques des tracks.',
				);
			}

			return data ?? [];
		},
		{
			default: () => [],
		},
	);

	return { tracksStats, error };
};
