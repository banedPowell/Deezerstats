<script setup lang="ts"></script>

<template>
	<div class="logo__container">
		<NuxtImg class="logo__img" src="/deezerstats-logo.png" />

		<h1 class="logo logo__text">Deezerstats</h1>
	</div>
</template>

<style scoped lang="scss">
	.logo {
		&__container {
			display: flex;
			align-items: center;
			text-decoration: none;
			gap: 10px;
		}

		&__img {
			aspect-ratio: 1;
			width: 23px;
		}
	}
</style>
