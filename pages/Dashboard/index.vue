<script lang="ts" setup>
	import NumberFlow from '@number-flow/vue';
	import { Icon } from '@iconify/vue';

	import type {
		Database,
		CurrentStep,
		ProcessingStatusPayload,
	} from '~/types';

	const user = useSupabaseUser();
	const supabase = useSupabaseClient<Database>();

	const fileSent = ref(false);

	const processingDatas = ref(false);

	const currentStep: Ref<CurrentStep> = ref({
		title: '',
		description: '',
	});

	const steps: { title: string; icon: string; description: string }[] = [
		{
			title: 'Artistes',
			icon: 'lucide:mic-vocal',
			description: 'Ajout des artistes à la base de données',
		},
		{
			title: 'Albums',
			icon: 'f7:music-albums',
			description: 'Ajout des albums à la base de données',
		},
		{
			title: 'Morceaux',
			icon: 'lucide:music',
			description: 'Ajout des morceaux à la base de données',
		},
		{
			title: 'Historique',
			icon: 'lucide:book-headphones',
			description:
				"Ajout de l'historique de lectures à la base de données",
		},
		{
			title: 'Fin',
			icon: 'lucide:circle-check',
			description: 'Traitement des données terminé',
		},
	];

	const getStepState = (stepTitle: string) => {
		if (!currentStep.value.title) return 'waiting';

		const currentIndex = steps.findIndex(
			(step) => step.title === currentStep.value.title,
		);
		const stepIndex = steps.findIndex((step) => step.title === stepTitle);

		if (stepIndex < currentIndex) return 'completed';
		if (stepIndex === currentIndex) return 'current';
		return 'waiting';
	};

	const channels = supabase
		.channel('custom-all-channel')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'history_processing_status',
			},
			(payload: ProcessingStatusPayload) => {
				currentStep.value = JSON.parse(payload.new.current_step);
			},
		)
		.subscribe();

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

	onMounted(() => userHasUploadedHistoryFile);

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

	const refreshGeneralDatas = () => {
		refreshNuxtData([
			'playsCount',
			'totalSecondsPlayed',
			'totalDistinctsArtistsCount',
			'totalDistinctsAlbumsCount',
			'totalDistinctsSongsCount',
		]);
	};
</script>

<template>
	<div
		v-if="historyData === null || userHasUploadedHistoryFile || fileSent"
		class="dashboard"
	>
		<h1 class="title">
			Bienvenue
			<span class="username">{{ user?.user_metadata.display_name }}</span>
		</h1>

		<section class="data-processing" v-if="fileSent && processingDatas">
			<h2 class="title">Traitement des données</h2>

			<ul class="stepper__list">
				<StepperItem
					v-for="step of steps"
					:key="step.title"
					:step="step"
					:state="getStepState(step.title)"
					@end="(refreshGeneralDatas(), (processingDatas = false))"
				/>
			</ul>
		</section>

		<section class="general-stats">
			<h2
				class="title title--refresh-button"
				@click="refreshGeneralDatas"
			>
				<Icon
					icon="lucide:refresh-cw"
					width="20px"
					class="refresh-icon"
				/>

				Statistiques générales
			</h2>

			<ul class="general-stats__list">
				<li class="general-stats__list__item">
					<p class="general-stats__list__label">Nombre d'écoutes</p>
					<NumberFlow
						:value="playsCount ?? 0"
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
			<span class="username">{{ user?.user_metadata.display_name }}</span>
		</h1>

		<section class="send-file" v-if="!fileSent">
			<h2 class="title">Vous n'avez pas encore de top</h2>

			<Dropzone
				@fileSent="((fileSent = true), (processingDatas = true))"
			/>
		</section>
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

	.title {
		&--refresh-button {
			display: flex;
			align-items: center;
			gap: 20px;

			user-select: none;
			cursor: pointer;

			transition: all 0.2s ease-out;

			&:hover {
				color: $primary;

				.refresh-icon {
					animation: rotation 0.5s
						cubic-bezier(0.6, -0.28, 0.735, 0.045) (1, 0, 0, 1);
				}
			}
		}
	}

	.stepper__list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 20px 30px;

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

	section {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.general-stats {
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

	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>
