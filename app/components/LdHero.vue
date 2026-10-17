<script setup lang="ts">
import { PhBolt, PhEnvelopeSimple, PhSealCheck } from '@phosphor-icons/vue'
import type { BadgeVariants } from '~/components/ui/badge'
import { ref } from 'vue'

const email = ref('')
const submitted = ref(false)

function onSubmit() {
  submitted.value = true
}

const trustBadges = [
  { icon: '⚡', iconClass: 'text-primary', label: 'Alert < 2 Menit' },
  { icon: '🛡️', iconClass: 'text-emerald-400', label: 'Anti-Spam (1-Klik)' },
  { icon: '🎮', iconClass: 'text-teal-400', label: 'Android & iOS' },
]
</script>

<template>
  <section class="relative flex flex-col items-center border-b border-white/8 px-6 sm:px-10 pt-16 pb-14 text-center">
    <Badge
      variant="outline"
      class="gap-2 px-3 py-1 rounded-full border-white/12 bg-surface/90 tech-mono text-[11px] text-muted-foreground shadow-sm"
    >
      <span class="size-1.5 rounded-full bg-primary animate-pulse" />
      <span class="font-semibold text-white">[ v1.4 LIVE FEED ]</span>
      <span class="text-white/20">|</span>
      <span class="tracking-wide text-primary">EPIC GAMES MOBILE DROP RADAR</span>
    </Badge>

    <h1 class="mb-5 max-w-4xl text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
      Jangan Pernah Ketinggalan Game Gratis
      <span class="bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">Epic Games Mobile</span>
    </h1>

    <p class="mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
      Notifikasi email instan tepat saat vault terbuka di iOS &amp; Android. Tanpa spam, 100% legal, gratis selamanya.
    </p>

    <div id="subscribe-section" class="blueprint-box relative mx-auto w-full max-w-xl rounded-lg p-2 shadow-2xl backdrop-blur-md">
      <span class="crosshair-corner top-left" />
      <span class="crosshair-corner top-right" />
      <span class="crosshair-corner bottom-left" />
      <span class="crosshair-corner bottom-right" />

      <form class="flex flex-col items-stretch gap-2 sm:flex-row" @submit.prevent="onSubmit">
        <div class="relative flex-1">
          <PhEnvelopeSimple class="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground/70" weight="regular" />
          <Input
            v-model="email"
            type="email"
            required
            placeholder="nama@email.com"
            class="h-12 rounded border-white/8 bg-surface-container-lowest pl-11 pr-14 tech-mono text-sm text-white focus-visible:ring-primary/50"
          />
          <span class="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/4 px-1.5 py-0.5 tech-mono text-[10px] text-muted-foreground sm:inline-block">
            ESC
          </span>
        </div>
        <Button
          type="submit"
          size="lg"
          class="h-12 rounded tech-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_24px_rgba(0,223,129,0.35)] hover:shadow-[0_0_28px_rgba(0,223,129,0.45)] sm:text-sm"
        >
          <PhBolt class="size-4" weight="bold" />
          Dapatkan Alert Gratis
        </Button>
      </form>

      <div
        v-if="submitted"
        class="mt-2 flex items-center justify-center gap-2 rounded border border-accent/30 bg-accent/10 p-2.5 tech-mono text-xs text-primary"
      >
        <PhSealCheck class="size-3.5" weight="fill" />
        <span>Status: Email tersimpan. Radar drop aktif untuk Android &amp; iOS.</span>
      </div>
    </div>

    <div class="mt-8 grid w-full max-w-xl grid-cols-3 divide-x divide-white/8 rounded border border-white/8 bg-surface/40 text-center tech-mono text-xs text-muted-foreground">
      <div v-for="badge in trustBadges" :key="badge.label" class="flex items-center justify-center gap-1.5 px-2 py-2.5">
        <span class="font-bold" :class="badge.iconClass">{{ badge.icon }}</span>
        <span class="text-[11px] sm:text-xs">{{ badge.label }}</span>
      </div>
    </div>
  </section>
</template>
