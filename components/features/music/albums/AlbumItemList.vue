<script lang="ts" setup>
	import type { AlbumsStatsDatas } from '~/types';

	import { Icon } from '@iconify/vue';

	const props = defineProps<{ data: AlbumsStatsDatas }>();
	const albumTitle = props.data.album_title
		.replace(/\s+/g, '-')
		.toLowerCase();

	const artistName = props.data.artist_name
		.replace(/\s+/g, '-')
		.toLowerCase();

	const { data: albumDatas } = await useAsyncData(
		`artistDatas:${albumTitle}`,
		() =>
			$fetch(
				`/api/deezer/album?title=${albumTitle}&artist=${artistName}`,
			),
	);

	const coverSrc = albumDatas.value?.cover_big;
</script>

<template>
	<li class="album">
		<nuxtImg class="album__illustration" :src="coverSrc" />

		<p class="album__title">
			{{ data.album_title }}
		</p>

		<p class="album__artist-name">{{ data.artist_name }}</p>
		<div class="album__infos">
			<p class="album__release-date small details">
				Sorti le
				{{ albumDatas?.release_date.split('-').reverse().join('/') }}
			</p>
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
	@use 'assets/styles/screen' as screen;

	.album {
		display: flex;
		flex-direction: column;
		gap: 10px;

		padding: 10px;
		border-radius: 15px;

		width: fit-content;
		height: fit-content;

		color: $text;
		flex-shrink: 0;

		&:hover {
			background: color.scale($color: $bg, $lightness: 2%);
		}

		&__infos {
			display: flex;
			flex-direction: column;
			gap: 5px;

			max-width: 180px;

			@media screen and (max-width: screen.$tablet) {
				max-width: 120px;
			}
		}

		&__illustration {
			aspect-ratio: 1;
			width: 180px;

			border-radius: 5px;
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

		&__artist-name {
			font-size: 1.4rem;

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
		}
	}
</style>
