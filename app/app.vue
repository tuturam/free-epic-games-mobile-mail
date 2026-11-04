<script setup lang="ts">
const siteName = 'EpicGamesMobileFreeMail'
const title = 'Free Epic Games Mobile Alerts by Email (iOS & Android)'
const description =
  'Get an instant email the moment free games go live on Epic Games Store mobile (iOS & Android). No spam, one-click unsubscribe, free forever.'

const siteUrl = (useRuntimeConfig().public.siteUrl as string).replace(/\/$/, '')

useHead({
  htmlAttrs: { lang: 'en' },
  title,
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
    ...(siteUrl ? [{ rel: 'canonical', href: `${siteUrl}/` }] : []),
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        description,
        inLanguage: 'en',
        ...(siteUrl ? { url: `${siteUrl}/` } : {}),
      }),
    },
  ],
})

useSeoMeta({
  title,
  description,
  robots: 'index, follow',
  themeColor: '#0b0f0d',
  ogType: 'website',
  ogSiteName: siteName,
  ogTitle: title,
  ogDescription: description,
  ogLocale: 'en_US',
  ogUrl: siteUrl ? `${siteUrl}/` : undefined,
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
})
</script>

<template>
  <LdPage />
</template>
