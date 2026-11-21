const MIN_AGE = 14;
const statusEl = document.getElementById("profileStatus");
const form = document.getElementById("profileForm");
const feedback = document.getElementById("profileFeedback");
const submitButton = form.querySelector(".profile-save");
const firstNameInput = form.querySelector("#first-name");
const lastNameInput = form.querySelector("#last-name");
const birthdateInput = form.querySelector("#birthdate");
const stateSelect = form.querySelector("#state");
const majorSelect = form.querySelector("#major");
const displayName = document.getElementById("profileDisplayName");
const displayEmail = document.getElementById("profileDisplayEmail");

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
  feedback.classList.add("is-visible");
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
  fillMajorSelect(majorSelect, meta.major || "");
  updateHeader(firstName, lastName, user.email || "");
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
  const major = majorSelect.value.trim();

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
      state,
      major
    }
  });

  submitButton.disabled = false;

  if (error) {
    showFeedback(error.message, true);
    return;
  }

  updateHeader(firstName, lastName, displayEmail.textContent);
  showFeedback("Profile updated.");
  const trigger = document.querySelector(".user-menu-trigger span");
  if (trigger) trigger.textContent = `Hi, ${firstName}`;
});

loadProfile();
