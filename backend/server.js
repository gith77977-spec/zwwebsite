const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const {
    db,
    getAllProducts,
    getProductById,
    getAllOrders,
    getAdminByUsername,
    updateAdmin
} = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

// CORS Configuration
const corsOptions = {
    origin: NODE_ENV === 'production' 
        ? ALLOWED_ORIGIN 
        : ['http://localhost:8000', 'http://localhost:3000', 'http://127.0.0.1:8000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Cache control middleware
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('X-Redeploy-Trigger', Date.now().toString());
    next();
});

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Authentication Middleware
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminId = decoded.id;
        req.username = decoded.username;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// ===== ADMIN ROUTES =====

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        
        const admin = await getAdminByUsername(username);
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const passwordMatch = bcrypt.compareSync(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                fullName: admin.fullName
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Admin Profile
app.get('/api/admin/profile', verifyToken, async (req, res) => {
    try {
        db.get('SELECT id, username, email, fullName, createdAt FROM admins WHERE id = ?', [req.adminId], (err, admin) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!admin) {
                return res.status(404).json({ error: 'Admin not found' });
            }
            res.json({ success: true, admin });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Admin Profile
app.put('/api/admin/profile', verifyToken, async (req, res) => {
    try {
        const { email, fullName, currentPassword, newPassword } = req.body;
        
        // Get current admin to verify password
        db.get('SELECT * FROM admins WHERE id = ?', [req.adminId], async (err, admin) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            if (!admin) {
                return res.status(404).json({ error: 'Admin not found' });
            }
            
            // If changing password, verify current password
            if (newPassword) {
                if (!currentPassword) {
                    return res.status(400).json({ error: 'Current password required' });
                }
                
                const passwordMatch = bcrypt.compareSync(currentPassword, admin.password);
                if (!passwordMatch) {
                    return res.status(401).json({ error: 'Current password is incorrect' });
                }
            }
            
            try {
                const updateData = {};
                if (email) updateData.email = email;
                if (fullName) updateData.fullName = fullName;
                if (newPassword) updateData.password = newPassword;
                
                await updateAdmin(req.adminId, updateData);
                res.json({ success: true, message: 'Profile updated successfully' });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== PRODUCT ROUTES =====

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add product (admin)
app.post('/api/products', verifyToken, (req, res) => {
    try {
        const { name, descAr, price, category, stock, image } = req.body;
        
        if (!name || !price) {
            return res.status(400).json({ error: 'Name and price required' });
        }
        
        db.run(
            `INSERT INTO products (name, descAr, price, category, stock, image)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, descAr, price, category, stock, image],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({
                    success: true,
                    message: 'Product added',
                    productId: this.lastID
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update product (admin)
app.put('/api/products/:id', verifyToken, (req, res) => {
    try {
        const { name, descAr, price, category, stock, image } = req.body;
        
        db.run(
            `UPDATE products SET name = ?, descAr = ?, price = ?, category = ?, stock = ?, image = ?, updatedAt = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [name, descAr, price, category, stock, image, req.params.id],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true, message: 'Product updated' });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete product (admin)
app.delete('/api/products/:id', verifyToken, (req, res) => {
    try {
        db.run('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, message: 'Product deleted' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== ORDER ROUTES =====

// Get all orders (admin)
app.get('/api/orders', verifyToken, async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add order (public)
app.post('/api/orders', (req, res) => {
    try {
        const { customer, phone, state, products, total } = req.body;
        
        db.run(
            `INSERT INTO orders (customer, phone, state, products, total, status)
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [customer, phone, state, JSON.stringify(products), total],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({
                    success: true,
                    message: 'Order created',
                    orderId: this.lastID
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update order status (admin)
app.put('/api/orders/:id', verifyToken, (req, res) => {
    try {
        const { status, notes } = req.body;
        
        let query = 'UPDATE orders SET ';
        let params = [];
        
        if (status) {
            query += 'status = ?, ';
            params.push(status);
        }
        if (notes) {
            query += 'notes = ?, ';
            params.push(notes);
        }
        
        query += 'date = CURRENT_TIMESTAMP WHERE id = ?';
        params.push(req.params.id);
        
        db.run(query, params, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, message: 'Order updated' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== BACKUP ROUTES =====

// Create backup
app.post('/api/backup', verifyToken, (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        
        const backupDir = path.join(__dirname, 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const backupFile = path.join(backupDir, `backup-${timestamp}.db`);
        
        // Copy database file
        fs.copyFileSync(path.join(__dirname, 'zonewear.db'), backupFile);
        
        const stats = fs.statSync(backupFile);
        
        // Record backup in database
        db.run(
            `INSERT INTO backups (name, filePath, size, status)
             VALUES (?, ?, ?, 'completed')`,
            [`backup-${timestamp}`, backupFile, stats.size],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({
                    success: true,
                    message: 'Backup created',
                    backupId: this.lastID,
                    file: `backup-${timestamp}`,
                    size: stats.size
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get backups list
app.get('/api/backups', verifyToken, (req, res) => {
    try {
        db.all(
            'SELECT id, name, timestamp, size, status FROM backups ORDER BY timestamp DESC',
            (err, backups) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true, backups });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback to index.html for non-API routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 404 Handler - send 404 JSON for API routes only
app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'Route not found' });
    } else {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║    ZONEWEAR Backend Server Running     ║
║           Port: ${PORT}                    ║
║    Database: SQLite (zonewear.db)      ║
╚════════════════════════════════════════╝
    `);
});
