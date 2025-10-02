<script lang="ts" setup>
	const user = useSupabaseUser();

	const isAuthenticated = computed(() => {
		return !!user.value;
	});
</script>

<template>
	<DHeader :clear="true" :is-authenticated="isAuthenticated" />

	<main>
		<slot />
	</main>

	<DFooter />
</template>

<style lang="scss" scoped>
	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		width: 100%;
		padding: 30px 50px;

		&__left,
		&__right {
			display: flex;
			flex-direction: row;
			align-items: center;

			width: fit-content;
		}
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;

		min-height: 80vh;
		margin-top: 100px;
		padding: 0 20px;

		width: 100%;
	}
</style>
