<script setup lang="ts">
import { PhArrowRight, PhLock, PhQuestion, PhShieldCheck } from '@phosphor-icons/vue'
import type { EpicFeedResponse } from '../../shared/types/epic'

// Fetch the live Epic feed on every load (server-cached for 60s) and refresh
// it every 60s to match the "Refresh: 60 seconds" data-stream contract.
const { data, refresh } = await useFetch<EpicFeedResponse>('/api/epic/free-games')

const games = computed(() => data.value?.games ?? [])
const activeGame = computed(() => games.value[0] ?? null)
const extraCount = computed(() => Math.max(0, games.value.length - 1))
const upcomingGame = computed(() => data.value?.upcoming ?? null)
const region = computed(() => data.value?.country ?? 'US')

// The Epic API only returns dates (discountEndDate / purchaseStateEffectiveDate),
// never a countdown value — so the countdown is computed client-side and ticked
// every second. Rendered only after mount to avoid SSR hydration mismatches.
const ready = ref(false)
const nowMs = ref(Date.now())
let tickTimer: ReturnType<typeof setInterval> | undefined
let pollTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  ready.value = true
  nowMs.value = Date.now()
  tickTimer = setInterval(() => {
    nowMs.value = Date.now()
  }, 1000)
  pollTimer = setInterval(() => {
    refresh()
  }, 60_000)
})

onUnmounted(() => {
  if (tickTimer) clearInterval(tickTimer)
  if (pollTimer) clearInterval(pollTimer)
})

function pad(value: number): string {
  return String(Math.max(0, Math.floor(value))).padStart(2, '0')
}

function formatClaimCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  return `${pad(total / 3600)}H : ${pad((total % 3600) / 60)}M : ${pad(total % 60)}S`
}

function formatVaultCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  return `${pad(total / 86400)}D : ${pad((total % 86400) / 3600)}H : ${pad((total % 3600) / 60)}M`
}

// Same format as broadcast-template.ts formatDate() so the preview matches
// the real email ("ENDS: Wed, Oct 29, 2025 UTC").
function formatEndDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function formatSyncTime(iso: string): string {
  return `${new Date(iso).toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' })} UTC`
}

const timeLeft = computed(() => {
  if (!ready.value || !activeGame.value) return '--H : --M : --S'
  return formatClaimCountdown(new Date(activeGame.value.endDate).getTime() - nowMs.value)
})

const vaultOpens = computed(() => {
  if (!ready.value || !upcomingGame.value) return '--D : --H : --M'
  return formatVaultCountdown(new Date(upcomingGame.value.startDate).getTime() - nowMs.value)
})

const endsDate = computed(() => (activeGame.value ? formatEndDate(activeGame.value.endDate) : '—'))

// Mirrors the subject built in server/api/resend/create-broadcast.post.ts.
const broadcastSubject = computed(() => {
  const titles = games.value.map((g) => g.title).join(' & ')
  if (!titles) return '[FREE DROP] —'
  return `[FREE DROP] ${titles} ${games.value.length > 1 ? 'are' : 'is'} now FREE!`
})

const syncLabel = computed(() => (data.value?.fetchedAt ? formatSyncTime(data.value.fetchedAt) : '—'))
</script>

