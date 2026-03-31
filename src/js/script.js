// src/js/main.js - Updated to use Backend API

const API_URL = 'http://localhost:5000/api';

async function loadPortfolio() {
    try {
        const response = await fetch(`${API_URL}/portfolio`);
        const data = await response.json();
        
        console.log('Data loaded from backend:', data);
        
        // Update Site Title
        const siteTitle = document.getElementById('siteTitle');
        if (siteTitle) siteTitle.textContent = data.settings?.siteTitle || 'Tanzeela Fatima';
        document.title = data.settings?.siteTitle || 'Tanzeela Fatima';
        
        // Hero Section
        if (data.hero) {
            const heroTitle = document.getElementById('heroTitle');
            if (heroTitle) heroTitle.innerHTML = `Hi, I'm <span class="gradient-text">${data.hero.title}</span>`;
            
            const heroTyping = document.getElementById('heroTyping');
            if (heroTyping) heroTyping.innerHTML = `${data.hero.typingText} <i class="fa-solid fa-code"></i>`;
            
            const profileImage = document.getElementById('profileImage');
            if (profileImage) profileImage.src = data.hero.image || '../src/images/profile.png';
            
            const cvButton = document.getElementById('cvButton');
            if (cvButton && data.hero.cvLink && data.hero.cvLink !== '#') {
                cvButton.onclick = () => window.open(data.hero.cvLink, '_blank');
            }
        }
        
        // Social Links
        const socialIconsContainer = document.querySelector('.social-icons');
        if (socialIconsContainer && data.socialLinks && data.socialLinks.length > 0) {
            socialIconsContainer.innerHTML = data.socialLinks.map(link => {
                const iconClass = link.platform === 'linkedin' ? 'fab fa-linkedin' :
                                  link.platform === 'github' ? 'fab fa-github' :
                                  link.platform === 'leetcode' ? 'fab fa-code' :
                                  link.platform === 'twitter' ? 'fab fa-twitter' :
                                  link.platform === 'instagram' ? 'fab fa-instagram' :
                                  'fas fa-link';
                return `<a href="${link.url}" target="_blank"><i class="${iconClass}"></i></a>`;
            }).join('');
        }
        
        // About Section
        const aboutContainer = document.getElementById('aboutCardsContainer');
        if (aboutContainer && data.aboutCards && data.aboutCards.length > 0) {
            aboutContainer.innerHTML = data.aboutCards.map(card => `
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <i class="fas ${card.icon} fa-3x"></i>
                            <h3 class="gradient-text-animated">${card.title}</h3>
                        </div>
                        <div class="flip-card-back">
                            <p>${card.content}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        // Languages Section
        const languagesGrid = document.getElementById('languagesGrid');
        if (languagesGrid && data.languages && data.languages.length > 0) {
            languagesGrid.innerHTML = data.languages.map(lang => `
                <div class="Language">
                    <div class="circle" data-percent="${lang.percent}"><span>0%</span></div>
                    <div class="Language-name">${lang.name}</div>
                </div>
            `).join('');
            setTimeout(() => initCircles(), 100);
        }
        
        // Projects Section - Latest X projects on homepage
        const homepageCount = data.settings?.homepageProjectsCount || 3;
        const homepageProjects = data.projects?.slice(0, homepageCount) || [];
        const projectsGrid = document.getElementById('projectsGrid');
        
        if (projectsGrid) {
            if (homepageProjects.length === 0) {
                projectsGrid.innerHTML = '<p class="text-center">No projects yet. Check back soon!</p>';
            } else {
                projectsGrid.innerHTML = homepageProjects.map(p => `
                    <div class="project-card">
                        ${p.image ? `<div class="project-image"><img src="${p.image}" alt="${p.title}"></div>` : ''}
                        <div class="project-content">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <h3 class="project-title" style="margin: 0;">${p.title}</h3>
                                ${p.category ? `<span class="badge" style="background: linear-gradient(135deg, #9FC9C7, #8EB1D3); color: #0D1B2A; padding: 3px 10px; border-radius: 15px; font-size: 11px;">${p.category}</span>` : ''}
                            </div>
                            <p class="project-desc">${p.description?.substring(0, 100) || ''}...</p>
                            <div class="project-tags">
                                ${p.tags ? p.tags.split(',').map(t => `<span>${t.trim()}</span>`).join('') : ''}
                            </div>
                            ${p.demoLink ? `<a href="${p.demoLink}" target="_blank" class="project-link">View Project →</a>` : ''}
                        </div>
                    </div>
                `).join('');
            }
        }
        
        // Explore More Button
        const exploreBtn = document.getElementById('exploreMoreBtn');
        if (exploreBtn && data.projects?.length > homepageCount) {
            exploreBtn.innerHTML = `<a href="../src/pages/projects.html" class="btn-custom">Explore All Projects (${data.projects.length} total) <i class="fas fa-arrow-right"></i></a>`;
        } else if (exploreBtn) {
            exploreBtn.innerHTML = '';
        }
        
        // Education Section
        const educationCards = document.getElementById('educationCards');
        if (educationCards && data.education && data.education.length > 0) {
            educationCards.innerHTML = data.education.map(edu => `
                <div class="edu-card">
                    <h3>${edu.degree}</h3>
                    <p class="edu-institute">${edu.institute}</p>
                    <p class="edu-year">${edu.year}</p>
                </div>
            `).join('');
        }
        
        // Contact Section
        const contactEmail = document.getElementById('contactEmail');
        if (contactEmail) contactEmail.innerHTML = `Contact Info : ${data.contact?.email || 'codequeen765@gmail.com'}`;
        
        // Footer Section
        const footerText = document.getElementById('footerText');
        if (footerText) footerText.innerHTML = data.footer?.text || data.settings?.footerText || '© 2025 Tanzeela Fatima. All Rights Reserved.';
        
        // Footer Social Links
        const footerSocials = document.querySelector('.footer-socials');
        if (footerSocials && data.footer?.socialLinks && data.footer.socialLinks.length > 0) {
            footerSocials.innerHTML = data.footer.socialLinks.map(link => {
                const iconClass = link.platform === 'linkedin' ? 'fab fa-linkedin-in' :
                                  link.platform === 'github' ? 'fab fa-github' :
                                  link.platform === 'twitter' ? 'fab fa-twitter' :
                                  link.platform === 'envelope' ? 'fas fa-envelope' :
                                  'fas fa-link';
                return `<a href="${link.url}" target="_blank"><i class="${iconClass}"></i></a>`;
            }).join('');
        }
        
        // Footer Background Color
        if (data.footer?.bgColor) {
            const footer = document.querySelector('.footer');
            if (footer) footer.style.backgroundColor = data.footer.bgColor;
        }
        
        // Footer Text Color
        if (data.footer?.textColor) {
            const footer = document.querySelector('.footer');
            if (footer) footer.style.color = data.footer.textColor;
        }
        
        // Navigation Menu
        const navMenu = document.getElementById('navMenu');
        if (navMenu && data.navigation && data.navigation.length > 0) {
            navMenu.innerHTML = data.navigation.map(nav => `
                <li><a class="nav-link text-white" href="${nav.link}" target="${nav.target || '_self'}">${nav.name}</a></li>
            `).join('');
        }
        
        console.log('✅ Portfolio loaded successfully from backend');
        
    } catch (error) {
        console.error('Error loading portfolio:', error);
        // Fallback to localStorage if backend is not available
        loadFromLocalStorage();
    }
}

// Fallback to localStorage
async function loadFromLocalStorage() {
    console.log('Backend not available, using localStorage fallback');
    try {
        const saved = localStorage.getItem('portfolio_data');
        if (saved) {
            const data = JSON.parse(saved);
            updatePortfolioUI(data);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function updatePortfolioUI(data) {
    // Same UI update logic as above
    if (data.hero) {
        const heroTitle = document.getElementById('heroTitle');
        if (heroTitle) heroTitle.innerHTML = `Hi, I'm <span class="gradient-text">${data.hero.title}</span>`;
        
        const heroTyping = document.getElementById('heroTyping');
        if (heroTyping) heroTyping.innerHTML = `${data.hero.typingText} <i class="fa-solid fa-code"></i>`;
        
        const profileImage = document.getElementById('profileImage');
        if (profileImage) profileImage.src = data.hero.image || '../src/images/profile.png';
    }
    
    if (data.aboutCards) {
        const aboutContainer = document.getElementById('aboutCardsContainer');
        if (aboutContainer) {
            aboutContainer.innerHTML = data.aboutCards.map(card => `
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <i class="fas ${card.icon} fa-3x"></i>
                            <h3 class="gradient-text-animated">${card.title}</h3>
                        </div>
                        <div class="flip-card-back">
                            <p>${card.content}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (data.languages) {
        const languagesGrid = document.getElementById('languagesGrid');
        if (languagesGrid) {
            languagesGrid.innerHTML = data.languages.map(lang => `
                <div class="Language">
                    <div class="circle" data-percent="${lang.percent}"><span>0%</span></div>
                    <div class="Language-name">${lang.name}</div>
                </div>
            `).join('');
            setTimeout(() => initCircles(), 100);
        }
    }
    
    if (data.projects) {
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
            const homepageProjects = data.projects.slice(0, 3);
            projectsGrid.innerHTML = homepageProjects.map(p => `
                <div class="project-card">
                    ${p.image ? `<div class="project-image"><img src="${p.image}" alt="${p.title}"></div>` : ''}
                    <div class="project-content">
                        <h3 class="project-title">${p.title}</h3>
                        <p class="project-desc">${p.description?.substring(0, 100)}...</p>
                        <div class="project-tags">
                            ${p.tags ? p.tags.split(',').map(t => `<span>${t.trim()}</span>`).join('') : ''}
                        </div>
                        ${p.demoLink ? `<a href="${p.demoLink}" target="_blank" class="project-link">View Project →</a>` : ''}
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (data.education) {
        const educationCards = document.getElementById('educationCards');
        if (educationCards) {
            educationCards.innerHTML = data.education.map(edu => `
                <div class="edu-card">
                    <h3>${edu.degree}</h3>
                    <p class="edu-institute">${edu.institute}</p>
                    <p class="edu-year">${edu.year}</p>
                </div>
            `).join('');
        }
    }
    
    const contactEmail = document.getElementById('contactEmail');
    if (contactEmail) contactEmail.innerHTML = `Contact Info : ${data.contact?.email || 'codequeen765@gmail.com'}`;
    
    const footerText = document.getElementById('footerText');
    if (footerText) footerText.innerHTML = data.settings?.footerText || '© 2025 Tanzeela Fatima. All Rights Reserved.';
}

function initCircles() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCircle(entry.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.circle').forEach(circle => observer.observe(circle));
}

function animateCircle(circle) {
    const target = parseInt(circle.dataset.percent) || 0;
    const span = circle.querySelector('span');
    let current = 0;
    const timer = setInterval(() => {
        current++;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        circle.style.setProperty('--percent', current);
        if (span) span.textContent = current + '%';
    }, 15);
}

// Mobile menu toggle
document.querySelector('.sticky-nav-toggle')?.addEventListener('click', () => {
    document.querySelector('.sticky-nav-menu').classList.toggle('mobile-active');
});

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        e.target.reset();
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadPortfolio);