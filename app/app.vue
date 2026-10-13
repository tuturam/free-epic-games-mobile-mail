<template>
  <div>
    <div class="fixed inset-0 bg-grid-pattern pointer-events-none -z-20 opacity-70"/>
    </div>
</template>

<style lang="css" scoped>
    /* Blueprint & Grid Styling (Cloudflare/Linear style) */
    .bg-grid-pattern {
      background-size: 32px 32px;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
    }
</style>