<template>
  <section class="relative px-6 sm:px-10 py-12">
    <div class="relative grid grid-cols-1 gap-5 md:grid-cols-3">
      <!-- CARD 1: Active Claim Radar -->
      <Card class="group flex flex-col justify-between gap-0 rounded border-white/10 bg-surface/70 p-5 transition-colors hover:border-white/20">
        <span class="crosshair-corner top-left" />
        <span class="crosshair-corner top-right" />
        <span class="crosshair-corner bottom-left" />
        <span class="crosshair-corner bottom-right" />

        <CardHeader class="flex items-center justify-between border-b border-white/6 p-0 pb-3">
          <CardTitle class="text-[11px] font-normal font-mono uppercase tracking-normal text-muted-foreground">
            ACTIVE CLAIM RADAR
          </CardTitle>
          <Badge v-if="activeGame" class="animate-pulse rounded border border-accent/20 bg-accent/10 px-2 py-0.5 tech-mono text-[10px] font-bold text-primary">
            CLAIMABLE NOW
          </Badge>
          <Badge v-else variant="outline" class="rounded border-white/10 bg-white/5 px-2 py-0.5 tech-mono text-[10px] text-muted-foreground">
            NO ACTIVE DROP
          </Badge>
        </CardHeader>

        <CardContent class="p-0 pt-4">
          <div class="space-y-1">
            <div class="tech-mono text-xs text-muted-foreground">GAME TITLE:</div>
            <div class="flex items-center justify-between gap-2 text-base font-bold text-white transition-colors group-hover:text-primary">
              <span>{{ activeGame?.title ?? 'AWAITING NEXT DROP' }}</span>
              <span v-if="activeGame" class="tech-mono text-xs whitespace-nowrap">
                <span v-if="activeGame.originalPrice" class="text-muted-foreground line-through">{{ activeGame.originalPrice }}</span>
                <span class="font-semibold text-primary">FREE</span>
              </span>
            </div>
          </div>

          <div class="mt-4 space-y-1.5 rounded border border-white/6 bg-surface-container-lowest p-2.5 tech-mono text-xs">
            <div class="flex justify-between text-[11px] text-muted-foreground">
              <span>Platform:</span>
              <span class="text-white">Android &amp; iOS ({{ region }})</span>
            </div>
            <div class="flex justify-between text-[11px] text-muted-foreground">
              <span>Ends:</span>
              <span class="text-white">{{ endsDate }} UTC</span>
            </div>
            <div class="flex justify-between text-[11px] text-muted-foreground">
              <span>Time Left:</span>
              <span class="font-semibold text-primary">{{ timeLeft }}</span>
            </div>
          </div>

          <div v-if="extraCount > 0" class="mt-2 tech-mono text-[10px] text-muted-foreground">
            +{{ extraCount }} MORE CLAIMABLE IN FEED
          </div>
        </CardContent>

        <CardFooter class="tech-mono mt-5 flex-row items-center justify-between border-t border-white/6 p-0 pt-3 text-[11px]">
          <span class="text-muted-foreground">STORE: EPIC GAMES APP</span>
          <a
            v-if="activeGame"
            :href="activeGame.url"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-0.5 font-semibold text-primary"
          >
            AVAILABLE <PhArrowRight class="size-3" weight="bold" />
          </a>
          <span v-else class="text-muted-foreground">STANDBY</span>
        </CardFooter>
      </Card>

      <!-- CARD 2: Email Dispatch Simulation Terminal -->
      <Card class="flex flex-col justify-between gap-0 rounded border-white/10 bg-surface/70 p-5 transition-colors hover:border-white/20">
        <span class="crosshair-corner top-left" />
        <span class="crosshair-corner top-right" />
        <span class="crosshair-corner bottom-left" />
        <span class="crosshair-corner bottom-right" />

        <CardHeader class="flex items-center justify-between border-b border-white/6 p-0 pb-3">
          <CardTitle class="text-[11px] font-normal font-mono uppercase tracking-normal text-muted-foreground">
            [02 // DISPATCH LOG]
          </CardTitle>
          <CardDescription class="tech-mono text-[10px] text-white/40">
            NOTIFICATION PREVIEW
          </CardDescription>
        </CardHeader>

        <CardContent class="p-0 pt-4">
          <div class="space-y-2 rounded border border-white/6 bg-surface-container-lowest p-3 tech-mono text-xs">
            <div class="flex items-center justify-between border-b border-white/6 pb-1.5 text-[11px] text-muted-foreground">
              <span>TO: &lt;subscriber@inbox&gt;</span>
              <span class="text-primary">{{ activeGame ? 'DISPATCHED' : 'STANDBY' }}</span>
            </div>
            <div class="text-[11px] leading-snug text-white">
              <span class="font-bold text-primary">SUBJ:</span>
              {{ broadcastSubject }}
            </div>
            <div class="text-[10px] leading-relaxed text-muted-foreground">
              Claim directly from the Epic Games app before the drop ends.
            </div>
            <div class="flex justify-between text-[10px] text-muted-foreground">
              <span>
                PRICE:
                <template v-if="activeGame">
                  <span class="line-through">{{ activeGame.originalPrice }}</span>
                  <span class="font-bold text-primary"> FREE</span>
                </template>
                <span v-else>—</span>
              </span>
              <span>ENDS: {{ endsDate }} UTC</span>
            </div>
            <div class="pt-1">
              <a
                v-if="activeGame"
                :href="activeGame.url"
                target="_blank"
                rel="noopener"
                class="block rounded border border-accent/30 bg-accent/10 py-1 text-center tech-mono text-[10px] font-bold text-primary"
              >
                [ CLAIM ]
              </a>
              <div v-else class="rounded border border-white/10 bg-white/5 py-1 text-center tech-mono text-[10px] text-muted-foreground">
                [ CLAIM ]
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

        <CardHeader class="flex items-center justify-between border-b border-white/6 p-0 pb-3">
          <CardTitle class="text-[11px] font-normal font-mono uppercase tracking-normal text-muted-foreground">
            VAULT COUNTDOWN
          </CardTitle>
          <Badge variant="outline" class="gap-1 rounded border-white/10 bg-white/5 px-2 py-0.5 tech-mono text-[10px] text-muted-foreground">
            <PhLock class="size-2.5" weight="bold" /> LOCKED
          </Badge>
        </CardHeader>

        <CardContent class="p-0 pt-4">
          <div class="space-y-1">
            <div class="tech-mono text-xs text-muted-foreground">UPCOMING DROP:</div>
            <div class="flex items-center gap-2 text-base font-bold text-white">
              <PhQuestion class="size-4 text-primary" weight="bold" />
              <span>{{ upcomingGame?.title ?? 'Epic Mystery Vault' }}</span>
            </div>
          </div>

          <div class="mt-4 rounded border border-white/6 bg-surface-container-lowest p-3 text-center tech-mono">
            <div class="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Opens In:</div>
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
        <span>Feed: Epic Games Mobile Store API</span>
        <span class="hidden text-white/20 sm:inline">|</span>
        <span class="hidden sm:inline">Refresh: 60 seconds</span>
        <span class="hidden text-white/20 sm:inline">|</span>
        <span class="hidden sm:inline">Last sync: {{ syncLabel }}</span>
      </div>
      <div class="flex items-center gap-2 text-primary">
        <PhShieldCheck class="size-3.5" weight="bold" />
        <span>100% Phishing-Free &amp; No Unofficial Links</span>
      </div>
    </div>
  </section>
</template>
