const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// SQLite Database Setup
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Portfolio data table (stores all non-project data as JSON)
    db.run(`CREATE TABLE IF NOT EXISTS portfolio_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Projects table
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        tags TEXT,
        image TEXT,
        demoLink TEXT,
        category TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // About Cards table
    db.run(`CREATE TABLE IF NOT EXISTS about_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon TEXT,
        title TEXT,
        content TEXT,
        display_order INTEGER DEFAULT 0
    )`);

    // Languages table
    db.run(`CREATE TABLE IF NOT EXISTS languages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        percent INTEGER
    )`);

    // Education table
    db.run(`CREATE TABLE IF NOT EXISTS education (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        degree TEXT,
        institute TEXT,
        year TEXT
    )`);

    // Navigation table
    db.run(`CREATE TABLE IF NOT EXISTS navigation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        link TEXT,
        type TEXT,
        target TEXT DEFAULT '_self',
        display_order INTEGER DEFAULT 0
    )`);

    // Insert default admin
    const defaultPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)`, 
        ['admin@portfolio.com', defaultPassword]);

    // Insert default hero settings
    db.run(`INSERT OR IGNORE INTO portfolio_settings (key, value) VALUES (?, ?)`, 
        ['hero', JSON.stringify({
            image: '../src/images/profile.png',
            title: 'Tanzeela',
            typingText: 'Web & C++ Dev',
            cvLink: '#',
            buttonType: 'both'
        })]);

    // Insert default settings
    db.run(`INSERT OR IGNORE INTO portfolio_settings (key, value) VALUES (?, ?)`, 
        ['settings', JSON.stringify({
            siteTitle: 'Tanzeela Fatima',
            footerText: '© 2025 Tanzeela Fatima. All Rights Reserved.',
            homepageProjectsCount: 3
        })]);

    // Insert default contact
    db.run(`INSERT OR IGNORE INTO portfolio_settings (key, value) VALUES (?, ?)`, 
        ['contact', JSON.stringify({
            email: 'codequeen765@gmail.com',
            phone: '',
            address: ''
        })]);

    // Insert default about cards
    const aboutCards = [
        { icon: 'fa-user', title: 'Who I Am', content: "Hi, I'm Tanzeela Fatima, a passionate developer turning ideas into real digital products.", display_order: 0 },
        { icon: 'fa-code', title: 'What I Build', content: 'I build modern websites, backend systems, and Android UIs.', display_order: 1 },
        { icon: 'fa-bullseye', title: 'My Mission', content: 'To grow as a full-stack developer and work on meaningful projects.', display_order: 2 }
    ];
    aboutCards.forEach(card => {
        db.run(`INSERT OR IGNORE INTO about_cards (icon, title, content, display_order) VALUES (?, ?, ?, ?)`,
            [card.icon, card.title, card.content, card.display_order]);
    });

    // Insert default languages
    const languages = [
        { name: 'HTML', percent: 90 }, { name: 'CSS', percent: 80 }, { name: 'JavaScript', percent: 75 },
        { name: 'React', percent: 70 }, { name: 'Node.js', percent: 65 }, { name: 'Python', percent: 60 },
        { name: 'SQL', percent: 70 }, { name: 'MongoDB', percent: 65 }, { name: 'C++', percent: 85 }
    ];
    languages.forEach(lang => {
        db.run(`INSERT OR IGNORE INTO languages (name, percent) VALUES (?, ?)`, [lang.name, lang.percent]);
    });

    // Insert default education
    const education = [
        { degree: 'Bachelor in Information Technology', institute: 'University of Kotli, AJK', year: '2022 – Present' },
        { degree: 'Intermediate in Computer Science', institute: 'Fatima Jinnah College, Kotli', year: '2020 – 2022' }
    ];
    education.forEach(edu => {
        db.run(`INSERT OR IGNORE INTO education (degree, institute, year) VALUES (?, ?, ?)`,
            [edu.degree, edu.institute, edu.year]);
    });

    // Insert default navigation
    const navigation = [
        { name: 'Home', link: '../index.html', type: 'home', target: '_self', display_order: 0 },
        { name: 'About', link: '#about', type: 'section', target: '_self', display_order: 1 },
        { name: 'Languages', link: '#languages', type: 'section', target: '_self', display_order: 2 },
        { name: 'Projects', link: '../src/pages/projects.html', type: 'page', target: '_self', display_order: 3 },
        { name: 'Education', link: '#education', type: 'section', target: '_self', display_order: 4 },
        { name: 'Contact', link: '#contact', type: 'section', target: '_self', display_order: 5 }
    ];
    navigation.forEach(nav => {
        db.run(`INSERT OR IGNORE INTO navigation (name, link, type, target, display_order) VALUES (?, ?, ?, ?, ?)`,
            [nav.name, nav.link, nav.type, nav.target, nav.display_order]);
    });

    console.log('✅ SQLite Database initialized');
});

