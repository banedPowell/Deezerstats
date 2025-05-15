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
