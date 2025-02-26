<script setup lang="ts">
	const props = defineProps<{
		type: 'primary' | 'secondary';
	}>();
</script>

<template>
	<div :class="`button button--${props.type}`">
		<p class="button__text">
			<slot>Bouton</slot>
		</p>
	</div>
</template>

<style scoped lang="scss">
	.button {
		padding: 10px 20px;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		width: fit-content;
		color: $text;
		box-sizing: border-box;

		&__text {
			font-family: 'Inter', sans-serif;
			font-size: 1.2rem;
			font-weight: bold;
		}

		&--primary {
			background-color: $primary;
			border: none;
		}

		&--secondary {
			box-sizing: border-box;
			-moz-box-sizing: border-box;
			-webkit-box-sizing: border-box;

			background-color: $bg;
			border: 2px solid $strokes;
		}
	}
</style>
