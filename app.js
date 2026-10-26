// These arrays are simple stand-ins for future database tables.
const pathways = [
  { id: "technology", 
    icon: "⌘", 
    title: "Technology", 
    tagline: "Digital skills, data, and AI",
    recommended: true,
    text: "Build a foundation in digital skills, data, and AI.", 
    meta: ["3 courses", "Beginner-friendly"], 
    details: "A practical introduction to technology for students who want to understand how digital tools, data, and AI shape the world." },
  { id: "business", 
    icon: "↗", 
    title: "Business", 
    tagline: "Entrepreneurship and leadership",
    text: "Turn ideas into impact through entrepreneurship and leadership.", 
    meta: ["2 courses", "5 weeks"], 
    details: "Explore entrepreneurship, marketing, finance, and leadership through activities that connect classroom ideas to real work." },
  { id: "psychology", 
    icon: "◉", title: "Psychology", 
    tagline: "People and well-being",
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
    time: "", 
    title: "Information Technology Server Architect / Cybersecurity", 
    company: "LinkedIn", 
    description: "Example search for server architecture and cybersecurity roles.", 
    source: "LinkedIn", 
    sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=server%20architect%20cybersecurity", 
    meta: ["External reference", "Career search"] },
  { id: "software-engineer", 
    type: "Career search", 
    time: "LinkedIn", 
    title: "Software Engineer", 
    company: "", 
    description: "Example search for software engineering roles and entry-level opportunities.", 
    source: "LinkedIn", 
    sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=software%20engineer", 
    meta: ["External reference", "Career search"] },
  { id: "it-support", 
    type: "Career search", 
    time: "", 
    title: "IT Support Specialist",
    company: "Indeed",
    description: "Example search for help desk, technical support, and IT support roles.", 
    source: "Indeed", 
    sourceUrl: "https://www.indeed.com/jobs?q=IT+Support+Specialist", 
    meta: ["External reference", "Career search"] }
];

// Only pathways listed here have a step-by-step journey so far.
const journeys = {
  technology: [
    { title: "Take the course",
      text: "Start the Technology pathway: three beginner-friendly courses on digital skills, data, and AI.",
      action: "View course", type: "pathway", id: "technology" },
    { title: "Build your skills",
      text: "Try the skills self-check, then use the resume starter kit to show what you can do.",
      action: "Open self-check", type: "resource", id: "skills" },
    { title: "Find an internship or job",
      text: "Look at IT Support Specialist roles, a common first step into technology.",
      action: "View opportunity", type: "opportunity", id: "it-support", sample: true },
    { title: "Reach out to a mentor",
      text: "Ask ACDC for guidance on your resume and what to apply for first.",
      action: "Find support", scroll: "support" }
  ]
};

