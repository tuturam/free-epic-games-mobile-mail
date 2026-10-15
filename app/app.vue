<template>
  <div>
    <div class="fixed inset-0 bg-grid-pattern pointer-events-none -z-20 opacity-70"/>
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-300 h-145 glow-conic-radial pointer-events-none -z-10"/>
  </div>
</template>

<style lang="css">
    /* Blueprint & Grid Styling (Cloudflare/Linear style) */
    .bg-grid-pattern {
      background-size: 32px 32px;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
    }
    .glow-conic-radial {
      background: radial-gradient(circle at 50% 15%, rgba(0, 223, 129, 0.14) 0%, rgba(0, 223, 129, 0.03) 40%, transparent 70%);
    }
</style>
