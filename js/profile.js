const MIN_AGE = 14;
const statusEl = document.getElementById("profileStatus");
const form = document.getElementById("profileForm");
const feedback = document.getElementById("profileFeedback");
const submitButton = form.querySelector(".profile-save");
const firstNameInput = form.querySelector("#first-name");
const lastNameInput = form.querySelector("#last-name");
const birthdateInput = form.querySelector("#birthdate");
const stateSelect = form.querySelector("#state");
const interestList = document.getElementById("profileInterests");
const changeInterestsButton = document.getElementById("changeInterests");
const editButton = document.getElementById("profileEdit");
const cancelButton = document.getElementById("profileCancel");
const nameRead = document.getElementById("nameRead");
const birthdateRead = document.getElementById("birthdateRead");
const stateRead = document.getElementById("stateRead");
const majorRead = document.getElementById("majorRead");
const displayName = document.getElementById("profileDisplayName");
const displayEmail = document.getElementById("profileDisplayEmail");
let currentInterests = [];
let savedSnapshot = null;

function getMaxBirthdate() {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);
  return maxDate.toISOString().slice(0, 10);
}

function isAtLeastMinAge(birthdateValue) {
  if (!birthdateValue) return false;
  const birthdate = new Date(`${birthdateValue}T00:00:00`);
  if (Number.isNaN(birthdate.getTime())) return false;

  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - MIN_AGE);
  cutoff.setHours(0, 0, 0, 0);
  return birthdate <= cutoff;
}

function setStatus(message, isError = false) {
  statusEl.hidden = !message;
  statusEl.textContent = message || "";
  statusEl.classList.toggle("is-error", isError);
  statusEl.classList.add("is-visible");
}

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.classList.toggle("is-error", isError);
  feedback.classList.toggle("is-visible", Boolean(message));
}

function splitFullName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function updateHeader(firstName, lastName, email) {
  const fullName = `${firstName} ${lastName}`.trim() || "Your name";
  displayName.textContent = fullName;
  displayEmail.textContent = email || "";
}

function formatBirthdate(value) {
  if (!value) return "Not set";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function majorText() {
  if (!currentInterests.length) return "Not set";
  return currentInterests.map(id => getInterestOption(id)?.label).filter(Boolean).join(", ");
}

function renderReads() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  nameRead.textContent = `${firstName} ${lastName}`.trim() || "Not set";
  birthdateRead.textContent = formatBirthdate(birthdateInput.value);
  stateRead.textContent = stateSelect.value || "Not set";
  majorRead.textContent = majorText();
  interestList.textContent = majorText();
}

function setEditing(isEditing) {
  form.classList.toggle("is-editing", isEditing);
  editButton.hidden = isEditing;
  if (isEditing) firstNameInput.focus();
}

function renderInterests(ids) {
  currentInterests = Array.isArray(ids) ? ids.filter(id => getInterestOption(id)) : [];
  renderReads();
}

function fillForm(user) {
  const meta = user.user_metadata || {};
  const fromFullName = splitFullName(meta.full_name);
  const firstName = meta.first_name || fromFullName.firstName;
  const lastName = meta.last_name || fromFullName.lastName;

  firstNameInput.value = firstName;
  lastNameInput.value = lastName;
  birthdateInput.value = meta.birthdate || "";
  birthdateInput.max = getMaxBirthdate();
  fillStateSelect(stateSelect, meta.state || "");
  renderInterests(meta.interests);
  savedSnapshot = {
    firstName,
    lastName,
    birthdate: meta.birthdate || "",
    state: meta.state || "",
    interests: [...currentInterests]
  };
  updateHeader(firstName, lastName, user.email || "");
  setEditing(false);
}

async function loadProfile() {
  if (!supabaseClient) {
    setStatus("Profile isn’t set up yet. Add your Supabase project details to supabase-config.js.", true);
    return;
  }

  const user = await getCurrentUser();
  if (!user) {
    requireSignIn("profile.html");
    return;
  }

  fillForm(user);
  form.hidden = false;
  setStatus("");
}

form.addEventListener("submit", async event => {
  event.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const birthdate = birthdateInput.value.trim();
  const state = stateSelect.value.trim();

  if (!firstName || !lastName) {
    showFeedback("Please enter your first and last name.", true);
    return;
  }

  if (!isAtLeastMinAge(birthdate)) {
    showFeedback(`You must be at least ${MIN_AGE} years old.`, true);
    return;
  }

  if (!state) {
    showFeedback("Please select your state.", true);
    return;
  }

  submitButton.disabled = true;
  showFeedback("Saving your profile…");

  const { error } = await supabaseClient.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`.trim(),
      birthdate,
      state
    }
  });

  submitButton.disabled = false;

  if (error) {
    showFeedback(error.message, true);
    return;
  }

  savedSnapshot = {
    firstName,
    lastName,
    birthdate,
    state,
    interests: [...currentInterests]
  };
  renderReads();
  updateHeader(firstName, lastName, displayEmail.textContent);
  setEditing(false);
  showFeedback("Profile updated.");
  const trigger = document.querySelector(".user-menu-trigger span");
  if (trigger) trigger.textContent = `Hi, ${firstName}`;
});

editButton.addEventListener("click", () => {
  showFeedback("");
  setEditing(true);
});

cancelButton.addEventListener("click", async () => {
  if (!savedSnapshot) return;
  const majorChanged = savedSnapshot.interests.join("|") !== currentInterests.join("|");
  firstNameInput.value = savedSnapshot.firstName;
  lastNameInput.value = savedSnapshot.lastName;
  birthdateInput.value = savedSnapshot.birthdate;
  fillStateSelect(stateSelect, savedSnapshot.state);
  renderInterests(savedSnapshot.interests);
  showFeedback("");
  setEditing(false);

  if (majorChanged) {
    await supabaseClient.auth.updateUser({
      data: { interests: savedSnapshot.interests }
    });
  }
});

changeInterestsButton.addEventListener("click", () => {
  openInterestPicker({
    required: currentInterests.length !== 1,
    selected: currentInterests
  });
});

document.addEventListener("interests-saved", event => {
  renderInterests(event.detail.interests);
  showFeedback("Your major is saved.");
});

loadProfile();
