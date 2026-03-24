// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  runtimeConfig: {
    public: {
      apiBase: '',
    },
  },

  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'https://backend.test',
          changeOrigin: true,
          secure: false,
        },
        '/sanctum': {
          target: 'https://backend.test',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
})
