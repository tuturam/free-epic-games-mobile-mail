<script setup lang="ts">
import { PhBellRinging, PhLightning } from '@phosphor-icons/vue'
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/8 bg-background/80 backdrop-blur-md">
    <div class="flex items-center justify-between h-16 px-6 sm:px-8">
      <div class="flex items-center gap-4">
        <a class="flex items-center gap-2 group focus:outline-none" href="#">
          <div class="flex size-7 items-center justify-center rounded border border-accent/40 bg-accent/10 text-primary transition-colors group-hover:border-accent">
            <PhLightning class="size-4" weight="bold" />
          </div>
          <span class="tech-mono text-sm sm:text-base font-bold tracking-wider text-white">
            LOOTDROP<span class="text-primary font-normal">.io</span>
          </span>
        </a>
        <div class="hidden sm:flex items-center gap-2 pl-4 border-l border-white/8">
          <span class="relative flex size-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span class="relative inline-flex rounded-full size-2 bg-primary" />
          </span>
          <span class="tech-mono text-[11px] tracking-widest text-muted-foreground font-medium uppercase">
            LIVE SYNC // ACTIVE
          </span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/8 bg-surface/80 text-[11px] tech-mono text-muted-foreground">
          <span class="text-primary">EPIC-STORE</span>: <span class="text-white">v1.4</span>
        </div>
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
