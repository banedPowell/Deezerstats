// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },

	runtimeConfig: {
		jwtSecret: process.env.JWT_SECRET,
	},

	modules: [
		'@nuxthub/core',
		'@pinia/nuxt',
		'@nuxt/image',
		'@nuxt/icon',
		'@nuxt/fonts',
	],

	fonts: {
		defaults: {
			weights: [300, 400],
			styles: ['normal', 'italic'],
		},
		families: [
			{
				name: 'League Gothic',
				provider: 'google',
			},

			{
				name: 'Inter',
				provider: 'google',
			},
		],
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "~/assets/styles/_colors.scss" as *;',
					api: 'modern-compiler',
				},
			},
		},
	},

	css: ['@/assets/styles/index.scss'],

	nitro: {
		experimental: {
			openAPI: true,
		},
	},

	hub: {
		database: true,
	},
});
