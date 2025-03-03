<script lang="ts" setup>
	const props = defineProps<{
		type: 'primary' | 'secondary';
		size: 'large' | 'small';
		disabled?: boolean;
		danger?: boolean;
	}>();
</script>

<template>
	<div
		:class="`button button--${props.type} button--${props.size} ${disabled ? 'button--disabled' : 'button--enabled'} ${danger ? 'button--danger' : ''}`"
	>
		<p class="button__text">
			<slot>Bouton</slot>
		</p>
	</div>
</template>

<style lang="scss" scoped>
	.button {
		display: flex;
		justify-content: center;
		align-items: center;

		border: none;
		border-radius: 8px;

		padding: 12px 24px;
		width: fit-content;

		color: $text;
		cursor: pointer;
		user-select: none;

		&__text {
			font-family: 'Inter', sans-serif;
			font-size: 1.2rem;
			font-weight: 500;
		}

		&--large {
			padding: 16px 32px;
			border-radius: 12px;
			width: 100%;

			.button__text {
				font-size: 1.6rem;
			}
		}

		&--primary {
			background-color: $primary;
			border: none;
		}

		&--secondary {
			background-color: $bg;
			border: 1px solid $strokes;
		}

		&--disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&--danger {
			border: 1px solid $error;
			color: $error;

			&:hover {
				border: 1px dotted $error;
			}
		}
	}
</style>
