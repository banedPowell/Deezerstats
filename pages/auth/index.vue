<script lang="ts" setup>
	const user = useSupabaseUser();

	watch(
		user,
		() => {
			if (user.value) {
				return navigateTo('/dashboard');
			}

			return navigateTo('/auth/login');
		},
		{ immediate: true },
	);
</script>

<template>
	<div>
		<p>Redirecting...</p>
	</div>
</template>
