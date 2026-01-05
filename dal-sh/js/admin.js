// admin.js - Manages all content via JSON files
let siteData = null;    // New: Holds site.json (Home, About, Global)
let servicesData = null;
let projectsData = null;
let careerData = null;
let contactData = null;

async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    return await res.json();
  } catch(e) { console.error("Error loading " + path, e); return {}; }
}

async function loadAdminData() {
  siteData = await fetchJSON('data/site.json'); // Load the main site data
  servicesData = await fetchJSON('data/services.json');
  projectsData = await fetchJSON('data/projects.json');
  careerData = await fetchJSON('data/career.json');
  contactData = await fetchJSON('data/contact.json');

  // Render All Sections
  renderGlobalEditor();
  renderHomeEditor();
  renderAboutEditor();
  
  renderServicesEditor();
  renderProjectsEditor();
  renderCareerEditors();
  renderContactPageEditors();
}

// =======================================================
// 1. GLOBAL SETTINGS (Navbar, Footer, Company Info)
// =======================================================
function renderGlobalEditor() {
    const el = document.getElementById('global-editor');
    const comp = siteData.company || {};
    const footer = siteData.footer || {};

    el.innerHTML = `
        <div class="form-grid">
            <div class="full-width">
                <label>Company Name (Navbar Logo)</label>
                <input value="${escapeHtml(comp.name)}" onchange="siteData.company.name=this.value">
            </div>
            <div class="full-width">
                <label>Site Tagline (Browser Title)</label>
                <input value="${escapeHtml(comp.tagline)}" onchange="siteData.company.tagline=this.value">
            </div>
            <div class="full-width">
                <label>Company Description (SEO)</label>
                <textarea onchange="siteData.company.description=this.value">${escapeHtml(comp.description)}</textarea>
            </div>
            <div class="full-width">
                <label>Footer Copyright Text</label>
                <input value="${escapeHtml(footer.copyright)}" onchange="siteData.footer.copyright=this.value">
            </div>
        </div>
        
        <h3>Footer Contact Details</h3>
        <div class="form-grid">
            <div>
                <label>Email</label>
                <input value="${escapeHtml(footer.contact.email)}" onchange="siteData.footer.contact.email=this.value">
            </div>
            <div>
                <label>Phone</label>
                <input value="${escapeHtml(footer.contact.phone)}" onchange="siteData.footer.contact.phone=this.value">
            </div>
            <div class="full-width">
                <label>Address</label>
                <input value="${escapeHtml(footer.contact.address)}" onchange="siteData.footer.contact.address=this.value">
            </div>
        </div>
    `;
}

// =======================================================
// 2. HOME PAGE (Hero, Intro, News)
// =======================================================
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
            <h3>Introduction Section</h3>
            <label>Title</label>
            <input value="${escapeHtml(home.introduction.title)}" onchange="siteData.home.introduction.title=this.value">
            <label>Content</label>
            <textarea style="height:150px" onchange="siteData.home.introduction.content=this.value">${escapeHtml(home.introduction.content)}</textarea>
        </div>

        <div class="admin-card">
            <h3>Call to Action (CTA)</h3>
            <label>Title</label>
            <input value="${escapeHtml(home.cta.title)}" onchange="siteData.home.cta.title=this.value">
            <label>Description</label>
            <textarea onchange="siteData.home.cta.description=this.value">${escapeHtml(home.cta.description)}</textarea>
            <label>Button Text</label>
            <input value="${escapeHtml(home.cta.button.text)}" onchange="siteData.home.cta.button.text=this.value">
        </div>
    `;

    renderNewsEditor();
}

function renderNewsEditor() {
    const el = document.getElementById('news-editor');
    el.innerHTML = '';
    (siteData.home.news || []).forEach((item, i) => {
        el.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <label>Title</label>
                <input value="${escapeHtml(item.title)}" onchange="siteData.home.news[${i}].title=this.value">
                <label>Date</label>
                <input value="${escapeHtml(item.date)}" onchange="siteData.home.news[${i}].date=this.value">
                <label>Category</label>
                <input value="${escapeHtml(item.category)}" onchange="siteData.home.news[${i}].category=this.value">
                <label>Excerpt</label>
                <textarea onchange="siteData.home.news[${i}].excerpt=this.value">${escapeHtml(item.excerpt)}</textarea>
                <button class="btn-danger" onclick="removeNewsItem(${i})">Remove News</button>
            </div>
        `);
    });
}

function addNewsItem() {
    if (!siteData.home.news) siteData.home.news = [];
    siteData.home.news.push({ title: "New Headline", date: "Jan 1, 2026", category: "Update", excerpt: "Details here...", image: "", link: "#" });
    renderNewsEditor();
}
function removeNewsItem(i) {
    siteData.home.news.splice(i, 1);
    renderNewsEditor();
}

