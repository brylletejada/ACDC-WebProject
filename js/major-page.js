// The page reads its major name from data-major in the <body> element.
const majorData = {
  informationTechnology: {
    title: "Information Technology",
    intro: "Explore systems, networks, cybersecurity, cloud services, and the technology skills used by organizations every day.",
    tags: ["Cybersecurity", "Networks", "Cloud services"],
    pathways: [
      { icon: "⌘", title: "Cybersecurity foundations", text: "Learn how to protect devices, accounts, networks, and information.", meta: ["3 courses", "Beginner-friendly"] },
      { icon: "◌", title: "Networks and systems", text: "Understand how computers and servers connect and work together.", meta: ["2 courses", "Hands-on"] },
      { icon: "☁", title: "Cloud services", text: "Build a basic understanding of cloud platforms and hosted services.", meta: ["2 courses", "5 weeks"] }
    ],
    resources: [
      { icon: "▤", title: "IT resume starter", text: "Show technical skills clearly on your first resume.", href: "it-resume.html", save: false },
      { icon: "⌘", title: "Cybersecurity basics", text: "Review simple security terms and safe practices." },
      { icon: "◌", title: "Networking vocabulary", text: "Practice common words used in IT support and networks." },
      { icon: "✦", title: "Technical interview practice", text: "Build confidence before an IT interview." }
    ],
    opportunities: [
      { type: "Career search", time: "LinkedIn reference", title: "Server Architect / Cybersecurity", company: "LinkedIn", description: "Example search for server architecture and cybersecurity roles.", source: "LinkedIn", sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=server%20architect%20cybersecurity" },
      { type: "Career search", time: "LinkedIn reference", title: "Information Technology Intern", company: "LinkedIn", description: "Example search for student and entry-level technology internships.", source: "LinkedIn", sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=information%20technology%20intern" },
      { type: "Career search", time: "Indeed reference", title: "IT Support Specialist", company: "Indeed", description: "Example search for help desk and technical support positions.", source: "Indeed", sourceUrl: "https://www.indeed.com/jobs?q=IT+Support+Specialist" }
    ]
  },
  business: {
    title: "Business",
    intro: "Explore leadership, entrepreneurship, marketing, finance, and the skills used to turn ideas into positive community impact.",
    tags: ["Leadership", "Entrepreneurship", "Marketing"],
    pathways: [
      { icon: "↗", title: "Entrepreneurship", text: "Turn a problem or idea into a clear plan for a useful service.", meta: ["2 courses", "5 weeks"] },
      { icon: "$", title: "Finance basics", text: "Learn how budgets, costs, and revenue support good decisions.", meta: ["2 courses", "Beginner-friendly"] },
      { icon: "✦", title: "Leadership and teams", text: "Practice communication, teamwork, and responsible leadership.", meta: ["1 course", "Self-paced"] }
    ],
    resources: [
      { icon: "▤", title: "Business resume starter", text: "Organize your strengths for business roles." },
      { icon: "↗", title: "Pitch practice guide", text: "Practice explaining an idea in a simple way." },
      { icon: "$", title: "Budget planning worksheet", text: "Try a basic budget for a project or small business." },
      { icon: "✦", title: "Leadership self-check", text: "Think about the skills you bring to a team." }
    ],
    opportunities: [
      { type: "Career search", time: "LinkedIn reference", title: "Business Analyst", company: "LinkedIn", description: "Example search for business analysis and planning roles.", source: "LinkedIn", sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=business%20analyst" },
      { type: "Career search", time: "Indeed reference", title: "Marketing Intern", company: "Indeed", description: "Example search for marketing internships and student roles.", source: "Indeed", sourceUrl: "https://www.indeed.com/jobs?q=marketing+intern" },
      { type: "Career search", time: "LinkedIn reference", title: "Project Coordinator", company: "LinkedIn", description: "Example search for entry-level project coordination roles.", source: "LinkedIn", sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=project%20coordinator" }
    ]
  },
  computerScience: {
    title: "Computer Science",
    intro: "Explore programming, software development, data, and problem-solving through practical technology projects.",
    tags: ["Programming", "Software", "Data"],
    pathways: [
      { icon: "&lt;/&gt;", title: "Programming foundations", text: "Start solving problems with code and logical thinking.", meta: ["3 courses", "Beginner-friendly"] },
      { icon: "◈", title: "Software development", text: "Learn how software is planned, built, tested, and improved.", meta: ["3 courses", "Project-based"] },
      { icon: "▤", title: "Data and algorithms", text: "Use data structures and step-by-step methods to solve problems.", meta: ["2 courses", "5 weeks"] }
    ],
    resources: [
      { icon: "&lt;/&gt;", title: "Coding starter guide", text: "Review basic programming ideas and vocabulary." },
      { icon: "◈", title: "Project ideas", text: "Choose a small project to practice your skills." },
      { icon: "▤", title: "Git and teamwork basics", text: "Learn how developers share and track code." },
      { icon: "✦", title: "Software interview practice", text: "Prepare for common questions and coding tasks." }
    ],
    opportunities: [
      { type: "Career search", time: "LinkedIn reference", title: "Software Engineer", company: "LinkedIn", description: "Example search for software engineering and entry-level roles.", source: "LinkedIn", sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=software%20engineer" },
      { type: "Career search", time: "LinkedIn reference", title: "Data Analyst", company: "LinkedIn", description: "Example search for data analysis and reporting roles.", source: "LinkedIn", sourceUrl: "https://www.linkedin.com/jobs/search/?keywords=data%20analyst" },
      { type: "Career search", time: "Indeed reference", title: "Frontend Developer", company: "Indeed", description: "Example search for web development and frontend positions.", source: "Indeed", sourceUrl: "https://www.indeed.com/jobs?q=frontend+developer" }
    ]
  }
};

const $ = selector => document.querySelector(selector);
const pageKey = document.body.dataset.major;
const major = majorData[pageKey];
const majorPageFile = {
  informationTechnology: "information-technology.html",
  business: "business.html",
  computerScience: "computer-science.html"
}[pageKey];

let currentUser = null;
let savedKeys = new Set();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function saveButtonMarkup(itemKey, isSaved) {
  const label = isSaved ? "Remove bookmark" : "Save bookmark";
  return `<button class="save-button save-circle${isSaved ? " saved" : ""}" type="button" data-item-key="${escapeHtml(itemKey)}" aria-label="${label}" aria-pressed="${isSaved}"></button>`;
}

function renderPage() {
  document.title = `ACDC | ${major.title}`;
  $("#majorTitle").textContent = major.title;
  $("#majorIntro").textContent = major.intro;
  $("#majorTags").innerHTML = major.tags.map(tag => `<span class="major-tag">${escapeHtml(tag)}</span>`).join("");

  $("#pathwayGrid").innerHTML = major.pathways.map(item => {
    const itemKey = buildItemKey(pageKey, "pathway", item.title);
    return `
    <article class="pathway-card major-pathway-card" data-item-type="pathway" data-title="${escapeHtml(item.title)}" data-description="${escapeHtml(item.text)}">
      <div class="card-top"><span class="card-icon">${item.icon}</span>${saveButtonMarkup(itemKey, savedKeys.has(itemKey))}</div>
      <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p><div class="card-meta"><span>${escapeHtml(item.meta[0])}</span><span>·</span><span>${escapeHtml(item.meta[1])}</span></div>
    </article>`;
  }).join("");

  $("#resourceList").innerHTML = major.resources.map(item => {
    const itemKey = buildItemKey(pageKey, "resource", item.title);
    const save = item.save === false ? "" : saveButtonMarkup(itemKey, savedKeys.has(itemKey));
    const inner = `
      <span class="resource-thumb">${item.icon}</span>
      <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>
      ${save}`;
    if (item.href) {
      return `<a class="resource-item resource-link" href="${escapeHtml(item.href)}">${inner}</a>`;
    }
    return `<article class="resource-item" data-item-type="resource" data-title="${escapeHtml(item.title)}" data-description="${escapeHtml(item.text)}">${inner}</article>`;
  }).join("");

  $("#opportunityGrid").innerHTML = major.opportunities.map(item => {
    return `
    <article class="opportunity-card">
      <div class="opp-type"><span>${escapeHtml(item.type)}</span></div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <a class="source-link" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener">View ${escapeHtml(item.source)} search ↗</a>
    </article>`;
  }).join("");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function setSaveButtonState(button, isSaved) {
  button.classList.toggle("saved", isSaved);
  button.setAttribute("aria-pressed", String(isSaved));
  button.setAttribute("aria-label", isSaved ? "Remove bookmark" : "Save bookmark");
}

async function toggleBookmark(button) {
  if (!supabaseClient) {
    showToast("Bookmarks aren't set up yet. Add your Supabase project details first.");
    return;
  }

  if (!currentUser) {
    showToast("Sign in to save bookmarks.");
    requireSignIn(majorPageFile);
    return;
  }

  const card = button.closest("[data-item-type]");
  const itemKey = button.dataset.itemKey;
  const isSaved = savedKeys.has(itemKey);
  button.disabled = true;

  try {
    if (isSaved) {
      await removeBookmark(currentUser.id, itemKey);
      savedKeys.delete(itemKey);
      setSaveButtonState(button, false);
      showToast("Removed from your saved list.");
    } else {
      await saveBookmark({
        user_id: currentUser.id,
        item_type: card.dataset.itemType,
        item_key: itemKey,
        major_key: pageKey,
        major_title: major.title,
        title: card.dataset.title,
        description: card.dataset.description || "",
        source_url: card.dataset.sourceUrl || null
      });
      savedKeys.add(itemKey);
      setSaveButtonState(button, true);
      showToast("Saved to your list.");
    }
  } catch (error) {
    const missingTable = /relation .*saved_items.* does not exist|Could not find the table/i.test(error.message || "");
    showToast(
      missingTable
        ? "Bookmarks table is missing. Run supabase-saved-items.sql in Supabase."
        : error.message || "Couldn't update that bookmark."
    );
  } finally {
    button.disabled = false;
  }
}

async function initBookmarks() {
  renderPage();

  currentUser = await getCurrentUser();
  if (currentUser) {
    try {
      savedKeys = await fetchSavedKeys(currentUser.id);
      renderPage();
    } catch (error) {
      const missingTable = /relation .*saved_items.* does not exist|Could not find the table/i.test(error.message || "");
      if (missingTable) {
        showToast("Bookmarks table is missing. Run supabase-saved-items.sql in Supabase.");
      }
    }
  }
}

initBookmarks();

$("#supportButton").addEventListener("click", () => showToast("Support directory coming next — mentors, tutoring, and wellness resources will live here."));

document.addEventListener("click", event => {
  const saveButton = event.target.closest(".save-button");
  if (saveButton) {
    event.preventDefault();
    event.stopPropagation();
    toggleBookmark(saveButton);
    return;
  }

  const clicked = event.target.closest("button, a");
  if (!clicked) return;
  clicked.classList.remove("clicked");
  void clicked.offsetWidth;
  clicked.classList.add("clicked");
  setTimeout(() => clicked.classList.remove("clicked"), 280);
});
