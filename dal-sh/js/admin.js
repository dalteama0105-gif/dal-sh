// admin.js - loads services.json, projects.json, career.json, contact.json and provides editors
let servicesData = null;
let projectsData = null;
let careerData = null;
let contactData = null;

// Replace with your Cloudinary values
const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

async function fetchJSON(path) {
  const res = await fetch(path);
  return await res.json();
}

async function loadAdminData() {
  servicesData = await fetchJSON('data/services.json');
  projectsData = await fetchJSON('data/projects.json');
  careerData = await fetchJSON('data/career.json');
  contactData = await fetchJSON('data/contact.json');

  renderServicesEditor();
  renderProjectsEditor();
  renderCareerEditors();
  renderBranchesEditor();
}

function renderServicesEditor(){
  const el = document.getElementById('services-editor');
  el.innerHTML = '';
  (servicesData.services || []).forEach((s,i)=>{
    const html = `
      <div class="admin-card">
        <input placeholder="Title" value="${escapeHtml(s.title)}" onchange="servicesData.services[${i}].title=this.value">
        <textarea placeholder="Description" onchange="servicesData.services[${i}].description=this.value">${escapeHtml(s.description)}</textarea>
        <input placeholder="Icon (emoji or text)" value="${escapeHtml(s.icon)}" onchange="servicesData.services[${i}].icon=this.value">
        <div style="margin-top:8px">
          <button class="btn btn-secondary" onclick="removeService(${i})">Remove</button>
        </div>
      </div>
    `;
    el.insertAdjacentHTML('beforeend', html);
  });
}
function addService(){
  servicesData.services.push({title:'New Service',description:'Description',icon:'💻'});
  renderServicesEditor();
}
function removeService(i){ servicesData.services.splice(i,1); renderServicesEditor(); }
function saveServices(){ downloadJSON(servicesData,'services.json'); }

// Projects
function renderProjectsEditor(){
  const el = document.getElementById('projects-editor'); el.innerHTML='';
  (projectsData.projects||[]).forEach((p,i)=>{
    const techs = (p.technologies||[]).join(', ');
    el.insertAdjacentHTML('beforeend', `
      <div class="admin-card">
        <input placeholder="Project Name" value="${escapeHtml(p.name)}" onchange="projectsData.projects[${i}].name=this.value">
        <textarea placeholder="Description" onchange="projectsData.projects[${i}].description=this.value">${escapeHtml(p.description)}</textarea>
        <input placeholder="Technologies (comma separated)" value="${escapeHtml(techs)}"
               onchange="projectsData.projects[${i}].technologies=this.value.split(',').map(t=>t.trim())">
        <select onchange="projectsData.projects[${i}].status=this.value">
          <option value="Completed" ${p.status==='Completed'?'selected':''}>Completed</option>
          <option value="Ongoing" ${p.status==='Ongoing'?'selected':''}>Ongoing</option>
        </select>
        <input placeholder="Image URL" value="${escapeHtml(p.image||'')}" onchange="projectsData.projects[${i}].image=this.value">
        <div style="margin-top:8px"><button class="btn btn-secondary" onclick="removeProject(${i})">Remove</button></div>
      </div>
    `);
  });
}
function addProject(){
  projectsData.projects.push({name:'New Project',description:'Description',technologies:['Tech'],status:'Ongoing',image:''});
  renderProjectsEditor();
}
function removeProject(i){ projectsData.projects.splice(i,1); renderProjectsEditor(); }
function saveProjects(){ downloadJSON(projectsData,'projects.json'); }

// Career editors
function renderCareerEditors(){
  document.getElementById('career-intro-text').value = (careerData.intro && careerData.intro.description) || '';
  renderBenefitsEditor();
  renderPositionsEditor();
}
function saveCareer(){
  careerData.intro.description = document.getElementById('career-intro-text').value;
  downloadJSON(careerData,'career.json');
}

