import type { Database } from '~/types';

export const useArtistsStats = async (
	userId: string | undefined,
	isLoading: Ref<boolean>,
	orderBy: 'listening_time' | 'streams' = 'listening_time',
	order: 'DESC' | 'ASC' = 'DESC',
	limit: 1 | 10 | 30 = 10,
	page: number = 1,
) => {
	const supabase = useSupabaseClient<Database>();
	const key = `artistsStats:${userId}:${orderBy}:${order}:${limit}:${page}`;

	const { data: artistsStats, error } = await useAsyncData(
		key,
		async () => {
			if (!userId) {
				return [];
			}

			if (isLoading.value) {
				await new Promise((resolve) => {
					const unwatch = watch(
						isLoading,
						(newValue) => {
							if (!newValue) {
								unwatch();
								resolve(undefined);
							}
						},
						{ immediate: true },
					);
				});
			}

			const { data, error: supabaseError } = await supabase.rpc(
				'get_artists_stats_by_user',
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
					'Erreur lors de la récupération des statistiques des artistes.',
				);
			}

			return data ?? [];
		},
		{
			default: () => [],
		},
	);

	return { artistsStats, error };
};
