import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// منع Next.js من محاولة pre-render هذا Route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
