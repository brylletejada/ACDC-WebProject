const authForm = document.querySelector(".auth-form");
const feedback = authForm.querySelector(".auth-feedback");
const submitButton = authForm.querySelector(".auth-submit");
const isRegister = authForm.dataset.authMode === "register";
const MIN_AGE = 14;

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.classList.toggle("is-error", isError);
  feedback.classList.add("is-visible");
}

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

if (isRegister) {
  const birthdateInput = authForm.querySelector("#birthdate");
  if (birthdateInput) {
    birthdateInput.max = getMaxBirthdate();
  }
}

if (new URLSearchParams(window.location.search).get("reset") === "success") {
  showFeedback("Your password has been updated. Sign in with your new password.");
}

if (supabaseClient) {
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session) window.location.replace("index.html");
  });
}

authForm.addEventListener("submit", async event => {
  event.preventDefault();

  if (!supabaseClient) {
    showFeedback("Sign-in isn't set up yet. Add your Supabase project details to supabase-config.js.", true);
    return;
  }

  const formData = new FormData(authForm);
  const email = formData.get("email").trim();
  const password = formData.get("password");

  if (isRegister) {
    const firstName = String(formData.get("first_name") || "").trim();
    const lastName = String(formData.get("last_name") || "").trim();
    const birthdate = String(formData.get("birthdate") || "").trim();

    if (!firstName || !lastName) {
      showFeedback("Please enter your first and last name.", true);
      return;
    }

    if (!isAtLeastMinAge(birthdate)) {
      showFeedback(`You must be at least ${MIN_AGE} years old to create an account.`, true);
      return;
    }
  }

  submitButton.disabled = true;
  showFeedback(isRegister ? "Creating your account…" : "Signing you in…");

  const { data, error } = isRegister
    ? await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: String(formData.get("first_name") || "").trim(),
            last_name: String(formData.get("last_name") || "").trim(),
            full_name: `${String(formData.get("first_name") || "").trim()} ${String(formData.get("last_name") || "").trim()}`.trim(),
            birthdate: String(formData.get("birthdate") || "").trim()
          },
          emailRedirectTo: new URL("index.html", window.location.href).href
        }
      })
    : await supabaseClient.auth.signInWithPassword({ email, password });

  submitButton.disabled = false;

  if (error) {
    showFeedback(error.message, true);
    return;
  }

  if (isRegister && !data.session) {
    authForm.reset();
    showFeedback("Check your email for a link to confirm your account, then sign in.");
    return;
  }

  const next = new URLSearchParams(window.location.search).get("next");
  const safeNext = next && !next.includes("://") && !next.startsWith("/") ? next : "index.html";
  window.location.href = safeNext;
});
