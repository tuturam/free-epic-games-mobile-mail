<script setup lang="ts">
import { PhBellRinging, PhLightning } from '@phosphor-icons/vue'
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/8 bg-background/80 backdrop-blur-md">
    <div class="flex items-center justify-between h-16 px-6 sm:px-8">
      <div class="flex items-center gap-4">
        <a class="flex items-center gap-2 group focus:outline-none tech-mono font-extrabold" href="#">
            EpicGamesMobileFreeMail
        </a>
      </div>

      <div class="flex items-center gap-3">
        <Button
          as-child
          class="h-auto py-1.5 px-3.5 rounded border border-accent/40 bg-accent/10 text-primary tech-mono text-xs font-semibold tracking-wide hover:bg-accent/20 hover:text-primary hover:border-accent"
        >
          <a href="#subscribe-section">
            <PhBellRinging class="size-3.5" weight="bold" />
            <span class="font-bold">GET ALERTS</span>
          </a>
        </Button>
      </div>
    </div>

    <span class="crosshair-corner bottom-left" />
    <span class="crosshair-corner bottom-right" />
  </header>
</template>
