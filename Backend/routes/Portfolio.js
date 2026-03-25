const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Get all portfolio data (public)
router.get('/', async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();

        if (!portfolio) {
            // Create default portfolio
            portfolio = new Portfolio({
                hero: {},
                aboutCards: [
                    { icon: 'fa-user', title: 'Who I Am', content: 'Hi, I\'m Tanzeela Fatima, a passionate developer...', order: 0 },
                    { icon: 'fa-code', title: 'What I Build', content: 'I build modern websites, backend systems...', order: 1 },
                    { icon: 'fa-bullseye', title: 'My Mission', content: 'To grow as a full-stack developer...', order: 2 }
                ],
                languages: [
                    { name: 'HTML', percent: 90 },
                    { name: 'CSS', percent: 80 },
                    { name: 'JavaScript', percent: 75 },
                    { name: 'C++', percent: 93 }
                ],
                projects: [],
                education: [
                    { degree: 'Bachelor in Information Technology', institute: 'University of Kotli, AJK', year: '2022 – Present' },
                    { degree: 'Intermediate in Computer Science', institute: 'Fatima Jinnah College, Kotli', year: '2020 – 2022' }
                ],
                contact: { email: 'codequeen765@gmail.com' },
                navigation: [
                    { name: 'Home', link: '#', type: 'home', order: 0 },
                    { name: 'About', link: '#about', type: 'section', order: 1 },
                    { name: 'Language', link: '#Languages', type: 'section', order: 2 },
                    { name: 'Projects', link: 'HTML/Projects.html', type: 'page', order: 3 },
                    { name: 'Education', link: '#education', type: 'section', order: 4 },
                    { name: 'Contact', link: '#contact', type: 'section', order: 5 }
                ],
                settings: { siteTitle: 'Tanzeela Fatima', footerText: '© 2025 Tanzeela Fatima. All Rights Reserved.', homepageProjectsCount: 3 }
            });
            await portfolio.save();
        }

        res.json(portfolio);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get projects only (for projects page)
router.get('/projects', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne();
        res.json(portfolio?.projects || []);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get homepage projects (limited count)
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

// Update hero section (protected)
router.put('/hero', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();

        portfolio.hero = req.body;
        await portfolio.save();

        res.json({ message: 'Hero updated successfully', data: portfolio.hero });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update about cards (protected)
router.put('/about', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();

        portfolio.aboutCards = req.body;
        await portfolio.save();

        res.json({ message: 'About cards updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add about card (protected)
router.post('/about', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();

        portfolio.aboutCards.push(req.body);
        await portfolio.save();

        res.json({ message: 'About card added successfully', card: req.body });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete about card (protected)
router.delete('/about/:index', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

        portfolio.aboutCards.splice(req.params.index, 1);
        await portfolio.save();

        res.json({ message: 'About card deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update languages (protected)
router.put('/languages', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();

        portfolio.languages = req.body;
        await portfolio.save();

        res.json({ message: 'Languages updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add language (protected)
router.post('/languages', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();

        portfolio.languages.push(req.body);
        await portfolio.save();

        res.json({ message: 'Language added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete language (protected)
router.delete('/languages/:index', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

        portfolio.languages.splice(req.params.index, 1);
        await portfolio.save();

        res.json({ message: 'Language deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Projects CRUD
router.get('/projects/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne();
        const project = portfolio?.projects?.id(req.params.id);

        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/projects', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();

        portfolio.projects.push(req.body);
        await portfolio.save();

        res.json({ message: 'Project added successfully', project: req.body });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/projects/:id', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        const projectIndex = portfolio.projects.findIndex(p => p._id.toString() === req.params.id);

        if (projectIndex === -1) return res.status(404).json({ message: 'Project not found' });

        portfolio.projects[projectIndex] = { ...portfolio.projects[projectIndex].toObject(), ...req.body };
        await portfolio.save();

        res.json({ message: 'Project updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/projects/:id', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        portfolio.projects = portfolio.projects.filter(p => p._id.toString() !== req.params.id);
        await portfolio.save();

        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Education CRUD
router.post('/education', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();

        portfolio.education.push(req.body);
        await portfolio.save();

        res.json({ message: 'Education added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/education/:index', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        portfolio.education[req.params.index] = req.body;
        await portfolio.save();

        res.json({ message: 'Education updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/education/:index', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        portfolio.education.splice(req.params.index, 1);
        await portfolio.save();

        res.json({ message: 'Education deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Contact update
router.put('/contact', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();

        portfolio.contact = req.body;
        await portfolio.save();

        res.json({ message: 'Contact updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Navigation update
router.put('/navigation', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();

        portfolio.navigation = req.body;
        await portfolio.save();

        res.json({ message: 'Navigation updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Settings update
router.put('/settings', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();

        portfolio.settings = { ...portfolio.settings, ...req.body, updatedAt: Date.now() };
        await portfolio.save();

        res.json({ message: 'Settings updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Custom Pages CRUD
router.get('/pages', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne();
        res.json(portfolio?.customPages || []);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/pages', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        if (!portfolio) portfolio = new Portfolio();

        portfolio.customPages.push(req.body);
        await portfolio.save();

        res.json({ message: 'Page created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/pages/:id', auth, async (req, res) => {
    try {
        let portfolio = await Portfolio.findOne();
        portfolio.customPages = portfolio.customPages.filter(p => p._id.toString() !== req.params.id);
        await portfolio.save();

        res.json({ message: 'Page deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Image upload
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

module.exports = router;