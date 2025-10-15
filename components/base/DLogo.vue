<script lang="ts" setup></script>

<template>
	<div class="logo__container">
		<NuxtImg class="logo__img" src="/logo.png" />

		<h1 class="logo__text">banedStats</h1>
	</div>
</template>

<style lang="scss" scoped>
	@use 'assets/styles/screen' as screen;

	.logo {
		&__container {
			display: flex;
			align-items: center;
			text-decoration: none;
			gap: 5px;
		}

		&__img {
			aspect-ratio: 1;
			width: 30px;
		}

		&__text {
			font-family: 'League Gothic', serif;
			font-size: 2rem;
			font-weight: normal;
			color: $text;

			@media screen and (max-width: screen.$mobile-l) {
				display: none;
			}
		}
	}
</style>
