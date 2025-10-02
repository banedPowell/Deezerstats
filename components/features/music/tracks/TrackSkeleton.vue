<script setup lang="ts"></script>

<template>
	<li class="track">
		<div class="track__illustration" />
		<div class="track__title" />
		<div class="track__artist-name" />
		<div class="track__release-date" />
		<div class="track__stats" />
	</li>
</template>

<style lang="scss" scoped>
	@use 'sass:color';
	@use 'assets/styles/screen' as screen;

	.track {
		display: flex;
		flex-direction: column;
		gap: 10px;

		padding: 10px;
		border-radius: 15px;

		width: fit-content;
		height: fit-content;
		cursor: pointer;

		&:hover {
			background: color.scale($color: $bg, $lightness: 2%);
		}

		&__illustration {
			aspect-ratio: 1;
			width: 180px;

			border-radius: 5px;
			animation: pulse 2s infinite;

			@media screen and (max-width: screen.$tablet) {
				width: 120px;
			}
		}

		&__title,
		&__artist-name {
			height: 1.9rem;
			width: 100%;

			border-radius: 5px;
			animation: pulse 2s infinite;
		}

		&__release-date,
		&__stats {
			height: 1.2rem;
			width: 100%;

			border-radius: 5px;
			animation: pulse 2s infinite;
		}
		&__artist-name {
			width: 63px;
		}
		&__release-date {
			width: 85px;
		}
	}
</style>
