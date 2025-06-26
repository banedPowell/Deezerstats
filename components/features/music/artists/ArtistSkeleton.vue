<script setup lang="ts"></script>

<template>
	<li class="artist">
		<div class="artist__illustration" />
		<p class="artist__name"></p>
		<div class="artist__stats"></div>
	</li>
</template>

<style lang="scss" scoped>
	@use 'sass:color';

	.artist {
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

			border-radius: 100%;
			animation: pulse 2s infinite;
		}

		&__name {
			height: 1.9rem;
			width: 100%;

			border-radius: 5px;
			animation: pulse 2s infinite;
		}

		&__stats {
			height: 1.2rem;
			width: 100%;

			border-radius: 5px;
			animation: pulse 2s infinite;
		}
		&__name {
			width: 63px;
		}
	}
</style>
