<script lang="ts" setup>
	import { Icon } from '@iconify/vue';
</script>

<template>
	<footer class="footer">
		<ul class="footer__column">
			<li class="footer__column__item--title">Liens utiles</li>

			<li class="footer__column__item">
				<NuxtLink to="/"> Accueil </NuxtLink>
			</li>

			<li class="footer__column__item">
				<NuxtLink to="/"> A propos </NuxtLink>
			</li>
		</ul>

		<ul class="footer__column">
			<li class="footer__column__item--title">Me retrouver</li>

			<li class="footer__column__item">
				<NuxtLink to="https://baned.me" target="_blank">
					<Icon icon="lucide:globe" width="14px" />
					Portfolio
				</NuxtLink>
			</li>

			<li class="footer__column__item">
				<NuxtLink to="https://github.com/banedPowell" target="_blank">
					<Icon icon="mdi:github" width="14px" />
					GitHub
				</NuxtLink>
			</li>

			<li class="footer__column__item">
				<NuxtLink to="mailto:contact@baned.me" target="_blank">
					<Icon icon="mdi:email" width="14px" />
					contact@baned.me
				</NuxtLink>
			</li>

			<li class="footer__column__item">
				<NuxtLink to="https://bento.me/banedPowell" target="_blank">
					<Icon icon="simple-icons:bento" width="14px" />
					Bento.me
				</NuxtLink>
			</li>

			<li class="footer__column__item">
				<NuxtLink
					to="https://www.linkedin.com/in/rub%C3%A9ndc/"
					target="_blank"
				>
					<Icon icon="mdi:linkedin" width="14px" />
					LinkedIn
				</NuxtLink>
			</li>
		</ul>

		<ul class="footer__column">
			<li class="footer__column__item--title">Sur ce projet</li>

			<li class="footer__column__item">
				<NuxtLink
					to="https://github.com/banedPowell/deezerstats"
					target="_blank"
				>
					<Icon icon="mdi:github" width="14px" />
					Repository GitHub
				</NuxtLink>
			</li>

			<li class="footer__column__item">
				<NuxtLink to="https://developers.deezer.com/" target="_blank">
					<Icon icon="cbi:deezer-logo" width="14px" />
					API Deezer
				</NuxtLink>
			</li>

			<li class="footer__column__item">
				<Icon icon="simple-icons:nuxt" width="14px" />
				Nuxt 3
			</li>

			<li class="footer__column__item">
				<Icon icon="unjs:nitro" width="14px" />
				Nitro
			</li>

			<li class="footer__column__item">
				<Icon icon="simple-icons:typescript" width="14px" />
				TypeScript
			</li>

			<li class="footer__column__item">
				<Icon icon="simple-icons:supabase" width="14px" />
				Supabase
			</li>

			<li class="footer__column__item">
				<Icon icon="simple-icons:tailwindcss" width="14px" />
				Tailwind CSS
			</li>
		</ul>
	</footer>
</template>

<style lang="scss" scoped>
	@use 'assets/styles/screen' as screen;

	.footer {
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: start;
		flex-wrap: wrap;
		gap: 90px;

		width: 100%;

		margin-top: 250px;
		padding: 50px;

		border-top: 1px solid $strokes;
		font-size: 1.4rem;

		&__column {
			display: flex;
			flex-direction: column;
			gap: 15px;

			&__item {
				display: flex;
				align-items: center;
				gap: 8px;

				color: $details;

				a {
					display: flex;
					align-items: center;
					gap: 8px;

					color: $details;

					&:hover {
						color: $primary;
					}
				}

				&--title {
					color: $text;
				}
			}
		}
	}
</style>
