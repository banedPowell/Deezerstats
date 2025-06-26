<script lang="ts" setup>
	const user = useSupabaseUser();

	const { albumsStats } = await useAlbumsStats(user.value?.id);
</script>

<template>
	<ul class="flex flex-row overflow-x-scroll">
		<AlbumItemList v-for="album in albumsStats" :data="album" />
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
