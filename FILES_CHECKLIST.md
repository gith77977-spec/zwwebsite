# 📋 فهرس الملفات للنشر - ZONEWEAR

**تاريخ الإعداد:** 23 فبراير 2026

---

## 📦 الملفات الواجب رفعها إلى public_html/

### HTML Files (9 ملفات)

```
index.html                    4.6 KB      ✅
├─ الصفحة الرئيسية
├─ الهبوط الأول للزوار
└─ يجب رفعها أولاً

admin-login.html             19.5 KB     ✅
├─ صفحة دخول المسؤول
├─ تتضمن config.js
└─ مهمة جداً للإدارة

admin.html                   33.8 KB     ✅
├─ لوحة التحكم الرئيسية
├─ أكبر ملف HTML
└─ نقطة التحكم الكاملة

admin-settings.html          19.2 KB     ✅
├─ إعدادات حساب المسؤول
├─ يحتوي على config.js
└─ إدارة النسخ الاحتياطية

products.html                3.5 KB      ✅
├─ عرض المنتجات للزوار
├─ ملف صغير خفيف
└─ يتوافق مع جميع الأجهزة

about.html                   3.5 KB      ✅
├─ صفحة من نحن
└─ معلومات الشركة

contact.html                 4.2 KB      ✅
├─ صفحة اتصل بنا
└─ نموذج التواصل

test-backend.html           17.5 KB      ⚠️  اختياري
├─ صفحة اختبار API
├─ للاختبار فقط (يمكن عدم رفعها)
└─ ننصح برفعها للمتابعة

test-products.html           5.6 KB      ⚠️  اختياري
├─ اختبار المنتجات
├─ للاختبار فقط
└─ اختياري
```

### CSS و JavaScript (3 ملفات)

```
style.css                    ملف CSS     ✅
├─ جميع الأنماط والألوان
├─ الرسوم المتحركة
└─ القوائم والتصميمات المتجاوبة

script.js                    ملف JS      ✅
├─ كل الوظائف الأساسية
├─ معالجة الأحداث
└─ التفاعل مع المستخدم

config.js                    48 سطر      ✅ جديد
├─ إعدادات الـ API الديناميكية
├─ يكتشف environment تلقائياً
└─ مهم جداً للإنتاج
```

### المجلدات (3 مجلدات)

```
admin/                       مجلد        ✅
├─ ملفات إضافية للإدارة
└─ يتم إنشاء الملفات فيه تلقائياً

images/                      مجلد        ✅
├─ صور المنتجات (5 صور موجودة)
├─ صور الشعار
├─ صور الخلفيات
└─ صور العروض الدعائية

videos/                      مجلد        ✅
├─ فيديو عرض المنتج
├─ فيديو الشركة
└─ فيديو التعليمات
```

**المجموع:**
```
✅ 9 ملفات HTML
✅ 1 ملف CSS
✅ 1 ملف JavaScript
✅ 1 ملف config.js (جديد)
✅ 3 مجلدات
───────────────
✅ المجموع: 15 عنصر
```

---

## 📦 الملفات الواجب رفعها إلى backend/ (مجلد منفصل)

### ملفات Python/Node.js الأساسية

```
server.js                    12.48 KB    ✅
├─ خادم Express الرئيسي
├─ جميع API endpoints (14 function)
├─ معالجة الطلبات
└─ الأهمية: حرجة جداً

database.js                  5.59 KB     ✅
├─ إدارة قاعدة البيانات
├─ التهيئة التلقائية
├─ التخزين والاسترجاع
└─ الأهمية: حرجة جداً

package.json                 مهم         ✅
├─ قائمة المكتبات المطلوبة
├─ يجب عدم تعديله
└─ npm install يقرأه
```

### ملفات الإعدادات

```
.env.production              مهم جداً    ✅
├─ إعدادات الإنتاج
├─ JWT_SECRET (الأمان)
├─ PORT=3000
├─ NODE_ENV=production
├─ ALLOWED_ORIGIN=https://yourdomain.com
└─ يجب تحديثه بدومينك الفعلي

.env                         (تطوير فقط)  ℹ️  اختياري
├─ إعدادات التطوير
├─ لا تحتاجه في الإنتاج
└─ يمكن تخطيه
```

### ملف PM2 (إدارة العمليات)

```
ecosystem.config.js          0.48 KB     ✅
├─ إعدادات PM2 للإنتاج
├─ clustering mode
├─ auto-restart على الأعطال
├─ monitoring الذاكرة
└─ الأهمية: مهم لاستقرار الموقع
```

### قاعدة البيانات

```
zonewear.db                  32 KB       ✅
├─ ملف قاعدة البيانات SQLite
├─ بيانات المنتجات
├─ سجل الطلبات
├─ حسابات المسؤولين
└─ جداول النسخ الاحتياطية

db/                          مجلد        ✅
├─ مجلد النسخ الاحتياطية
├─ ستُنشأ تلقائياً إذا لم تكن موجودة
└─ للنسخ الاحتياطية اليومية
```

