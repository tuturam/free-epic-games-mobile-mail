import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    apiKeyResend: '',
    segmentIdResend: '',
    broadcastToken: '',
    fromEmailResend: ''
  },
  modules: ['shadcn-nuxt'],
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@phosphor-icons/vue',
        '@vue/devtools-core',
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
