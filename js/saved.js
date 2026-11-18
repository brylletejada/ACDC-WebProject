const majorPages = {
  informationTechnology: "information-technology.html",
  business: "business.html",
  computerScience: "computer-science.html"
};

const typeLabels = {
  pathway: "Pathways",
  resource: "Learning resources",
  opportunity: "Career opportunities"
};

const statusEl = document.getElementById("savedStatus");
const groupsEl = document.getElementById("savedGroups");
const emptyEl = document.getElementById("savedEmpty");
const totalEl = document.getElementById("savedTotal");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setStatus(message, isError = false) {
  statusEl.hidden = !message;
  statusEl.textContent = message || "";
  statusEl.classList.toggle("is-error", isError);
  statusEl.classList.add("is-visible");
}

function renderItems(items) {
  totalEl.textContent = `${items.length} saved`;

  if (!items.length) {
    groupsEl.hidden = true;
    groupsEl.innerHTML = "";
    emptyEl.hidden = false;
    setStatus("");
    return;
  }

  emptyEl.hidden = true;
  groupsEl.hidden = false;
  setStatus("");

  const grouped = { pathway: [], resource: [], opportunity: [] };
  items.forEach(item => {
    if (grouped[item.item_type]) grouped[item.item_type].push(item);
  });

  groupsEl.innerHTML = Object.entries(grouped)
    .filter(([, list]) => list.length)
    .map(([type, list]) => `
      <section class="saved-group">
        <div class="section-heading">
          <div>
            <p class="eyebrow">${escapeHtml(typeLabels[type])}</p>
            <h2>${list.length} saved</h2>
          </div>
        </div>
        <div class="saved-list">
          ${list.map(item => `
            <article class="saved-card" data-item-key="${escapeHtml(item.item_key)}">
              <div class="saved-card-top">
                <span class="saved-major">${escapeHtml(item.major_title)}</span>
                <button class="save-button saved" type="button" data-item-key="${escapeHtml(item.item_key)}" aria-label="Remove bookmark" aria-pressed="true">♥</button>
              </div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
              <div class="saved-card-actions">
                <a href="${escapeHtml(majorPages[item.major_key] || "index.html")}">Open major →</a>
                ${item.source_url ? `<a href="${escapeHtml(item.source_url)}" target="_blank" rel="noopener">Open link ↗</a>` : ""}
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `)
    .join("");
}

async function removeSavedItem(button) {
  const itemKey = button.dataset.itemKey;
  button.disabled = true;

  try {
    const user = await getCurrentUser();
    if (!user) {
      requireSignIn("saved.html");
      return;
    }

    await removeBookmark(user.id, itemKey);
    const card = button.closest(".saved-card");
    card?.remove();

    const remaining = [...groupsEl.querySelectorAll(".saved-card")];
    if (!remaining.length) {
      renderItems([]);
    } else {
      totalEl.textContent = `${remaining.length} saved`;
      [...groupsEl.querySelectorAll(".saved-group")].forEach(group => {
        const count = group.querySelectorAll(".saved-card").length;
        if (!count) group.remove();
        else group.querySelector("h2").textContent = `${count} saved`;
      });
    }

    showToast("Removed from your saved list.");
  } catch (error) {
    button.disabled = false;
    showToast(error.message || "Couldn't remove that bookmark.");
  }
}

async function initSavedPage() {
  if (!supabaseClient) {
    setStatus("Bookmarks aren't set up yet. Add your Supabase project details first.", true);
    return;
  }

  const user = await getCurrentUser();
  if (!user) {
    requireSignIn("saved.html");
    return;
  }

  try {
    const items = await fetchSavedItems();
    renderItems(items);
  } catch (error) {
    const missingTable = /relation .*saved_items.* does not exist|Could not find the table/i.test(error.message || "");
    setStatus(
      missingTable
        ? "Bookmarks table is missing. Run supabase-saved-items.sql in the Supabase SQL Editor."
        : error.message || "Couldn't load your saved items.",
      true
    );
  }
}

groupsEl.addEventListener("click", event => {
  const button = event.target.closest(".save-button");
  if (button) removeSavedItem(button);
});

initSavedPage();
