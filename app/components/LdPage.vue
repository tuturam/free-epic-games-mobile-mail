<script setup lang="ts">
</script>

<template>
  <div class="relative flex min-h-screen flex-col font-sans antialiased text-foreground">
    <div class="fixed inset-0 -z-20 bg-blueprint-grid opacity-70 pointer-events-none" />
    <div class="fixed top-0 left-1/2 h-145 w-300 -translate-x-1/2 -z-10 bg-radial-hero-glow pointer-events-none" />

    <div class="relative mx-auto flex w-full max-w-6xl flex-grow flex-col border-x border-white/8">
      <div class="pointer-events-none absolute bottom-0 -top-12 left-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
      <div class="pointer-events-none absolute bottom-0 -top-12 right-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />

      <LdHeader />

      <main class="flex flex-grow flex-col">
        <LdHero />
        <LdTelemetry />
      </main>

      <LdFooter />
    </div>
  </div>
</template>
