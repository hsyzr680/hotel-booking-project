'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Hotel, Mail, Lock, User } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء التسجيل')
      }

      // Registration successful, redirect to login
      router.push('/auth/login?registered=true')
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء التسجيل')
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
            إنشاء حساب جديد
          </h1>
          <p className="text-gray-600">انضم إلينا وابدأ رحلتك</p>
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
                <User className="absolute right-3 top-11 text-gray-400 w-5 h-5" />
                <Input
                  label="الاسم الكامل"
                  type="text"
                  placeholder="أدخل اسمك"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="pr-10"
                />
              </div>

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
                  minLength={6}
                  className="pr-10"
                />
              </div>

              <div className="relative">
                <Lock className="absolute right-3 top-11 text-gray-400 w-5 h-5" />
                <Input
                  label="تأكيد كلمة المرور"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  className="pr-10"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                إنشاء الحساب
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                لديك حساب بالفعل؟{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
