/**
 * admin.js - Content Management Logic
 */

let siteData = {};
let servicesData = {};
let projectsData = {};
let careerData = {};
let contactData = {};
let productPageData = {};

// --- Data Fetching ---
async function fetchJSON(path) {
    try {
        const res = await fetch(path);
        if(!res.ok) throw new Error("HTTP error " + res.status);
        return await res.json();
    } catch(e) { 
        console.error("Error loading " + path, e); 
        return {}; 
    }
}

async function loadAdminData() {
    siteData = await fetchJSON('data/site.json');
    servicesData = await fetchJSON('data/services.json');
    projectsData = await fetchJSON('data/projects.json');
    careerData = await fetchJSON('data/career.json');
    contactData = await fetchJSON('data/contact.json');

    renderGlobalEditor();
    renderHomeEditor();
    renderAboutEditor();
    renderOrganizationEditor();
    renderRndEditor();
    renderServicesEditor();
    renderProjectsEditor();
    renderCareerEditors();
    renderContactPageEditors();
}

// --- Utilities ---
function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

// =======================================================
// 1. SITE.JSON EDITORS
// =======================================================

// --- Global & Footer ---
function renderGlobalEditor() {
    const el = document.getElementById('global-editor');
    if(!siteData.company) siteData.company = {};
    if(!siteData.footer) siteData.footer = { contact: {} };

    el.innerHTML = `
        <div class="form-grid">
            <div class="full-width">
                <label>Company Name</label>
                <input value="${escapeHtml(siteData.company.name)}" onchange="siteData.company.name=this.value">
            </div>
            <div class="full-width">
                <label>Tagline</label>
                <input value="${escapeHtml(siteData.company.tagline)}" onchange="siteData.company.tagline=this.value">
            </div>
            <div class="full-width">
                <label>Description (SEO)</label>
                <textarea onchange="siteData.company.description=this.value">${escapeHtml(siteData.company.description)}</textarea>
            </div>
            <div class="full-width">
                <label>Footer Copyright</label>
                <input value="${escapeHtml(siteData.footer.copyright)}" onchange="siteData.footer.copyright=this.value">
            </div>
            <div>
                <label>Contact Email</label>
                <input value="${escapeHtml(siteData.footer.contact.email)}" onchange="siteData.footer.contact.email=this.value">
            </div>
            <div>
                <label>Contact Phone</label>
                <input value="${escapeHtml(siteData.footer.contact.phone)}" onchange="siteData.footer.contact.phone=this.value">
            </div>
            <div class="full-width">
                <label>Contact Address</label>
                <input value="${escapeHtml(siteData.footer.contact.address)}" onchange="siteData.footer.contact.address=this.value">
            </div>
        </div>
    `;
}

// --- Home Page ---
function renderHomeEditor() {
    const el = document.getElementById('home-editor');
    const home = siteData.home || {};
    
    el.innerHTML = `
        <div class="admin-card">
            <h3>Hero Section</h3>
            <label>Hero Title</label>
            <input value="${escapeHtml(home.hero.title)}" onchange="siteData.home.hero.title=this.value">
            <label>Hero Tagline</label>
            <textarea onchange="siteData.home.hero.tagline=this.value">${escapeHtml(home.hero.tagline)}</textarea>
        </div>
        <div class="admin-card">
            <h3>Introduction</h3>
            <label>Title</label>
            <input value="${escapeHtml(home.introduction.title)}" onchange="siteData.home.introduction.title=this.value">
            <label>Content</label>
            <textarea style="height:120px" onchange="siteData.home.introduction.content=this.value">${escapeHtml(home.introduction.content)}</textarea>
        </div>
        <div class="admin-card">
            <h3>Bottom CTA</h3>
            <label>Title</label>
            <input value="${escapeHtml(home.cta.title)}" onchange="siteData.home.cta.title=this.value">
            <label>Description</label>
            <textarea onchange="siteData.home.cta.description=this.value">${escapeHtml(home.cta.description)}</textarea>
            <label>Button Text</label>
            <input value="${escapeHtml(home.cta.button.text)}" onchange="siteData.home.cta.button.text=this.value">
            <label>Button Link</label>
            <input value="${escapeHtml(home.cta.button.link)}" onchange="siteData.home.cta.button.link=this.value">
        </div>
    `;
    renderHeroBtns();
    renderNews();
}

