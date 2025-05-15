<script lang="ts" setup>
	const user = useSupabaseUser();

	const isAuthenticated = computed(() => {
		return !!user.value;
	});
</script>

<template>
	<DHeader :clear="false" :is-authenticated="isAuthenticated" />

	<main>
		<slot />
	</main>

	<footer>
		<p>&copy; 2025</p>
	</footer>
</template>

<style lang="scss" scoped>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;

		min-height: 80vh;
		max-width: 800px;
		width: 100%;

		margin-top: 30px;
		padding: 0 20px;
	}
</style>
