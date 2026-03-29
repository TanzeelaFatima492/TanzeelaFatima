// Main Portfolio Script

async function loadPortfolio() {
  try {
    const data = await window.portfolioAPI.getData();

    // Update site title
    document.title = data.settings?.siteTitle || 'Tanzeela Fatima';
    document.getElementById('siteTitle').textContent = data.settings?.siteTitle || 'Tanzeela Fatima';

    // Hero Section
    if (data.hero) {
      document.getElementById('heroTitle').innerHTML = `Hi, I'm <span class="gradient-text">${data.hero.title}</span>`;
      document.getElementById('heroTyping').innerHTML = `${data.hero.typingText} <i class="fa-solid fa-code"></i>`;
      document.getElementById('profileImage').src = data.hero.image;
      document.getElementById('cvButton').onclick = () => data.hero.cvLink && window.open(data.hero.cvLink, '_blank');
    }

    // About Cards
    if (data.aboutCards) {
      document.getElementById('aboutCardsContainer').innerHTML = data.aboutCards.map(card => `
                <div class="flip-card"><div class="flip-card-inner">
                    <div class="flip-card-front"><i class="fas ${card.icon} fa-3x"></i><h3 class="gradient-text-animated">${card.title}</h3></div>
                    <div class="flip-card-back"><p>${card.content}</p></div>
                </div></div>
            `).join('');
    }

    // Languages
    if (data.languages) {
      document.getElementById('languagesGrid').innerHTML = data.languages.map(lang => `
                <div class="Language"><div class="circle" data-percent="${lang.percent}"><span>0%</span></div><div class="Language-name">${lang.name}</div></div>
            `).join('');
      setTimeout(() => initCircles(), 100);
    }

    // Projects (Homepage - limited)
    const count = data.settings?.homepageProjectsCount || 3;
    const homepageProjects = data.projects?.slice(0, count) || [];
    const projectsContainer = document.getElementById('projectsGrid');

    if (homepageProjects.length === 0) {
      projectsContainer.innerHTML = '<p class="text-center">No projects yet. Check back soon!</p>';
    } else {
      projectsContainer.innerHTML = homepageProjects.map(p => `
                <div class="project-card">${p.image ? `<div class="project-image"><img src="${p.image}" alt="${p.title}"></div>` : ''}
                <div class="project-content"><h3 class="project-title">${p.title}</h3><p class="project-desc">${p.description.substring(0, 100)}...</p>
                <div class="project-tags">${p.technologies ? p.technologies.split(',').map(t => `<span>${t.trim()}</span>`).join('') : ''}</div>
                ${p.link ? `<a href="${p.link}" target="_blank" class="project-link">View Project →</a>` : ''}</div></div>
            `).join('');
    }

    // Explore More button
    const exploreBtn = document.getElementById('exploreMoreBtn');
    if (data.projects?.length > count) {
      exploreBtn.innerHTML = `<a href="projects.html" class="btn btn-custom">Explore More Projects <i class="fas fa-arrow-right"></i></a>`;
    } else {
      exploreBtn.innerHTML = '';
    }

    // Education
    if (data.education) {
      document.getElementById('educationCards').innerHTML = data.education.map(edu => `
                <div class="edu-card"><h3>${edu.degree}</h3><p class="edu-institute">${edu.institute}</p><p class="edu-year">${edu.year}</p></div>
            `).join('');
    }

    // Contact
    document.getElementById('contactEmail').innerHTML = `Contact Info : ${data.contact?.email || 'codequeen765@gmail.com'}`;

    // Navigation
    if (data.navigation) {
      document.getElementById('navMenu').innerHTML = data.navigation.map(nav => `
                <li><a class="nav-link text-white" href="${nav.link}">${nav.name}</a></li>
            `).join('');
    }

    // Footer
    document.getElementById('footerText').innerHTML = data.settings?.footerText || '© 2025 Tanzeela Fatima. All Rights Reserved.';

  } catch (error) {
    console.error('Error loading portfolio:', error);
    showError('Failed to load data. Please refresh.');
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
  document.querySelectorAll('.circle').forEach(c => observer.observe(c));
}

function animateCircle(circle) {
  const target = parseInt(circle.dataset.percent) || 0;
  const span = circle.querySelector('span');
  let current = 0;
  const timer = setInterval(() => {
    current++;
    if (current >= target) { clearInterval(timer); current = target; }
    circle.style.setProperty('--percent', current);
    if (span) span.textContent = current + '%';
  }, 15);
}

function showError(msg) {
  const popup = document.createElement('div');
  popup.className = 'alert alert-danger';
  popup.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;padding:12px 20px;border-radius:10px;';
  popup.innerHTML = msg;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 5000);
}

function closePopup() {
  document.getElementById('popupMsg')?.classList.remove('show');
}

// Contact form
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const popup = document.getElementById('popupMsg');
  popup.classList.add('show');
  e.target.reset();
  setTimeout(() => popup.classList.remove('show'), 3000);
});

// Mobile menu
document.querySelector('.sticky-nav-toggle')?.addEventListener('click', () => {
  document.querySelector('.sticky-nav-menu').classList.toggle('mobile-active');
});

// Initialize
document.addEventListener('DOMContentLoaded', loadPortfolio);