function renderHeroBtns() {
    const el = document.getElementById('hero-cta-editor');
    el.innerHTML = '';
    (siteData.home.hero.cta || []).forEach((btn, i) => {
        el.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <div class="form-grid">
                    <input value="${escapeHtml(btn.text)}" onchange="siteData.home.hero.cta[${i}].text=this.value" placeholder="Button Text">
                    <input value="${escapeHtml(btn.link)}" onchange="siteData.home.hero.cta[${i}].link=this.value" placeholder="Link">
                    <input value="${escapeHtml(btn.style)}" onchange="siteData.home.hero.cta[${i}].style=this.value" placeholder="CSS Class (e.g., btn-primary)">
                </div>
                <button class="btn-danger delete-btn" onclick="siteData.home.hero.cta.splice(${i},1); renderHeroBtns()">X</button>
            </div>
        `);
    });
}
function addHeroButton() { siteData.home.hero.cta.push({text:"New Button", link:"#", style:"btn-light"}); renderHeroBtns(); }

function renderNews() {
    const el = document.getElementById('news-editor');
    el.innerHTML = '';
    (siteData.home.news || []).forEach((item, i) => {
        el.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <div class="form-grid">
                    <div class="full-width"><label>Title</label><input value="${escapeHtml(item.title)}" onchange="siteData.home.news[${i}].title=this.value"></div>
                    <div><label>Date</label><input value="${escapeHtml(item.date)}" onchange="siteData.home.news[${i}].date=this.value"></div>
                    <div><label>Category</label><input value="${escapeHtml(item.category)}" onchange="siteData.home.news[${i}].category=this.value"></div>
                    <div class="full-width"><label>Image URL</label><input value="${escapeHtml(item.image)}" onchange="siteData.home.news[${i}].image=this.value"></div>
                    <div class="full-width"><label>Excerpt</label><textarea onchange="siteData.home.news[${i}].excerpt=this.value">${escapeHtml(item.excerpt)}</textarea></div>
                </div>
                <button class="btn-danger delete-btn" onclick="siteData.home.news.splice(${i},1); renderNews()">X</button>
            </div>
        `);
    });
}
function addNewsItem() { siteData.home.news.push({title:"New News", date:"Jan 1, 2026", category:"Update", excerpt:"Details...", image:""}); renderNews(); }

// --- About Page ---
function renderAboutEditor() {
    const el = document.getElementById('about-editor');
    el.innerHTML = `
        <div class="admin-card">
            <h3>Overview</h3>
            <input value="${escapeHtml(siteData.about.overview.title)}" onchange="siteData.about.overview.title=this.value">
            <textarea onchange="siteData.about.overview.content=this.value">${escapeHtml(siteData.about.overview.content)}</textarea>
        </div>
        <div class="form-grid">
            <div class="admin-card">
                <h3>Mission</h3>
                <input value="${escapeHtml(siteData.about.mission.title)}" onchange="siteData.about.mission.title=this.value">
                <textarea onchange="siteData.about.mission.content=this.value">${escapeHtml(siteData.about.mission.content)}</textarea>
            </div>
            <div class="admin-card">
                <h3>Vision</h3>
                <input value="${escapeHtml(siteData.about.vision.title)}" onchange="siteData.about.vision.title=this.value">
                <textarea onchange="siteData.about.vision.content=this.value">${escapeHtml(siteData.about.vision.content)}</textarea>
            </div>
        </div>
    `;
    renderValues();
}

