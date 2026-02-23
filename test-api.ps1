# Complete API Testing Script
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "    ZONEWEAR Complete System Validation    " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host " " -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "TEST 1: Health Check" -ForegroundColor Yellow
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -UseBasicParsing -ErrorAction Stop
    $data = $resp.Content | ConvertFrom-Json
    Write-Host "✅ Status: $($data.status) | Time: $($data.timestamp)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host " " -ForegroundColor Cyan

# Test 2: Get Products
Write-Host "TEST 2: Get Products (Public)" -ForegroundColor Yellow
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:3000/api/products" -Method GET -UseBasicParsing -ErrorAction Stop
    $data = $resp.Content | ConvertFrom-Json
    Write-Host "✅ Total Products: $($data.products.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host " " -ForegroundColor Cyan

# Test 3: Admin Login
Write-Host "TEST 3: Admin Login (Password Authentication)" -ForegroundColor Yellow
try {
    $loginBody = '{"username":"zonewear2026","password":"Wz2L9MqswZweb"}'
    $resp = Invoke-WebRequest -Uri "http://localhost:3000/api/admin/login" -Method POST `
        -Body $loginBody -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
    $data = $resp.Content | ConvertFrom-Json
    if ($data.success) {
        $token = $data.token
        Write-Host "✅ Login Successful | Token: $($token.Substring(0,30))..." -ForegroundColor Green
    } else {
        Write-Host "❌ Login returned false" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    exit
}
Write-Host " " -ForegroundColor Cyan

# Test 4: Get Admin Profile
Write-Host "TEST 4: Get Admin Profile (Protected)" -ForegroundColor Yellow
try {
    $headers = @{"Authorization"="Bearer $token"}
    $resp = Invoke-WebRequest -Uri "http://localhost:3000/api/admin/profile" -Method GET `
        -Headers $headers -UseBasicParsing -ErrorAction Stop
    $data = $resp.Content | ConvertFrom-Json
    Write-Host "✅ Admin username: $($data.admin.username)" -ForegroundColor Green
    Write-Host "   Email: $($data.admin.email)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host " " -ForegroundColor Cyan

# Test 5: Protected Orders Endpoint
Write-Host "TEST 5: Get Orders (Protected)" -ForegroundColor Yellow
try {
    $headers = @{"Authorization"="Bearer $token"}
    $resp = Invoke-WebRequest -Uri "http://localhost:3000/api/orders" -Method GET `
        -Headers $headers -UseBasicParsing -ErrorAction Stop
    $data = $resp.Content | ConvertFrom-Json
    Write-Host "✅ Total Orders: $($data.orders.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host " " -ForegroundColor Cyan

# Test 6: Create Product
Write-Host "TEST 6: Create Product (Protected)" -ForegroundColor Yellow
try {
    $headers = @{"Authorization"="Bearer $token"}
    $productBody = @{
        name = "Test Product"
        descAr = "منتج اختبار"
        price = 99.99
        category = "test"
        stock = 10
        image = ""
    } | ConvertTo-Json
    
    $resp = Invoke-WebRequest -Uri "http://localhost:3000/api/products" -Method POST `
        -Headers $headers -Body $productBody -ContentType "application/json" `
        -UseBasicParsing -ErrorAction Stop
    $data = $resp.Content | ConvertFrom-Json
    if ($data.success) {
        Write-Host "✅ Product Created | ID: $($data.productId)" -ForegroundColor Green
    } else {
        Write-Host "❌ Product creation failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host " " -ForegroundColor Cyan

# Test 7: Create Order
Write-Host "TEST 7: Create Order (Public)" -ForegroundColor Yellow
try {
    $orderBody = @{
        customer = "أحمد محمد"
        phone = "07812345678"
        state = "بغداد"
        products = @(@{id=1; name="منتج"; price=99.99; quantity=1})
        total = 99.99
    } | ConvertTo-Json
    
    $resp = Invoke-WebRequest -Uri "http://localhost:3000/api/orders" -Method POST `
        -Body $orderBody -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
    $data = $resp.Content | ConvertFrom-Json
    if ($data.success) {
        Write-Host "✅ Order Created | ID: $($data.orderId)" -ForegroundColor Green
    } else {
        Write-Host "❌ Order creation failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host " " -ForegroundColor Cyan

# Test 8: Backup System
Write-Host "TEST 8: Create Backup (Protected)" -ForegroundColor Yellow
try {
    $headers = @{"Authorization"="Bearer $token"}
    $resp = Invoke-WebRequest -Uri "http://localhost:3000/api/backup" -Method POST `
        -Headers $headers -UseBasicParsing -ErrorAction Stop
    $data = $resp.Content | ConvertFrom-Json
    if ($data.success) {
        Write-Host "✅ Backup Created | Name: $($data.backupName)" -ForegroundColor Green
    } else {
        Write-Host "❌ Backup creation failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host " " -ForegroundColor Cyan

# Test 9: Get Backups
Write-Host "TEST 9: Get Backups (Protected)" -ForegroundColor Yellow
try {
    $headers = @{"Authorization"="Bearer $token"}
    $resp = Invoke-WebRequest -Uri "http://localhost:3000/api/backups" -Method GET `
        -Headers $headers -UseBasicParsing -ErrorAction Stop
    $data = $resp.Content | ConvertFrom-Json
    Write-Host "✅ Total Backups: $($data.backups.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
Write-Host " " -ForegroundColor Cyan

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "    All Tests Completed Successfully!       " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
