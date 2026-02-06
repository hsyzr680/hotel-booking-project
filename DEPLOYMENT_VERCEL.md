# 🚀 نشر المشروع على Vercel - دليل كامل

## الخطوات للعميل:

### 1. إنشاء حساب GitHub
```
1. اذهب إلى github.com
2. اضغط "Sign up"
3. أنشئ حساب جديد
```

### 2. رفع المشروع على GitHub

#### الطريقة الأولى (عبر GitHub Desktop):
```
1. حمّل GitHub Desktop
2. افتح البرنامج
3. اضغط File > Add Local Repository
4. اختر مجلد hotel-booking
5. اضغط Publish Repository
```

#### الطريقة الثانية (عبر Git):
```bash
cd hotel-booking
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/hotel-booking.git
git push -u origin main
```

### 3. نشر على Vercel

#### أ. إنشاء حساب:
```
1. اذهب إلى vercel.com
2. اضغط "Sign Up"
3. اختر "Continue with GitHub"
4. أدخل بيانات GitHub
```

#### ب. ربط المشروع:
```
1. في لوحة Vercel، اضغط "Add New"
2. اختر "Project"
3. اختر مشروع hotel-booking من GitHub
4. اضغط "Import"
```

#### ج. إعدادات المشروع:
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### د. إضافة المتغيرات (Environment Variables):
```
1. اضغط على "Environment Variables"
2. أضف المتغيرات التالية:

DATABASE_URL=file:./prod.db
NEXTAUTH_SECRET=[اضغط Generate لتوليد مفتاح]
NEXTAUTH_URL=https://your-domain.vercel.app
```

#### هـ. النشر:
```
1. اضغط "Deploy"
2. انتظر 2-3 دقائق
3. ستحصل على رابط مثل: your-project.vercel.app
```

### 4. ربط نطاق مخصص (Domain)

```
1. في لوحة Vercel، اذهب لـ Settings
2. اضغط Domains
3. أدخل اسم النطاق: hotelbook.com
4. اتبع التعليمات لتحديث DNS
5. انتظر حتى يتم التفعيل (5-60 دقيقة)
```

### 5. إعداد قاعدة البيانات الإنتاجية

#### الخيار 1: Vercel Postgres (مدفوع)
```
1. في Vercel، اذهب لـ Storage
2. اختر Postgres
3. أنشئ قاعدة بيانات
4. سينشئ DATABASE_URL تلقائياً
```

#### الخيار 2: Supabase (مجاني)
```
1. اذهب إلى supabase.com
2. أنشئ مشروع جديد
3. احصل على DATABASE_URL
4. أضفه في Vercel Environment Variables:
   DATABASE_URL="postgresql://..."
```

#### الخيار 3: PlanetScale (MySQL مجاني)
```
1. اذهب إلى planetscale.com
2. أنشئ قاعدة بيانات
3. احصل على Connection String
4. غيّر schema.prisma:
   provider = "mysql"
```

### 6. تشغيل Migration

```bash
# على جهازك المحلي
# غيّر DATABASE_URL في .env للقاعدة الجديدة
npx prisma db push
npm run db:seed
```

### 7. التحديثات المستقبلية

```bash
# أي تغيير على الكود
git add .
git commit -m "تحديث المشروع"
git push

# Vercel ستنشر التحديث تلقائياً!
```

---

## ✅ Checklist للتأكد:

- [ ] المشروع على GitHub
- [ ] الحساب على Vercel
- [ ] المتغيرات مضافة
- [ ] قاعدة البيانات جاهزة
- [ ] النطاق مربوط (اختياري)
- [ ] البيانات التجريبية مضافة
- [ ] الموقع يعمل

---

## 🎉 النتيجة:

رابط الموقع: `https://your-domain.vercel.app`
أو: `https://hotelbook.com` (إذا ربطت نطاق)

**وقت التنصيب الكلي: 10-15 دقيقة!**
