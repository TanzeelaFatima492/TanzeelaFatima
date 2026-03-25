const mongoose = require('mongoose');

// Hero Section Schema
const HeroSchema = new mongoose.Schema({
    image: { type: String, default: 'assets/images/profile.png' },
    title: { type: String, default: 'Tanzeela' },
    typingText: { type: String, default: 'Web & C++ Dev' },
    cvLink: { type: String, default: 'assests/Resume.pdf' },
    buttonType: { type: String, default: 'both' }
});

// About Card Schema
const AboutCardSchema = new mongoose.Schema({
    icon: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, default: 0 }
});

// Language Schema
const LanguageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    percent: { type: Number, required: true, min: 0, max: 100 }
});

// Project Schema
const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: String, required: true },
    image: { type: String },
    link: { type: String },
    category: { type: String },
    date: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false }
});

// Education Schema
const EducationSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    institute: { type: String, required: true },
    year: { type: String, required: true }
});

// Contact Schema
const ContactSchema = new mongoose.Schema({
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String }
});

// Navigation Schema
const NavigationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, enum: ['home', 'section', 'page'], default: 'section' },
    order: { type: Number, default: 0 }
});

// Custom Page Schema
const CustomPageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Settings Schema
const SettingsSchema = new mongoose.Schema({
    siteTitle: { type: String, default: 'Tanzeela Fatima' },
    footerText: { type: String, default: '© 2025 Tanzeela Fatima. All Rights Reserved.' },
    homepageProjectsCount: { type: Number, default: 3 },
    updatedAt: { type: Date, default: Date.now }
});

// Main Portfolio Schema
const PortfolioSchema = new mongoose.Schema({
    hero: HeroSchema,
    aboutCards: [AboutCardSchema],
    languages: [LanguageSchema],
    projects: [ProjectSchema],
    education: [EducationSchema],
    contact: ContactSchema,
    navigation: [NavigationSchema],
    customPages: [CustomPageSchema],
    settings: SettingsSchema,
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);