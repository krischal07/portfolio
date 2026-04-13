// dotenv MUST run before any other module loads process.env
import { config } from 'dotenv'
config({ path: '.env.local' })

const ADMIN_NAME = 'Krischal Shrestha'
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.local before running.')
  process.exit(1)
}

async function main() {
  // Dynamic import runs AFTER dotenv.config(), so DATABASE_URL is available
  const { auth } = await import('../lib/auth')

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL!,
        password: ADMIN_PASSWORD!,
      },
    })
    console.log('Admin account created:', result.user?.email)
  } catch (err) {
    console.error('Failed to create admin account:', err)
    process.exit(1)
  }
}

main()
