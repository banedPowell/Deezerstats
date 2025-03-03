<script lang="ts" setup>
	const props = defineProps<{
		isAuthenticated: boolean;
		clear: boolean;
	}>();

	const router = useRouter();

	const { logout } = useAuthStore();

	const logoutUser = () => {
		logout();
		router.push('/login');
	};
</script>

<template>
	<header class="header">
		<div class="header__left">
			<NuxtLink to="/">
				<DLogo />
			</NuxtLink>
		</div>

		<div v-if="!clear" class="header__right">
			<div v-if="!isAuthenticated" class="unauthenticated">
				<NuxtLink to="/login">
					<DButton size="small" type="secondary">Connexion</DButton>
				</NuxtLink>

				<NuxtLink to="/signup">
					<DButton size="small" type="primary">Inscription</DButton>
				</NuxtLink>
			</div>

			<div v-if="isAuthenticated" class="authenticated">
				<NuxtLink to="/dashboard">Dashboard</NuxtLink>

				<DButton size="small" type="secondary" @click="logoutUser">
					Logout
				</DButton>
			</div>
		</div>

		<div v-else class="header__right"></div>
	</header>
</template>

<style lang="scss" scoped>
	@use 'assets/styles/screen' as screen;

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		width: 100%;
		padding: 30px 90px;

		//border-bottom: 1px solid $strokes;

		@media screen and (max-width: screen.$tablet) {
			padding: 30px 20px;
		}

		&__left,
		&__right {
			display: flex;
			flex-direction: row;
			align-items: center;

			width: fit-content;
		}

		& .unauthenticated,
		.authenticated {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 20px;

			a {
				font-size: 1.2rem;

				&:hover {
					text-underline-offset: 0.4rem;
					text-decoration: $text underline dashed;
				}
			}
		}
	}
</style>