### ملفات npm

```
node_modules/                مجلد        ✅
├─ 2824 ملف (جميع المكتبات)
├─ يُنشأ تلقائياً بـ npm install
├─ لا تحتاج لرفعه إذا كان 
│  Node.js موجوداً على السيرفر
└─ أو رفعه إذا كنت تريد توفير الوقت
```

**المجموع:**
```
✅ 2 ملف جافاسكريبت (server.js + database.js)
✅ 1 ملف package.json
✅ 2 ملف env (.env.production + .env)
✅ 1 ملف ecosystem.config.js
✅ 1 ملف قاعدة البيانات (zonewear.db)
✅ 2 مجلد (db/ + node_modules/)
───────────────
✅ المجموع: 9 عناصر
```

---

## 🚀 ملخص النسخ (Copy & Paste)

### المجلداد يجب أن تبدو كالتالي بعد النسخ:

```
Hostinger Public HTML (Front-end)
│
├── index.html
├── admin-login.html
├── admin.html
├── admin-settings.html
├── products.html
├── about.html
├── contact.html
├── test-backend.html            (اختياري)
├── test-products.html           (اختياري)
│
├── style.css
├── script.js
├── config.js                    ⭐ جديد
│
├── admin/
├── images/
│   ├── zw-1.jpg
│   ├── zw-2.jpg
│   ├── zw-3.jpg
│   ├── zw-4.jpg
│   └── zw-5.jpg
│
└── videos/
    └── zonewear-product.mp4

═══════════════════════════════════════════

Hostinger Backend Server (منفصل)
│
├── server.js
├── database.js
├── package.json
│
├── .env.production              ⭐ جديد
├── .env
├── ecosystem.config.js          ⭐ جديد
│
├── zonewear.db
│
├── db/
│   └── (سيتم إنشاء النسخ هنا)
│
└── node_modules/
    └── (2824 ملف من المكتبات)
```

---

## 📊 الأحجام الإجمالية

### Frontend (في public_html):
```
HTML Files:          ~90 KB
CSS/JavaScript:      ~100 KB
Images:              ~1-2 MB (حسب دقة الصور)
Videos:              ~10-50 MB (حسب جودة الفيديو)
───────────────────────────
المجموع:             ~15-100 MB (حسب الوسائط)
```

### Backend (مجلد منفصل):
```
Python/Node files:   ~18 KB
Config files:        ~1 KB
Database:            ~32 KB
node_modules/:       ~50-100 MB
───────────────────────────
المجموع:             ~50-100 MB (بدون node_modules: ~51 KB فقط)
```

---

## ✅ قائمة المراجعة قبل النسخ

```
☐ قائمة 9 ملفات HTML كاملة
☐ ملف style.css موجود
☐ ملف script.js موجود
☐ ملف config.js موجود ⭐ جديد
☐ مجلد admin/ موجود
☐ مجلد images/ موجود مع الصور
☐ مجلد videos/ موجود مع الفيديو

☐ ملف server.js موجود
☐ ملف database.js موجود
☐ ملف package.json موجود
☐ ملف .env.production موجود ⭐ جديد
☐ ملف ecosystem.config.js موجود ⭐ جديد
☐ ملف zonewear.db موجود

☐ ALLOWED_ORIGIN محدث في .env.production
☐ جميع الملفات بصيغتها الصحيحة (UTF-8)
☐ لا توجد ملفات مؤقتة (.tmp, .bak)
☐ جميع الأسماء بنفس حالة الأحرف (Case sensitive)
```

---

## 🔧 ملخص الأوامر المهمة

```bash
# بعد رفع الملفات:
cd ~/zonewear-backend

# تثبيت المكتبات
npm install

# تشغيل البرنامج
pm2 start ecosystem.config.js --env production

# عرض الحالة
pm2 status

# عرض السجلات
pm2 logs

# الدخول للموقع
https://yourdomain.com
https://yourdomain.com/admin-login.html
```

---

## 📝 ملاحظات مهمة

```
⚠️  تحديثات مهمة:

1. ملف config.js ⭐ جديد
   - لتشغيل الموقع على أي دومين
   - يجب رفعه إلى public_html

2. ملف .env.production ⭐ جديد
   - يجب تعديل ALLOWED_ORIGIN
   - ضع دومينك الفعلي

3. ملف ecosystem.config.js ⭐ جديد
   - لتشغيل Backend على الإنتاج
   - يستبدل npm start

4. الملفات الجديدة لا تحتوي على أخطاء
   - تم اختبارها عملياً
   - جاهزة 100% للإنتاج
```

---

**إجمالي الملفات: 15 عنصر (Frontend) + 9 عناصر (Backend)**

**الحالة: ✅ جاهز 100% للنسخ**
