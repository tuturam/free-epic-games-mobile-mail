<script setup lang="ts">
import { PhBolt } from '@phosphor-icons/vue'

const links = [
  { label: 'Privasi', href: '#' },
  { label: 'Ketentuan', href: '#' },
  { label: 'Discord Bot', href: '#' },
  { label: 'Unsubscribe', href: '#' },
]
</script>

<template>
  <footer class="relative border-t border-white/8 bg-surface/80">
    <span class="crosshair-corner top-left" />
    <span class="crosshair-corner top-right" />

    <div class="flex flex-col items-center justify-between gap-4 px-6 py-6 tech-mono text-xs text-muted-foreground sm:px-8 md:flex-row">
      <div class="flex flex-col items-center gap-3 sm:flex-row">
        <span class="flex items-center gap-1.5 font-bold text-white">
          <PhBolt class="size-3.5 text-primary" weight="fill" />
          LOOTDROP MOBILE
        </span>
        <span class="hidden text-white/20 sm:inline">|</span>
        <span>© 2025 LOOTDROP Alert Hub. Tidak berafiliasi dengan Epic Games, Inc.</span>
      </div>
      <div class="flex items-center gap-4">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          class="transition-colors hover:text-primary"
        >{{ link.label }}</a>
      </div>
    </div>
  </footer>
</template>

