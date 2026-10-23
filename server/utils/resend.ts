import { Resend } from "resend";

const config = useRuntimeConfig()
// Read the secret at runtime so its value never gets inlined into the build
// output (which would fail Netlify's secrets scan).
export const resend = new Resend(config.apiKeyResend || process.env.RESEND_API_KEY)