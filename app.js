// These arrays are simple stand-ins for future database tables.
const pathways = [
  { id: "technology", 
    icon: "⌘", 
    title: "Technology", 
    text: "Build a foundation in digital skills, data, and AI.", 
    meta: ["3 courses", "Beginner-friendly"], 
    details: "A practical introduction to technology for students who want to understand how digital tools, data, and AI shape the world." },
  { id: "business", 
    icon: "↗", 
    title: "Business", 
    text: "Turn ideas into impact through entrepreneurship and leadership.", 
    meta: ["2 courses", "5 weeks"], 
    details: "Explore entrepreneurship, marketing, finance, and leadership through activities that connect classroom ideas to real work." },
  { id: "psychology", 
    icon: "◉", title: "Psychology", 
    text: "Understand people, behavior, and the science of well-being.", 
    meta: ["1 course", "Self-paced"], 
    details: "Learn about the history of psychology, neuroscience, and the scientific method while discovering where your curiosity can lead." }
];

const resources = [
  { id: "resume", 
    icon: "▤", 
    title: "Resume starter kit", 
    text: "Templates and tips for your first resume" },
  { id: "interview", 
    icon: "◌", 
    title: "Interview practice", 
    text: "Build confidence before the big day" },
  { id: "college", 
    icon: "⌂", 
    title: "College planning guide", 
    text: "A simple map for your next application" },
  { id: "skills", 
    icon: "✦", 
    title: "Skills self-check", 
    text: "See what you already bring to the table" }
];

// Sample search records. LinkedIn reference for now
const opportunities = [
  { id: "server-architect", 
    type: "Career search", 
    // time: "LinkedIn reference", 
    title: "Information Technology Server Architect / Cybersecurity", 
    company: "LinkedIn", 
    description: "Example search for server architecture and cybersecurity roles.", 
    source: "LinkedIn", 
    sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=server%20architect%20cybersecurity", 
    meta: ["External reference", "Career search"] },
  { id: "software-engineer", 
    type: "Career search", 
    // time: "LinkedIn reference", 
    title: "Software Engineer", 
    company: "LinkedIn", 
    description: "Example search for software engineering roles and entry-level opportunities.", 
    source: "LinkedIn", 
    sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=software%20engineer", 
    meta: ["External reference", "Career search"] },
  { id: "it-support", 
    type: "Career search", 
    // time: "Indeed reference", 
    title: "IT Support Specialist", 
    company: "Indeed", 
    description: "Example search for help desk, technical support, and IT support roles.", 
    source: "Indeed", 
    sourceUrl: "https://www.indeed.com/jobs?q=IT+Support+Specialist", 
    meta: ["External reference", "Career search"] }
];

const savedKey = "acdc-pathways-saved";
let saved = JSON.parse(localStorage.getItem(savedKey) || "[]");
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function renderPathways(items = pathways) {
  $("#pathwayGrid").innerHTML = items.length ? items.map(item => `
    <article class="pathway-card" data-id="${item.id}" data-type="pathway" tabindex="0">
      <div class="card-top"><span class="card-icon">${item.icon}</span><button class="save-button ${saved.includes(item.id) ? "saved" : ""}" data-save="${item.id}" aria-pressed="${saved.includes(item.id)}" aria-label="${saved.includes(item.id) ? "Remove" : "Save"} ${item.title}">${saved.includes(item.id) ? "♥" : "♡"}</button></div>
      <h3>${item.title}</h3><p>${item.text}</p><div class="card-meta"><span>${item.meta[0]}</span><span>·</span><span>${item.meta[1]}</span></div>
    </article>`).join("") : emptyState("No pathways found yet.");
}

function renderResources(items = resources) {
  $("#resourceList").innerHTML = items.length ? items.map(item => `
    <article class="resource-item" data-id="${item.id}" data-type="resource" tabindex="0"><span class="resource-thumb">${item.icon}</span><div><h3>${item.title}</h3><p>${item.text}</p></div><span class="resource-arrow">→</span></article>`).join("") : emptyState("No learning resources found.");
}

function renderOpportunities(items = opportunities) {
  $("#opportunityGrid").innerHTML = items.length ? items.map(item => `
    <article class="opportunity-card" data-id="${item.id}" data-type="opportunity" tabindex="0">
      <div class="opp-type"><span>${item.type}</span><span>${item.time}</span></div>
      <h3>${item.title}</h3><p>${item.description}</p>
      <div class="opp-footer"><span>${item.company}</span><strong>View details →</strong></div>
      <a class="source-link" data-external="true" href="${item.sourceUrl}" target="_blank" rel="noopener">View ${item.source} search ↗</a>
    </article>`).join("") : emptyState("No opportunities found. Try software engineer, cybersecurity, or technology.");
}

function emptyState(message) { 
  return `<div class="empty-state" style="grid-column:1/-1;padding:25px;border:1px dashed #cfc2e1;border-radius:10px;color:#5e5a68;background:#fff">${message}</div>`; }
