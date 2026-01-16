/**
 * CMS.js - Content Management System
 * Handles all data fetching and content rendering from JSON files
 */

const CMS = {
    // Cache for loaded data
    cache: {},

    /**
     * Fetch JSON data from file
     * @param {string} file - Path to JSON file
     * @returns {Promise} - Promise resolving to JSON data
     */
    async fetchData(file) {
        // Return cached data if available
        if (this.cache[file]) {
            return this.cache[file];
        }

        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${file}: ${response.status}`);
            }
            const data = await response.json();
            this.cache[file] = data;
            return data;
        } catch (error) {
            console.error(`Error fetching ${file}:`, error);
            return null;
        }
    },

    /**
     * Render navigation logo
     */
    async renderNavLogo() {
        const data = await this.fetchData('data/site.json');
        if (!data) return;

        const logoElement = document.getElementById('nav-logo');
        if (logoElement) {
            logoElement.textContent = data.company.name;
        }
    },

    /**
     * Render hero section
     */
    async renderHero() {
        const data = await this.fetchData('data/site.json');
        if (!data) return;

        const heroContent = document.getElementById('hero-content');
        if (!heroContent) return;

        heroContent.innerHTML = `
            <h1>${data.home.hero.title}</h1>
            <p>${data.home.hero.tagline}</p>
            <div class="hero-buttons">
                ${data.home.hero.cta.map(button => `
                    <a href="${button.link}" class="btn ${button.style}">${button.text}</a>
                `).join('')}
            </div>
        `;

        heroContent.classList.add('fade-in');
    },

    /**
     * Render intro section
     */
    async renderIntro() {
        const data = await this.fetchData('data/site.json');
        if (!data) return;

        const introContent = document.getElementById('intro-content');
        if (!introContent) return;

        introContent.innerHTML = `
            <h2>${data.home.introduction.title}</h2>
            <p>${data.home.introduction.content}</p>
        `;

        introContent.classList.add('fade-in');
    },

    // Add to CMS object
    async renderProductsPage() {
        const data = await this.fetchData('data/products.json');
        if (!data) return;

        // Assuming products.html has a container with id="product-list-container"
        const container = document.getElementById('product-list-container');
        if (!container) return;

        container.innerHTML = data.products.map(p => `
            <div id="${p.id}" class="project-card fade-in" style="margin-bottom: 2rem;">
                <img src="${p.image}" alt="${p.title}" class="project-image" style="height: 300px;">
                <div class="project-content">
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                </div>
            </div>
        `).join('');
    },

    /**
     * Render services (homepage highlight)
     */
    async renderServicesHighlight() {
        const data = await this.fetchData('data/services.json');
        if (!data) return;

        const servicesGrid = document.getElementById('services-grid');
        if (!servicesGrid) return;

        // Show first 3 services
        const services = data.services.slice(0, 3);
        
        servicesGrid.innerHTML = services.map(service => `
            <div class="service-card fade-in">
                <span class="service-icon">${service.icon}</span>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            </div>
        `).join('');
    },

    /**
     * Render all services (services page)
     */
    async renderAllServices() {
        const data = await this.fetchData('data/services.json');
        if (!data) return;

        const servicesGrid = document.getElementById('services-full-grid');
        if (!servicesGrid) return;

        servicesGrid.innerHTML = data.services.map((service, index) => `
            <div class="service-card fade-in" style="animation-delay: ${index * 0.1}s">
                <span class="service-icon">${service.icon}</span>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            </div>
        `).join('');
    },

    /**
     * Render projects (homepage featured)
     */
    async renderFeaturedProjects() {
        const data = await this.fetchData('data/projects.json');
        if (!data) return;

        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        // Show first 3 projects
        const projects = data.projects.slice(0, 3);
        
        projectsGrid.innerHTML = projects.map(project => this.createProjectCard(project)).join('');
    },

    /**
     * Render all projects (projects page)
     */
    async renderAllProjects(filter = 'all') {
        const data = await this.fetchData('data/projects.json');
        if (!data) return;

        const projectsGrid = document.getElementById('projects-full-grid');
        if (!projectsGrid) return;

        let projects = data.projects;

        // Filter projects
        if (filter !== 'all') {
            projects = projects.filter(p => p.status.toLowerCase() === filter);
        }

        projectsGrid.innerHTML = projects.map((project, index) => {
            const card = this.createProjectCard(project);
            return card.replace('project-card', `project-card fade-in`);
        }).join('');
    },

    /**
     * Create project card HTML
     */
    createProjectCard(project) {
        return `
            <div class="project-card" data-status="${project.status.toLowerCase()}">
                <img src="${project.image}" alt="${project.name}" class="project-image" onerror="this.style.background='linear-gradient(135deg, #2563eb, #3b82f6)'">
                <div class="project-content">
                    <div class="project-header">
                        <h3>${project.name}</h3>
                        <span class="project-status status-${project.status.toLowerCase()}">${project.status}</span>
                    </div>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `
                            <span class="tech-tag">${tech}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render CTA section
     */
    async renderCTA() {
        const data = await this.fetchData('data/site.json');
        if (!data) return;

        const ctaContent = document.getElementById('cta-content');
        if (!ctaContent) return;

        ctaContent.innerHTML = `
            <h2>${data.home.cta.title}</h2>
            <p>${data.home.cta.description}</p>
            <a href="${data.home.cta.button.link}" class="btn ${data.home.cta.button.style}">${data.home.cta.button.text}</a>
        `;
    },

    /**
     * Render footer
     */
    async renderFooter() {
        const data = await this.fetchData('data/site.json');
        if (!data) return;

        const footerContent = document.getElementById('footer-sitemap');
        if (!footerContent) return;

        footerContent.innerHTML = `
            <div class="footer-column">
                <h3>${data.company.name}</h3>
                <p>${data.company.tagline}</p>
                <div class="footer-social">
                    ${data.footer.social.map(social => `
                        <a href="${social.url}" target="_blank" title="${social.platform}">
                            ${social.icon}
                        </a>
                    `).join('')}
                </div>
            </div>
            <div class="footer-column">
                <h3>Company</h3>
                <ul class="footer-links-list">
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="about.html#team">Our Team</a></li>
                    <li><a href="career.html">Careers</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Services</h3>
                <ul class="footer-links-list">
                    <li><a href="services.html">All Services</a></li>
                    <li><a href="services.html#development">Development</a></li>
                    <li><a href="services.html#cloud">Cloud Solutions</a></li>
                    <li><a href="services.html#consulting">Consulting</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Resources</h3>
                <ul class="footer-links-list">
                    <li><a href="projects.html">Projects</a></li>
                    <li><a href="index.html#news">News</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Documentation</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Contact Us</h3>
                <div class="footer-contact-item">
                    <span>📧</span>
                    <span>${data.footer.contact.email}</span>
                </div>
                <div class="footer-contact-item">
                    <span>📞</span>
                    <span>${data.footer.contact.phone}</span>
                </div>
                <div class="footer-contact-item">
                    <span>📍</span>
                    <span>${data.footer.contact.address}</span>
                </div>
            </div>
            <div class="footer-bottom" style="grid-column: 1 / -1;">
                <p>${data.footer.copyright}</p>
            </div>
        `;
    },

    /**
     * Render company overview (about page)
     */
    async renderCompanyOverview() {
        const data = await this.fetchData('data/site.json');
        if (!data) return;

        const overviewElement = document.getElementById('company-overview');
        if (!overviewElement) return;

        overviewElement.innerHTML = `
            <h2>${data.about.overview.title}</h2>
            <p>${data.about.overview.content}</p>
        `;
    },

    /**
     * Render mission and vision
     */
    async renderMissionVision() {
        const data = await this.fetchData('data/site.json');
        if (!data) return;

        const mvGrid = document.getElementById('mission-vision-grid');
        if (!mvGrid) return;

        mvGrid.innerHTML = `
            <div class="mv-card fade-in">
                <h3>${data.about.mission.title}</h3>
                <p>${data.about.mission.content}</p>
            </div>
            <div class="mv-card fade-in" style="animation-delay: 0.2s">
                <h3>${data.about.vision.title}</h3>
                <p>${data.about.vision.content}</p>
            </div>
        `;
    },

    /**
     * Render core values
     */
    async renderValues() {
        const data = await this.fetchData('data/site.json');
        if (!data) return;

        const valuesGrid = document.getElementById('values-grid');
        if (!valuesGrid) return;

        valuesGrid.innerHTML = data.about.values.map((value, index) => `
            <div class="value-card fade-in" style="animation-delay: ${index * 0.1}s">
                <span class="value-icon">${value.icon}</span>
                <h4>${value.title}</h4>
                <p>${value.description}</p>
            </div>
        `).join('');
    },

    /**
     * Render contact information
     */
    async renderContactInfo() {
        const data = await this.fetchData('data/contact.json');
        if (!data) return;

        const contactInfo = document.getElementById('contact-info');
        if (!contactInfo) return;

        contactInfo.innerHTML = `
            <div class="contact-item">
                <span class="contact-icon">📧</span>
                <div class="contact-details">
                    <h4>Email</h4>
                    <p>${data.contact.email}</p>
                </div>
            </div>
            <div class="contact-item">
                <span class="contact-icon">📞</span>
                <div class="contact-details">
                    <h4>Phone</h4>
                    <p>${data.contact.phone}</p>
                </div>
            </div>
            <div class="contact-item">
                <span class="contact-icon">📍</span>
                <div class="contact-details">
                    <h4>Address</h4>
                    <p>${data.contact.address}</p>
                </div>
            </div>
            <div class="contact-item">
                <span class="contact-icon">🕐</span>
                <div class="contact-details">
                    <h4>Business Hours</h4>
                    <p>${data.contact.hours}</p>
                </div>
            </div>
        `;
    },

    /**
     * Render map
     */
    async renderMap() {
        const data = await this.fetchData('data/contact.json');
        if (!data) return;

        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <iframe src="${data.map.embedUrl}" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        `;
    },

    /**
     * Render news bulletin
     */
    async renderNews() {
        const data = await this.fetchData('data/site.json');
        if (!data) return;

        const newsGrid = document.getElementById('news-grid');
        if (!newsGrid) return;

        newsGrid.innerHTML = data.home.news.map((item, index) => `
            <div class="news-card fade-in" style="animation-delay: ${index * 0.1}s">
                <img src="${item.image}" alt="${item.title}" class="news-image" onerror="this.style.background='linear-gradient(135deg, #2563eb, #3b82f6)'">
                <div class="news-content">
                    <div class="news-meta">
                        <span class="news-date">📅 ${item.date}</span>
                        <span class="news-category">📂 ${item.category}</span>
                    </div>
                    <h3>${item.title}</h3>
                    <p>${item.excerpt}</p>
                    <a href="${item.link}" class="news-link">Read More →</a>
                </div>
            </div>
        `).join('');
    },

    /**
     * Render organization chart
     */
    async renderOrganization() {
      const data = await this.fetchData('data/site.json');
      if (!data) return;

      const org = data.about.organization;

      const foundersGrid = document.getElementById('founders-grid');
      const execGrid = document.getElementById('executive-grid');
      const techGrid = document.getElementById('tech-grid');

      /* FOUNDERS */
      foundersGrid.innerHTML = org.ceo.map(member => `
        <div class="org-card">
          <img src="${member.photo}">
          <h4>${member.name}</h4>
          <p>${member.title}</p>
        </div>
      `).join('');

      /* EXECUTIVES */
      execGrid.innerHTML = org.executive.map(member => `
        <div class="org-card">
          <img src="${member.photo}">
          <h4>${member.name}</h4>
          <p>${member.title}</p>
        </div>
      `).join('');

      /* TECH TEAM (static roles like your sketch) */
      techGrid.innerHTML = org.tech.map(member => `
        <div class="org-card">
          <img src="${member.photo}">
          <h4>${member.name}</h4>
          <p>${member.title}</p>
        </div>
      `).join('');
    },

    /**
     * Render career intro
     */
    async renderCareerIntro() {
        const data = await this.fetchData('data/career.json');
        if (!data) return;

        const careerIntro = document.getElementById('career-intro');
        if (!careerIntro) return;

        careerIntro.innerHTML = `
            <h2>${data.intro.title}</h2>
            <p>${data.intro.description}</p>
        `;
    },

    /**
     * Render benefits
     */
    async renderBenefits() {
        const data = await this.fetchData('data/career.json');
        if (!data) return;

        const benefitsGrid = document.getElementById('benefits-grid');
        if (!benefitsGrid) return;

        benefitsGrid.innerHTML = data.benefits.map((benefit, index) => `
            <div class="benefit-card fade-in" style="animation-delay: ${index * 0.1}s">
                <span class="benefit-icon">${benefit.icon}</span>
                <h4>${benefit.title}</h4>
                <p>${benefit.description}</p>
            </div>
        `).join('');
    },

    /**
     * Render job positions
     */
    async renderPositions() {
        const data = await this.fetchData('data/career.json');
        if (!data) return;

        const positionsList = document.getElementById('positions-list');
        if (!positionsList) return;

        positionsList.innerHTML = data.positions.map((position, index) => `
            <div class="position-card fade-in" style="animation-delay: ${index * 0.1}s">
                <div class="position-header">
                    <div class="position-title">
                        <h3>${position.title}</h3>
                        <div class="position-meta">
                            <span>📍 ${position.location}</span>
                            <span>💼 ${position.type}</span>
                            <span>⏰ ${position.experience}</span>
                        </div>
                    </div>
                </div>
                <p>${position.description}</p>
                <div class="position-requirements">
                    <h4>Requirements:</h4>
                    <ul>
                        ${position.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                <a href="contact.html" class="btn btn-primary">Apply Now</a>
            </div>
        `).join('');
    },

    /**
     * Render branches
     */
    async renderBranches() {
        const data = await this.fetchData('data/contact.json');
        if (!data) return;

        const branchesGrid = document.getElementById('branches-grid');
        if (!branchesGrid) return;

        branchesGrid.innerHTML = data.branches.map((branch, index) => `
            <div class="branch-card fade-in" style="animation-delay: ${index * 0.1}s">
                <h3>
                    ${branch.city}
                    <span class="branch-type">${branch.type}</span>
                </h3>
                <p class="branch-address">${branch.address}</p>
                <div class="branch-contacts">
                    <div class="branch-contact-item">
                        <span>📧</span>
                        <span>${branch.email}</span>
                    </div>
                    <div class="branch-contact-item">
                        <span>📞</span>
                        <span>${branch.phone}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Initialize CMS based on current page
     */
    init() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

        // Render common elements
        this.renderNavLogo();
        this.renderFooter();

        // Render page-specific content
        if (page === 'index.html' || page === '') {
            this.renderHero();
            this.renderIntro();
            this.renderServicesHighlight();
            this.renderFeaturedProjects();
            this.renderNews();
            this.renderCTA();
        } else if (page === 'about.html') {
            this.renderCompanyOverview();
            this.renderMissionVision();
            this.renderValues();
            this.renderOrganization();
            this.renderTeam();
        } else if (page === 'services.html') {
            this.renderAllServices();
        } else if (page === 'projects.html') {
            this.renderAllProjects();
        } else if (page === 'career.html') {
            this.renderCareerIntro();
            this.renderBenefits();
            this.renderPositions();
        } else if (page === 'contact.html') {
            this.renderContactInfo();
            this.renderMap();
            this.renderBranches();
        }
    },

    renderRndIntro() {
        this.fetchData('data/site.json').then(data => {
            const el = document.getElementById('rnd-intro');
            el.innerHTML = `
                <h2>${data.rnd.intro.title}</h2>
                <p>${data.rnd.intro.content}</p>
            `;
        });
    },
    
    renderRndFocus() {
        this.fetchData('data/site.json').then(data => {
            const grid = document.getElementById('rnd-focus-grid');
            grid.innerHTML = data.rnd.focus.map(item => `
                <div class="service-card">
                    <span class="service-icon">${item.icon}</span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `).join('');
        });
    },
    
    renderRndProjects() {
        this.fetchData('data/site.json').then(data => {
            const grid = document.getElementById('rnd-projects-grid');
            grid.innerHTML = data.rnd.projects.map(p => `
                <div class="project-card">
                    <div class="project-content">
                        <h3>${p.name}</h3>
                        <p>${p.description}</p>
                        <span class="project-status status-ongoing">${p.status}</span>
                    </div>
                </div>
            `).join('');
        });
    },
    
    renderRndCTA() {
        this.fetchData('data/site.json').then(data => {
            const el = document.getElementById('rnd-cta');
            el.innerHTML = `
                <h2>${data.rnd.cta.title}</h2>
                <p>${data.rnd.cta.description}</p>
                <a href="${data.rnd.cta.button.link}" class="btn btn-light">
                    ${data.rnd.cta.button.text}
                </a>
            `;
        });
    },

};

// Initialize CMS when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CMS.init());
} else {
    CMS.init();
}

introContent.innerHTML = `
    <h2 data-i18n="welcome">${data.home.introduction.title}</h2>
    <p>${data.home.introduction.content}</p>
`;

