// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },

	runtimeConfig: {
		jwtSecret: process.env.JWT_SECRET,
		supabaseUrl: process.env.SUPABASE_URL,
		supabaseKey: process.env.SUPABASE_KEY,
	},

	modules: [
		'@pinia/nuxt',
		'@nuxt/image',
		'@nuxt/icon',
		'@nuxt/fonts',
		'@nuxtjs/supabase',
	],

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
