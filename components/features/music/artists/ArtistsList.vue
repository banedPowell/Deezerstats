<script lang="ts" setup>
	const props = defineProps<{
		isLoading: boolean;
	}>();

	const user = useSupabaseUser();

	const { artistsStats } = await useArtistsStats(
		user.value?.id,
		toRef(props, 'isLoading'),
	);
</script>

<template>
	<ul class="flex flex-row overflow-x-scroll">
		<ArtistItemList v-for="artist in artistsStats" :data="artist" />
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
