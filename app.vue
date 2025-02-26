<script lang="ts" setup>
	useAuthStore();
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
