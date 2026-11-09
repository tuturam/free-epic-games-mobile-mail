<script setup lang="ts">

const links = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Discord Bot', href: '#' },
  { label: 'Unsubscribe', href: '#' },
]
</script>

<template>
  <footer class="relative border-t border-white/8 bg-surface/80">
    <span class="crosshair-corner top-left" />
    <span class="crosshair-corner top-right" />

    <div class="flex flex-col items-center justify-between gap-4 px-4 py-6 tech-mono text-xs text-muted-foreground sm:px-8 md:flex-row">
      <div class="flex flex-col items-center gap-2 sm:gap-3 text-center sm:text-left md:flex-row">
        <span class="flex items-center gap-1.5 font-bold text-white">
          EpicGamesMobileFreeMail
        </span>
        <span class="hidden text-white/20 md:inline">|</span>
        <span class="text-[11px] sm:text-xs">© 2025 EpicGamesMobileFreeMail Alert Hub. Not affiliated with Epic Games, Inc.</span>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
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