// ============ Helper Functions ============

const getSetting = (key, callback) => {
    db.get('SELECT value FROM portfolio_settings WHERE key = ?', [key], (err, row) => {
        if (err || !row) {
            callback(null, null);
        } else {
            callback(null, JSON.parse(row.value));
        }
    });
};

const updateSetting = (key, value, callback) => {
    const jsonValue = JSON.stringify(value);
    db.run(`INSERT OR REPLACE INTO portfolio_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [key, jsonValue], callback);
};

// ============ Authentication Middleware ============

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// ============ Auth Routes ============

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email },
            'your_jwt_secret_key',
            { expiresIn: '7d' }
        );
        
        res.json({ token, user: { id: user.id, email: user.email } });
    });
});

// ============ Portfolio Routes ============

// Get all portfolio data
app.get('/api/portfolio', async (req, res) => {
    try {
        // Get hero
        getSetting('hero', (err, hero) => {
            // Get settings
            getSetting('settings', (err, settings) => {
                // Get contact
                getSetting('contact', (err, contact) => {
                    // Get about cards
                    db.all('SELECT * FROM about_cards ORDER BY display_order', (err, aboutCards) => {
                        // Get languages
                        db.all('SELECT * FROM languages', (err, languages) => {
                            // Get projects
                            db.all('SELECT * FROM projects ORDER BY date DESC', (err, projects) => {
                                // Get education
                                db.all('SELECT * FROM education', (err, education) => {
                                    // Get navigation
                                    db.all('SELECT * FROM navigation ORDER BY display_order', (err, navigation) => {
                                        res.json({
                                            hero: hero || {},
                                            aboutCards: aboutCards || [],
                                            languages: languages || [],
                                            projects: projects || [],
                                            education: education || [],
                                            contact: contact || {},
                                            navigation: navigation || [],
                                            settings: settings || {}
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update hero
app.put('/api/portfolio/hero', auth, (req, res) => {
    updateSetting('hero', req.body, (err) => {
        if (err) {
            res.status(500).json({ message: 'Error updating hero' });
        } else {
            res.json({ message: 'Hero updated successfully' });
        }
    });
});

// Get about cards
app.get('/api/portfolio/about', (req, res) => {
    db.all('SELECT * FROM about_cards ORDER BY display_order', (err, cards) => {
        res.json(cards || []);
    });
});

// Add about card
app.post('/api/portfolio/about', auth, (req, res) => {
    const { icon, title, content, display_order } = req.body;
    db.run(`INSERT INTO about_cards (icon, title, content, display_order) VALUES (?, ?, ?, ?)`,
        [icon, title, content, display_order || 0], function(err) {
            if (err) {
                res.status(500).json({ message: 'Error adding card' });
            } else {
                res.json({ id: this.lastID, ...req.body });
            }
        });
});

// Update about card
app.put('/api/portfolio/about/:id', auth, (req, res) => {
    const { icon, title, content, display_order } = req.body;
    db.run(`UPDATE about_cards SET icon = ?, title = ?, content = ?, display_order = ? WHERE id = ?`,
        [icon, title, content, display_order, req.params.id], function(err) {
            if (err) {
                res.status(500).json({ message: 'Error updating card' });
            } else {
                res.json({ message: 'Card updated' });
            }
        });
});

// Delete about card
app.delete('/api/portfolio/about/:id', auth, (req, res) => {
    db.run('DELETE FROM about_cards WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ message: 'Error deleting card' });
        } else {
            res.json({ message: 'Card deleted' });
        }
    });
});

// Get languages
app.get('/api/portfolio/languages', (req, res) => {
    db.all('SELECT * FROM languages', (err, languages) => {
        res.json(languages || []);
    });
});

// Update languages (batch)
app.put('/api/portfolio/languages', auth, (req, res) => {
    const languages = req.body;
    db.run('DELETE FROM languages', [], (err) => {
        const stmt = db.prepare('INSERT INTO languages (name, percent) VALUES (?, ?)');
        languages.forEach(lang => {
            stmt.run(lang.name, lang.percent);
        });
        stmt.finalize();
        res.json({ message: 'Languages updated' });
    });
});

// Add language
app.post('/api/portfolio/languages', auth, (req, res) => {
    const { name, percent } = req.body;
    db.run('INSERT INTO languages (name, percent) VALUES (?, ?)', [name, percent], function(err) {
        if (err) {
            res.status(500).json({ message: 'Error adding language' });
        } else {
            res.json({ id: this.lastID, ...req.body });
        }
    });
});

// Delete language
app.delete('/api/portfolio/languages/:id', auth, (req, res) => {
    db.run('DELETE FROM languages WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ message: 'Error deleting language' });
        } else {
            res.json({ message: 'Language deleted' });
        }
    });
});

// Get projects
app.get('/api/portfolio/projects', (req, res) => {
    db.all('SELECT * FROM projects ORDER BY date DESC', (err, projects) => {
        res.json(projects || []);
    });
});

// Get homepage projects (limited)
app.get('/api/portfolio/homepage-projects', (req, res) => {
    getSetting('settings', (err, settings) => {
        const count = settings?.homepageProjectsCount || 3;
        db.all('SELECT * FROM projects ORDER BY date DESC LIMIT ?', [count], (err, projects) => {
            res.json(projects || []);
        });
    });
});

// Add project
app.post('/api/portfolio/projects', auth, (req, res) => {
    const { title, description, tags, image, demoLink, category } = req.body;
    db.run(`INSERT INTO projects (title, description, tags, image, demoLink, category) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, tags, image, demoLink, category], function(err) {
            if (err) {
                res.status(500).json({ message: 'Error adding project' });
            } else {
                res.json({ id: this.lastID, ...req.body });
            }
        });
});

