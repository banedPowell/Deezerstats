<script lang="ts" setup>
	const props = defineProps<{
		isLoading: boolean;
	}>();

	const user = useSupabaseUser();

	const { tracksStats } = await useTracksStats(
		user.value?.id,
		toRef(props, 'isLoading'),
	);
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
