<script lang="ts" setup>
	import NumberFlow from '@number-flow/vue';
	import { Icon } from '@iconify/vue';

	const props = defineProps({
		secondsAmount: {
			type: Number,
			required: true,
		},
	});

	const label = ref<'secondes' | 'minutes' | 'heures' | 'jours'>('minutes');
	const switchLabel = () => {
		if (label.value === 'secondes') {
			label.value = 'minutes';
		} else if (label.value === 'minutes') {
			label.value = 'heures';
		} else if (label.value === 'heures') {
			label.value = 'jours';
		} else {
			label.value = 'secondes';
		}
	};

	const calculatedValues = computed(() => {
		return {
			secondes: props.secondsAmount,
			minutes: Math.floor(props.secondsAmount / 60),
			heures: Math.floor(props.secondsAmount / 60 / 60),
			jours: Math.floor(props.secondsAmount / 60 / 60 / 24),
		};
	});
</script>

<template>
	<li class="minutes-switch">
		<p class="minutes-switch__label" @click="switchLabel">
			<Icon icon="mi:switch" :ssr="true" />

			{{ label }} d'écoute
		</p>

		<NumberFlow
			:value="calculatedValues[label]"
			class="minutes-switch__value league-gothic"
		/>
	</li>
</template>

<style scoped lang="scss">
	.minutes-switch {
		display: flex;
		flex-direction: column;

		padding: 10px;

		&__label {
			display: flex;
			align-items: center;
			gap: 5px;

			font-size: 1.5rem;

			cursor: pointer;
			user-select: none;

			transition: color 0.1s ease-in-out;

			&:hover {
				color: $primary;
			}
		}

		&__value {
			font-size: 6.4rem;
		}
	}
</style>
