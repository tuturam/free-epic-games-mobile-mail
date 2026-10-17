import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    apiKeyResend: process.env.RESEND_API_KEY
  },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  vite: {
    optimizeDeps: {
      include: [
        '@phosphor-icons/vue',
        '@vueuse/core',
        'class-variance-authority',
        'cn',
        'reka-ui',
      ],
    },
  },
  shadcn: {
    /**
      * Prefix for all the imported component.
      * @default "Ui"
      */
    prefix: '',
    /**
      * Directory that the component lives in.
      * Will respect the Nuxt aliases.
      * @link https://nuxt.com/docs/api/nuxt-config#alias
      * @default "@/components/ui"
      */
    componentDir: '@/components/ui'
  }
})
