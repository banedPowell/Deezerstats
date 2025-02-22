<script lang="ts" setup>
	const router = useRouter();

	const user = ref({
		username: '',
		password: '',
	});

	const { login } = useAuthStore();
	const authStore = storeToRefs(useAuthStore());

	const logToAccount = async () => {
		await login(user.value);

		if (authStore.isAuthenticated) {
			await router.push('/');
		}
	};
</script>

<template>
	<h1>Login</h1>

	<form @submit.prevent="logToAccount">
		<input v-model="user.username" placeholder="Username" type="text" />
		<input v-model="user.password" placeholder="Password" type="password" />
		<button type="submit">Login</button>
	</form>
</template>

<style lang="scss" scoped></style>
