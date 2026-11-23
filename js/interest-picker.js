const INTEREST_LIMIT = 1;

function escapeInterestText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function openInterestPicker({ required = false, selected = [], onSaved } = {}) {
  if (!supabaseClient || document.querySelector(".interest-backdrop")) return;

  const chosen = new Set(
    (Array.isArray(selected) ? selected : []).filter(id => getInterestOption(id))
  );

  const backdrop = document.createElement("div");
  backdrop.className = "interest-backdrop";

  function optionButtons(options) {
    return options.map(option => `
      <button class="interest-option" type="button" data-interest-id="${escapeInterestText(option.id)}" aria-pressed="false">
        ${escapeInterestText(option.label)}
      </button>
    `).join("");
  }

  backdrop.innerHTML = `
    <div class="interest-dialog" role="dialog" aria-modal="true" aria-labelledby="interest-title">
      <p class="eyebrow">Your path</p>
      <h2 id="interest-title">Choose your major</h2>
      <p>Please pick the one major you want on your career.</p>
      <div class="interest-options">${optionButtons(INTEREST_OPTIONS)}</div>
      <p class="interest-message" aria-live="polite"></p>
      <div class="interest-footer">
        <span class="interest-count">Select 1 major</span>
        <div class="interest-actions">
          ${required ? "" : `<button class="outline-button interest-cancel" type="button">Cancel</button>`}
          <button class="auth-submit interest-save" type="button" disabled>Save major</button>
        </div>
      </div>
      <p class="interest-undecided"><a href="self-assessment.html">Undecided? Take a self-assessment test</a></p>
    </div>
  `;

  const dialog = backdrop.querySelector(".interest-dialog");
  const count = backdrop.querySelector(".interest-count");
  const message = backdrop.querySelector(".interest-message");
  const saveButton = backdrop.querySelector(".interest-save");
  const buttons = [...backdrop.querySelectorAll(".interest-option")];

  function paint() {
    buttons.forEach(button => {
      const isSelected = chosen.has(button.dataset.interestId);
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
    count.textContent = chosen.size === 1 ? "1 major selected" : "Select 1 major";
    saveButton.disabled = chosen.size !== 1;
  }

  function closePicker() {
    backdrop.remove();
    document.body.classList.remove("interest-open");
    document.removeEventListener("keydown", onKeydown);
  }

  function onKeydown(event) {
    if (event.key === "Escape" && !required) closePicker();
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.interestId;
      message.textContent = "";
      if (chosen.has(id)) {
        chosen.delete(id);
      } else {
        chosen.clear();
        chosen.add(id);
      }
      paint();
    });
  });

  saveButton.addEventListener("click", async () => {
    if (chosen.size !== 1) return;
    const interests = [...chosen];
    saveButton.disabled = true;
    message.textContent = "Saving your major…";

    const { error } = await supabaseClient.auth.updateUser({
      data: { interests }
    });

    if (error) {
      saveButton.disabled = false;
      message.textContent = error.message || "Couldn't save your major.";
      return;
    }

    closePicker();
    document.dispatchEvent(new CustomEvent("interests-saved", { detail: { interests } }));
    if (onSaved) onSaved(interests);
  });

  backdrop.querySelector(".interest-cancel")?.addEventListener("click", closePicker);
  if (!required) {
    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) closePicker();
    });
  }

  document.body.classList.add("interest-open");
  document.body.append(backdrop);
  document.addEventListener("keydown", onKeydown);
  paint();
  dialog.querySelector(".interest-option").focus();
}

async function promptForInterests() {
  const page = (window.location.pathname.split("/").pop() || "index").replace(/\.html$/, "");
  if (!supabaseClient || document.body.classList.contains("auth-page") || page === "self-assessment") return;

  const { data } = await supabaseClient.auth.getSession();
  const user = data.session?.user;
  if (!user) return;

  const interests = Array.isArray(user.user_metadata?.interests) ? user.user_metadata.interests : [];
  const savedMajors = interests.filter(id => getInterestOption(id));
  if (savedMajors.length === 1 && interests.length === 1) return;

  openInterestPicker({
    required: true,
    selected: savedMajors.length === 1 ? savedMajors : []
  });
}

window.openInterestPicker = openInterestPicker;
promptForInterests();
