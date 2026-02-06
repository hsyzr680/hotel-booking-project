# 🖥️ نشر المشروع على استضافة تقليدية (cPanel/VPS)

## للاستضافات العراقية والعربية

---

## المتطلبات:
- استضافة تدعم Node.js 18+
- SSH Access
- مساحة 2GB+

---

## الخطوة 1: رفع الملفات

### عبر FTP:
```
1. افتح FileZilla
2. اتصل بالسيرفر (Host, Username, Password)
3. ارفع مجلد hotel-booking كامل
4. ضعه في: /home/username/hotel-booking
```

### عبر SSH:
```bash
# على جهازك
scp -r hotel-booking user@server-ip:/home/username/

# أو استخدم Git
ssh user@server-ip
cd /home/username
git clone https://github.com/YOUR-USERNAME/hotel-booking.git
```

---

## الخطوة 2: التنصيب على السيرفر

### اتصل بالسيرفر عبر SSH:
```bash
ssh username@server-ip
cd /home/username/hotel-booking
```

### ثبّت المكتبات:
```bash
npm install
```

### أنشئ ملف .env:
```bash
nano .env
```

الصق هذا:
```env
DATABASE_URL="file:./prod.db"
NEXTAUTH_SECRET="توليد-مفتاح-عشوائي-هنا"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

اضغط Ctrl+X ثم Y للحفظ

### جهز قاعدة البيانات:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### ابنِ المشروع:
```bash
npm run build
```

---

## الخطوة 3: تشغيل المشروع

### الطريقة 1: PM2 (موصى بها)
```bash
# ثبّت PM2
npm install -g pm2

# شغّل المشروع
pm2 start npm --name "hotel-booking" -- start

# اجعله يشتغل تلقائياً عند إعادة التشغيل
pm2 startup
pm2 save

# أوامر مفيدة:
pm2 list           # عرض المشاريع الشغالة
pm2 logs           # عرض السجلات
pm2 restart hotel-booking  # إعادة التشغيل
pm2 stop hotel-booking     # إيقاف
```

### الطريقة 2: Node مباشرة (للاختبار)
```bash
npm start
# سيشتغل على http://localhost:3000
```

---

## الخطوة 4: إعداد Nginx (Reverse Proxy)

### إنشاء ملف تكوين:
```bash
sudo nano /etc/nginx/sites-available/hotel-booking
```

الصق هذا:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### تفعيل الموقع:
```bash
sudo ln -s /etc/nginx/sites-available/hotel-booking /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## الخطوة 5: SSL مجاني (Let's Encrypt)

```bash
# ثبّت Certbot
sudo apt install certbot python3-certbot-nginx

# احصل على شهادة SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# تجديد تلقائي
sudo certbot renew --dry-run
```

---

## الخطوة 6: إعداد Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## الخطوة 7: النسخ الاحتياطي التلقائي

### أنشئ سكريبت:
```bash
nano /home/username/backup.sh
```

الصق هذا:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/username/backups"
PROJECT_DIR="/home/username/hotel-booking"

mkdir -p $BACKUP_DIR

# نسخ قاعدة البيانات
cp $PROJECT_DIR/prisma/prod.db $BACKUP_DIR/db_$DATE.db

# نسخ كامل المشروع
tar -czf $BACKUP_DIR/project_$DATE.tar.gz $PROJECT_DIR

# حذف النسخ القديمة (أكثر من 7 أيام)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

اجعله قابل للتنفيذ:
```bash
chmod +x /home/username/backup.sh
```

جدولة النسخ الاحتياطي:
```bash
crontab -e
```

أضف هذا السطر (نسخ احتياطي يومياً الساعة 2 صباحاً):
```
0 2 * * * /home/username/backup.sh
```

---

## ✅ التحقق من التنصيب:

```bash
# تحقق من Node.js
node --version    # يجب أن يكون 18+

# تحقق من المشروع
pm2 list          # يجب أن يظهر hotel-booking

# تحقق من Nginx
sudo nginx -t

# تحقق من الموقع
curl http://localhost:3000
```

---

## 🔄 التحديثات:

```bash
cd /home/username/hotel-booking

# سحب آخر التحديثات
git pull

# تثبيت المكتبات الجديدة
npm install

# إعادة البناء
npm run build

# إعادة تشغيل
pm2 restart hotel-booking
```

---

## 🆘 حل المشاكل:

### المشكلة: الموقع لا يفتح
```bash
# تحقق من PM2
pm2 logs hotel-booking

# تحقق من Nginx
sudo systemctl status nginx

# تحقق من البورت
netstat -tlnp | grep :3000
```

### المشكلة: قاعدة البيانات لا تعمل
```bash
cd /home/username/hotel-booking
npx prisma db push
npm run db:seed
pm2 restart hotel-booking
```

### المشكلة: الصور لا تظهر
```bash
# تأكد من الصلاحيات
chmod -R 755 /home/username/hotel-booking/public
```

---

## 📊 مراقبة الأداء:

```bash
# استخدام الذاكرة
pm2 monit

# السجلات المباشرة
pm2 logs hotel-booking --lines 100

# معلومات النظام
htop
```

---

## 🎯 ملاحظات مهمة:

1. **الأمان:**
   - غيّر NEXTAUTH_SECRET دائماً
   - استخدم كلمات مرور قوية
   - فعّل Firewall

2. **الأداء:**
   - استخدم PM2 clustering لأداء أفضل:
     ```bash
     pm2 start npm --name "hotel-booking" -i max -- start
     ```

3. **المراقبة:**
   - راقب السجلات بانتظام
   - استخدم PM2 Monitoring (مدفوع) للإنتاج

4. **النسخ الاحتياطي:**
   - نسخ احتياطي يومي لقاعدة البيانات
   - نسخ احتياطي أسبوعي للمشروع كامل

---

## 💰 التكلفة التقديرية:

- **VPS صغير:** $5-10/شهر (DigitalOcean, Linode)
- **استضافة عراقية:** 50K-100K IQD/شهر
- **النطاق:** $10-15/سنة

---

**وقت التنصيب الكلي: 30-60 دقيقة**