function renderValues() {
    const el = document.getElementById('values-editor');
    el.innerHTML = '';
    (siteData.about.values || []).forEach((val, i) => {
        el.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <div class="form-grid">
                    <div><input value="${escapeHtml(val.title)}" onchange="siteData.about.values[${i}].title=this.value" placeholder="Title"></div>
                    <div><input value="${escapeHtml(val.icon)}" onchange="siteData.about.values[${i}].icon=this.value" placeholder="Icon"></div>
                    <div class="full-width"><textarea onchange="siteData.about.values[${i}].description=this.value">${escapeHtml(val.description)}</textarea></div>
                </div>
                <button class="btn-danger delete-btn" onclick="siteData.about.values.splice(${i},1); renderValues()">X</button>
            </div>
        `);
    });
}
function addValue() { siteData.about.values.push({title:"Core Value", icon:"⭐", description:"Description"}); renderValues(); }

// --- Organization ---
function renderOrganizationEditor() {
    if(!siteData.about.organization) siteData.about.organization = { ceo:[], executive:[], tech:[] };
    const org = siteData.about.organization;

    // Helper to render a list of members
    const renderMembers = (list, containerId, listName) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        list.forEach((m, i) => {
            container.insertAdjacentHTML('beforeend', `
                <div class="admin-card">
                    <div class="form-grid">
                        <input value="${escapeHtml(m.name)}" onchange="siteData.about.organization['${listName}'][${i}].name=this.value" placeholder="Name">
                        <input value="${escapeHtml(m.title)}" onchange="siteData.about.organization['${listName}'][${i}].title=this.value" placeholder="Title">
                        <input value="${escapeHtml(m.photo)}" onchange="siteData.about.organization['${listName}'][${i}].photo=this.value" placeholder="Photo URL">
                        ${m.department !== undefined ? `<input value="${escapeHtml(m.department)}" onchange="siteData.about.organization['${listName}'][${i}].department=this.value" placeholder="Department">` : ''}
                    </div>
                    <button class="btn-danger delete-btn" onclick="siteData.about.organization['${listName}'].splice(${i},1); renderOrganizationEditor()">X</button>
                </div>
            `);
        });
    };

    renderMembers(org.ceo, 'org-ceo-editor', 'ceo');
    renderMembers(org.executive, 'org-exec-editor', 'executive');
    renderMembers(org.tech, 'org-tech-editor', 'tech');
}

function addOrgMember(type) {
    const member = { name: "Name", title: "Title", photo: "assets/images/logo.png" };
    if(type !== 'tech') member.department = "Management";
    siteData.about.organization[type].push(member);
    renderOrganizationEditor();
}

// --- R&D ---
function renderRndEditor() {
    if(!siteData.rnd) siteData.rnd = { intro:{}, focus:[], projects:[], cta:{} };
    const rnd = siteData.rnd;

    document.getElementById('rnd-intro-editor').innerHTML = `
        <div class="admin-card">
            <h3>Intro</h3>
            <input value="${escapeHtml(rnd.intro.title)}" onchange="siteData.rnd.intro.title=this.value" placeholder="Title">
            <textarea onchange="siteData.rnd.intro.content=this.value">${escapeHtml(rnd.intro.content)}</textarea>
        </div>
        <div class="admin-card">
            <h3>Bottom CTA</h3>
            <input value="${escapeHtml(rnd.cta.title)}" onchange="siteData.rnd.cta.title=this.value" placeholder="CTA Title">
            <textarea onchange="siteData.rnd.cta.description=this.value">${escapeHtml(rnd.cta.description)}</textarea>
            <input value="${escapeHtml(rnd.cta.button && rnd.cta.button.text)}" onchange="siteData.rnd.cta.button.text=this.value" placeholder="Button Text">
        </div>
    `;

    // Focus Areas
    const focusEl = document.getElementById('rnd-focus-editor');
    focusEl.innerHTML = '';
    rnd.focus.forEach((f, i) => {
        focusEl.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <input value="${escapeHtml(f.title)}" onchange="siteData.rnd.focus[${i}].title=this.value" placeholder="Area Title">
                <input value="${escapeHtml(f.icon)}" onchange="siteData.rnd.focus[${i}].icon=this.value" placeholder="Icon">
                <textarea onchange="siteData.rnd.focus[${i}].description=this.value">${escapeHtml(f.description)}</textarea>
                <button class="btn-danger delete-btn" onclick="siteData.rnd.focus.splice(${i},1); renderRndEditor()">X</button>
            </div>
        `);
    });

    // R&D Projects
    const projEl = document.getElementById('rnd-projects-editor');
    projEl.innerHTML = '';
    rnd.projects.forEach((p, i) => {
        projEl.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <input value="${escapeHtml(p.name)}" onchange="siteData.rnd.projects[${i}].name=this.value" placeholder="Project Name">
                <input value="${escapeHtml(p.status)}" onchange="siteData.rnd.projects[${i}].status=this.value" placeholder="Status">
                <textarea onchange="siteData.rnd.projects[${i}].description=this.value">${escapeHtml(p.description)}</textarea>
                <button class="btn-danger delete-btn" onclick="siteData.rnd.projects.splice(${i},1); renderRndEditor()">X</button>
            </div>
        `);
    });
}
function addRndFocus() { siteData.rnd.focus.push({title:"New Area", icon:"🔬", description:"Description"}); renderRndEditor(); }
function addRndProject() { siteData.rnd.projects.push({name:"Experiment X", status:"Prototype", description:"Description"}); renderRndEditor(); }


// 2. Update loadAdminData() to fetch the new JSON
async function loadAdminData() {
    // ... existing fetches ...
    productPageData = await fetchJSON('data/products.json'); // Add this line
    
    // ... existing renders ...
    renderProductPageEditor(); // Add this line
}

// 3. Add these new functions to js/admin.js
function renderProductPageEditor() {
    const el = document.getElementById('product-page-editor');
    el.innerHTML = '';
    (productPageData.products || []).forEach((p, i) => {
        el.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <div class="form-grid">
                    <div><label>ID (Anchor)</label><input value="${escapeHtml(p.id)}" onchange="productPageData.products[${i}].id=this.value"></div>
                    <div class="full-width"><label>Title</label><input value="${escapeHtml(p.title)}" onchange="productPageData.products[${i}].title=this.value"></div>
                    <div class="full-width"><label>Image URL</label><input value="${escapeHtml(p.image)}" onchange="productPageData.products[${i}].image=this.value"></div>
                    <div class="full-width"><label>Description</label><textarea onchange="productPageData.products[${i}].description=this.value">${escapeHtml(p.description)}</textarea></div>
                </div>
                <button class="btn-danger delete-btn" onclick="productPageData.products.splice(${i},1); renderProductPageEditor()">X</button>
            </div>
        `);
    });
}