// Update project
app.put('/api/portfolio/projects/:id', auth, (req, res) => {
    const { title, description, tags, image, demoLink, category } = req.body;
    db.run(`UPDATE projects SET title = ?, description = ?, tags = ?, image = ?, demoLink = ?, category = ? WHERE id = ?`,
        [title, description, tags, image, demoLink, category, req.params.id], function(err) {
            if (err) {
                res.status(500).json({ message: 'Error updating project' });
            } else {
                res.json({ message: 'Project updated' });
            }
        });
});

// Delete project
app.delete('/api/portfolio/projects/:id', auth, (req, res) => {
    db.run('DELETE FROM projects WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ message: 'Error deleting project' });
        } else {
            res.json({ message: 'Project deleted' });
        }
    });
});

// Get education
app.get('/api/portfolio/education', (req, res) => {
    db.all('SELECT * FROM education', (err, education) => {
        res.json(education || []);
    });
});

// Add education
app.post('/api/portfolio/education', auth, (req, res) => {
    const { degree, institute, year } = req.body;
    db.run('INSERT INTO education (degree, institute, year) VALUES (?, ?, ?)',
        [degree, institute, year], function(err) {
            if (err) {
                res.status(500).json({ message: 'Error adding education' });
            } else {
                res.json({ id: this.lastID, ...req.body });
            }
        });
});

// Delete education
app.delete('/api/portfolio/education/:id', auth, (req, res) => {
    db.run('DELETE FROM education WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ message: 'Error deleting education' });
        } else {
            res.json({ message: 'Education deleted' });
        }
    });
});

// Update contact
app.put('/api/portfolio/contact', auth, (req, res) => {
    updateSetting('contact', req.body, (err) => {
        if (err) {
            res.status(500).json({ message: 'Error updating contact' });
        } else {
            res.json({ message: 'Contact updated' });
        }
    });
});

// Get navigation
app.get('/api/portfolio/navigation', (req, res) => {
    db.all('SELECT * FROM navigation ORDER BY display_order', (err, navigation) => {
        res.json(navigation || []);
    });
});

// Update navigation (batch)
app.put('/api/portfolio/navigation', auth, (req, res) => {
    const navigation = req.body;
    db.run('DELETE FROM navigation', [], (err) => {
        const stmt = db.prepare('INSERT INTO navigation (name, link, type, target, display_order) VALUES (?, ?, ?, ?, ?)');
        navigation.forEach((nav, index) => {
            stmt.run(nav.name, nav.link, nav.type, nav.target || '_self', nav.display_order || index);
        });
        stmt.finalize();
        res.json({ message: 'Navigation updated' });
    });
});

// Add navigation item
app.post('/api/portfolio/navigation', auth, (req, res) => {
    const { name, link, type, target, display_order } = req.body;
    db.run(`INSERT INTO navigation (name, link, type, target, display_order) VALUES (?, ?, ?, ?, ?)`,
        [name, link, type, target || '_self', display_order || 0], function(err) {
            if (err) {
                res.status(500).json({ message: 'Error adding navigation item' });
            } else {
                res.json({ id: this.lastID, ...req.body });
            }
        });
});

// Delete navigation item
app.delete('/api/portfolio/navigation/:id', auth, (req, res) => {
    db.run('DELETE FROM navigation WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ message: 'Error deleting navigation item' });
        } else {
            res.json({ message: 'Navigation item deleted' });
        }
    });
});

// Update settings
app.put('/api/portfolio/settings', auth, (req, res) => {
    updateSetting('settings', req.body, (err) => {
        if (err) {
            res.status(500).json({ message: 'Error updating settings' });
        } else {
            res.json({ message: 'Settings updated' });
        }
    });
});

// Image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

app.post('/api/portfolio/upload', auth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (err) {
        res.status(500).json({ message: 'Upload failed' });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Database: ${dbPath}`);
    console.log(`📂 Uploads: ${uploadDir}`);
    console.log(`\n✅ Ready to accept requests!\n`);
});