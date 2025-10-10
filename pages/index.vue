<script lang="ts" setup>
	import { Icon } from '@iconify/vue';
</script>

<template>
	<div class="flex w-full flex-col items-center gap-96">
		<section class="flex w-full flex-col items-center gap-16">
			<div
				class="pill flex scale-75 flex-row items-center justify-center gap-5 rounded-full border border-gray-800 bg-black text-nowrap text-gray-500 sm:scale-100"
			>
				<Icon icon="lucide:music" class="size-6" />

				<p>Analysez votre compte Deezer</p>
			</div>

			<div class="flex max-w-3xl flex-col items-center gap-4">
				<h1
					class="title flex w-fit scale-65 flex-row items-center gap-2 md:scale-75 lg:scale-100"
				>
					<NuxtImg src="/deezerstats-logo-xl.png" class="size-30" />
					DEEZERSTATS
				</h1>

				<p class="text-center text-lg text-gray-400">
					Découvrez vos habitudes musicales comme jamais auparavant.
					Analysez votre historique d'écoute Deezer et obtenez des
					statistiques détaillées sur toute la durée de votre compte.
				</p>
			</div>

			<div
				class="flex flex-row flex-wrap items-center justify-center gap-5"
			>
				<NuxtLink to="/dashboard">
					<DButton size="small" type="primary">
						Découvrir mon top
						<Icon icon="lucide:arrow-right" />
					</DButton>
				</NuxtLink>

				<NuxtLink to="/auth/login">
					<DButton size="small" type="secondary">
						Me connecter
					</DButton>
				</NuxtLink>
			</div>
		</section>

		<section class="flex w-full flex-col items-center gap-24">
			<div class="flex max-w-3xl flex-col items-center gap-4">
				<h2 class="title items-center gap-2 text-center">
					Vos données musicales
					<span class="accent">révélées en détails</span>
				</h2>

				<p class="text-center text-lg text-gray-400">
					Explorez vos habitudes d'écoute sur votre parcours musical.
					Deezerstats vous offre une analyse approfondie de vos
					données musicales avec des outils avancés et des
					visualisations intuitives.
				</p>

				<p class="text-center text-lg text-gray-400">
					Vous pourrez découvrir :
				</p>
			</div>

			<ul class="grid w-full grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2">
				<li class="flex h-fit w-full flex-col gap-10">
					<p class="screenshots__title z-10">
						Vos statistiques générales en détails
					</p>

					<GeneralScreenshots />
				</li>

				<li class="flex h-fit w-full flex-col gap-10">
					<p class="screenshots__title z-10">Vos morceaux préférés</p>

					<TracksScreenshots />
				</li>
			</ul>

			<div class="flex h-fit w-full flex-col gap-10">
				<p class="screenshots__title albums-and-artists-title z-10">
					Vos artistes et albums préférés
				</p>

				<AlbumsAndArtistsScreenshots />
			</div>
		</section>

		<section class="flex w-full flex-col items-center gap-16">
			<div class="flex max-w-3xl flex-col items-center gap-4">
				<h2 class="title items-center gap-2 text-center">
					Prêt à découvrir vos
					<span class="color-details">statistiques musicales ? </span>
				</h2>

				<p class="text-center text-lg text-gray-400">
					Récupérez vos données sur Deezer et obtenez instantanément
					une analyse complète de votre historique d'écoute
				</p>
			</div>

			<div
				class="flex flex-row flex-wrap items-center justify-center gap-5"
			>
				<NuxtLink to="/dashboard">
					<DButton size="small" type="primary">
						Découvrir mon top
						<Icon icon="lucide:arrow-right" />
					</DButton>
				</NuxtLink>
			</div>
		</section>
	</div>
</template>

<style lang="scss" scoped>
	@use 'assets/styles/colors' as c;

	.pill {
		background: c.$bg-2;
		border: 1px solid c.$strokes;
		padding: 5px 15px;

		user-select: none;
	}

	.screenshots__title {
		margin-bottom: 15px;
	}

	.albums-and-artists-title {
		margin-top: 70px;
	}
</style>
