import dns from 'node:dns'

dns.setDefaultResultOrder('ipv4first')

export default defineNitroPlugin(() => {})