// Benefits
function renderBenefitsEditor(){
  const el = document.getElementById('benefits-editor'); el.innerHTML='';
  (careerData.benefits||[]).forEach((b,i)=>{
    el.insertAdjacentHTML('beforeend', `
      <div class="admin-card">
        <input value="${escapeHtml(b.title)}" onchange="careerData.benefits[${i}].title=this.value">
        <textarea onchange="careerData.benefits[${i}].description=this.value">${escapeHtml(b.description)}</textarea>
        <input value="${escapeHtml(b.icon)}" onchange="careerData.benefits[${i}].icon=this.value">
        <div style="margin-top:8px"><button class="btn btn-secondary" onclick="careerData.benefits.splice(${i},1);renderBenefitsEditor()">Remove</button></div>
      </div>
    `);
  });
}
function addBenefit(){ careerData.benefits.push({title:'New Benefit',description:'Description',icon:'✨'}); renderBenefitsEditor(); }

// Positions
function renderPositionsEditor(){
  const el = document.getElementById('positions-editor'); el.innerHTML='';
  (careerData.positions||[]).forEach((p,i)=>{
    el.insertAdjacentHTML('beforeend', `
      <div class="admin-card">
        <input value="${escapeHtml(p.title)}" onchange="careerData.positions[${i}].title=this.value">
        <input value="${escapeHtml(p.location)}" onchange="careerData.positions[${i}].location=this.value">
        <input value="${escapeHtml(p.type)}" onchange="careerData.positions[${i}].type=this.value">
        <textarea onchange="careerData.positions[${i}].description=this.value">${escapeHtml(p.description)}</textarea>
        <textarea placeholder="Requirements (one per line)" onchange="careerData.positions[${i}].requirements=this.value.split('\\n')">${(p.requirements||[]).join('\n')}</textarea>
        <div style="margin-top:8px"><button class="btn btn-secondary" onclick="careerData.positions.splice(${i},1);renderPositionsEditor()">Remove</button></div>
      </div>
    `);
  });
}
function addPosition(){ careerData.positions.push({title:'New Position',location:'Remote',type:'Full-Time',description:'Description',requirements:['Requirement 1']}); renderPositionsEditor(); }

// Branches editor
function renderBranchesEditor(){
  const el = document.getElementById('branches-editor'); el.innerHTML='';
  (contactData.branches||[]).forEach((b,i)=>{
    el.insertAdjacentHTML('beforeend', `
      <div class="admin-card">
        <input value="${escapeHtml(b.city)}" onchange="contactData.branches[${i}].city=this.value">
        <input value="${escapeHtml(b.type)}" onchange="contactData.branches[${i}].type=this.value">
        <textarea onchange="contactData.branches[${i}].address=this.value">${escapeHtml(b.address)}</textarea>
        <input value="${escapeHtml(b.email)}" onchange="contactData.branches[${i}].email=this.value">
        <input value="${escapeHtml(b.phone)}" onchange="contactData.branches[${i}].phone=this.value">
        <div style="margin-top:8px"><button class="btn btn-secondary" onclick="contactData.branches.splice(${i},1);renderBranchesEditor()">Remove</button></div>
      </div>
    `);
  });
}
function addBranch(){ contactData.branches.push({city:'New City',type:'Office',address:'Address',email:'email@dal-sh.com',phone:'+000000000'}); renderBranchesEditor(); }
function saveBranches(){ downloadJSON(contactData,'contact.json'); }

// Utility
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// Cloudinary upload
async function uploadImage() {
  const input = document.getElementById('imageUpload');
  if (!input.files || !input.files[0]) { alert('Select an image first'); return; }
  const file = input.files[0];
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET);
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method:'POST', body:fd });
    const data = await res.json();
    document.getElementById('imageUrl').value = data.secure_url;
    document.getElementById('imagePreview').src = data.secure_url;
  } catch (e) {
    console.error('upload error', e);
    alert('Upload failed');
  }
}

function escapeHtml(s){ if (s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// initialization
loadAdminData();
