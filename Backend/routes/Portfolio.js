const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
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
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Default data
const getDefaultData = () => ({
    hero: {
        image: "src/images/profile.png",
        title: "Tanzeela",
        typingText: "Web & C++ Dev",
        cvLink: "#",
        buttonType: "both"
    },
    aboutCards: [
        { icon: "fa-user", title: "Who I Am", content: "Hi, I'm Tanzeela Fatima, a passionate developer turning ideas into real digital products.", order: 0 },
        { icon: "fa-code", title: "What I Build", content: "I build modern websites, backend systems, and Android UIs.", order: 1 },
        { icon: "fa-bullseye", title: "My Mission", content: "To grow as a full-stack developer and work on meaningful projects.", order: 2 }
    ],
    languages: [
        { name: "HTML", percent: 90 }, { name: "CSS", percent: 80 }, { name: "JavaScript", percent: 75 },
        { name: "React", percent: 70 }, { name: "Node.js", percent: 65 }, { name: "Python", percent: 60 },
        { name: "SQL", percent: 70 }, { name: "MongoDB", percent: 65 }, { name: "C++", percent: 85 }
    ],
    projects: [],
    education: [
        { degree: "Bachelor in Information Technology", institute: "University of Kotli, AJK", year: "2022 – Present" },
        { degree: "Intermediate in Computer Science", institute: "Fatima Jinnah College, Kotli", year: "2020 – 2022" }
    ],
    contact: { email: "codequeen765@gmail.com" },
    navigation: [
        { name: "Home", link: "../index.html", type: "home", target: "_self", order: 0 },
        { name: "About", link: "#about", type: "section", target: "_self", order: 1 },
        { name: "Languages", link: "#languages", type: "section", target: "_self", order: 2 },
        { name: "Projects", link: "../src/pages/projects.html", type: "page", target: "_self", order: 3 },
        { name: "Education", link: "#education", type: "section", target: "_self", order: 4 },
        { name: "Contact", link: "#contact", type: "section", target: "_self", order: 5 }
    ],
    settings: {
        siteTitle: "Tanzeela Fatima",
        footerText: "© 2025 Tanzeela Fatima. All Rights Reserved.",
        homepageProjectsCount: 3
    }
});

// Get all portfolio data (public)
router.get('/', async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) {
            portfolio = new Portfolio(getDefaultData());
            await portfolio.save();
        }
        res.json(portfolio);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get homepage projects (limited)
router.get('/homepage-projects', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne();
        const count = portfolio?.settings?.homepageProjectsCount || 3;
        const projects = portfolio?.projects?.slice(0, count) || [];
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update full portfolio (protected)
router.put('/', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) {
            portfolio = new Portfolio(req.body);
        } else {
            portfolio.set(req.body);
            portfolio.updatedAt = Date.now();
        }
        await portfolio.save();
        res.json({ message: 'Portfolio updated successfully', data: portfolio });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update hero section
router.put('/hero', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        portfolio.hero = req.body;
        await portfolio.save();
        res.json({ message: 'Hero updated', data: portfolio.hero });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update about cards
router.put('/about', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        portfolio.aboutCards = req.body;
        await portfolio.save();
        res.json({ message: 'About cards updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add about card
router.post('/about', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        portfolio.aboutCards.push(req.body);
        await portfolio.save();
        res.json({ message: 'About card added' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete about card
router.delete('/about/:index', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        portfolio.aboutCards.splice(req.params.index, 1);
        await portfolio.save();
        res.json({ message: 'About card deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update languages
router.put('/languages', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        portfolio.languages = req.body;
        await portfolio.save();
        res.json({ message: 'Languages updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add language
router.post('/languages', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        portfolio.languages.push(req.body);
        await portfolio.save();
        res.json({ message: 'Language added' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete language
router.delete('/languages/:index', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        portfolio.languages.splice(req.params.index, 1);
        await portfolio.save();
        res.json({ message: 'Language deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add project
router.post('/projects', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        portfolio.projects.push(req.body);
        await portfolio.save();
        res.json({ message: 'Project added', project: req.body });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update project
router.put('/projects/:id', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        const index = portfolio.projects.findIndex(p => p._id.toString() === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Project not found' });
        portfolio.projects[index] = { ...portfolio.projects[index].toObject(), ...req.body };
        await portfolio.save();
        res.json({ message: 'Project updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete project
router.delete('/projects/:id', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        portfolio.projects = portfolio.projects.filter(p => p._id.toString() !== req.params.id);
        await portfolio.save();
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add education
router.post('/education', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        portfolio.education.push(req.body);
        await portfolio.save();
        res.json({ message: 'Education added' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete education
router.delete('/education/:index', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        portfolio.education.splice(req.params.index, 1);
        await portfolio.save();
        res.json({ message: 'Education deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update contact
router.put('/contact', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        portfolio.contact = req.body;
        await portfolio.save();
        res.json({ message: 'Contact updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update navigation
router.put('/navigation', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        portfolio.navigation = req.body;
        await portfolio.save();
        res.json({ message: 'Navigation updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add navigation item
router.post('/navigation', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        portfolio.navigation.push(req.body);
        await portfolio.save();
        res.json({ message: 'Navigation item added' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete navigation item
router.delete('/navigation/:index', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        portfolio.navigation.splice(req.params.index, 1);
        await portfolio.save();
        res.json({ message: 'Navigation item deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update settings
router.put('/settings', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();
        portfolio.settings = { ...portfolio.settings, ...req.body, updatedAt: Date.now() };
        await portfolio.save();
        res.json({ message: 'Settings updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload image
router.post('/upload', auth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (err) {
        res.status(500).json({ message: 'Upload failed' });
    }
});

// Serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;