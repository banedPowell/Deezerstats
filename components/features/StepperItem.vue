<script lang="ts" setup>
	import { Icon } from '@iconify/vue';

	const props = defineProps<{
		step: { title: string; icon: string; description: string };
		state: 'waiting' | 'completed' | 'current';
		lastTimer?: string;
	}>();

	const emits = defineEmits<{
		(e: 'refresh'): void;
		(e: 'end'): void;
	}>();

	// const timeToRefresh = 10000;

	const timer = ref('00:00');
	const startTime = ref<number | null>(null);
	const timerInterval = ref<number | null>(null);

	const formatTime = (ms: number): string => {
		const totalSeconds = Math.floor(ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		const milliseconds = ms % 1000;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
	};

	const startTimer = () => {
		if (props.state === 'current' && !startTime.value) {
			startTime.value = Date.now();
			timerInterval.value = window.setInterval(() => {
				if (startTime.value) {
					const elapsed = Date.now() - startTime.value;
					timer.value = formatTime(elapsed);

					// if (elapsed >= timeToRefresh) {
					// 	emits('refresh');
					// }
				}
			}, 10);
		}
	};

	const stopTimer = () => {
		if (timerInterval.value) {
			clearInterval(timerInterval.value);
			timerInterval.value = null;
		}
	};

	watch(
		() => props.state,
		(newState) => {
			if (newState === 'current' && props.step.title !== 'Fin') {
				startTimer();
			} else if (newState === 'completed') {
				stopTimer();
			} else if (
				props.state === 'current' &&
				props.step.title === 'Fin'
			) {
				emits('end');
			}
		},
	);

	onMounted(() => {
		if (props.state === 'current' && props.step.title !== 'Fin') {
			startTimer();
		} else if (props.state === 'current' && props.step.title === 'Fin') {
			emits('end');
		}
	});

	onUnmounted(() => {
		stopTimer();
	});
</script>

<template>
	<li
		class="stepper-item"
		:class="{
			'stepper-item__current': state === 'current',
			'stepper-item__completed': state === 'completed',
		}"
	>
		<div class="stepper-item__icon-wrapper">
			<Icon
				class="stepper-item__icon-wrapper__icon"
				:icon="step.icon"
				:width="15"
				:ssr="true"
			/>
		</div>

		<p
			class="stepper-item__timer"
			v-if="state !== 'waiting' && props.step.title !== 'Fin'"
		>
			{{ timer }}
		</p>

		<h3 class="stepper-item__title league-gothic">{{ step.title }}</h3>

		<p class="stepper-item__description">{{ step.description }}</p>
	</li>
</template>

<style scoped lang="scss">
	.stepper-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;

		width: fit-content;
		max-width: 100px;
		height: fit-content;

		opacity: 0.5;

		&__current,
		&__completed {
			opacity: 100%;
		}

		&__icon-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;

			aspect-ratio: 1;
			width: 32px;
			border-radius: 100%;

			background: $text;

			&__icon {
				color: $bg;
			}
		}

		&__title {
			font-size: 2.4rem;
		}

		&__description {
			font-size: 1.2rem;
			color: $details;
			text-align: center;
			line-height: 1.5rem;
		}
	}
</style>
