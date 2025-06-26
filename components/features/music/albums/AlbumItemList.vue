<script lang="ts" setup>
	import type { AlbumsStatsDatas } from '~/types';

	import { Icon } from '@iconify/vue';

	const props = defineProps<{ data: AlbumsStatsDatas }>();
</script>

<template>
	<li class="album">
		<div class="album__illustration"></div>

		<p class="album__title">{{ data.album_title }}</p>

		<p class="album__artist-name">{{ data.artist_name }}</p>
		<div class="album__infos">
			<p class="album__release-date small details">Sorti le 10/10/2002</p>
			<div class="album__stats">
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

	.album {
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