function updateSavedCount() { 
  $(".saved-count").textContent = saved.length; }
function persistSaved() { 
  localStorage.setItem(savedKey, JSON.stringify(saved)); updateSavedCount(); }

function openDetails(item, type) {
  const title = item.title;
  const description = item.details || item.description || item.text;
  const chips = item.meta || [item.type || "Student resource", item.time || "Explore at your pace"];
  const actionText = type === "opportunity" ? `Open ${item.source} search` : "Add to my plan";
  $("#modalContent").innerHTML = `<span class="modal-kicker">${type === "pathway" ? "Career pathway" : type === "opportunity" ? item.type : "Learning resource"}</span><h2 id="modalTitle">${title}</h2><p>${description}</p><div class="modal-chips">${chips.map(chip => `<span class="modal-chip">${chip}</span>`).join("")}</div><button class="light-button modal-cta" id="modalCta">${actionText} <span>→</span></button>`;
  $("#modalBackdrop").hidden = false;
  $("#modalCta").addEventListener("click", () => {
    if (type === "opportunity") {
      window.open(item.sourceUrl, "_blank", "noopener");
      showToast(`Opening the ${item.source} reference search.`);
      return;
    }
    if (!saved.includes(item.id)) saved.push(item.id);
    persistSaved();
    showToast(`${title} added to your saved list.`);
    $("#modalBackdrop").hidden = true;
    renderPathways();
  });
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function findItem(id, type) {
  if (type === "pathway") return pathways.find(item => item.id === id);
  if (type === "resource") return resources.find(item => item.id === id);
  return opportunities.find(item => item.id === id);
}

function searchAll(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    renderPathways(); renderResources(); renderOpportunities(); return;
  }
  const match = item => Object.values(item).flat().join(" ").toLowerCase().includes(q);
  renderPathways(pathways.filter(match));
  renderResources(resources.filter(match));
  renderOpportunities(opportunities.filter(match));
  if (pathways.some(match) || resources.some(match) || opportunities.some(match)) showToast(`Showing results for “${query}”`);
  else showToast("No exact matches yet — try software engineer, cybersecurity, resume, or mentor.");
}

// Add a short visual pulse to every clicked button or link.
document.addEventListener("click", event => {
  const clicked = event.target.closest("button, a");
  if (!clicked) return;
  clicked.classList.remove("clicked");
  void clicked.offsetWidth;
  clicked.classList.add("clicked");
  setTimeout(() => clicked.classList.remove("clicked"), 280);
}, true);

renderPathways(); renderResources(); renderOpportunities(); updateSavedCount();

document.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    event.stopPropagation();
    const id = saveButton.dataset.save;
    saved = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id];
    persistSaved();
    renderPathways();
    showToast(saved.includes(id) ? "Saved to your plan." : "Removed from your saved list.");
    return;
  }
  if (event.target.closest("[data-external]")) return;
  const card = event.target.closest("[data-type]");
  if (card) {
    const item = findItem(card.dataset.id, card.dataset.type);
    if (item) openDetails(item, card.dataset.type);
    return;
  }
  const tag = event.target.closest("[data-search]");
  if (tag) {
    $("#globalSearch").value = tag.dataset.search;
    searchAll(tag.dataset.search);
    $("#globalSearch").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const scrollTarget = event.target.closest("[data-scroll]");
  if (scrollTarget) document.getElementById(scrollTarget.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
});

$("#searchButton").addEventListener("click", () => searchAll($("#globalSearch").value));
$("#globalSearch").addEventListener("keydown", event => { if (event.key === "Enter") searchAll(event.target.value); });
$("#resetButton").addEventListener("click", () => { $("#globalSearch").value = ""; renderPathways(); renderResources(); renderOpportunities(); showToast("View reset — ready to explore."); });
$("#savedButton").addEventListener("click", () => showToast(saved.length ? `You have ${saved.length} saved item${saved.length === 1 ? "" : "s"}.` : "Save a pathway or opportunity to see it here."));
$("#profileButton").addEventListener("click", () => showToast("Dashboard sign-in is ready for the next project phase."));
$("#continueButton").addEventListener("click", () => { document.querySelector(".pathway-card")?.scrollIntoView({ behavior: "smooth", block: "center" }); showToast("Choose one pathway to continue your map."); });
$("#supportButton").addEventListener("click", () => showToast("Support directory coming next — mentors, tutoring, and wellness resources will live here."));
$("#modalClose").addEventListener("click", () => $("#modalBackdrop").hidden = true);
$("#modalBackdrop").addEventListener("click", event => { if (event.target.id === "modalBackdrop") event.currentTarget.hidden = true; });
document.addEventListener("keydown", event => { if (event.key === "Escape") $("#modalBackdrop").hidden = true; });
$$('.nav-link').forEach(link => link.addEventListener('click', () => { $$('.nav-link').forEach(item => item.classList.remove('active')); link.classList.add('active'); }));
