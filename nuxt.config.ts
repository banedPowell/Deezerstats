// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },

	runtimeConfig: {
		supabaseUrl: process.env.SUPABASE_URL,
		supabaseKey: process.env.SUPABASE_KEY,
		supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
	},

	modules: [
		'@pinia/nuxt',
		'@nuxtjs/supabase',
		'@nuxt/image',
		'@nuxt/fonts',
		'@nuxthub/core',
	],

	routeRules: {
		'/dashboard/**': {
			ssr: false,
		},
	},

	supabase: {
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,

		redirectOptions: {
			login: '/auth/login',
			callback: '/auth/index',
			include: ['/dashboard', '/dashboard/**'],
			exclude: ['/', '/auth/**'],
			saveRedirectToCookie: false,
		},
	},

	fonts: {
		defaults: {
			weights: [300, 400, 500, 600],
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
});