// =======================================================
// 3. ABOUT PAGE (Overview, Mission, Team)
// =======================================================
function renderAboutEditor() {
    const el = document.getElementById('about-editor');
    const about = siteData.about || {};
    
    el.innerHTML = `
        <div class="admin-card">
            <h3>Company Overview</h3>
            <input value="${escapeHtml(about.overview.title)}" onchange="siteData.about.overview.title=this.value">
            <textarea style="height:100px" onchange="siteData.about.overview.content=this.value">${escapeHtml(about.overview.content)}</textarea>
        </div>
        <div class="form-grid">
            <div class="admin-card">
                <h3>Mission</h3>
                <input value="${escapeHtml(about.mission.title)}" onchange="siteData.about.mission.title=this.value">
                <textarea onchange="siteData.about.mission.content=this.value">${escapeHtml(about.mission.content)}</textarea>
            </div>
            <div class="admin-card">
                <h3>Vision</h3>
                <input value="${escapeHtml(about.vision.title)}" onchange="siteData.about.vision.title=this.value">
                <textarea onchange="siteData.about.vision.content=this.value">${escapeHtml(about.vision.content)}</textarea>
            </div>
        </div>
    `;

    renderValuesEditor();
    renderTeamEditor();
}

function renderValuesEditor() {
    const el = document.getElementById('values-editor');
    el.innerHTML = '';
    (siteData.about.values || []).forEach((val, i) => {
        el.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <div class="form-grid">
                    <div><input value="${escapeHtml(val.title)}" onchange="siteData.about.values[${i}].title=this.value" placeholder="Value Title"></div>
                    <div><input value="${escapeHtml(val.icon)}" onchange="siteData.about.values[${i}].icon=this.value" placeholder="Icon"></div>
                    <div class="full-width"><textarea onchange="siteData.about.values[${i}].description=this.value">${escapeHtml(val.description)}</textarea></div>
                </div>
                <button class="btn-danger" onclick="removeValue(${i})">Remove Value</button>
            </div>
        `);
    });
}
function addValue() { siteData.about.values.push({title:"New Value",icon:"⭐",description:"Desc"}); renderValuesEditor(); }
function removeValue(i) { siteData.about.values.splice(i,1); renderValuesEditor(); }

function renderTeamEditor() {
    const el = document.getElementById('team-editor');
    el.innerHTML = '';
    (siteData.about.team || []).forEach((member, i) => {
        el.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <div class="form-grid">
                    <input value="${escapeHtml(member.name)}" onchange="siteData.about.team[${i}].name=this.value" placeholder="Name">
                    <input value="${escapeHtml(member.role)}" onchange="siteData.about.team[${i}].role=this.value" placeholder="Role">
                    <input value="${escapeHtml(member.photo)}" onchange="siteData.about.team[${i}].photo=this.value" placeholder="Photo URL">
                    <div class="full-width"><textarea onchange="siteData.about.team[${i}].bio=this.value" placeholder="Bio">${escapeHtml(member.bio)}</textarea></div>
                </div>
                <button class="btn-danger" onclick="removeTeamMember(${i})">Remove Member</button>
            </div>
        `);
    });
}
function addTeamMember() { siteData.about.team.push({name:"Name",role:"Role",photo:"",bio:"Bio"}); renderTeamEditor(); }
function removeTeamMember(i) { siteData.about.team.splice(i,1); renderTeamEditor(); }

// Save Function for SITE.JSON
function saveSiteData() { downloadJSON(siteData, 'site.json'); }


// =======================================================
// 4. EXISTING EDITORS (Services, Projects, Career, Contact)
// =======================================================
// (These functions are largely the same as your previous version, just ensuring they exist)

function renderServicesEditor(){
  const el = document.getElementById('services-editor');
  el.innerHTML = '';
  (servicesData.services || []).forEach((s,i)=>{
    el.insertAdjacentHTML('beforeend', `
      <div class="admin-card">
        <input placeholder="Title" value="${escapeHtml(s.title)}" onchange="servicesData.services[${i}].title=this.value">
        <textarea placeholder="Description" onchange="servicesData.services[${i}].description=this.value">${escapeHtml(s.description)}</textarea>
        <input placeholder="Icon" value="${escapeHtml(s.icon)}" onchange="servicesData.services[${i}].icon=this.value">
        <button class="btn-danger" onclick="removeService(${i})">Remove</button>
      </div>
    `);
  });
}
function addService(){ servicesData.services.push({title:'New Service',description:'Description',icon:'💻'}); renderServicesEditor(); }
function removeService(i){ servicesData.services.splice(i,1); renderServicesEditor(); }
function saveServices(){ downloadJSON(servicesData,'services.json'); }

