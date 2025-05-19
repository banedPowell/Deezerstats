<script lang="ts" setup>
	import NumberFlow from '@number-flow/vue';

	const user = useSupabaseUser();
	const supabase = useSupabaseClient();

	// Récupérer les informations d'import de l'utilisateur
	const { data: historyData } = useAsyncData(
		'userHistory',
		async () => {
			if (!user.value) return null;

			const { data } = await supabase
				.from('listening_history_file_infos')
				.select('has_uploaded_history_file')
				.eq('user_id', user.value.id)
				.single();

			return data;
		},
		{ default: () => null },
	);

	const userHasUploadedHistoryFile = computed(
		() => historyData.value?.has_uploaded_history_file || false,
	);

	// Compter les écoutes si l'utilisateur a importé son historique
	const { data: playsCount } = useAsyncData(
		'playsCount',
		async () => {
			if (!user.value) return 0;

			const { count } = await supabase
				.from('plays')
				.select('*', { count: 'exact', head: true })
				.eq('user_id', user.value.id);

			return count;
		},
		{
			// Ne pas exécuter la requête si l'utilisateur n'a pas importé d'historique
			watch: [historyData],
			default: () => 0,
		},
	);

	// Calculer le nombre total de secondes écoutes
	const { data: totalSecondsPlayed } = useAsyncData(
		'totalSecondsPlayed',
		async () => {
			if (!user.value) return 0;

			const { data } = await supabase
				.from('plays')
				.select('listening_time')
				.eq('user_id', user.value.id);

			const totalSeconds =
				data?.reduce((total, play) => total + play.listening_time, 0) ||
				0;
			return totalSeconds;
		},
		{
			// Ne pas exécuter la requête si l'utilisateur n'a pas importé d'historique
			watch: [historyData],
			default: () => 0,
		},
	);

	const { data: totalDistinctsArtistsCount } = useAsyncData(
		'totalDistinctsArtistsCount',
		async () => {
			if (!user.value) return 0;

			const { data, error } = await supabase.rpc(
				'count_distinct_artists',
				{ user_id_input: user.value.id },
			);

			if (error) {
				console.error(
					'Erreur lors du comptage des artistes distincts:',
					error,
				);
				return 0;
			}

			return data;
		},
		{
			// Ne pas exécuter la requête si l'utilisateur n'a pas importé d'historique
			watch: [historyData],
			default: () => 0,
		},
	);

	const { data: totalDistinctsAlbumsCount } = useAsyncData(
		'totalDistinctsAlbumsCount',
		async () => {
			if (!user.value) return 0;

			const { data, error } = await supabase.rpc(
				'count_distinct_albums',
				{ user_id_input: user.value.id },
			);

			if (error) {
				console.error(
					'Erreur lors du comptage des albums distincts:',
					error,
				);
				return 0;
			}

			return data;
		},
		{
			// Ne pas exécuter la requête si l'utilisateur n'a pas importé d'historique
			watch: [historyData],
			default: () => 0,
		},
	);

	const { data: totalDistinctsSongsCount } = useAsyncData(
		'totalDistinctsSongsCount',
		async () => {
			if (!user.value) return 0;

			const { data, error } = await supabase.rpc('count_distinct_songs', {
				user_id_input: user.value.id,
			});

			if (error) {
				console.error(
					'Erreur lors du comptage des morceaux distincts:',
					error,
				);
				return 0;
			}

			return data;
		},
		{
			// Ne pas exécuter la requête si l'utilisateur n'a pas importé d'historique
			watch: [historyData],
			default: () => 0,
		},
	);
</script>

<template>
	<div
		v-if="historyData === null || userHasUploadedHistoryFile"
		class="dashboard"
	>
		<h1 class="title">
			Bienvenue
			<span class="username">{{ user.user_metadata.display_name }}</span>
		</h1>

		<section class="general-stats">
			<h2 class="title">Statistiques générales</h2>

			<ul class="general-stats__list">
				<li class="general-stats__list__item">
					<p class="general-stats__list__label">Nombre d'écoutes</p>
					<NumberFlow
						:value="playsCount"
						class="general-stats__list__value league-gothic"
					/>
				</li>

				<MinutesSwitch :secondsAmount="totalSecondsPlayed ?? 0" />

				<li class="general-stats__list__item">
					<p class="general-stats__list__label">Artistes écoutés</p>
					<NumberFlow
						:value="totalDistinctsArtistsCount ?? 0"
						class="general-stats__list__value league-gothic"
					/>
				</li>

				<li class="general-stats__list__item">
					<p class="general-stats__list__label">Albums écoutés</p>
					<NumberFlow
						:value="totalDistinctsAlbumsCount ?? 0"
						class="general-stats__list__value league-gothic"
					/>
				</li>

				<li class="general-stats__list__item">
					<p class="general-stats__list__label">Morceaux écoutés</p>
					<NumberFlow
						:value="totalDistinctsSongsCount ?? 0"
						class="general-stats__list__value league-gothic"
					/>
				</li>
			</ul>
		</section>

		<section class="tops">
			<h2 class="title">Top albums</h2>
		</section>
	</div>

	<div v-else class="dashboard empty-dashboard">
		<h1 class="title">
			Bienvenue
			<span class="username">{{ user.user_metadata.display_name }}</span>
		</h1>

		<h2 class="title">Vous n'avez pas encore de top</h2>

		<NuxtLink to="/dashboard/imports">
			<DButton size="small" type="secondary">
				Importer mes statistiques
			</DButton>
		</NuxtLink>
	</div>
</template>

<style lang="scss" scoped>
	.dashboard {
		display: flex;
		flex-direction: column;
		gap: 40px;

		width: 100%;

		.username {
			color: $details;
		}
	}

	.import-button {
		border: 1px dashed $strokes;

		transition: scale 0.1s ease-in-out;

		&:hover {
			scale: 1.01;
			transition: scale 0.1s ease-in-out;
		}
	}

	.general-stats {
		display: flex;
		flex-direction: column;
		gap: 30px;

		&__list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 20px 80px;

			width: 100%;

			&__item {
				display: flex;
				flex-direction: column;
				// gap: 10px;

				padding: 10px;
			}

			&__label {
				font-size: 1.5rem;
			}

			&__value {
				font-size: 6.4rem;
			}
		}
	}

	.empty-dashboard {
	}
</style>
