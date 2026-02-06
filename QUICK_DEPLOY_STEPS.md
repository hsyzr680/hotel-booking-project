# 🚀 خطوات النشر السريع على Vercel

## 📌 ملخص التغييرات المطبقة:

✅ تم تحويل قاعدة البيانات من SQLite إلى PostgreSQL  
✅ تم إضافة `postinstall` script لتوليد Prisma Client  
✅ تم إنشاء ملف `vercel.json` للإعدادات الصحيحة  

---

## ⚡ خطوات النشر (5 دقائق فقط):

### 1️⃣ اختر قاعدة بيانات PostgreSQL

**الخيار الأسهل: Vercel Postgres**
- افتح [vercel.com](https://vercel.com)
- اذهب لـ Storage → Create Database → Postgres
- سيُضاف `DATABASE_URL` تلقائياً! ✨

**أو استخدم Supabase (مجاني):**
- [supabase.com](https://supabase.com) → New Project
- انسخ Connection String من Settings → Database

---

### 2️⃣ أضف المتغيرات البيئية في Vercel

```env
DATABASE_URL=<رابط قاعدة البيانات>
NEXTAUTH_SECRET=<مفتاح عشوائي - استخدم زر Generate>
NEXTAUTH_URL=https://your-project.vercel.app
```

---

### 3️⃣ ارفع التعديلات على GitHub

```bash
git add .
git commit -m "Fix: PostgreSQL for Vercel deployment"
git push
```

---

### 4️⃣ انشر المشروع

إذا كان مشروعك موجود على Vercel:
- ✅ سيبدأ Build تلقائياً!

إذا كان مشروع جديد:
- اذهب لـ [vercel.com/new](https://vercel.com/new)
- Import مشروعك من GitHub
- أضف Environment Variables
- اضغط Deploy

---

### 5️⃣ أنشئ جداول قاعدة البيانات

```bash
# ثبّت Vercel CLI
npm i -g vercel

# سجل دخول واربط المشروع
vercel login
vercel link

# اسحب المتغيرات البيئية
vercel env pull .env.local

# أنشئ الجداول
npx prisma db push

# أضف البيانات التجريبية
npm run db:seed
```

---

## 🎉 انتهى!

افتح موقعك: `https://your-project.vercel.app`

**حساب تجريبي:**
- Email: `admin@test.com`
- Password: `admin123`

---

## ❓ واجهت مشكلة؟

راجع الملف: `VERCEL_FIX.md` - يحتوي على حلول مفصلة لكل مشكلة محتملة.

---

**💡 نصيحة:** احفظ `DATABASE_URL` في مكان آمن!
