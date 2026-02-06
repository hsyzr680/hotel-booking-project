import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

// Fallback للـ NEXTAUTH_SECRET أثناء البناء
const getNextAuthSecret = () => {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET
  }
  
  // أثناء البناء على Vercel، استخدم قيمة مؤقتة
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    console.warn('⚠️  NEXTAUTH_SECRET غير موجود، استخدام قيمة افتراضية')
  }
  
  return process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build-only-change-in-production'
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // التحقق من المدخلات
        if (!credentials?.email || !credentials?.password) {
          throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان')
        }

        try {
          // Try-catch حول عمليات قاعدة البيانات
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.password) {
            throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          // معالجة أخطاء قاعدة البيانات
          console.error('خطأ في المصادقة:', error)
          
          // إذا كان الخطأ من Prisma (مشكلة اتصال بقاعدة البيانات)
          if (error instanceof Error) {
            if (error.message.includes('PrismaClient') || 
                error.message.includes('database') ||
                error.message.includes('connection')) {
              throw new Error('خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً')
            }
          }
          
          // إعادة رمي الأخطاء الأخرى
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: getNextAuthSecret(),
}