function renderProjectsEditor(){
  const el = document.getElementById('projects-editor'); el.innerHTML='';
  (projectsData.projects||[]).forEach((p,i)=>{
    el.insertAdjacentHTML('beforeend', `
      <div class="admin-card">
        <input placeholder="Project Name" value="${escapeHtml(p.name)}" onchange="projectsData.projects[${i}].name=this.value">
        <textarea placeholder="Description" onchange="projectsData.projects[${i}].description=this.value">${escapeHtml(p.description)}</textarea>
        <select onchange="projectsData.projects[${i}].status=this.value" style="margin-bottom:10px">
          <option value="Completed" ${p.status==='Completed'?'selected':''}>Completed</option>
          <option value="Ongoing" ${p.status==='Ongoing'?'selected':''}>Ongoing</option>
        </select>
        <button class="btn-danger" onclick="removeProject(${i})">Remove</button>
      </div>
    `);
  });
}
function addProject(){ projectsData.projects.push({name:'New Project',description:'Desc',technologies:[],status:'Ongoing',image:''}); renderProjectsEditor(); }
function removeProject(i){ projectsData.projects.splice(i,1); renderProjectsEditor(); }
function saveProjects(){ downloadJSON(projectsData,'projects.json'); }

function renderCareerEditors(){
    document.getElementById('career-intro-text').value = (careerData.intro && careerData.intro.description) || '';
    renderBenefitsEditor();
    renderPositionsEditor();
}
function renderBenefitsEditor(){
    const el = document.getElementById('benefits-editor'); el.innerHTML='';
    (careerData.benefits||[]).forEach((b,i)=>{
        el.insertAdjacentHTML('beforeend', `
            <div class="admin-card"><input value="${escapeHtml(b.title)}" onchange="careerData.benefits[${i}].title=this.value">
            <button class="btn-danger" onclick="careerData.benefits.splice(${i},1);renderBenefitsEditor()">Remove</button></div>
        `);
    });
}
function addBenefit(){ careerData.benefits.push({title:'New Benefit',description:'Desc',icon:'✨'}); renderBenefitsEditor(); }

function renderPositionsEditor(){
    const el = document.getElementById('positions-editor'); el.innerHTML='';
    (careerData.positions||[]).forEach((p,i)=>{
        el.insertAdjacentHTML('beforeend', `
            <div class="admin-card">
                <input value="${escapeHtml(p.title)}" onchange="careerData.positions[${i}].title=this.value">
                <button class="btn-danger" onclick="careerData.positions.splice(${i},1);renderPositionsEditor()">Remove</button>
            </div>
        `);
    });
}
function addPosition(){ careerData.positions.push({title:'New Position',location:'Remote',type:'Full-Time',description:'Desc',requirements:[]}); renderPositionsEditor(); }
function saveCareer(){ careerData.intro.description = document.getElementById('career-intro-text').value; downloadJSON(careerData,'career.json'); }

// Contact Page Editing
function renderContactPageEditors() {
    // Main Contact Info
    const el = document.getElementById('main-contact-editor');
    const c = contactData.contact || {};
    el.innerHTML = `
        <div class="form-grid">
            <div><label>Phone</label><input value="${escapeHtml(c.phone)}" onchange="contactData.contact.phone=this.value"></div>
            <div><label>Email</label><input value="${escapeHtml(c.email)}" onchange="contactData.contact.email=this.value"></div>
            <div class="full-width"><label>Address</label><input value="${escapeHtml(c.address)}" onchange="contactData.contact.address=this.value"></div>
            <div class="full-width"><label>Hours</label><input value="${escapeHtml(c.hours)}" onchange="contactData.contact.hours=this.value"></div>
        </div>
    `;
    renderBranchesEditor();
}

function renderBranchesEditor(){
  const el = document.getElementById('branches-editor'); el.innerHTML='';
  (contactData.branches||[]).forEach((b,i)=>{
    el.insertAdjacentHTML('beforeend', `
      <div class="admin-card">
        <input value="${escapeHtml(b.city)}" onchange="contactData.branches[${i}].city=this.value" placeholder="City">
        <textarea onchange="contactData.branches[${i}].address=this.value">${escapeHtml(b.address)}</textarea>
        <button class="btn-danger" onclick="contactData.branches.splice(${i},1);renderBranchesEditor()">Remove</button>
      </div>
    `);
  });
}
function addBranch(){ contactData.branches.push({city:'New City',type:'Office',address:'Address',email:'',phone:''}); renderBranchesEditor(); }
function saveContact(){ downloadJSON(contactData,'contact.json'); }


// UTILITIES
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
function escapeHtml(s){ if (s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// START
loadAdminData();