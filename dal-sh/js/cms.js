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
            <p>${data.home.hero.tagline}</p >
            <div class="hero-buttons">
                ${data.home.hero.cta.map(button => `
                    ${button.text}
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
            <p>${data.home.introduction.content}</p >
        `;

        introContent.classList.add('fade-in');
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
                <p>${service.description}</p >
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
                <p>${service.description}</p >
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
                < img src="${project.image}" alt="${project.name}" class="project-image" onerror="this.style.background='linear-gradient(135deg, #2563eb, #3b82f6)'">
                <div class="project-content">
                    <div class="project-header">
                        <h3>${project.name}</h3>
                        <span class="project-status status-${project.status.toLowerCase()}">${project.status}</span>
                    </div>
                    <p>${project.description}</p >
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
            <p>${data.home.cta.description}</p >
            ${data.home.cta.button.text}
        `;
    },

    /**
     * Render footer
     */
    async renderFooter() {
        const data = await this.fetchData('data/site.json');
        if (!data) return;

        const footerContent = document.getElementById('footer-content');
        if (!footerContent) return;

        footerContent.innerHTML = `
            <div class="footer-logo">${data.company.name}</div>
            <p>${data.company.tagline}</p >
            <div class="footer-links">
                ${data.footer.links.map(link => `
                    ${link.text}
                `).join('')}
            </div>
            <div class="social-links">
                ${data.footer.social.map(social => `
                    <a href="${social.url}" class="social-link" target="_blank" title="${social.platform}">
                        ${social.icon}
                    </a >
                `).join('')}
            </div>
            <div class="footer-bottom">
                <p>${data.footer.copyright}</p >
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
            <p>${data.about.overview.content}</p >
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
                <p>${data.about.mission.content}</p >
            </div>
            <div class="mv-card fade-in" style="animation-delay: 0.2s">
                <h3>${data.about.vision.title}</h3>
                <p>${data.about.vision.content}</p >
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
                <p>${value.description}</p >
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
                    <p>${data.contact.email}</p >
                </div>
            </div>
            <div class="contact-item">
                <span class="contact-icon">📞</span>
                <div class="contact-details">
                    <h4>Phone</h4>
                    <p>${data.contact.phone}</p >
                </div>
            </div>
            <div class="contact-item">
                <span class="contact-icon">📍</span>
                <div class="contact-details">
                    <h4>Address</h4>
                    <p>${data.contact.address}</p >
                </div>
            </div>
            <div class="contact-item">
                <span class="contact-icon">🕐</span>
                <div class="contact-details">
                    <h4>Business Hours</h4>
                    <p>${data.contact.hours}</p >
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
            this.renderCTA();
        } else if (page === 'about.html') {
            this.renderCompanyOverview();
            this.renderMissionVision();
            this.renderValues();
        } else if (page === 'services.html') {
            this.renderAllServices();
        } else if (page === 'projects.html') {
            this.renderAllProjects();
        } else if (page === 'contact.html') {
            this.renderContactInfo();
            this.renderMap();
        }
    }
};

// Initialize CMS when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CMS.init());
} else {
    CMS.init();
}