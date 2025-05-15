<script lang="ts" setup>
	definePageMeta({
		layout: 'auth-layout',
	});

	useHead({
		title: 'Deezerstats - Connexion',
	});

	const router = useRouter();

	const supabase = useSupabaseClient();
	const errorMessage = ref('');

	const user = ref({
		mail: '',
		password: '',
	});

	const resetUser = () => {
		user.value.mail = '';
		user.value.password = '';
	};

	const logToAccount = async () => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: user.value.mail,
			password: user.value.password,
		});

		if (error) {
			errorMessage.value = error.message;
			return;
		}

		if (data.session) {
			errorMessage.value = '';
			resetUser();
			await router.push('/auth');
		}
	};
</script>

<template>
	<section class="auth">
		<h1 class="title">Connecte-toi</h1>

		<form @submit.prevent="logToAccount">
			<label>
				Adresse mail

				<input v-model="user.mail" type="email" />
			</label>

			<label>
				Mot de passe

				<input v-model="user.password" type="password" />
			</label>

			<p class="">
				Pas encore de compte ?
				<NuxtLink class="accent" to="/auth/signup"
					>Inscription
				</NuxtLink>
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
