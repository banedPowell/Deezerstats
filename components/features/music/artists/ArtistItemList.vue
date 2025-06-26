<script lang="ts" setup>
	import type { ArtistsStatsDatas } from '~/types';
	import { Icon } from '@iconify/vue';

	const props = defineProps<{ data: ArtistsStatsDatas }>();
</script>

<template>
	<li class="artist">
		<div class="artist__illustration"></div>

		<p class="artist__title">{{ data.artist_name }}</p>

		<div class="artist__infos">
			<div class="artist__stats">
				<p class="small">{{ data.total_streams }} streams</p>

				<Icon icon="lucide:dot" height="1rem" />

				<p class="small">
					{{ Math.floor(data.total_listening_time / 60) }} minutes
				</p>
			</div>
		</div>
	</li>
</template>

<style lang="scss" scoped>
	@use 'sass:color';

	.artist {
		display: flex;
		flex-direction: column;
		gap: 10px;

		padding: 10px;
		border-radius: 15px;

		width: fit-content;
		height: fit-content;

		color: $text;

		&:hover {
			background: color.scale($color: $bg, $lightness: 2%);
		}

		&__infos {
			display: flex;
			flex-direction: column;
			gap: 5px;
		}

		&__illustration {
			aspect-ratio: 1;
			width: 180px;

			border-radius: 5px;
			animation: pulse 2s infinite;
		}

		&__title {
			font-size: 1.6rem;
			line-height: 1.3;
		}

		&__artist-name {
			font-size: 1.4rem;
		}

		&__stats {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 5px;
		}
	}

	@keyframes pulse {
		0% {
			background: #252525;
		}
		70% {
			background: #171717;
		}
		100% {
			background: #252525;
		}
	}
</style>
