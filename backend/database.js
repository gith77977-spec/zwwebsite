const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'zonewear.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database at:', dbPath);
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Admin Users Table
    db.run(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE,
            fullName TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating admins table:', err);
        else console.log('Admins table ready');
    });

    // Products Table
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            descAr TEXT,
            price REAL NOT NULL,
            category TEXT,
            stock INTEGER DEFAULT 0,
            image TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating products table:', err);
        else console.log('Products table ready');
    });

    // Orders Table
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer TEXT NOT NULL,
            phone TEXT,
            state TEXT,
            products TEXT NOT NULL,
            total REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            notes TEXT
        )
    `, (err) => {
        if (err) console.error('Error creating orders table:', err);
        else console.log('Orders table ready');
    });

    // Backups Table
    db.run(`
        CREATE TABLE IF NOT EXISTS backups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            filePath TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            size INTEGER,
            status TEXT DEFAULT 'completed'
        )
    `, (err) => {
        if (err) console.error('Error creating backups table:', err);
        else console.log('Backups table ready');
    });

    // Create default admin if not exists
    setDefaultAdmin();
}

// Set default admin user
function setDefaultAdmin() {
    const defaultUsername = 'zonewear2026';
    const defaultPassword = 'Wz2L9MqswZweb';
    
    db.get('SELECT * FROM admins WHERE username = ?', [defaultUsername], (err, row) => {
        if (!row) {
            const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
            db.run(
                `INSERT INTO admins (username, password, email, fullName) 
                 VALUES (?, ?, ?, ?)`,
                [defaultUsername, hashedPassword, 'admin@zonewear.com', 'ZONEWEAR Admin'],
                (err) => {
                    if (err) console.error('Error creating default admin:', err);
                    else console.log('Default admin created:', defaultUsername);
                }
            );
        }
    });
}

// Helper functions
function getAllProducts() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM products', (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

function getProductById(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function getAllOrders() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM orders ORDER BY date DESC', (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

function getAdminByUsername(username) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM admins WHERE username = ?', [username], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function updateAdmin(id, data) {
    return new Promise((resolve, reject) => {
        const { email, fullName, password } = data;
        let hashedPassword = password;
        
        if (password) {
            hashedPassword = bcrypt.hashSync(password, 10);
        }
        
        let query = 'UPDATE admins SET ';
        let params = [];
        
        if (email) {
            query += 'email = ?, ';
            params.push(email);
        }
        if (fullName) {
            query += 'fullName = ?, ';
            params.push(fullName);
        }
        if (password) {
            query += 'password = ?, ';
            params.push(hashedPassword);
        }
        
        query += 'updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
        params.push(id);
        
        db.run(query, params, (err) => {
            if (err) reject(err);
            else resolve({ success: true });
        });
    });
}

module.exports = {
    db,
    getAllProducts,
    getProductById,
    getAllOrders,
    getAdminByUsername,
    updateAdmin
};
