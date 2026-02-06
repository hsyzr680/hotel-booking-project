'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Hotel, Mail, Lock } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        router.push('/profile')
        router.refresh()
      }
    } catch (error) {
      setError('حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold text-blue-600">
            <Hotel className="w-10 h-10" />
            <span>حجز فنادق</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
            مرحباً بعودتك
          </h1>
          <p className="text-gray-600">سجل دخولك للمتابعة</p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="relative">
                <Mail className="absolute right-3 top-11 text-gray-400 w-5 h-5" />
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="pr-10"
                />
              </div>

              <div className="relative">
                <Lock className="absolute right-3 top-11 text-gray-400 w-5 h-5" />
                <Input
                  label="كلمة المرور"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="pr-10"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                تسجيل الدخول
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ليس لديك حساب؟{' '}
                <Link href="/auth/register" className="text-blue-600 hover:underline font-semibold">
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-3 text-center">حسابات تجريبية:</p>
              <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                <div>
                  <strong className="text-gray-900">مدير:</strong>{' '}
                  <span className="text-gray-600">admin@hotel.com / admin123</span>
                </div>
                <div>
                  <strong className="text-gray-900">مستخدم:</strong>{' '}
                  <span className="text-gray-600">user@test.com / user123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
