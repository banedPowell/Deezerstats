<script lang="ts" setup>
	useHead({
		title: 'Deezerstats',
		link: [
			{
				rel: 'icon',
				type: 'image/png',
				href: '/deezerstats-logo.png',
			},
		],
	});

	useSeoMeta({
		title: 'Deezerstats',
		description:
			"Découvrez vos habitudes musicales ! Analysez votre historique d'écoute Deezer et obtenez des statistiques détaillées sur toute la durée de votre compte.",
		ogTitle: 'Deezerstats',
		ogDescription:
			"Découvrez vos habitudes musicales ! Analysez votre historique d'écoute Deezer et obtenez des statistiques détaillées sur toute la durée de votre compte.",
		ogImage: '/seo.png',
		ogUrl: 'https://deezerstats.baned.me/',
		ogType: 'website',
		ogLocale: 'fr_FR',
		ogSiteName: 'Deezerstats',
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
