// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // Modo SPA para empacotamento estático no Capacitor (Android/iOS)
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss'
  ],
  primevue: {
    options: {
      unstyled: true
    }
  },
  app: {
    head: {
      title: 'THE WAY COLLECTIVE',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { charset: 'utf-8' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Courier+Prime:wght@400;700&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1' }
      ]
    }
  },
  css: [
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'https://theawaycollectiveapi.onrender.com'
    }
  }
})
