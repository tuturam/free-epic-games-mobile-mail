// Shapes shared between the Nitro server (server/utils/epic.ts) and the app
// (app/components/LdTelemetry.vue). Keep these in sync with the EGS
// discover/home response mapping in server/utils/epic.ts.

export interface EpicFreeGame {
  title: string
  description: string
  slug: string
  url: string
  imageUrl: string
  originalPrice: string
  /** ISO timestamp when the free claim window ends. */
  endDate: string
}

export interface EpicUpcomingGame {
  title: string
  slug: string
  url: string
  imageUrl: string
  /** ISO timestamp when the free claim window opens. */
  startDate: string
}

export interface EpicShowcase {
  games: EpicFreeGame[]
  upcoming: EpicUpcomingGame | null
}

export interface EpicFeedResponse extends EpicShowcase {
  country: string
  /** ISO timestamp of the last successful fetch from the Epic API. */
  fetchedAt: string
}
