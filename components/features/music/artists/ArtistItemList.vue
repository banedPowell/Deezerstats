<script lang="ts" setup>
	import type { ArtistsStatsDatas } from '~/types';
	import { Icon } from '@iconify/vue';

	const props = defineProps<{ data: ArtistsStatsDatas }>();
	const artistName = props.data.artist_name
		.replace(/\s+/g, '-')
		.toLowerCase();

	const { data: artistDatas } = await useAsyncData(
		`artistDatas:${artistName}`,
		() => $fetch(`/api/deezer/artist?name=${artistName}`),
	);

	const pictureSrc = artistDatas.value?.picture_big;
</script>

<template>
	<li class="artist">
		<NuxtImg class="artist__illustration" :src="pictureSrc" />

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
	@use 'assets/styles/screen' as screen;

	.artist {
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex-shrink: 0;

		padding: 10px;
		border-radius: 15px;

		width: fit-content;
		height: fit-content;
		cursor: pointer;

		&:hover {
			background: color.scale($color: $bg, $lightness: 2%);
		}

		&__illustration {
			aspect-ratio: 1;
			width: 180px;
			object-fit: cover;
			flex-shrink: 0;

			border-radius: 100%;
			animation: pulse 2s infinite;

			@media screen and (max-width: screen.$tablet) {
				width: 120px;
			}
		}

		&__title {
			font-size: 1.6rem;
			line-height: 1.3;

			max-width: 180px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			@media screen and (max-width: screen.$tablet) {
				max-width: 120px;
			}
		}

		&__stats {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 5px;

			max-width: 180px;

			@media screen and (max-width: screen.$tablet) {
				max-width: 120px;
			}
		}
	}
</style>
