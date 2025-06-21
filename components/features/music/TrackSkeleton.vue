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

	@keyframes pulse {
		0% {
			background: #252525;
		}
		70% {
			background: #171717;
		}
		100% {
			background: #252525;
		}
	}
</style>
