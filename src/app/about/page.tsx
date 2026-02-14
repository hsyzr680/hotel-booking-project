import Link from 'next/link'
import { Hotel, Shield, Award, Heart, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Hotel className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl font-bold mb-4">عن حجز فنادق</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            منصتك الموثوقة لحجز أفضل الفنادق بأفضل الأسعار
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">من نحن</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                حجز فنادق هي منصة عربية متخصصة في تقديم خدمات حجز الفنادق والغرف الفندقية بأسعار منافسة.
                نسعى لتحقيق تجربة حجز سلسة وآمنة لجميع عملائنا.
              </p>
              <p className="text-gray-600 leading-relaxed">
                نقدم لك مجموعة متنوعة من الفنادق في مختلف المدن، مع إمكانية البحث حسب الموقع والسعر
                والتقييمات لمساعدتك في اختيار الفندق المناسب.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-bold text-gray-900 mb-2">آمن وموثوق</h3>
                <p className="text-sm text-gray-600">حجوزاتك محمية ومضمونة</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-bold text-gray-900 mb-2">أسعار منافسة</h3>
                <p className="text-sm text-gray-600">أفضل العروض والأسعار</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-bold text-gray-900 mb-2">خدمة العملاء</h3>
                <p className="text-sm text-gray-600">نحن هنا لمساعدتك دائماً</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Star className="w-5 h-5" />
              ابدأ البحث عن فنادقك
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
