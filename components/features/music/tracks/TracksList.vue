<script lang="ts" setup>
	const user = useSupabaseUser();

	const { tracksStats } = await useTracksStats(user.value?.id);
</script>

<template>
	<ul class="flex flex-row overflow-x-scroll">
		<TrackItemList v-for="track in tracksStats" :data="track" />
	</ul>
</template>

<style scoped lang="scss">
	.stats {
		&__list {
			display: flex;

			max-width: 100%;

			&--row {
				flex-direction: row;
				overflow-x: scroll;
			}
		}
	}
</style>
