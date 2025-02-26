<script lang="ts" setup>
	const store = useAuthStore();
	const { logout } = useAuthStore();
	const { isAuthenticated } = storeToRefs(store);
</script>

<template>
	<header class="header">
		<div class="header__left">
			<NuxtLink to="/">
				<Logo />
			</NuxtLink>
		</div>

		<div class="header__right">
			<div v-if="!isAuthenticated" class="unauthenticated">
				<NuxtLink to="/login">
					<Button type="secondary">Connexion</Button>
				</NuxtLink>

				<NuxtLink to="/signup">
					<Button type="primary">Inscription</Button>
				</NuxtLink>
			</div>

			<div v-if="isAuthenticated" class="authenticated">
				<Button type="secondary" @click="logout">Logout</Button>
			</div>
		</div>
	</header>

	<main>
		<slot />
	</main>

	<footer>
		<p>&copy; 2025</p>
	</footer>
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

		& .unauthenticated {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 20px;
		}
	}

	//main {
	//	min-height: 100vh;
	//}
</style>