function addProductItem() {
    if (!productPageData.products) productPageData.products = [];
    productPageData.products.push({id: "new-id", title: "New Product", description: "Description", image: ""});
    renderProductPageEditor();
}

function saveProductPage() {
    downloadJSON(productPageData, 'products.json');
}
// =======================================================
// 2. OTHER JSON EDITORS
// =======================================================

function renderServicesEditor() {
    const el = document.getElementById('services-editor');
    el.innerHTML = '';
    (servicesData.services || []).forEach((s, i) => {
        el.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <div class="form-grid">
                    <input value="${escapeHtml(s.title)}" onchange="servicesData.services[${i}].title=this.value" placeholder="Service Title">
                    <input value="${escapeHtml(s.icon)}" onchange="servicesData.services[${i}].icon=this.value" placeholder="Icon">
                </div>
                <textarea onchange="servicesData.services[${i}].description=this.value">${escapeHtml(s.description)}</textarea>
                <button class="btn-danger delete-btn" onclick="servicesData.services.splice(${i},1); renderServicesEditor()">X</button>
            </div>
        `);
    });
}
function addService() { servicesData.services.push({title:"New Service", icon:"⚡", description:"Description"}); renderServicesEditor(); }

function renderProjectsEditor() {
    const el = document.getElementById('projects-editor');
    el.innerHTML = '';
    (projectsData.projects || []).forEach((p, i) => {
        el.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <div class="form-grid">
                    <div class="full-width"><input value="${escapeHtml(p.name)}" onchange="projectsData.projects[${i}].name=this.value" placeholder="Project Name"></div>
                    <div>
                        <select onchange="projectsData.projects[${i}].status=this.value">
                            <option value="Completed" ${p.status==='Completed'?'selected':''}>Completed</option>
                            <option value="Ongoing" ${p.status==='Ongoing'?'selected':''}>Ongoing</option>
                        </select>
                    </div>
                    <div><input value="${escapeHtml(p.image)}" onchange="projectsData.projects[${i}].image=this.value" placeholder="Image URL"></div>
                </div>
                <textarea onchange="projectsData.projects[${i}].description=this.value">${escapeHtml(p.description)}</textarea>
                <button class="btn-danger delete-btn" onclick="projectsData.projects.splice(${i},1); renderProjectsEditor()">X</button>
            </div>
        `);
    });
}
function addProject() { projectsData.projects.push({name:"Project", status:"Ongoing", description:"Desc", image:"", technologies:[]}); renderProjectsEditor(); }