const savedKey = "acdc-pathways-saved";
const progressKey = "acdc-pathways-progress";
let saved = JSON.parse(localStorage.getItem(savedKey) || "[]");
let progress = JSON.parse(localStorage.getItem(progressKey) || "{}");
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
      <div class="opp-footer"><span>${item.company}</span><strong>" "</strong></div>
      <a class="source-link" data-external="true" href="${item.sourceUrl}" target="_blank" rel="noopener">View ${item.source} search ↗</a>
    </article>`).join("") : emptyState("No opportunities yet.");
}

function renderStartButtons() {
  $("#startButtons").innerHTML = pathways.map(item => {
    const selected = progress.pathway === item.id;
    return `
    <button class="start-button ${item.recommended ? "recommended" : ""} ${selected ? "selected" : ""}" data-pathway="${item.id}" aria-pressed="${selected}">
      <strong>${item.title}</strong><small>${item.tagline}</small>
    </button>`;
  }).join("");
}

function renderJourney() {
  $("#journeyGrid").innerHTML = journeys.technology.map((step, index) => `
    <article class="journey-step">
      <span class="journey-number">Step ${index + 1}</span>
      <h3>${step.title}${step.sample ? ` <span class="sample-tag">Sample</span>` : ""}</h3>
      <p>${step.text}</p>
      <button class="outline-button" ${step.scroll ? `data-scroll="${step.scroll}"` : `data-type="${step.type}" data-id="${step.id}"`}>${step.action} <span>→</span></button>
    </article>`).join("");
}

function renderProgress() {
  const steps = [Boolean(progress.pathway), Boolean(progress.explored), saved.length > 0];
  const percent = Math.round(steps.filter(Boolean).length / steps.length * 100);
  $(".progress-percent").textContent = `${percent}%`;
  $(".progress-bar span").style.width = `${percent}%`;
  $$(".progress-step").forEach((step, index) => {
    step.classList.toggle("done", steps[index]);
    step.querySelector("span").textContent = steps[index] ? "✓" : index + 1;
    step.querySelector("small").textContent = steps[index] ? "Completed" : step.dataset.time;
  });
}

function emptyState(message) { 
  return `<div class="empty-state" style="grid-column:1/-1;padding:25px;border:1px dashed #cfc2e1;border-radius:10px;color:#5e5a68;background:#fff">${message}</div>`; }
function persistSaved() { 
  localStorage.setItem(savedKey, JSON.stringify(saved)); renderProgress(); }
function persistProgress() {
  localStorage.setItem(progressKey, JSON.stringify(progress)); renderStartButtons(); renderProgress(); }

function choosePathway(id) {
  const item = pathways.find(pathway => pathway.id === id);
  if (!item) return;
  progress.pathway = id;
  persistProgress();
  if (journeys[id]) {
    $("#journey").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast(`${item.title} selected. Here is your journey.`);
    return;
  }
  openDetails({ ...item, details: `${item.details} A step-by-step journey for ${item.title} is coming next. Technology is mapped first.` }, "pathway");
}

function openDetails(item, type) {
  if (type === "pathway" && !progress.explored) {
    progress.explored = true;
    persistProgress();
  }
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

// Add a short visual pulse to every clicked button or link.
document.addEventListener("click", event => {
  const clicked = event.target.closest("button, a");
  if (!clicked) return;
  clicked.classList.remove("clicked");
  void clicked.offsetWidth;
  clicked.classList.add("clicked");
  setTimeout(() => clicked.classList.remove("clicked"), 280);
}, true);

renderStartButtons(); renderJourney(); renderPathways(); renderResources(); renderOpportunities(); renderProgress();

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
  const pathwayButton = event.target.closest("[data-pathway]");
  if (pathwayButton) {
    choosePathway(pathwayButton.dataset.pathway);
    return;
  }
  if (event.target.closest("[data-unsure]")) {
    $("#resources").scrollIntoView({ behavior: "smooth", block: "start" });
    openDetails(findItem("skills", "resource"), "resource");
    return;
  }
  const card = event.target.closest("[data-type]");
  if (card) {
    const item = findItem(card.dataset.id, card.dataset.type);
    if (item) openDetails(item, card.dataset.type);
    return;
  }
  const scrollTarget = event.target.closest("[data-scroll]");
  if (scrollTarget) document.getElementById(scrollTarget.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
});

$("#savedButton")?.addEventListener("click", () => showToast(saved.length ? `You have ${saved.length} saved item${saved.length === 1 ? "" : "s"}.` : "Save a pathway or opportunity to see it here."));
$("#continueButton").addEventListener("click", () => {
  if (!progress.pathway) {
    $("#explore").scrollIntoView({ behavior: "smooth" });
    showToast("Choose where to start first.");
  } else if (journeys[progress.pathway]) {
    $("#journey").scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    choosePathway(progress.pathway);
  }
});
$("#supportButton").addEventListener("click", () => showToast("Support directory coming next — mentors, tutoring, and wellness resources will live here."));
$("#modalClose").addEventListener("click", () => $("#modalBackdrop").hidden = true);
$("#modalBackdrop").addEventListener("click", event => { if (event.target.id === "modalBackdrop") event.currentTarget.hidden = true; });
document.addEventListener("keydown", event => { if (event.key === "Escape") $("#modalBackdrop").hidden = true; });
$$('.nav-link').forEach(link => link.addEventListener('click', () => { $$('.nav-link').forEach(item => item.classList.remove('active')); link.classList.add('active'); }));
