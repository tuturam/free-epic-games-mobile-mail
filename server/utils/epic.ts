import type { EpicFreeGame, EpicShowcase, EpicUpcomingGame } from '../../shared/types/epic'

interface EpicMediaImage {
  imageSrc: string
  altText: string
  imageType: string
  width: number
  height: number
}

interface EpicDiscount {
  discountAmountDisplay: string
  originalPriceDisplay: string
  discountEndDate: string
}

interface EpicPurchaseEntry {
  offerLifecycleState?: string
  price?: {
    currencyCode: string
    decimalPrice: number
  }
  priceDisplay?: string
  purchasePayload?: {
    offerId: string
    sandboxId: string
  }
  purchaseStateEffectiveDate: string
  purchaseType: string
  discount?: EpicDiscount
}

interface EpicOfferContent {
  catalogItemId: string
  categories: string[]
  mapping: {
    slug: string
  }
  media: Record<string, EpicMediaImage>
  purchase: EpicPurchaseEntry[]
  title: string
}

interface EpicOffer {
  content: EpicOfferContent
  offerId: string
  sandboxId: string
}

interface EpicDiscoverModule {
  offers: EpicOffer[]
  size: string
  topicId: string
  type: string
  link: {
    linkText: string
    src: string
  }
  title: string
}

interface EpicDiscoverResponse {
  __typename: string
  data: EpicDiscoverModule[]
  paging: {
    count: number
    start: number
    total: number
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

export async function fetchEpicShowcase(country = 'US'): Promise<EpicShowcase> {
  const res = await withRetry(
    () =>
      $fetch<EpicDiscoverResponse>(
        'https://egs-platform-service.store.epicgames.com/api/v2/public/discover/home',
        {
          query: {
            count: 10,
            country,
            locale: 'en-US',
            platform: 'android',
            start: 0,
            store: 'EGS',
          },
          headers: {
            'User-Agent': 'UEGameRequest/1.0 epicgames',
            Accept: 'application/json',
          },
          timeout: 20_000,
        },
      ),
    4,
    5000,
  )

  const now = Date.now()
  const games: EpicFreeGame[] = []
  const upcomingOffers: EpicUpcomingGame[] = []

  const freeGameModule = res.data.find((m) => m.type === 'freeGame')
  if (!freeGameModule) return { games, upcoming: null, nextRotationAt: null }

  for (const offer of freeGameModule.offers) {
    const content = offer.content
    const purchases = content.purchase ?? []

    const slug = content.mapping.slug
    if (!slug) continue

    const image = content.media?.card16x9?.imageSrc || content.media?.coverImage?.imageSrc || ''
    const url = `https://store.epicgames.com/en-US/p/${slug}`

    const claim = purchases.find(
      (p) =>
        p.purchaseType === 'Claim' &&
        p.price?.decimalPrice === 0 &&
        new Date(p.purchaseStateEffectiveDate).getTime() <= now,
    )

    if (claim) {
      const claimIndex = purchases.indexOf(claim)
      const nextPurchase = purchases
        .slice(claimIndex + 1)
        .find((p) => new Date(p.purchaseStateEffectiveDate).getTime() > now)
      const endDate = claim.discount?.discountEndDate ?? nextPurchase?.purchaseStateEffectiveDate
      if (endDate && now < new Date(endDate).getTime()) {
        games.push({
          title: content.title,
          description: '',
          slug,
          url,
          imageUrl: image,
          originalPrice: claim.discount?.originalPriceDisplay ?? claim.priceDisplay ?? '',
          endDate,
        })
        continue
      }
    }

    const nextClaim = purchases.find(
      (p) =>
        p.purchaseType === 'Claim' &&
        p.price?.decimalPrice === 0 &&
        new Date(p.purchaseStateEffectiveDate).getTime() > now,
    )
    if (nextClaim) {
      upcomingOffers.push({
        title: content.title,
        slug,
        url,
        imageUrl: image,
        startDate: nextClaim.purchaseStateEffectiveDate,
      })
    }
  }

  upcomingOffers.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  // The mobile API never announces the next title, but the drop rotates when
  // the current claim window closes — derive the rotation moment from the
  // earliest active end date so the vault countdown can be truthful.
  const nextRotationAt =
    games.length > 0
      ? games.map((g) => g.endDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
      : null

  return { games, upcoming: upcomingOffers[0] ?? null, nextRotationAt }
}

export async function fetchEpicFreeGames(country = 'US'): Promise<EpicFreeGame[]> {
  return (await fetchEpicShowcase(country)).games
}
