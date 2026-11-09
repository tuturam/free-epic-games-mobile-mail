<script setup lang="ts">
import { PhBellRinging } from '@phosphor-icons/vue'
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/8 bg-background/80 backdrop-blur-md">
    <div class="flex items-center justify-between h-16 px-4 sm:px-8 gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <a class="flex items-center gap-2 group focus:outline-none tech-mono font-extrabold text-xs sm:text-sm md:text-base tracking-tight truncate text-white" href="#">
          <span class="truncate">EpicGamesMobileFreeMail</span>
        </a>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <Button
          as-child
          class="h-auto py-1.5 px-2.5 sm:px-3.5 rounded border border-accent/40 bg-accent/10 text-primary tech-mono text-xs font-semibold tracking-wide hover:bg-accent/20 hover:text-primary hover:border-accent shrink-0"
        >
          <a href="#subscribe-section" class="flex items-center gap-1.5">
            <PhBellRinging class="size-3.5 shrink-0" weight="bold" />
            <span class="font-bold">GET ALERTS</span>
          </a>
        </Button>
      </div>
    </div>

    <span class="crosshair-corner bottom-left" />
    <span class="crosshair-corner bottom-right" />
  </header>
</template>
