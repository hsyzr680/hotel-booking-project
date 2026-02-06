# 💻 تشغيل المشروع محلياً بعد التعديلات

## ⚠️ تغيير مهم:
تم تحويل المشروع من **SQLite** إلى **PostgreSQL**

---

## 📋 الخيارات المتاحة:

### خيار 1: استخدام PostgreSQL محلياً (موصى به)

#### تثبيت PostgreSQL:

**على Windows:**
```powershell
# حمّل من: https://www.postgresql.org/download/windows/
# أو استخدم Chocolatey:
choco install postgresql
```

**على Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**على Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### إنشاء قاعدة بيانات:

```bash
# افتح PostgreSQL
psql -U postgres

# أنشئ قاعدة بيانات
CREATE DATABASE hotel_booking;
CREATE USER hoteluser WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE hotel_booking TO hoteluser;
\q
```

#### إعداد المشروع:

```bash
# انسخ ملف البيئة
cp .env.example .env

# عدّل DATABASE_URL في .env
DATABASE_URL="postgresql://hoteluser:password123@localhost:5432/hotel_booking"
NEXTAUTH_SECRET="any-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

```bash
# ثبّت الحزم
npm install

# أنشئ الجداول
npx prisma db push

# أضف بيانات تجريبية
npm run db:seed

# شغّل المشروع
npm run dev
```

---

### خيار 2: استخدام Supabase (مجاني وسهل) 🆓

```bash
# 1. اذهب لـ supabase.com وأنشئ مشروع
# 2. احصل على Connection String
# 3. ضعه في .env

DATABASE_URL="postgresql://postgres:[password]@[host].supabase.co:5432/postgres"
NEXTAUTH_SECRET="any-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# ثبّت وشغّل
npm install
npx prisma db push
npm run db:seed
npm run dev
```

---

### خيار 3: استخدام Docker (للمحترفين) 🐳

```bash
# أنشئ ملف docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: hotel_booking
      POSTGRES_USER: hoteluser
      POSTGRES_PASSWORD: password123
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# شغّل PostgreSQL
docker-compose up -d

# استخدم هذا DATABASE_URL في .env
DATABASE_URL="postgresql://hoteluser:password123@localhost:5432/hotel_booking"
```

---

### خيار 4: الرجوع لـ SQLite (للتطوير المحلي فقط)

⚠️ **تحذير:** لن تستطيع رفع المشروع على Vercel بـ SQLite!

```bash
# عدّل prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

# في .env
DATABASE_URL="file:./dev.db"

# شغّل المشروع
npm install
npx prisma db push
npm run db:seed
npm run dev
```

---

## ✅ التحقق من التشغيل

1. افتح المتصفح: http://localhost:3000
2. سجل دخول بحساب تجريبي:
   - Email: `admin@test.com`
   - Password: `admin123`

---

## 🔧 أوامر مفيدة

```bash
# عرض قاعدة البيانات في واجهة رسومية
npx prisma studio

# إعادة إنشاء الجداول
npx prisma db push --force-reset

# إعادة seed البيانات
npm run db:seed

# تحديث Prisma Client
npx prisma generate
```

---

## ❓ مشاكل شائعة

### "Can't reach database server"
- ✅ تأكد أن PostgreSQL يعمل
- ✅ تحقق من `DATABASE_URL` في `.env`
- ✅ تأكد من username/password صحيحين

### "Prisma Client not found"
```bash
npx prisma generate
```

### "Port 3000 already in use"
```bash
# غيّر المنفذ
PORT=3001 npm run dev
```

---

**🎉 الآن يمكنك التطوير محلياً والنشر على Vercel بدون مشاكل!**
