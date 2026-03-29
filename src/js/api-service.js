// Portfolio API Service
class PortfolioAPI {
    constructor() {
        this.MASTER_PASSWORD = 'admin123';
        console.log('✅ API Service Initialized');
    }

    async getData() {
        try {
            const saved = localStorage.getItem('portfolio_data');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.log('Using default data');
        }
        return this.getDefaultData();
    }

    async updateData(data) {
        localStorage.setItem('portfolio_data', JSON.stringify(data));
        return { success: true };
    }

    getDefaultData() {
        return {
            hero: {
                image: "src/images/profile.png",
                title: "Tanzeela",
                typingText: "Web & C++ Dev",
                cvLink: "#",
                buttonType: "both"
            },
            aboutCards: [
                { icon: "fa-user", title: "Who I Am", content: "Hi, I'm Tanzeela Fatima, a passionate developer turning ideas into real digital products." },
                { icon: "fa-code", title: "What I Build", content: "I build modern websites, backend systems, and Android UIs." },
                { icon: "fa-bullseye", title: "My Mission", content: "To grow as a full-stack developer and work on meaningful projects." }
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
            settings: {
                siteTitle: "Tanzeela Fatima",
                footerText: "© 2025 Tanzeela Fatima. All Rights Reserved.",
                homepageProjectsCount: 3
            }
        };
    }

    verifyPassword(password) {
        return password === this.MASTER_PASSWORD;
    }
}

window.portfolioAPI = new PortfolioAPI();