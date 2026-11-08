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
      { icon: "▤", title: "IT resume starter", text: "Show technical skills clearly on your first resume." },
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

function renderPage() {
  document.title = `ACDC | ${major.title}`;
  $("#majorTitle").textContent = major.title;
  $("#majorIntro").textContent = major.intro;
  $("#majorTags").innerHTML = major.tags.map(tag => `<span class="major-tag">${tag}</span>`).join("");
  $("#pathwayGrid").innerHTML = major.pathways.map(item => `
    <article class="pathway-card major-pathway-card">
      <div class="card-top"><span class="card-icon">${item.icon}</span><span class="card-index">PATHWAY</span></div>
      <h3>${item.title}</h3><p>${item.text}</p><div class="card-meta"><span>${item.meta[0]}</span><span>·</span><span>${item.meta[1]}</span></div>
    </article>`).join("");
  $("#resourceList").innerHTML = major.resources.map(item => `
    <article class="resource-item"><span class="resource-thumb">${item.icon}</span><div><h3>${item.title}</h3><p>${item.text}</p></div><span class="resource-arrow">→</span></article>`).join("");
  $("#opportunityGrid").innerHTML = major.opportunities.map(item => `
    <article class="opportunity-card"><h3>${item.title}</h3><p>${item.description}</p><a class="source-link" href="${item.sourceUrl}" target="_blank" rel="noopener">View ${item.source} search ↗</a></article>`).join("");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

renderPage();

$("#supportButton").addEventListener("click", () => showToast("Support directory coming next — mentors, tutoring, and wellness resources will live here."));
const profileButton = $("#profileButton");
const dashboardMenu = $("#dashboardMenu");

function setDashboardMenuOpen(open) {
  dashboardMenu.hidden = !open;
  profileButton.setAttribute("aria-expanded", String(open));
}

profileButton.addEventListener("click", event => {
  event.stopPropagation();
  setDashboardMenuOpen(dashboardMenu.hidden);
});

document.addEventListener("click", event => {
  if (!event.target.closest(".dashboard-menu-wrap")) setDashboardMenuOpen(false);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !dashboardMenu.hidden) {
    setDashboardMenuOpen(false);
    profileButton.focus();
  }
});

document.addEventListener("click", event => {
  const clicked = event.target.closest("button, a");
  if (!clicked) return;
  clicked.classList.remove("clicked");
  void clicked.offsetWidth;
  clicked.classList.add("clicked");
  setTimeout(() => clicked.classList.remove("clicked"), 280);
});
