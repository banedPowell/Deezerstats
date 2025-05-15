<script lang="ts" setup>
	const isEmpty = ref(true);
</script>

<template>
	<section v-if="isEmpty" class="dashboard empty-dashboard">
		<!-- <h1 class="title">Bienvenue {{ authStore.user.name }}</h1> -->

		<h2 class="top-title">Vous n'avez pas encore de top</h2>

		<NuxtLink to="/dashboard/imports">
			<DButton size="small" type="secondary">
				Importer mes statistiques
			</DButton>
		</NuxtLink>
	</section>
</template>

<style lang="scss" scoped>
	h2.top-title {
		font-family: 'Inter', sans-serif;
		font-size: 2rem;
		font-weight: 300;
	}

	.dashboard {
		display: flex;
		flex-direction: column;
		gap: 30px;

		width: 100%;
	}

	.import-button {
		border: 1px dashed $strokes;

		transition: scale 0.1s ease-in-out;

		&:hover {
			scale: 1.01;
			transition: scale 0.1s ease-in-out;
		}
	}

	.empty-dashboard {
	}
</style>
