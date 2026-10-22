<script setup lang="ts">
import { PhLightning, PhEnvelopeSimple, PhSealCheck, PhWarningOctagon } from '@phosphor-icons/vue'
import {ref, computed} from 'vue';
import {Field, useForm, ErrorMessage} from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .email('Invalid email')
      .or(z.literal('')),
  }),
)

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: formSchema,
  initialValues: {
    email: '',
  },
})

const submitted = ref(false)
const loading = ref(false)
const submitError = ref('')

const statusClass = computed(() =>
  submitted.value
    ? 'border-accent/30 bg-accent/10 text-primary'
    : 'border-red-500/30 bg-red-500/10 text-red-500',
)

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  submitError.value = ''
  try {
    await $fetch('/api/resend/create-contact', {
      method: 'POST',
      body: { email: values.email },
    })
    submitted.value = true
    resetForm()
  } catch (err: any) {
    console.error('[LdHero] submit failed:', err)
    submitted.value = false
    submitError.value = err?.data?.message || 'Failed to save email. Try again.'
  } finally {
    loading.value = false
  }
})

const trustBadges = [
  { icon: '⚡', iconClass: 'text-primary', label: 'Alert < 2 Minutes' },
  { icon: '🛡️', iconClass: 'text-emerald-400', label: 'Anti-Spam (1-Klik)' },
  { icon: '🎮', iconClass: 'text-teal-400', label: 'Android & iOS' },
]
</script>

<template>
  <section class="relative flex flex-col items-center border-b border-white/8 px-6 sm:px-10 pt-16 pb-14 text-center">
    <Badge
      variant="outline"
      class="gap-2 px-3 py-1 rounded-full border-white/12 bg-surface/90 tech-mono text-[11px] text-muted-foreground shadow-sm"
    >
      <span class="size-1.5 rounded-full bg-primary animate-pulse" />
      <span class="font-semibold text-white">[ v1.4 LIVE FEED ]</span>
      <span class="text-white/20">|</span>
      <span class="tracking-wide text-primary">EPIC GAMES MOBILE DROP RADAR</span>
    </Badge>

    <h1 class="mb-5 max-w-4xl text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
      Never Miss a Free Games from
      <span class="bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">Epic Games Mobile</span>
    </h1>

    <p class="mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
      Instant email notifications the moment free games go live on iOS &amp; Android. No spam, 100% legal, free forever.
    </p>

    <div id="subscribe-section" class="blueprint-box relative mx-auto w-full max-w-xl rounded-lg p-2 shadow-2xl backdrop-blur-md">
      <span class="crosshair-corner top-left" />
      <span class="crosshair-corner top-right" />
      <span class="crosshair-corner bottom-left" />
      <span class="crosshair-corner bottom-right" />

      <form class="flex flex-col items-stretch gap-2 sm:flex-row" @submit="onSubmit">
        <div class="relative flex-1">
          <PhEnvelopeSimple class="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground/70" weight="regular" />
          <Field
            name="email"
            type="email"
            :validate-on-blur="false"
            placeholder="email@example.com"
            class="h-12 rounded border-white/8 bg-surface-container-lowest pl-12 pr-32 tech-mono text-sm text-white focus-visible:ring-primary/50"
          />
          <span class="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/4 px-1.5 py-0.5 tech-mono text-[10px] text-muted-foreground sm:inline-block">
            ESC
          </span>
        </div>
        <Button
          type="submit"
          size="lg"
          :disabled="loading"
          class="h-12 rounded tech-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_24px_rgba(0,223,129,0.35)] hover:shadow-[0_0_28px_rgba(0,223,129,0.45)] sm:text-sm"
        >
          <PhLightning class="size-4" weight="bold" />
          {{ loading ? 'Sending...' : 'Get Free Alerts' }}
        </Button>
      </form>

      <div
        v-if="submitted || submitError || errors.email"
        class="mt-2 flex items-center justify-center gap-2 rounded border p-2.5 tech-mono text-xs"
        :class="statusClass"
      >
        <template v-if="submitted">
          <PhSealCheck class="size-3.5 shrink-0" weight="fill" />
          <span>Status: Email saved. Drop radar active for Android &amp; iOS.</span>
        </template>
        <template v-else-if="submitError">
          <PhWarningOctagon class="size-3.5 shrink-0" weight="fill" />
          <span>{{ submitError }}</span>
        </template>
        <template v-else>
          <PhWarningOctagon class="size-3.5 shrink-0" weight="fill" />
          <ErrorMessage name="email" as="span" />
        </template>
      </div>
    </div>

    <div class="mt-8 grid w-full max-w-xl grid-cols-3 divide-x divide-white/8 rounded border border-white/8 bg-surface/40 text-center tech-mono text-xs text-muted-foreground">
      <div v-for="badge in trustBadges" :key="badge.label" class="flex items-center justify-center gap-1.5 px-2 py-2.5">
        <span class="font-bold" :class="badge.iconClass">{{ badge.icon }}</span>
        <span class="text-[11px] sm:text-xs">{{ badge.label }}</span>
      </div>
    </div>
  </section>
</template>
