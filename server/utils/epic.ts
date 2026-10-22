export interface EpicFreeGame {
  title: string
  description: string
  slug: string
  url: string
  imageUrl: string
  originalPrice: string
  endDate: string
}

interface EpicPromotion {
  startDate: string
  endDate: string
}

interface EpicElement {
  title: string
  description?: string
  urlSlug?: string | null
  productSlug?: string | null
  offerMappings?: { pageSlug?: string }[]
  keyImages?: { type: string; url: string }[]
  price?: {
    totalPrice?: {
      discountPrice?: number
      fmtPrice?: { originalPrice?: string }
    }
  }
  promotions?: {
    promotionalOffers?: { promotionalOffers?: EpicPromotion[] }[]
  }
}

interface EpicResponse {
  data: {
    Catalog: {
      searchStore: {
        elements: EpicElement[]
      }
    }
  }
}

export async function withRetry<T>(fn: () => Promise<T>, attempts = 2, delayMs = 2000): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      console.warn(`[epic] attempt ${i + 1}/${attempts} failed:`, error)
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }
  throw lastError
}

export async function fetchEpicFreeGames(country: string): Promise<EpicFreeGame[]> {
  const res = await withRetry(() =>
    $fetch<EpicResponse>('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions', {
      query: { locale: 'en', country, allowCountries: country },
      timeout: 10_000,
    }),
  )

  const now = Date.now()
  const games: EpicFreeGame[] = []

  for (const el of res.data.Catalog.searchStore.elements) {
    const offers = el.promotions?.promotionalOffers?.flatMap((o) => o.promotionalOffers ?? []) ?? []
    const active = offers.find(
      (o) => new Date(o.startDate).getTime() <= now && now < new Date(o.endDate).getTime(),
    )
    if (!active || el.price?.totalPrice?.discountPrice !== 0) continue

    const pageSlug = el.offerMappings?.[0]?.pageSlug || el.urlSlug || el.productSlug
    if (!pageSlug) continue

    const image =
      el.keyImages?.find((i) => i.type === 'OfferImageWide')?.url ||
      el.keyImages?.find((i) => i.type === 'DieselStoreFrontWide')?.url ||
      el.keyImages?.[0]?.url

    games.push({
      title: el.title,
      description: el.description ?? '',
      slug: pageSlug,
      url: `https://store.epicgames.com/en-US/p/${pageSlug}`,
      imageUrl: image ?? '',
      originalPrice: el.price.totalPrice.fmtPrice?.originalPrice ?? '',
      endDate: active.endDate,
    })
  }

  return games
}
