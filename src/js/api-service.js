// Portfolio API Service - Lifetime Solution using JSONBin.io
// Replace with your actual JSONBin.io credentials

class PortfolioAPI {
    constructor() {
        // ========== IMPORTANT: Replace with your actual JSONBin.io credentials ==========
        // Go to https://jsonbin.io - Sign up for free
        // Create a bin and get your Bin ID and API Key
        this.BIN_ID = '69c392c5aa77b81da918e9d0';      // Replace with your Bin ID
        this.API_KEY = '$2a$10$hg.Y2YcRo9zVn//XokM1iOPorIyKx917DFuGeFpgMMTzpqwTF.6XW';    // Replace with your API Key
        this.BASE_URL = 'https://api.jsonbin.io/v3/b/69c392c5aa77b81da918e9d0';

        // Master password for admin (change this!)
        this.MASTER_PASSWORD = 'Tanzeela2025!';

        // Load saved password
        this.loadSavedPassword();
    }

    // Get all portfolio data
    async getData() {
        try {
            const response = await fetch(`${this.BASE_URL}/${this.BIN_ID}/latest`, {
                headers: { 'X-Master-Key': this.API_KEY }
            });
            if (!response.ok) throw new Error('Failed to fetch');
            const result = await response.json();
            return result.record;
        } catch (error) {
            console.error('Error fetching data:', error);
            return this.getDefaultData();
        }
    }

    // Update entire portfolio data
    async updateData(data) {
        try {
            const response = await fetch(`${this.BASE_URL}/${this.BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.API_KEY
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update');
            return await response.json();
        } catch (error) {
            console.error('Error updating data:', error);
            throw error;
        }
    }

    // Specific updates
    async updateHero(heroData) {
        const data = await this.getData();
        data.hero = heroData;
        return await this.updateData(data);
    }

    async updateAboutCards(cards) {
        const data = await this.getData();
        data.aboutCards = cards;
        return await this.updateData(data);
    }

    async addAboutCard(card) {
        const data = await this.getData();
        data.aboutCards.push(card);
        return await this.updateData(data);
    }

    async deleteAboutCard(index) {
        const data = await this.getData();
        data.aboutCards.splice(index, 1);
        return await this.updateData(data);
    }

    async updateLanguages(languages) {
        const data = await this.getData();
        data.languages = languages;
        return await this.updateData(data);
    }

    async addLanguage(language) {
        const data = await this.getData();
        data.languages.push(language);
        return await this.updateData(data);
    }

    async deleteLanguage(index) {
        const data = await this.getData();
        data.languages.splice(index, 1);
        return await this.updateData(data);
    }

    async addProject(project) {
        const data = await this.getData();
        project.id = Date.now();
        project.date = new Date().toISOString();
        data.projects.unshift(project);
        return await this.updateData(data);
    }

    async updateProject(projectId, updatedProject) {
        const data = await this.getData();
        const index = data.projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            data.projects[index] = { ...data.projects[index], ...updatedProject };
            return await this.updateData(data);
        }
    }

    async deleteProject(projectId) {
        const data = await this.getData();
        data.projects = data.projects.filter(p => p.id !== projectId);
        return await this.updateData(data);
    }

    async addEducation(education) {
        const data = await this.getData();
        data.education.push(education);
        return await this.updateData(data);
    }

    async updateEducation(index, education) {
        const data = await this.getData();
        data.education[index] = education;
        return await this.updateData(data);
    }

    async deleteEducation(index) {
        const data = await this.getData();
        data.education.splice(index, 1);
        return await this.updateData(data);
    }

    async updateContact(contact) {
        const data = await this.getData();
        data.contact = contact;
        return await this.updateData(data);
    }

    async updateNavigation(navigation) {
        const data = await this.getData();
        data.navigation = navigation;
        return await this.updateData(data);
    }

    async addNavigationTab(tab) {
        const data = await this.getData();
        data.navigation.push(tab);
        return await this.updateData(data);
    }

    async deleteNavigationTab(index) {
        const data = await this.getData();
        data.navigation.splice(index, 1);
        return await this.updateData(data);
    }

    async updateSettings(settings) {
        const data = await this.getData();
        data.settings = { ...data.settings, ...settings };
        return await this.updateData(data);
    }

    // Default data
    getDefaultData() {
        return {
            hero: {
                image: "assets/images/profile.png",
                title: "Tanzeela",
                typingText: "Web & C++ Dev",
                cvLink: "assests/Resume.pdf",
                buttonType: "both"
            },
            aboutCards: [
                { icon: "fa-user", title: "Who I Am", content: "Hi, I'm Tanzeela Fatima, a passionate developer turning ideas into real digital products." },
                { icon: "fa-code", title: "What I Build", content: "I build modern websites, backend systems, and Android UIs." },
                { icon: "fa-bullseye", title: "My Mission", content: "To grow as a full-stack developer and work on meaningful projects." }
            ],
            languages: [
                { name: "HTML", percent: 90 }, { name: "CSS", percent: 80 }, { name: "JavaScript", percent: 75 },
                { name: "AngularJS", percent: 60 }, { name: "jQuery", percent: 70 }, { name: "PHP", percent: 50 },
                { name: "SQL", percent: 70 }, { name: "MySQL", percent: 70 }, { name: "C#", percent: 40 },
                { name: "Kotlin", percent: 30 }, { name: "WordPress", percent: 30 }, { name: "C++", percent: 93 }
            ],
            projects: [],
            education: [
                { degree: "Bachelor in Information Technology", institute: "University of Kotli, AJK", year: "2022 – Present" },
                { degree: "Intermediate in Computer Science", institute: "Fatima Jinnah College, Kotli", year: "2020 – 2022" }
            ],
            contact: { email: "codequeen765@gmail.com", phone: "", address: "" },
            navigation: [
                { name: "Home", link: "#", type: "home" }, { name: "About", link: "#about", type: "section" },
                { name: "Language", link: "#Languages", type: "section" }, { name: "Projects", link: "projects.html", type: "page" },
                { name: "Education", link: "#education", type: "section" }, { name: "Contact", link: "#contact", type: "section" }
            ],
            settings: { siteTitle: "Tanzeela Fatima", footerText: "© 2025 Tanzeela Fatima. All Rights Reserved.", homepageProjectsCount: 3 }
        };
    }

    // Authentication
    verifyPassword(password) { return password === this.MASTER_PASSWORD; }

    changePassword(oldPass, newPass) {
        if (oldPass === this.MASTER_PASSWORD) {
            this.MASTER_PASSWORD = newPass;
            localStorage.setItem('adminPassword', btoa(newPass));
            return true;
        }
        return false;
    }

    loadSavedPassword() {
        const saved = localStorage.getItem('adminPassword');
        if (saved) this.MASTER_PASSWORD = atob(saved);
    }
}

// Initialize and make global
window.portfolioAPI = new PortfolioAPI();