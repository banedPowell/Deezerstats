<script lang="ts" setup>
	const router = useRouter();

	const user = ref({
		username: '',
		password: '',
	});

	const { signup } = useAuthStore();
	const authStore = storeToRefs(useAuthStore());

	const createAccount = async () => {
		await signup(user.value);

		if (authStore.isAuthenticated) {
			await router.push('/');
		}
	};
</script>

<template>
	<h1>Signup</h1>

	<form @submit.prevent="createAccount">
		<input v-model="user.username" placeholder="Username" type="text" />
		<input v-model="user.password" placeholder="Password" type="password" />
		<button type="submit">Sign Up</button>
	</form>
</template>

<style lang="scss" scoped></style>
