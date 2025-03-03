<script lang="ts" setup>
	definePageMeta({
		layout: 'auth-layout',
		middleware: 'auth-route-middleware',
	});

	useHead({
		title: 'Deezerstats - Connexion',
	});

	const router = useRouter();

	const user = ref({
		username: '',
		password: '',
	});

	const errorMessage = ref('');

	const resetUser = () => {
		user.value.username = '';
		user.value.password = '';
	};

	const { login } = useAuthStore();
	const authStore = storeToRefs(useAuthStore());

	const logToAccount = async () => {
		try {
			await login(user.value);

			resetUser();

			if (authStore.isAuthenticated) {
				await router.push('/dashboard');
			}
		} catch (error) {
			errorMessage.value = (error as Error).message;
		}
	};
</script>

<template>
	<section class="auth">
		<h1 class="title">Connecte-toi</h1>

		<form @submit.prevent="logToAccount">
			<label>
				Nom d'utilisateur

				<input v-model="user.username" type="text" />
			</label>

			<label>
				Mot de passe

				<input v-model="user.password" type="password" />
			</label>

			<p class="">
				Pas encore de compte ?
				<NuxtLink class="accent" to="/signup">Inscription</NuxtLink>
			</p>

			<button style="display: none" type="submit"></button>

			<DButton size="large" type="primary" @click="logToAccount">
				Se connecter
			</DButton>
		</form>

		<p class="error">{{ errorMessage }}</p>
	</section>
</template>

<style lang="scss" scoped>
	.auth {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 40px;

		max-width: 500px;
		width: 100%;

		form {
			display: flex;
			flex-direction: column;
			align-items: start;
			justify-content: center;
			gap: 20px;

			width: 100%;

			p {
				margin: 10px 0 5px 0;
			}
		}
	}
</style>
