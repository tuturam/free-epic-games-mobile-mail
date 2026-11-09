<script setup lang="ts">
import { PhEnvelopeSimple, PhSealCheck, PhWarningOctagon } from '@phosphor-icons/vue'
import {ref, computed} from 'vue';
import {Field, useForm, ErrorMessage} from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { isTesterEmailDomain } from '~~/shared/utils/email-validation';

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .email('Invalid email')
      .refine((val) => !isTesterEmailDomain(val), {
        message: 'Test or example email domains are not allowed.',
      }),
  }),
)

const { handleSubmit, resetForm, errors, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    email: '',
  },
})

const submitted = ref(false)
const loading = ref(false)
const submitError = ref('')
const submitMessage = ref('')
const submitStatus = ref<'new-subscriber' | 'already-subscribed' | ''>('')

const statusClass = computed(() => {
  if (submitted.value) {
    if (submitStatus.value === 'already-subscribed') {
      return 'border-teal-400/30 bg-teal-400/10 text-teal-300'
    }
    return 'border-accent/30 bg-accent/10 text-primary'
  }
  return 'border-red-500/30 bg-red-500/10 text-red-500'
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  submitError.value = ''
  try {
    const res = await $fetch<{
      success: boolean
      status?: 'new-subscriber' | 'already-subscribed'
      message?: string
    }>('/api/resend/create-contact', {
      method: 'POST',
      body: { email: values.email },
    })
    submitted.value = true
    submitStatus.value = res?.status || 'new-subscriber'
    submitMessage.value = res?.message || 'Email saved. Drop radar active for Android & iOS.'
    resetForm()
  } catch (err: any) {
    console.error('[LdHero] submit failed:', err)
    submitted.value = false
    submitStatus.value = ''
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
  <section class="relative flex flex-col items-center border-b border-white/8 px-4 sm:px-8 md:px-10 pt-12 sm:pt-16 pb-10 sm:pb-14 text-center">

    <h1 class="mb-5 max-w-4xl text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-white break-words">
      Never Miss Free Games from
      <span class="bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">Epic Games Mobile</span>
    </h1>

    <p class="mb-8 sm:mb-10 max-w-2xl text-xs sm:text-base leading-relaxed text-muted-foreground">
      Instant email notifications the moment free games go live on iOS &amp; Android. No spam, 100% legal, free forever.
    </p>

    <div id="subscribe-section" class="blueprint-box relative mx-auto w-full max-w-xl rounded-lg p-2 shadow-2xl backdrop-blur-md">
      <span class="crosshair-corner top-left" />
      <span class="crosshair-corner top-right" />
      <span class="crosshair-corner bottom-left" />
      <span class="crosshair-corner bottom-right" />

      <form class="flex flex-col items-stretch gap-2 sm:flex-row" @submit="onSubmit">
        <div class="relative flex-1">
          <PhEnvelopeSimple class="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground/70 pointer-events-none" weight="regular" />
          <Field
            name="email"
            type="email"
            :validate-on-blur="false"
            :validate-on-change="false"
            placeholder="you@domain.com"
            class="h-12 rounded bg-surface-container-lowest w-full pl-10 pr-4 sm:pl-11 sm:pr-14 tech-mono text-sm text-white"
          />
          <span class="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/4 px-1.5 py-0.5 tech-mono text-[10px] text-muted-foreground sm:inline-block pointer-events-none">
            ESC
          </span>
        </div>
        <Button
          type="submit"
          size="lg"
          :disabled="loading || !values.email?.length"
          class="h-12 rounded tech-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_24px_rgba(0,223,129,0.35)] hover:shadow-[0_0_28px_rgba(0,223,129,0.45)] sm:text-sm shrink-0"
        >
          {{ loading ? 'Sending...' : 'Get Free Alerts' }}
        </Button>
      </form>

      <div
        v-if="submitted || submitError || errors.email"
        class="mt-2 flex items-start sm:items-center justify-center gap-2 rounded border p-2.5 tech-mono text-xs text-left sm:text-center"
        :class="statusClass"
      >
        <template v-if="submitted">
          <PhSealCheck class="size-4 shrink-0 mt-0.5 sm:mt-0" weight="fill" />
          <span class="break-words min-w-0">Status: {{ submitMessage }}</span>
        </template>
        <template v-else-if="submitError">
          <PhWarningOctagon class="size-4 shrink-0 mt-0.5 sm:mt-0" weight="fill" />
          <span class="break-words min-w-0">{{ submitError }}</span>
        </template>
        <template v-else>
          <PhWarningOctagon class="size-4 shrink-0 mt-0.5 sm:mt-0" weight="fill" />
          <ErrorMessage name="email" as="span" class="break-words min-w-0" />
        </template>
      </div>
    </div>

    <div class="mt-8 grid w-full max-w-xl grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/8 rounded border border-white/8 bg-surface/40 text-center tech-mono text-xs text-muted-foreground">
      <div v-for="badge in trustBadges" :key="badge.label" class="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-2 sm:py-2.5">
        <span class="font-bold shrink-0" :class="badge.iconClass">{{ badge.icon }}</span>
        <span class="text-[11px] sm:text-xs">{{ badge.label }}</span>
      </div>
    </div>
  </section>
</template>
