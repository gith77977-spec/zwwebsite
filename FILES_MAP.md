# 🗺️ خريطة المشروع البصرية - أين كل شيء؟

**دليل بصري يساعدك تجد كل ملف بسرعة**

---

## 📂 المجلد الرئيسي

```
C:\Users\Adverdesign\Desktop\zwwebsite2\zwwebsite
│
│ ┌─── 🌐 الصفحات (أنت تراها في المتصفح)
├─┤
│ ├─ 📄 index.html ............................ الصفحة الرئيسية
│ ├─ 📄 admin-login.html ..................... دخول الإدمن
│ ├─ 📄 admin.html ........................... لوحة التحكم
│ ├─ 📄 admin-settings.html ................. إعدادات الحساب
│ ├─ 📄 products.html ........................ عرض المنتجات
│ ├─ 📄 about.html ........................... من نحن
│ ├─ 📄 contact.html ......................... اتصل بنا
│ ├─ 📄 test-backend.html ................... اختبار الخادم
│ ├─ 📄 test-products.html .................. اختبار المنتجات
│ 
│ ┌─── 🎨 التصميم والتفاعل
├─┤
│ ├─ 🎨 style.css ........................... الألوان والتصميم
│ ├─ ⚙️ script.js ........................... الحركة والتفاعل
│ ├─ ⚡ config.js (جديد!) .................. الإعدادات الديناميكية
│
│ ┌─── 📁 مجلدات الملفات
├─┤
│ ├─ 📁 admin/ ............................. ملفات إدارية إضافية
│ ├─ 📁 images/ ............................ صور المنتجات (5 صور)
│ ├─ 📁 videos/ ............................ فيديوهات (فيديو واحد)
│ ├─ 📁 backend/ ........................... الخادم الخلفي (أسفل)
│ ├─ 📁 db/ ................................ قاعدة البيانات والنسخ
│
│ ┌─── 📝 ملفات الإعدادات
├─┤
│ ├─ 🔐 .env.production (جديد!) ........... إعدادات الإنتاج
│ ├─ 🔐 .env .............................. إعدادات التطوير
│
│ ┌─── 📚 ملفات التوثيق
└─┤
  ├─ 📖 README.md ........................ الشرح العام
  ├─ 📖 START_HERE.md ................... ابدأ من هنا
  ├─ 📖 COMPLETE_BEGINNER_GUIDE.md ..... الشرح المفصل
  ├─ 📖 PRACTICAL_STEP_BY_STEP.md ...... الخطوات العملية
  ├─ 📖 QUESTIONS_AND_ANSWERS.md ....... أسئلة وأجوبة
  ├─ 📖 ... وملفات توثيق أخرى كتير
```

---

## 📁 مجلد backend (الخادم الخلفي)

```
backend/
│
├─ 🖥️ ملفات الخادم الرئيسية
│  ├─ server.js ..................... الخادم الذي يستقبل الطلبات
│  └─ database.js .................. إدارة قاعدة البيانات
│
├─ 📦 المكتبات
│  ├─ package.json ................. قائمة المكتبات المطلوبة
│  ├─ node_modules/ ................ المكتبات نفسها (2824 ملف)
│  └─ package-lock.json ............ ملف التثبيت
│
├─ 🔐 الإعدادات
│  ├─ .env ......................... إعدادات التطوير
│  ├─ .env.production (جديد!) ..... إعدادات الإنتاج
│  └─ ecosystem.config.js (جديد!) . إعدادات PM2
│
├─ 💾 قاعدة البيانات
│  ├─ zonewear.db .................. ملف البيانات (32 KB)
│  └─ db/ .......................... مجلد النسخ الاحتياطية
│
└─ 📁 مجلدات إضافية
   └─ db/ ......................... النسخ الاحتياطية تُحفظ هنا
```

---

## 🖼️ مجلد images (الصور)

```
images/
│
├─ 🖼️ zw-1.jpg ..................... صورة منتج 1
├─ 🖼️ zw-2.jpg ..................... صورة منتج 2
├─ 🖼️ zw-3.jpg ..................... صورة منتج 3
├─ 🖼️ zw-4.jpg ..................... صورة منتج 4
└─ 🖼️ zw-5.jpg ..................... صورة منتج 5
```

---

## 🎬 مجلد videos (الفيديوهات)

```
videos/
│
└─ 🎬 zonewear-product.mp4 ......... فيديو عرض المنتج
```

---

## 📋 جدول معلومات الملفات

### الملفات الأساسية (Frontend)

