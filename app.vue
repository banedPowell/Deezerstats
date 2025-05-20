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

	const supabase = useSupabaseClient();

	const channels = supabase
		.channel('custom-all-channel')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'history_processing_status',
			},
			(payload) => {
				console.log('Change received!', payload);
			},
		)
		.subscribe();
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
