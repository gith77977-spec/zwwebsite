#!/usr/bin/env python3
# قراءة الملف
with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# حذف الجزء المكسور واستبداله
broken_part = '}\`n}\`n.product-img {\`n    width: 100%;\`n    height: 100%;\`n    object-fit: cover;\`n    object-position: center;\`n}'
fixed_part = '''}

.product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}'''

content = content.replace(broken_part, fixed_part)

# كتابة الملف المصلح
with open('style.css', 'w', encoding='utf-8') as f:
    f.write(content)

print('تم إصلاح CSS بنجاح!')
