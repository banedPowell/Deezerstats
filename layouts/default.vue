<script lang="ts" setup>
	const { logout } = useAuthStore();
</script>

<template>
	<header>
		<NuxtLink to="/">Home</NuxtLink>
		<NuxtLink to="/signup">signup</NuxtLink>
		<NuxtLink to="/login">login</NuxtLink>
		<button @click="logout">Logout</button>
	</header>

	<main>
		<slot />
	</main>

	<footer>
		<p>&copy; 2025</p>
	</footer>
</template>

<style lang="scss" scoped>
	main {
		min-height: 100vh;
	}
</style>
