<script setup lang="ts">
import { PhArrowRight, PhLock, PhQuestion, PhShieldCheck } from '@phosphor-icons/vue'

const leftNow = '03H : 14M : 28S'
const vaultOpens = '04D : 18H : 42M'
</script>

<template>
  <section class="relative px-6 sm:px-10 py-12">
    <div class="mb-6 flex items-center justify-between border-b border-white/6 pb-2">
      <div class="flex items-center gap-2">
        <span class="tech-mono text-xs font-bold text-primary">[01 // TELEMETRI RADAR]</span>
        <span class="tech-mono text-xs text-white/20">/</span>
        <span class="tech-mono text-xs text-muted-foreground">STATUS DROPS &amp; DISPATCH ENGINE</span>
      </div>
      <span class="hidden tech-mono text-[11px] text-muted-foreground sm:inline-block">
        SYS.STATUS: OK (LATENCY 18ms)
      </span>
    </div>

    <div class="relative grid grid-cols-1 gap-5 md:grid-cols-3">
      <!-- CARD 1: Active Claim Radar -->
      <Card class="group flex flex-col justify-between gap-0 rounded border-white/10 bg-surface/70 p-5 transition-colors hover:border-white/20">
        <span class="crosshair-corner top-left" />
        <span class="crosshair-corner top-right" />
        <span class="crosshair-corner bottom-left" />
        <span class="crosshair-corner bottom-right" />

        <CardHeader class="flex-row items-center justify-between border-b border-white/6 p-0 pb-3">
          <CardTitle class="text-[11px] font-normal font-mono uppercase tracking-normal text-muted-foreground">
            ACTIVE CLAIM RADAR
          </CardTitle>
          <Badge class="animate-pulse rounded border border-accent/20 bg-accent/10 px-2 py-0.5 tech-mono text-[10px] font-bold text-primary">
            CLAIMABLE NOW
          </Badge>
        </CardHeader>

        <CardContent class="p-0 pt-4">
          <div class="space-y-1">
            <div class="tech-mono text-xs text-muted-foreground">GAME TITLE:</div>
            <div class="flex items-center justify-between text-base font-bold text-white transition-colors group-hover:text-primary">
              <span>Fall Guys Mobile</span>
              <span class="tech-mono text-xs font-semibold text-primary">RP 0 (FREE)</span>
            </div>
          </div>

          <div class="mt-4 space-y-1.5 rounded border border-white/6 bg-surface-container-lowest p-2.5 tech-mono text-xs">
            <div class="flex justify-between text-[11px] text-muted-foreground">
              <span>Platform:</span>
              <span class="text-white">Android &amp; iOS (EU)</span>
            </div>
            <div class="flex justify-between text-[11px] text-muted-foreground">
              <span>Sisa Waktu:</span>
              <span class="font-semibold text-primary">{{ leftNow }}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter class="tech-mono mt-5 flex-row items-center justify-between border-t border-white/6 p-0 pt-3 text-[11px]">
          <span class="text-muted-foreground">STORE: EPIC GAMES APP</span>
          <span class="flex items-center gap-0.5 font-semibold text-primary">
            TERSEDIA <PhArrowRight class="size-3" weight="bold" />
          </span>
        </CardFooter>
      </Card>

      <!-- CARD 2: Email Dispatch Simulation Terminal -->
      <Card class="flex flex-col justify-between gap-0 rounded border-white/10 bg-surface/70 p-5 transition-colors hover:border-white/20">
        <span class="crosshair-corner top-left" />
        <span class="crosshair-corner top-right" />
        <span class="crosshair-corner bottom-left" />
        <span class="crosshair-corner bottom-right" />

        <CardHeader class="flex-row items-center justify-between border-b border-white/6 p-0 pb-3">
          <CardTitle class="text-[11px] font-normal font-mono uppercase tracking-normal text-muted-foreground">
            [02 // DISPATCH LOG]
          </CardTitle>
          <CardDescription class="tech-mono text-[10px] text-white/40">
            PREVIEW NOTIFIKASI
          </CardDescription>
        </CardHeader>

        <CardContent class="p-0 pt-4">
          <div class="space-y-2 rounded border border-white/6 bg-surface-container-lowest p-3 tech-mono text-xs">
            <div class="flex items-center justify-between border-b border-white/6 pb-1.5 text-[11px] text-muted-foreground">
              <span>TO: &lt;subscriber@inbox&gt;</span>
              <span class="text-primary">DISPATCHED</span>
            </div>
            <div class="text-[11px] leading-snug text-white">
              <span class="font-bold text-primary">SUBJ:</span>
              [FREE DROP] Fall Guys Mobile is now available!
            </div>
            <div class="text-[10px] leading-relaxed text-muted-foreground">
              Vault dibuka pada 22:00 WIB. Klik langsung tautan resmi untuk menambahkan ke library tanpa membuka PC.
            </div>
            <div class="pt-1">
              <div class="rounded border border-accent/30 bg-accent/10 py-1 text-center tech-mono text-[10px] font-bold text-primary">
                [ CLAIM ON MOBILE VIA 1-CLICK ]
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter class="tech-mono mt-5 flex-row items-center justify-between border-t border-white/6 p-0 pt-3 text-[11px] text-muted-foreground">
          <span>DELIVERY PROTOCOL</span>
          <span class="text-white">SMTP FAST-RELAY</span>
        </CardFooter>
      </Card>

      <!-- CARD 3: Upcoming Secret Vault -->
      <Card class="flex flex-col justify-between gap-0 rounded border-white/10 bg-surface/70 p-5 transition-colors hover:border-white/20">
        <span class="crosshair-corner top-left" />
        <span class="crosshair-corner top-right" />
        <span class="crosshair-corner bottom-left" />
        <span class="crosshair-corner bottom-right" />

        <CardHeader class="flex-row items-center justify-between border-b border-white/6 p-0 pb-3">
          <CardTitle class="text-[11px] font-normal font-mono uppercase tracking-normal text-muted-foreground">
            VAULT COUNTDOWN
          </CardTitle>
          <Badge variant="outline" class="gap-1 rounded border-white/10 bg-white/5 px-2 py-0.5 tech-mono text-[10px] text-muted-foreground">
            <PhLock class="size-2.5" weight="bold" /> LOCKED
          </Badge>
        </CardHeader>

        <CardContent class="p-0 pt-4">
          <div class="space-y-1">
            <div class="tech-mono text-xs text-muted-foreground">MYSTERY DROP #42:</div>
            <div class="flex items-center gap-2 text-base font-bold text-white">
              <PhQuestion class="size-4 text-primary" weight="bold" />
              <span>Epic Mystery Vault</span>
            </div>
          </div>

          <div class="mt-4 rounded border border-white/6 bg-surface-container-lowest p-3 text-center tech-mono">
            <div class="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Terbuka Dalam:</div>
            <div class="text-lg font-bold tracking-widest text-primary">{{ vaultOpens }}</div>
          </div>
        </CardContent>

        <CardFooter class="tech-mono mt-5 flex-row items-center justify-between border-t border-white/6 p-0 pt-3 text-[11px]">
          <span class="text-muted-foreground">AUTO-ALERT</span>
          <span class="font-semibold text-primary">STANDBY (ENABLED)</span>
        </CardFooter>
      </Card>
    </div>

    <div class="mt-5 flex flex-wrap items-center justify-between gap-3 rounded border border-white/8 bg-surface/30 p-3 tech-mono text-[11px] text-muted-foreground">
      <div class="flex items-center gap-3">
        <span class="font-medium text-white">[DATA STREAM]</span>
        <span>Feed: RSS / Epic Games Mobile Store API</span>
        <span class="hidden text-white/20 sm:inline">|</span>
        <span class="hidden sm:inline">Refresh: 60 detik</span>
      </div>
      <div class="flex items-center gap-2 text-primary">
        <PhShieldCheck class="size-3.5" weight="bold" />
        <span>100% Bebas Phishing &amp; Tautan Tidak Resmi</span>
      </div>
    </div>
  </section>
</template>
