import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'hsyzr690@gmail.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY غير موجود في .env')
      return NextResponse.json(
        { error: 'إعداد البريد غير مكتمل. يرجى إضافة RESEND_API_KEY في الإعدادات.' },
        { status: 500 }
      )
    }

    const resend = new Resend(RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: `تواصل معنا <${FROM_EMAIL}>`,
      to: [CONTACT_EMAIL],
      replyTo: email.trim(),
      subject: `[تواصل معنا] ${subject.trim()}`,
      html: `
        <h2>رسالة جديدة من نموذج التواصل</h2>
        <p><strong>الاسم:</strong> ${name.trim()}</p>
        <p><strong>البريد:</strong> ${email.trim()}</p>
        <p><strong>الموضوع:</strong> ${subject.trim()}</p>
        <hr />
        <p><strong>الرسالة:</strong></p>
        <p>${message.trim().replace(/\n/g, '<br />')}</p>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'فشل إرسال الرسالة. حاول لاحقاً.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء الإرسال' },
      { status: 500 }
    )
  }
}
