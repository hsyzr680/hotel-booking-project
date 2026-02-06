# 🔧 حل مشكلة Build على Vercel

## ✅ المشكلة:
مشروعك كان يستخدم **SQLite** وهو لا يعمل على Vercel (serverless environment).

## ✅ الحل المطبق:
تم تحويل المشروع لاستخدام **PostgreSQL**.

---

## 📋 خطوات النشر على Vercel (بعد التعديلات):

### 1. إنشاء قاعدة بيانات PostgreSQL

#### خيار أ: Vercel Postgres (سهل ومتكامل) ⭐

1. اذهب إلى [vercel.com](https://vercel.com)
2. افتح مشروعك أو أنشئ واحد جديد
3. اذهب إلى **Storage** → **Create Database**
4. اختر **Postgres**
5. اختر اسم للقاعدة: `hotel-booking-db`
6. اضغط **Create**

**✨ Vercel سيضيف `DATABASE_URL` تلقائياً للمشروع!**

#### خيار ب: Supabase (مجاني 100%) 🆓

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ حساب جديد
3. اضغط **New Project**
4. املأ البيانات:
   - Name: `hotel-booking`
   - Database Password: (احفظه!)
   - Region: اختر الأقرب لك
5. انتظر 2-3 دقائق حتى تجهز القاعدة
6. اذهب إلى **Settings** → **Database**
7. انسخ **Connection String** (URI)
8. غيّر `[YOUR-PASSWORD]` بكلمة المرور

#### خيار ج: Neon (مجاني وسريع) 🚀

1. اذهب إلى [neon.tech](https://neon.tech)
2. اضغط **Get Started**
3. سجل دخول بـ GitHub
4. أنشئ Project جديد
5. انسخ **Connection String**

---

### 2. إضافة المتغيرات البيئية في Vercel

1. افتح مشروعك في Vercel
2. اذهب إلى **Settings** → **Environment Variables**
3. أضف المتغيرات التالية:

```env
DATABASE_URL=<رابط قاعدة البيانات من الخطوة 1>
NEXTAUTH_SECRET=<اضغط على Generate أسفل الصفحة>
NEXTAUTH_URL=https://your-project.vercel.app
```

**⚠️ ملاحظات مهمة:**
- `DATABASE_URL`: إذا استخدمت Vercel Postgres، سيُضاف تلقائياً
- `NEXTAUTH_SECRET`: يمكنك توليده من: `openssl rand -base64 32` أو استخدم زر Generate
- `NEXTAUTH_URL`: غيّره بعد النشر لرابط مشروعك الفعلي

---

### 3. رفع الكود على GitHub

```bash
# افتح Terminal/PowerShell في مجلد المشروع
git add .
git commit -m "Fix: تحويل من SQLite إلى PostgreSQL لـ Vercel"
git push
```

إذا لم يكن عندك repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/hotel-booking.git
git push -u origin main
```

---

### 4. النشر على Vercel

#### إذا كان المشروع موجود بالفعل:
- Vercel سيكتشف التغييرات تلقائياً ويبدأ build جديد

#### إذا كان مشروع جديد:
1. اذهب إلى [vercel.com/new](https://vercel.com/new)
2. اضغط **Import** بجانب repository المشروع
3. الإعدادات ستكون تلقائية (Next.js)
4. تأكد من إضافة Environment Variables (الخطوة 2)
5. اضغط **Deploy**

---

### 5. إعداد قاعدة البيانات (Migration)

بعد نشر المشروع، تحتاج لإنشاء الجداول:

#### الطريقة الأولى: عبر Vercel CLI

```bash
# ثبّت Vercel CLI
npm i -g vercel

# سجل دخول
vercel login

# اربط المشروع
vercel link

# نفّذ migration
vercel env pull .env.local
npx prisma db push
npm run db:seed
```

#### الطريقة الثانية: عبر Local Database URL

```bash
# في ملف .env.local
DATABASE_URL="<رابط قاعدة البيانات الإنتاجية>"

npx prisma db push
npm run db:seed
```

---

## ✅ التحقق من نجاح النشر

1. افتح رابط مشروعك: `https://your-project.vercel.app`
2. جرّب تسجيل الدخول بحساب تجريبي:
   - Email: `admin@test.com`
   - Password: `admin123`
3. تحقق من عرض الفنادق

---

## 🚨 أخطاء شائعة وحلولها

### خطأ: "NEXTAUTH_SECRET is not defined"
**الحل:**
```bash
# في Vercel Environment Variables
NEXTAUTH_SECRET=<قيمة عشوائية طويلة>
```

### خطأ: "Prisma Client not generated"
**الحل:** تم إصلاحه تلقائياً بإضافة `postinstall` script

### خطأ: "Can't reach database server"
**الحل:** تأكد من:
- ✅ DATABASE_URL صحيح
- ✅ قاعدة البيانات تعمل
- ✅ الـ IP المسموح في Supabase/Neon (إذا استخدمت whitelist)

### خطأ: "Module not found: next-auth"
**الحل:** تأكد من `npm install` قبل الرفع

---

## 🎯 الخطوات التالية

1. ✅ ربط نطاق مخصص (Domain)
2. ✅ إضافة Stripe للدفع
3. ✅ تفعيل Analytics
4. ✅ إضافة CDN للصور

---

## 📞 الدعم

إذا واجهت أي مشكلة:
- تحقق من Logs في Vercel: Project → Deployments → Click on deployment → View Function Logs
- افتح Issue على GitHub
- راجع [Vercel Docs](https://vercel.com/docs)

---

**🎉 تم إصلاح المشكلة بنجاح!**
