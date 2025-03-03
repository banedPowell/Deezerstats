<script lang="ts" setup>
	import DHeader from '~/components/DHeader.vue';

	const store = useAuthStore();
	const { isAuthenticated } = storeToRefs(store);
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
