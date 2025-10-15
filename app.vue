<script lang="ts" setup>
	useHead({
		title: 'banedStats',
		link: [
			{
				rel: 'icon',
				type: 'image/png',
				href: '/logo.png',
			},
		],
	});

	useSeoMeta({
		title: 'banedStats',
		description:
			"Découvrez vos habitudes musicales ! Analysez votre historique d'écoute Deezer et obtenez des statistiques détaillées sur toute la durée de votre compte.",
		ogTitle: 'banedStats',
		ogDescription:
			"Découvrez vos habitudes musicales ! Analysez votre historique d'écoute Deezer et obtenez des statistiques détaillées sur toute la durée de votre compte.",
		ogImage: '/seo.png',
		ogUrl: 'https://banedStats.baned.me/',
		ogType: 'website',
		ogLocale: 'fr_FR',
		ogSiteName: 'banedStats',
	});
</script>

<template>
	<Html lang="fr">
		<Body>
			<NuxtRouteAnnouncer />

			<NuxtLayout>
				<NuxtPage />
			</NuxtLayout>
		</Body>
	</Html>
</template>
