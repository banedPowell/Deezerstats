<script lang="ts" setup></script>

<template>
	<section class="imports">
		<h1 class="title">Importation des statistiques</h1>

		<h2 class="title">Vous n'avez pas encore de top</h2>

		<NuxtLink to="/dashboard">
			<DButton class="back-button" size="small" type="secondary">
				<!--				<Icon-->
				<!--					class="icon"-->
				<!--					name="lucide:chevron-left"-->
				<!--					style="color: white"-->
				<!--				/>-->

				< Retour
			</DButton>
		</NuxtLink>

		<DDropzone />
	</section>
</template>

<style lang="scss" scoped>
	h2.title {
		font-family: 'Inter', sans-serif;
		font-size: 2rem;
		font-weight: 300;
	}

	.imports {
		display: flex;
		flex-direction: column;
		gap: 30px;

		width: 100%;
	}

	.back-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 50px;

		//margin-top: 50px;
	}
</style>
