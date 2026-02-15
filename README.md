# فندق القدوة - حجز فنادق

منصة لحجز الفنادق والغرف أونلاين (العراق).

## التشغيل محلياً

```bash
npm install
cp .env.example .env
# عدّل .env: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## المتغيرات البيئية

- `DATABASE_URL` — رابط PostgreSQL (مثل Railway)
- `NEXTAUTH_URL` — رابط الموقع (مثلاً http://localhost:3000)
- `NEXTAUTH_SECRET` — مفتاح عشوائي للجلسات
- `CONTACT_EMAIL` — البريد الذي تُرسل إليه رسائل تواصل معنا
- `RESEND_API_KEY` — مفتاح Resend لإرسال البريد (من resend.com)

## التقنيات

- Next.js 14 · NextAuth · Prisma · PostgreSQL · Tailwind CSS

## النشر على Vercel

1. اربط المشروع من GitHub.
2. أضف المتغيرات أعلاه في Settings → Environment Variables.
3. بعد النشر: نفّذ `npx prisma db push` و `npm run db:seed` محلياً (بعد `vercel env pull`) لإنشاء الجداول والبيانات التجريبية.
