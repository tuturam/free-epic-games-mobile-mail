const COUNTRY = 'US'

export default defineCachedEventHandler(
  async () => {
    const { games, upcoming } = await fetchEpicShowcase(COUNTRY)
    return {
      games,
      upcoming,
      country: COUNTRY,
      fetchedAt: new Date().toISOString(),
    }
  },
  {
    maxAge: 60,
  },
)
