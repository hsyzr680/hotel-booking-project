'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, MessageSquare, Send, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'فشل الإرسال')
        return
      }
      setSent(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setError('حدث خطأ في الإرسال')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            نسعد بتواصلك معنا، فريقنا جاهز للرد على استفساراتك
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              {sent ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إرسال رسالتك!</h2>
                  <p className="text-gray-600 mb-6">
                    شكراً لتواصلك، سنرد عليك في أقرب وقت ممكن.
                  </p>
                  <Button onClick={() => setSent(false)} variant="outline">
                    إرسال رسالة أخرى
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-gray-900">أرسل لنا رسالة</h2>
                    <p className="text-gray-600 mt-1">املأ النموذج وسنتواصل معك قريباً</p>
                  </div>

                  <Input
                    label="الاسم"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="اسمك الكامل"
                  />

                  <Input
                    label="البريد الإلكتروني"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="example@email.com"
                  />

                  <Input
                    label="الموضوع"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    placeholder="موضوع رسالتك"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الرسالة</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    <Send className="w-5 h-5 ml-2" />
                    {isLoading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">البريد الإلكتروني</h3>
                  <p className="text-gray-600">
                  <a href="mailto:hsyzr690@gmail.com" className="text-blue-600 hover:underline">
                    hsyzr690@gmail.com
                  </a>
                </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">الهاتف</h3>
                  <p className="text-gray-600">+966 50 000 0000</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