| الملف | الحجم | الموقع بالكامل | الدور |
|---|---|---|---|
| **index.html** | 4.6 KB | `zwwebsite/index.html` | الصفحة الأولى |
| **admin-login.html** | 19.5 KB | `zwwebsite/admin-login.html` | دخول الإدمن |
| **admin.html** | 33.8 KB | `zwwebsite/admin.html` | لوحة التحكم |
| **admin-settings.html** | 19.2 KB | `zwwebsite/admin-settings.html` | إعدادات الحساب |
| **products.html** | 3.5 KB | `zwwebsite/products.html` | المنتجات |
| **about.html** | 3.5 KB | `zwwebsite/about.html` | من نحن |
| **contact.html** | 4.2 KB | `zwwebsite/contact.html` | اتصل بنا |
| **style.css** | ~50 KB | `zwwebsite/style.css` | التصميم |
| **script.js** | ~50 KB | `zwwebsite/script.js` | التفاعل |
| **config.js ⭐** | 1 KB | `zwwebsite/config.js` | API الديناميكي |

### ملفات Backend

| الملف | الحجم | الموقع بالكامل | الدور |
|---|---|---|---|
| **server.js** | 12.48 KB | `backend/server.js` | الخادم الرئيسي |
| **database.js** | 5.59 KB | `backend/database.js` | إدارة البيانات |
| **package.json** | < 1 KB | `backend/package.json` | قائمة المكتبات |
| **zonewear.db** | 32 KB | `backend/zonewear.db` | قاعدة البيانات |

### ملفات الإعدادات

| الملف | الحجم | الموقع بالكامل | الدور |
|---|---|---|---|
| **.env** | < 1 KB | `zwwebsite/.env` | التطوير |
| **.env.production ⭐** | < 1 KB | `zwwebsite/.env.production` | الإنتاج |
| **ecosystem.config.js ⭐** | < 1 KB | `backend/ecosystem.config.js` | PM2 |

---

## 🎯 أين أجد ماذا أحتاج؟

### إذا أردت تعديل التصميم؟
```
✏️ اذهب إلى: style.css
📍 الموقع: C:\Users\Adverdesign\Desktop\zwwebsite2\zwwebsite\style.css
📝 ماذا تعدّل: الألوان، الحجم، الخطوط، الرسوم المتحركة
```

### إذا أردت تعديل الوظائف؟
```
✏️ اذهب إلى: script.js
📍 الموقع: C:\Users\Adverdesign\Desktop\zwwebsite2\zwwebsite\script.js
📝 ماذا تعدّل: الأزرار، الرسائل، السلوك
```

### إذا أردت إضافة منتج جديد؟
```
✏️ اذهب إلى: admin-login.html
📍 الرابط: https://yourdomain.com/admin-login.html
📝 الخطوات:
   1. ادخل بـ البيانات
   2. اضغط: Add Product
   3. أملأ: الاسم والسعر والوصف والصورة
   4. احفظ
```

### إذا أردت تغيير الدومين في الإنتاج؟
```
✏️ اذهب إلى: .env.production
📍 الموقع: C:\Users\Adverdesign\Desktop\zwwebsite2\zwwebsite\.env.production
📝 ماذا تعدّل: ALLOWED_ORIGIN
   من: https://zonewear.com
   إلى: https://yourdomain.com
```

### إذا أردت إعادة تشغيل الخادم؟
```
✏️ افتح: Terminal/SSH في Hostinger
📝 اكتب: pm2 restart 0
```

### إذا أردت عمل نسخة احتياطية؟
```
✏️ اذهب إلى: lوحة التحكم
📍 Address: https://yourdomain.com/admin-login.html
📝 الخطوات:
   1. ادخل
   2. اضغط: Settings
   3. اضغط: Create Backup
```

### إذا أردت إضافة صورة جديدة؟
```
✏️ اذهب إلى: مجلد images
📍 الموقع: C:\Users\Adverdesign\Desktop\zwwebsite2\zwwebsite\images\
📝 ماذا تفعل:
   1. ضع الصورة الجديدة في المجلد
   2. سمّها بطريقة واضحة (مثلاً: new-product.jpg)
   3. رفعها في admin من لوحة التحكم
```

---

## 📊 إحصائيات المشروع

### عدد الملفات

