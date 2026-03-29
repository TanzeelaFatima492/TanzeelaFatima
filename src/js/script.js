// Main Portfolio Script
console.log('✅ Main.js loaded');

async function loadPortfolio() {
    console.log('Loading portfolio data...');
    
    try {
        const data = await window.portfolioAPI.getData();
        console.log('Data loaded successfully');
        
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
            if (profileImage) profileImage.src = data.hero.image || 'src/images/profile.png';
            
            const cvButton = document.getElementById('cvButton');
            if (cvButton && data.hero.cvLink && data.hero.cvLink !== '#') {
                cvButton.onclick = () => window.open(data.hero.cvLink, '_blank');
            }
        }
        
        // About Cards
        const aboutContainer = document.getElementById('aboutCardsContainer');
        if (aboutContainer && data.aboutCards) {
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
        
        // Languages
        const languagesGrid = document.getElementById('languagesGrid');
        if (languagesGrid && data.languages) {
            languagesGrid.innerHTML = data.languages.map(lang => `
                <div class="Language">
                    <div class="circle" data-percent="${lang.percent}"><span>0%</span></div>
                    <div class="Language-name">${lang.name}</div>
                </div>
            `).join('');
            setTimeout(() => initCircles(), 100);
        }
        
        // Projects
        const count = data.settings?.homepageProjectsCount || 3;
        const homepageProjects = data.projects?.slice(0, count) || [];
        const projectsGrid = document.getElementById('projectsGrid');
        
        if (projectsGrid) {
            if (homepageProjects.length === 0) {
                projectsGrid.innerHTML = '<p class="text-center">No projects yet. Check back soon!</p>';
            } else {
                projectsGrid.innerHTML = homepageProjects.map(p => `
                    <div class="project-card">
                        ${p.image ? `<div class="project-image"><img src="${p.image}" alt="${p.title}"></div>` : ''}
                        <div class="project-content">
                            <h3 class="project-title">${p.title}</h3>
                            <p class="project-desc">${p.description.substring(0, 100)}...</p>
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
        if (exploreBtn && data.projects?.length > count) {
            exploreBtn.innerHTML = `<a href="src/pages/projects.html" class="btn-custom">Explore All Projects <i class="fas fa-arrow-right"></i></a>`;
        } else if (exploreBtn) {
            exploreBtn.innerHTML = '';
        }
        
        // Education
        const educationCards = document.getElementById('educationCards');
        if (educationCards && data.education) {
            educationCards.innerHTML = data.education.map(edu => `
                <div class="edu-card">
                    <h3>${edu.degree}</h3>
                    <p class="edu-institute">${edu.institute}</p>
                    <p class="edu-year">${edu.year}</p>
                </div>
            `).join('');
        }
        
        // Contact
        const contactEmail = document.getElementById('contactEmail');
        if (contactEmail) contactEmail.innerHTML = data.contact?.email || 'codequeen765@gmail.com';
        
        // Footer
        const footerText = document.getElementById('footerText');
        if (footerText) footerText.innerHTML = data.settings?.footerText || '© 2025 Tanzeela Fatima. All Rights Reserved.';
        
        console.log('✅ Portfolio loaded successfully');
        
    } catch (error) {
        console.error('Error loading portfolio:', error);
        document.body.innerHTML += '<div style="position:fixed;bottom:10px;right:10px;background:red;color:white;padding:10px;border-radius:5px;z-index:9999;">Error loading data. Check console.</div>';
    }
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
const toggleBtn = document.querySelector('.sticky-nav-toggle');
const navMenu = document.querySelector('.sticky-nav-menu');
if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-active');
    });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        e.target.reset();
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', loadPortfolio);