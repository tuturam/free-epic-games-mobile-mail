const COUNTRY = 'US'

export default defineCachedEventHandler(
  async () => {
    const { games, upcoming, nextRotationAt } = await fetchEpicShowcase(COUNTRY)
    return {
      games,
      upcoming,
      nextRotationAt,
      country: COUNTRY,
      fetchedAt: new Date().toISOString(),
    }
  },
  {
    maxAge: 60,
  },
)