```
📄 ملفات HTML:           9 ملفات
🎨 ملفات CSS:            1 ملف
⚙️ ملفات JavaScript:     3 ملفات (script + config + tests)
🖥️ ملفات Backend:        2 ملف (server + database)
⚙️ ملفات الإعدادات:      3 ملفات (.env, .env.production, ecosystem)
💾 ملفات البيانات:        1 ملف (zonewear.db)
📦 ملفات الإدارة:         1 ملف (package.json)
─────────────────────────────────
📊 المجموع: 20 ملف رئيسي
```

### المكتبات (npm packages)

```
📦 express ................ خادم الويب
📦 cors .................. الأمان بين الأنظمة
📦 sqlite3 ............... قاعدة البيانات
📦 bcryptjs .............. تشفير كلمات المرور
📦 jsonwebtoken .......... التوثيق الآمن
📦 body-parser ........... قراءة البيانات
📦 dotenv ................ إدارة الإعدادات
📦 pm2 ................... إدارة العمليات
─────────────────────────────────
📊 المجموع: 8 مكتبات
```

---

## 🔐 ملفات حساسة (احذر من حذفها!)

```
🔴 خطر جداً:
   ❌ لا تحذف: zonewear.db (قاعدة البيانات)
   ❌ لا تعدّل: server.js (بدون احترافية)
   ❌ لا تعدّل: database.js (بدون احترافية)
   
🟠 احذر:
   ⚠️ احذر من إضافة أشياء خطرة في script.js
   ⚠️ احذر من تغيير JWT_SECRET معشوائياً
   ⚠️ احذر من حذف المجلدات النشطة

🟢 آمن:
   ✅ يمكنك تعديل style.css بسهولة
   ✅ يمكنك إضافة صور جديدة
   ✅ يمكنك تعديل HTML (بحذر)
```

---

## 🗂️ التنظيم الموصى به

### المجلد الأساسي

```
بعد النشر على Hostinger، يجب تكون البنية:

public_html/
├─ جميع ملفات HTML
├─ style.css
├─ script.js
├─ config.js
├─ admin/
├─ images/
└─ videos/

backend/ (أو /app أو أي اسم آخر)
├─ server.js
├─ database.js
├─ package.json
├─ .env.production
├─ ecosystem.config.js
├─ zonewear.db
├─ db/
└─ node_modules/
```

---

## 📍 الملفات الجديدة (الـ ⭐)

### موقع كل ملف جديد

```
⭐ config.js
   📍 الموقع: C:\Users\Adverdesign\Desktop\zwwebsite2\zwwebsite\config.js
   📊 الحجم: 48 سطر
   🎯 الدور: إعدادات API الديناميكية
   🔧 الاستخدام: يستخدمه admin-login.html و admin-settings.html

⭐ .env.production
   📍 الموقع: C:\Users\Adverdesign\Desktop\zwwebsite2\zwwebsite\.env.production
   📊 الحجم: 6 سطور
   🎯 الدور: إعدادات الإنتاج (الإنترنت)
   🔧 المهم: عدّل ALLOWED_ORIGIN قبل النشر!

⭐ ecosystem.config.js
   📍 الموقع: C:\Users\Adverdesign\Desktop\zwwebsite2\zwwebsite\backend\ecosystem.config.js
   📊 الحجم: 23 سطر
   🎯 الدور: إعدادات PM2 (إدارة الخادم)
   🔧 الاستخدام: استخدمه بدلاً من npm start
```

---

## 🎯 خريطة سريعة جداً

```
تريد أن تفهم كل شيء بسرعة؟

الملفات المهمة الـ 5:
1. index.html ........... الصفحة الأولى
2. admin-login.html ..... دخول الإدمن
3. admin.html ........... لوحة التحكم
4. server.js ............ الخادم
5. zonewear.db .......... قاعدة البيانات

الملفات الجديدة الـ 3:
1. config.js ............ API الديناميكي
2. .env.production ....... إعدادات الإنتاج
3. ecosystem.config.js ... PM2

جميع الباقي:
← تفاصيل وملفات إضافية
```

---

## ✅ قائمة تحقق سريعة

```
قبل النشر، تحقق من:

☑️ جميع الملفات موجودة في zwwebsite/
☑️ مجلد backend/ موجود وفيه جميع الملفات
☑️ images/ وفيه الصور
☑️ videos/ وفيه الفيديو
☑️ zonewear.db موجود في backend/
☑️ node_modules/ موجود في backend/
☑️ .env.production معدّل (ALLOWED_ORIGIN)
☑️ جميع صفحات HTML موجودة

جاهز؟ ابدأ النشر!
```

---

**هل وجدت ما تبحث عنه؟ إذا لا، اسأل!** 😊
