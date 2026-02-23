# ZONEWEAR Backend Server

## مقدمة ✨

خادم Node.js/Express مع قاعدة بيانات SQLite لتطبيق ZONEWEAR.

### الميزات:
- ✅ نظام مصادقة آمن مع JWT
- ✅ قاعدة بيانات SQLite
- ✅ تشفير كلمات المرور بـ bcryptjs
- ✅ نظام إدارة المنتجات والطلبات
- ✅ نظام النسخ الاحتياطية التلقائية
- ✅ API RESTful شامل

---

## المتطلبات 📋

- **Node.js** v14 أو أحدث
- **npm** أو **yarn**

---

## التثبيت والتشغيل 🚀

### الخطوة 1: نصب المكتبات
```bash
cd backend
npm install
```

### الخطوة 2: تشغيل الخادم
```bash
npm start
```

أو للتطوير مع auto-reload:
```bash
npm run dev
```

### الخطوة 3: التحقق من الاتصال
افتح في المتصفح:
```
http://localhost:3000/api/health
```

يجب أن ترى:
```json
{ "status": "ok", "timestamp": "..." }
```

---

## API المتاح 🔌

### المصادقة (Authentication)

#### تسجيل الدخول
```
POST /api/admin/login
Headers: Content-Type: application/json
Body: {
  "username": "zonewear2026",
  "password": "Wz2L9MqswZweb"
}
Response: {
  "success": true,
  "token": "eyJhbGc...",
  "admin": { "id": 1, "username": "zonewear2026", ... }
}
```

#### الحصول على بيانات المسؤول
```
GET /api/admin/profile
Headers: Authorization: Bearer <token>
Response: { "success": true, "admin": {...} }
```

#### تحديث بيانات المسؤول
```
PUT /api/admin/profile
Headers: 
  - Authorization: Bearer <token>
  - Content-Type: application/json
Body: {
  "email": "new@email.com",
  "fullName": "Full Name",
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

---

### المنتجات (Products)

#### الحصول على جميع المنتجات
```
GET /api/products
Response: {
  "success": true,
  "products": [
    { "id": 1, "name": "Product Name", "price": 3500, ... },
    ...
  ]
}
```

#### إضافة منتج جديد
```
POST /api/products
Headers: 
  - Authorization: Bearer <token>
  - Content-Type: application/json
Body: {
  "name": "Product Name",
  "descAr": "الوصف بالعربية",
  "price": 3500,
  "category": "mens",
  "stock": 50,
  "image": "image-url"
}
```

#### تحديث منتج
```
PUT /api/products/:id
Headers: Authorization: Bearer <token>
```

#### حذف منتج
```
DELETE /api/products/:id
Headers: Authorization: Bearer <token>
```

---

### الطلبات (Orders)

#### الحصول على جميع الطلبات
```
GET /api/orders
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "orders": [...]
}
```

#### إنشاء طلب جديد
```
POST /api/orders
Body: {
  "customer": "Customer Name",
  "phone": "07XXXXXXX",
  "state": "State Name",
  "products": [...],
  "total": 10500
}
```

#### تحديث حالة الطلب
```
PUT /api/orders/:id
Headers: Authorization: Bearer <token>
Body: {
  "status": "completed",
  "notes": "Some notes"
}
```

---

### النسخ الاحتياطية (Backups)

#### إنشاء نسخة احتياطية
```
POST /api/backup
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "backupId": 1,
  "file": "backup-2026-02-22T...",
  "size": 45000
}
```

#### الحصول على قائمة النسخ الاحتياطية
```
GET /api/backups
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "backups": [...]
}
```

---

## متغيرات البيئة 🔐

ملف `.env`:
```
PORT=3000
JWT_SECRET=zonewear_secret_key_2026_very_secure_key_change_in_production
NODE_ENV=development
DB_PATH=./zonewear.db
```

**ملاحظة مهمة:** غيّر `JWT_SECRET` في الإنتاج!

---

## قاعدة البيانات 💾

### الجداول (Tables)

#### admins
```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL (encrypted with bcrypt),
  email TEXT UNIQUE,
  fullName TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
)
```

#### products
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  descAr TEXT,
  price REAL NOT NULL,
  category TEXT,
  stock INTEGER,
  image TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
)
```

#### orders
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer TEXT NOT NULL,
  phone TEXT,
  state TEXT,
  products TEXT (JSON),
  total REAL NOT NULL,
  status TEXT (pending/completed),
  date DATETIME,
  notes TEXT
)
```

#### backups
```sql
CREATE TABLE backups (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  filePath TEXT NOT NULL,
  timestamp DATETIME,
  size INTEGER,
  status TEXT
)
```

---

## أمان البيانات 🔒

### كلمات المرور
- جميع كلمات المرور مشفرة باستخدام **bcryptjs**
- salt rounds: 10

### JWT Tokens
- token expiration: 7 أيام
- التوقيع: HS256

### CORS
- مفعّل لجميع النطاقات
- قابل للتعديل في الإنتاج

---

## استكشاف الأخطاء 🛠️

### الخطأ: Cannot find module 'express'
```bash
npm install
```

### الخطأ: Port 3000 already in use
```bash
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux
```

### الخطأ: Database connection failed
تأكد من وجود صلاحيات الكتابة في المجلد.

---

## النسخ الاحتياطية 💾

النسخ الاحتياطية تُحفظ في:
```
backend/backups/backup-YYYY-MM-DDTHH-MM-SS.db
```

---

## الحد الأدنى من البيانات الافتراضية 👤

يتم إنشاء مسؤول افتراضي تلقائياً:
- **Username:** zonewear2026
- **Password:** Wz2L9MqswZweb

**غيّر كلمة المرور بعد التثبيت!**

---

## دعم وتطوير 📞

للمزيد من المعلومات أو الدعم التقني:
- اتصل بفريق ZONEWEAR
- البريد الإلكتروني: admin@zonewear.com

---

**آخر تحديث:** 22 فبراير 2026