function renderCareerEditors() {
    document.getElementById('career-intro-title').value = careerData.intro?.title || '';
    document.getElementById('career-intro-title').onchange = (e) => careerData.intro.title = e.target.value;
    
    document.getElementById('career-intro-desc').value = careerData.intro?.description || '';
    document.getElementById('career-intro-desc').onchange = (e) => careerData.intro.description = e.target.value;

    const benEl = document.getElementById('benefits-editor');
    benEl.innerHTML = '';
    (careerData.benefits || []).forEach((b, i) => {
        benEl.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <input value="${escapeHtml(b.title)}" onchange="careerData.benefits[${i}].title=this.value">
                <button class="btn-danger delete-btn" onclick="careerData.benefits.splice(${i},1); renderCareerEditors()">X</button>
            </div>
        `);
    });

    const posEl = document.getElementById('positions-editor');
    posEl.innerHTML = '';
    (careerData.positions || []).forEach((p, i) => {
        posEl.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <div class="form-grid">
                    <input value="${escapeHtml(p.title)}" onchange="careerData.positions[${i}].title=this.value" placeholder="Job Title">
                    <input value="${escapeHtml(p.location)}" onchange="careerData.positions[${i}].location=this.value" placeholder="Location">
                </div>
                <button class="btn-danger delete-btn" onclick="careerData.positions.splice(${i},1); renderCareerEditors()">X</button>
            </div>
        `);
    });
}
function addBenefit() { careerData.benefits.push({title:"Benefit", description:"Desc", icon:"+"}); renderCareerEditors(); }
function addPosition() { careerData.positions.push({title:"Job", location:"Remote", description:"Desc", requirements:[]}); renderCareerEditors(); }

function renderContactPageEditors() {
    const el = document.getElementById('main-contact-editor');
    const c = contactData.contact;
    el.innerHTML = `
        <div class="form-grid">
            <input value="${escapeHtml(c.email)}" onchange="contactData.contact.email=this.value" placeholder="Email">
            <input value="${escapeHtml(c.phone)}" onchange="contactData.contact.phone=this.value" placeholder="Phone">
            <div class="full-width"><input value="${escapeHtml(c.address)}" onchange="contactData.contact.address=this.value" placeholder="Address"></div>
            <div class="full-width"><input value="${escapeHtml(c.hours)}" onchange="contactData.contact.hours=this.value" placeholder="Hours"></div>
        </div>
    `;

    const branchEl = document.getElementById('branches-editor');
    branchEl.innerHTML = '';
    (contactData.branches || []).forEach((b, i) => {
        branchEl.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <div class="form-grid">
                    <input value="${escapeHtml(b.city)}" onchange="contactData.branches[${i}].city=this.value" placeholder="City">
                    <input value="${escapeHtml(b.type)}" onchange="contactData.branches[${i}].type=this.value" placeholder="Type">
                </div>
                <textarea onchange="contactData.branches[${i}].address=this.value">${escapeHtml(b.address)}</textarea>
                <button class="btn-danger delete-btn" onclick="contactData.branches.splice(${i},1); renderContactPageEditors()">X</button>
            </div>
        `);
    });
}
function addBranch() { contactData.branches.push({city:"City", type:"Office", address:"Address", email:"", phone:""}); renderContactPageEditors(); }

// --- Save Functions ---
function saveSiteData() { downloadJSON(siteData, 'site.json'); }
function saveServices() { downloadJSON(servicesData, 'services.json'); }
function saveProjects() { downloadJSON(projectsData, 'projects.json'); }
function saveCareer() { downloadJSON(careerData, 'career.json'); }
function saveContact() { downloadJSON(contactData, 'contact.json'); }

// Init
loadAdminData();