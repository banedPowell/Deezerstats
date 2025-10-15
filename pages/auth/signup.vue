<script lang="ts" setup>
	definePageMeta({
		layout: 'auth-layout',
	});

	useHead({
		title: 'banedStats - Inscription',
	});

	const router = useRouter();
	const supabase = useSupabaseClient();

	const user = ref({
		mail: '',
		displayName: '',
		password: '',
	});

	const resetUser = () => {
		user.value.mail = '';
		user.value.displayName = '';
		user.value.password = '';
	};

	const errorMessage = ref('');

	const createAccount = async () => {
		const { data, error } = await supabase.auth.signUp({
			email: user.value.mail,
			password: user.value.password,
			options: {
				data: {
					display_name: user.value.displayName,
				},
			},
		});

		if (error) {
			errorMessage.value = error.message;
			return;
		}

		if (data.user) {
			errorMessage.value = '';
			resetUser();
			await router.push('/auth');
		}
	};
</script>

<template>
	<section class="auth">
		<h1 class="title">Inscris-toi</h1>

		<form @submit.prevent="createAccount">
			<label>
				Pseudo
				<input v-model="user.displayName" type="text" required />
			</label>

			<label>
				Adresse mail
				<input v-model="user.mail" type="email" required />
			</label>

			<label>
				Mot de passe

				<input v-model="user.password" type="password" />
			</label>

			<p class="">
				Déjà un compte ?
				<NuxtLink class="accent" to="/auth/login">Connexion</NuxtLink>
			</p>

			<button style="display: none" type="submit"></button>

			<DButton size="large" type="primary" @click="createAccount">
				S'inscrire
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
