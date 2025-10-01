<script lang="ts" setup>
	import type { TracksStatsDatas } from '~/types';
	import { Icon } from '@iconify/vue';

	const props = defineProps<{ data: TracksStatsDatas }>();

	const trackTitle = props.data.track_name.replace(/\s+/g, '-').toLowerCase();

	const artistName = props.data.artist_names[0]
		.replace(/\s+/g, '-')
		.toLowerCase();

	const { data: trackDatas } = await useAsyncData(
		`artistDatas:${trackTitle}`,
		() =>
			$fetch(
				`/api/deezer/track?title=${trackTitle}&artist=${artistName}`,
			),
	);

	const coverSrc = trackDatas.value?.album.cover_big;
</script>

<template>
	<li class="track">
		<NuxtImg :src="coverSrc" class="track__illustration"></NuxtImg>

		<p class="track__title">{{ data.track_name }}</p>

		<ul class="track__artist-names-list">
			<li
				v-for="(artist, index) in data.artist_names"
				:key="index"
				class="track__artist-names-item"
			>
				{{ artist
				}}<template v-if="index < data.artist_names.length - 1"
					>,</template
				>
			</li>
		</ul>

		<div class="track__infos">
			<p class="track__release-date small details">
				Sorti le
				{{ trackDatas?.release_date.split('-').reverse().join('/') }}
			</p>
			<div class="track__stats">
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

	.track {
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

		&__artist-names-list {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 5px;
		}

		&__artist-names-item {
			font-size: 1.4rem;
		}

		&__stats {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 5px;
		}
	}
</style>
