<script lang="ts" setup>
	const user = useSupabaseUser();
	const supabase = useSupabaseClient();

	// Récupérer les informations d'import de l'utilisateur
	const { data: historyData } = await useAsyncData(
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
	);

	// Compter les écoutes si l'utilisateur a importé son historique
	const { data: playsCount } = await useAsyncData(
		'playsCount',
		async () => {
			const { data } = await supabase
				.from('plays')
				.select('*', { count: 'exact' })
				.eq('user_id', user.value.id);

			return data?.length || 0;
		},
		{
			// Ne pas exécuter la requête si l'utilisateur n'a pas importé d'historique
			watch: [historyData],
			default: () => 0,
		},
	);

	// Calculer le nombre total de minutes écoutes
	const { data: totalMinutesPlayed } = await useAsyncData(
		'totalMinutesPlayed',
		async () => {
			const { data } = await supabase
				.from('plays')
				.select('listening_time')
				.eq('user_id', user.value.id);

			// Convertir les secondes en minutes en divisant par 60
			const totalSeconds =
				data?.reduce((total, play) => total + play.listening_time, 0) ||
				0;
			return Math.round(totalSeconds / 60);
		},
		{
			// Ne pas exécuter la requête si l'utilisateur n'a pas importé d'historique
			watch: [historyData],
			default: () => 0,
		},
	);

	const userHasUploadedHistoryFile = computed(
		() => historyData.value?.has_uploaded_history_file || false,
	);
</script>

<template>
	<div v-if="userHasUploadedHistoryFile" class="dashboard">
		<h1 class="title">Bienvenue {{ user.user_metadata.display_name }}</h1>

		<section class="general-stats">
			<h2 class="title">Statistiques générales</h2>

			<ul class="general-stats__list">
				<li>
					<p class="general-stats__list__label">Nombre d'écoutes</p>
					<p class="general-stats__list__value league-gothic">
						{{ playsCount }}
					</p>
				</li>

				<li>
					<p class="general-stats__list__label">Minutes écoutées</p>
					<p class="general-stats__list__value league-gothic">
						{{ totalMinutesPlayed }}
					</p>
				</li>
			</ul>
		</section>
	</div>

	<div v-else class="dashboard empty-dashboard">
		<h1 class="title">Bienvenue {{ user.user_metadata.display_name }}</h1>

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
		gap: 30px;

		width: 100%;
	}

	.import-button {
		border: 1px dashed $strokes;

		transition: scale 0.1s ease-in-out;

		&:hover {
			scale: 1.01;
			transition: scale 0.1s ease-in-out;
		}
	}

	.empty-dashboard {
	}

	.general-stats {
		display: flex;
		flex-direction: column;
		gap: 30px;

		&__list {
			display: flex;
			flex-direction: column;
			gap: 10px;

			&__label {
				font-size: 1.5rem;
			}

			&__value {
				font-size: 6.4rem;
			}
		}
	}
</style>
