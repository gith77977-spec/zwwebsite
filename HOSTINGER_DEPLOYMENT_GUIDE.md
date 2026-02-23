# 🚀 دليل نشر ZONEWEAR على Hostinger

## 📋 المحتويات
1. [التحضيرات قبل النشر](#التحضيرات-قبل-النشر)
2. [إعداد حساب Hostinger](#إعداد-حساب-hostinger)
3. [رفع الملفات](#رفع-الملفات)
4. [تكوين الخادم](#تكوين-الخادم)
5. [تشغيل الموقع](#تشغيل-الموقع)
6. [كيفية الدخول كمسؤول](#كيفية-الدخول-كمسؤول)

---

## التحضيرات قبل النشر

### 1️⃣ **التحقق من الملفات الأساسية**

جميع الملفات مُحضّرة بالفعل:
```
✅ config.js - ملف الإعدادات الديناميكي (تم إنشاؤه)
✅ admin-login.html - صفحة الدخول المُحدثة
✅ admin-settings.html - صفحة الإعدادات المُحدثة
✅ backend/server.js - الخادم مع CORS محسّن
✅ backend/.env.production - إعدادات الإنتاج
✅ backend/ecosystem.config.js - إعدادات PM2
```

### 2️⃣ **التحقق من قاعدة البيانات**
```bash
# التأكد من وجود قاعدة البيانات
backend/zonewear.db ✅ (موجودة)
```

---

## إعداد حساب Hostinger

### الخطوة 1: إنشاء حساب

1. اذهب إلى [hostinger.com](https://hostinger.com)
2. اختر **Web Hosting** 
3. اختر الخطة المناسبة (الخطة الأساسية كافية)
4. أكمل التسجيل
5. اختر أو انقل domain الخاص بك (مثل: `zonewear.com`)

### الخطوة 2: إضافة Domain

```
اذا كنت تملك domain:
1. أضفه في Hostinger (Manage Domains)
2. وجه الـ DNS إلى Hostinger

إذا لم تكن تملك domain:
1. اشتر domain من Hostinger أو أي موقع آخر
2. وجه DNS إلى Hostinger
```

### الخطوة 3: الوصول لـ cPanel

1. اذهب إلى صفحة Hostinger
2. انقر على **Manage** في الحساب الخاص بك
3. اختر **cPanel**
4. سيفتح لك لوحة التحكم

---

## رفع الملفات

### الطريقة 1️⃣: استخدام File Manager (الأسهل)

#### للملفات الأمامية (Frontend):

```
1. في cPanel، افتح File Manager
2. انتقل إلى: public_html/
3. رفع الملفات التالية:
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
   ✅ test-backend.html
   ✅ folders: admin/, db/, images/, videos/
```

#### ملفات Backend:

```
1. في cPanel، انقر على Terminal (أو استخدم SSH)
2. انتقل إلى مجلد آخر (مثل: /home/username/backend/)
3. انسخ الملفات:
   ✅ backend/server.js
   ✅ backend/database.js
   ✅ backend/package.json
   ✅ backend/.env.production
   ✅ backend/ecosystem.config.js
   ✅ backend/zonewear.db (قاعدة البيانات)
```

### الطريقة 2️⃣: استخدام FTP

```
1. استخدم برنامج مثل FileZilla
2. أدخل بيانات FTP من Hostinger:
   - Host: ftp.zonewear.com
   - Username: [اسم المستخدم]
   - Password: [كلمة المرور]
   - Port: 21

3. رفع جميع الملفات
```

---

## تكوين الخادم

### الخطوة 1: تشغيل Backend على Node.js

```bash
# في cPanel Terminal

# 1. تثبيت npm والمكتبات
cd /home/username/backend
npm install

# 2. التحقق من التثبيت
npm list

# 3. تشغيل الخادم باستخدام PM2 (الأفضل للإنتاج)
npm install -g pm2
pm2 start ecosystem.config.js --env production

# 4. التحقق من أن الخادم يعمل
pm2 status
```

### الخطوة 2: تكوين CORS الصحيح

```
في ملف backend/server.js (تم تحديثه بالفعل):

const corsOptions = {
    origin: 'https://zonewear.com',  // AMB ضع domain الخاص بك
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
```

### الخطوة 3: تفعيل SSL/HTTPS

```
في cPanel:
1. اذهب إلى: Auto Installer / Certbot
2. اختر domain الخاص بك
3. اضغط Install
3. سيتم تفعيل HTTPS تلقائياً
```

---

## تشغيل الموقع

### اختبر الموقع

```
1. افتح المتصفح
2. اذهب إلى: https://zonewear.com
   ✅ يجب أن تظهر الصفحة الرئيسية

3. اذهب إلى: https://zonewear.com/admin-login.html
   ✅ يجب أن تظهر صفحة الدخول
```

### اختبر الخادم

```
في Terminal:

# تحقق من أن Backend يعمل
curl http://localhost:3000/api/health

# يجب أن ترى:
{"status":"ok","timestamp":"2026-02-23T..."}
```

---

## كيفية الدخول كمسؤول

### 🔓 بيانات الدخول الافتراضية

```
Username: zonewear2026
Password: Wz2L9MqswZweb
```

### 📍 خطوات الدخول

```
1. افتح: https://zonewear.com/admin-login.html
2. أدخل:
   - Username: zonewear2026
   - Password: Wz2L9MqswZweb
3. اختياري: ضع علامة "Remember me"
4. اضغط "Login"
5. ستُنقل إلى: https://zonewear.com/admin.html
```

### 🛠️ ماذا تستطيع أن تفعل كمسؤول

#### إضافة منتج:
```
1. في لوحة التحكم (admin.html)
2. انقر: "إضافة منتج"
3. املأ البيانات:
   - الاسم (عربي/إنجليزي)
   - السعر
   - الفئة
   - الصورة
   - الوصف
4. اضغط: "حفظ"
5. المنتج سيظهر فوراً على الموقع
```

#### حذف منتج:
```
1. في قائمة المنتجات
2. انقر: "حذف" بجانب المنتج
3. اضغط "تأكيد"
4. المنتج سيُحذف على الفور
```

#### تعديل كلمة المرور:
```
1. انقر على: "Profile Settings"
2. اذهب إلى: "Change Password"
3. أدخل كلمة المرور الحالية
4. أدخل كلمة المرور الجديدة
5. اضغط: "Update Password"
```

#### إنشاء نسخة احتياطية:
```
1. في Profile Settings
2. اذهب إلى: "Database Backups"
3. انقر: "Create Backup"
4. سيتم حفظ نسخة من البيانات
5. يمكنك تحميل النسخة الاحتياطية لاحقاً
```

---

## 🔒 معلومات أمان مهمة

### تغيير البيانات الافتراضية (ضروري!)

#### 1. تغيير username/password:

```sql
-- في قاعدة البيانات (من phpMyAdmin في Hostinger):

UPDATE admins 
SET password = bcrypt('كلمة مرور قوية جداً')
WHERE username = 'zonewear2026';

-- أو غيّر الـ username نفسه:
UPDATE admins 
SET username = 'myadmin'
WHERE id = 1;
```

#### 2. تغيير JWT_SECRET:

في ملف `.env.production`:

```env
# قديم (خطر)
JWT_SECRET=zonewear_secret_key_2026_very_secure_key_change_in_production

# جديد (آمن) - استخدم سلسلة عشوائية طويلة:
JWT_SECRET=aB3@kL9$mN2&pQ5%rS7!tU4#vW6^xY8*zC0(fG1)hJ2-iK3+lM4=nO5_ZONEWEAR_SECURE_2026
```

### قوائم الدخول الموصى بها

```
✅ استخدم: أحرف كبيرة + صغيرة + أرقام + رموز
✅ الطول الأدنى: 12 حرف
✅ مثال جيد: Zw@2026AdminSecure!Pwd

❌ لا تستخدم: كلمات بسيطة أو متسلسلة
❌ لا تستخدم: الأسماء أو التواريخ
```

---

## 🆘 استكشاف الأخطاء

### المشكلة: "لا يمكن الدخول"

```
الحل:
1. تكد من أن username و password صحيحة
2. تأكد من أن الخادم يعمل:
   curl http://localhost:3000/api/health
3. تحقق من ملف .env.production
```

### المشكلة: "لا تحمل الصور"

```
الحل:
1. تأكد من أن مجلد images/ موجود
2. تحقق من صلاحيات الملفات (755 للمجلدات)
3. استخدم مسارات نسبية في الكود
```

### المشكلة: "خطأ في الـ API"

```
الحل:
1. افتح DevTools في المتصفح (F12)
2. اذهب إلى Tab: Network
3. حاول تسجيل الدخول
4. شاهد الطلبات والأخطاء
5. اطلب دعم فني من Hostinger
```

---

## 📞 دعم Hostinger

```
الدردشة المباشرة (24/7):
- في لوحة Hostinger
- اختر: Live Chat

البريد الإلكتروني:
- support@hostinger.com

الهاتف:
- رقم الدعم في حسابك
```

---

## ✅ قائمة التحقق النهائية

قبل إخبار العميل بالموقع:

```
☐ الملفات رُفعت بالكامل
☐ قاعدة البيانات توجد في الخادم
☐ Backend يعمل (يمكنك الوصول إلى /api/health)
☐ Frontend يحمل بدون أخطاء
☐ صفحة الدخول تعمل
☐ تسجيل الدخول ينجح
☐ إضافة منتج تعمل
☐ حذف منتج يعمل
☐ راجع وحدّث كلمات المرور
☐ راجع وحدّث JWT_SECRET
☐ HTTPS/SSL مفعّل
☐ Domain يشير إلى الصحيح
☐ اختبر من جهاز آخر
```

---

## 📝 ملخص الأوامر الأساسية

```bash
# في Hostinger Terminal

# نسخ الملفات
scp -r backend/* username@zonewear.com:/home/username/backend/

# تشغيل الخادم
npm install
pm2 start ecosystem.config.js --env production

# عرض الحالة
pm2 status

# عرض السجلات
pm2 logs

# إيقاف الخادم
pm2 stop zonewear-backend

# إعادة تشغيل الخادم
pm2 restart zonewear-backend
```

---

## 🎉 النتيجة النهائية

بعد اتباع جميع الخطوات:

✅ **الموقع يعمل على:** https://zonewear.com  
✅ **الإدمين يدخل من:** https://zonewear.com/admin-login.html  
✅ **يمكنه إضافة/حذف المنتجات مباشرة**  
✅ **البيانات تُحفظ في قاعدة البيانات تلقائياً**  
✅ **كل شيء آمن ومشفر**  

---

**تاريخ الدليل:** 23 فبراير 2026  
**الإصدار:** 1.0 - Production Ready
