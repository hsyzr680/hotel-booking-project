# 🌐 نشر المشروع على Netlify

## الخطوات:

### 1. إنشاء حساب
```
1. اذهب إلى netlify.com
2. اضغط "Sign up"
3. اختر "GitHub" للتسجيل
```

### 2. نشر المشروع
```
1. اضغط "Add new site"
2. اختر "Import an existing project"
3. اختر GitHub
4. اختر مشروع hotel-booking
```

### 3. إعدادات البناء
```
Build command: npm run build
Publish directory: .next
```

### 4. متغيرات البيئة
```
Site settings > Environment variables > Add variable

DATABASE_URL=file:./prod.db
NEXTAUTH_SECRET=[generate new secret]
NEXTAUTH_URL=https://your-site.netlify.app
```

### 5. النشر
```
اضغط "Deploy site"
انتظر 3-5 دقائق
```

### 6. نطاق مخصص
```
Domain settings > Add custom domain
أدخل النطاق
اتبع تعليمات DNS
```

**وقت التنصيب: 10-15 دقيقة**
