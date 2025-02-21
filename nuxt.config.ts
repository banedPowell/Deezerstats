// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    
    runtimeConfig: {
        jwtSecret: process.env.JWT_SECRET
    },

    modules: [
        '@nuxthub/core',
        '@pinia/nuxt'
    ],

    hub: {
        database: true,
    }
})