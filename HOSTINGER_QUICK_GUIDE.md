# 🚀 دليل النشر على Hostinger - ZONEWEAR

## المرحلة الأولى: تجهيز حساب Hostinger

### الخطوة 1: إنشاء حساب Hostinger
1. اذهب إلى [hostinger.com](https://hostinger.com)
2. اختر خطة Hosting (Premium أو Business يفضل)
3. أكمل عملية إنشاء الحساب
4. تحقق من بريدك الإلكتروني

---

## المرحلة الثانية: إعداد الدومين

### الخطوة 2: ربط الدومين (إذا كان لديك بالفعل)
```
1. في لوحة تحكم Hostinger:
   - اذهب إلى: Domains > My Domains
   - أضف دومينك
   - أو أشر أسماء الخوادم (Nameservers) للدومين
```

### الخطوة 3: الحصول على SSL (HTTPS)
```
1. في cPanel:
   - اذهب إلى: AutoSSL
   - سيتم تثبيت شهادة SSL تلقائياً
   - أو استخدم Let's Encrypt يدوياً
```

---

## المرحلة الثالثة: رفع ملفات Frontend

### الخطوة 4: الوصول إلى cPanel
```
1. من الإيميل: ستستقبل بيانات cPanel
2. اذهب إلى: http://yourdomain.com:2083
3. أدخل username و password
```

### الخطوة 5: رفع ملفات الويب (Frontend)
```
في cPanel:
1. اذهب إلى: File Manager
2. انتقل إلى: public_html
3. احذف الملفات الافتراضية
4. رفع الملفات التالية:
   ✅ index.html
   ✅ admin-login.html
   ✅ admin.html
   ✅ admin-settings.html
   ✅ products.html
   ✅ about.html
   ✅ contact.html
   ✅ style.css
   ✅ script.js
   ✅ config.js
   ✅ المجلدات: admin/, images/, videos/
```

---

## المرحلة الرابعة: رفع وتشغيل Backend

### الخطوة 6: رفع ملفات Backend

**خيار أ: استخدام Terminal (SSH)**
```bash
# 1. اتصل عبر SSH
ssh username@yourdomain.com

# 2. انتقل إلى home directory
cd ~

# 3. أنشئ مجلد backend
mkdir zonewear-backend
cd zonewear-backend

# 4. حمّل الملفات من جهازك المحلي:
# استخدم SCP أو FTP لنقل الملفات
```

**خيار ب: استخدام FTP**
```
1. استخدم برنامج FileZilla
2. اتصل بـ:
   - Host: yourdomain.com
   - Username: من بيانات Hostinger
   - Password: من بيانات Hostinger
   - Port: 21 أو 22
3. رفع الملفات:
   ✅ server.js
   ✅ database.js
   ✅ package.json
   ✅ ecosystem.config.js
   ✅ .env.production
   ✅ zonenear.db
```

---

### الخطوة 7: تثبيت npm والمكتبات

**في Terminal (SSH):**
```bash
# 1. انتقل إلى مجلد backend
cd ~/zonewear-backend

# 2. تحديث npm
npm install -g npm

# 3. تثبيت المكتبات
npm install

# 4. تثبيت pm2 عالمياً
npm install -g pm2
```

### الخطوة 8: إنشاء ملف .env.production

**في Terminal:**
```bash
# 1. افتح محرر نصي
nano .env.production

# 2. أضف المحتوى التالي (مهم جداً):
PORT=3000
JWT_SECRET=aB3@kL9$mN2&pQ5%rS7!tU4#vW6^xY8*zC0(fG1)hJ2-iK3+lM4=nO5_ZONEWEAR_SECURE_2026
NODE_ENV=production
DB_PATH=./zonewear.db
ALLOWED_ORIGIN=https://yourdomain.com

# 3. اضغط Ctrl+X ثم Y ثم Enter
```

---

### الخطوة 9: تشغيل Backend باستخدام PM2

**في Terminal:**
```bash
# 1. بدء الخادم
pm2 start ecosystem.config.js --env production

# 2. اجعله يبدأ مع النظام
pm2 startup

# 3. احفظ الإعدادات
pm2 save

# 4. تحقق من الحالة
pm2 status

# 5. عرض السجلات (للتصحيح إذا لزم)
pm2 logs
```

---

## المرحلة الخامسة: اختبار الموقع

### الخطوة 10: اختبار Frontend

```
1. افتح المتصفح
2. اذهب إلى: https://yourdomain.com
3. دقّق في:
   ✅ تحميل الصفحة الرئيسية
   ✅ تحميل الصور والفيديو
   ✅ استجابة الأزرار
   ✅ HTTPS يعمل بدون تحذيرات
```

### الخطوة 11: اختبار Backend

```bash
# في Terminal لجهازك المحلي:
curl https://yourdomain.com:3000/api/health

# يجب أن تحصل على:
# {"status":"ok","timestamp":"..."}
```

---

### الخطوة 12: اختبار Admin Login

```
1. اذهب إلى: https://yourdomain.com/admin-login.html
2. أدخل:
   - Username: zonewear2026
   - Password: Wz2L9MqswZweb
3. يجب أن تدخل لوحة التحكم
4. اختبر:
   ✅ إضافة منتج جديد
   ✅ حفظ البيانات
   ✅ استرجاع البيانات
```

---

## إعادة تشغيل وإيقاف

### بدء الخادم:
```bash
pm2 start ecosystem.config.js --env production
```

### إيقاف الخادم:
```bash
pm2 stop 0
```

### إعادة تشغيل:
```bash
pm2 restart 0
```

### حذف من PM2:
```bash
pm2 delete 0
```

### عرض السجلات:
```bash
pm2 logs

# أو للتطبيق المعين:
pm2 logs 0

# أو الأخطاء فقط:
pm2 logs 0 --err
```

---

## المتطلبات النهائية

قبل الإطلاق:

```
✅ تحديث ALLOWED_ORIGIN في .env.production
   - غيّر: https://yourdomain.com

✅ تغيير كلمة مرور المسؤول (اختياري لكن موصى)
   - في admin panel: Settings > Change Password

✅ تحديد صور وفيديوهات احترافية
   - ضع صورك في: public_html/images/
   - ضع فيديوك في: public_html/videos/

✅ إضافة وصف منتجاتك
   - في Admin: Products > Add Product

✅ تشغيل HTTPS
   - تحقق من شهادة SSL
   - أعد التوجيه من HTTP إلى HTTPS
```

---

## حل المشاكل

### المشكلة: Backend لا يستجيب
```bash
# 1. تحقق من الحالة
pm2 status

# 2. عرض السجلات
pm2 logs

# 3. أعد التشغيل
pm2 restart 0

# 4. تحقق من الملفات المثبتة
ls -la
npm list
```

### المشكلة: خطأ 404 في صفحة المنتجات
```
- تأكد أن images/ موجود في public_html
- تأكد من أسماء الصور صحيحة
- تحقق من قاعدة البيانات (pm2 logs)
```

### المشكلة: CORS Error
```
- في .env.production، غيّر ALLOWED_ORIGIN
- أضف yourdomain.com بدلاً من zonewear.com
- أعد تشغيل Backend: pm2 restart 0
```

### المشكلة: قاعدة البيانات فارغة
```
- تحقق من path: ./zonewear.db
- تأكد أن الملف موجود
- افتح Admin > Settings > Backups
- استرجع النسخة الاحتياطية الأخيرة
```

---

## مراقبة الموقع

### يومياً:
```bash
# تحقق من سجلات الأخطاء
pm2 logs 0 --err

# عدد الطلبات
pm2 show 0
```

### أسبوعياً:
```bash
# نسخ احتياطي من قاعدة البيانات
cp zonewear.db zonewear.db.backup

# تنظيف السجلات القديمة
pm2 flush
```

### شهرياً:
```bash
# تحديث المكتبات
npm update

# إعادة تشغيل
pm2 restart 0
```

---

## دعم إضافي

### الملفات المهمة:
```
📄 README.md - شرح عام
📄 START_HERE.md - ابدأ من هنا
📄 USER_MANUAL_AR.md - شرح لوحة التحكم
📄 HOSTINGER_DEPLOYMENT_GUIDE.md - هذا الدليل
```

### بيانات الدخول المهمة:
```
Admin Username: zonewear2026
Admin Password: Wz2L9MqswZweb

JWT Secret: (موجود في .env.production)
Database: zonewear.db (SQLite)
```

---

## ✅ قائمة التحقق النهائية

قبل الإطلاق:

```
✅ حساب Hostinger نشط
✅ Domain مرتبط و يعمل
✅ SSL/HTTPS مثبت
✅ frontend files في public_html
✅ backend files في مجلد منفصل
✅ npm install نجح
✅ pm2 يشتغل (pm2 status)
✅ Backend يستجيب على /api/health
✅ Frontend يحمّل بدون أخطاء
✅ Admin login يعمل
✅ إضافة منتج تعمل
✅ قاعدة البيانات تحفظ البيانات
✅ ALLOWED_ORIGIN محدث
✅ كل الصور والفيديو موجودة
```

---

**🎉 مبروك! موقعك الآن على الإنترنت!**

اذهب إلى: **https://yourdomain.com** ⭐
