const authForm = document.querySelector(".auth-form");
const feedback = authForm.querySelector(".auth-feedback");
const submitButton = authForm.querySelector(".auth-submit");
const isRegister = authForm.dataset.authMode === "register";

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.classList.toggle("is-error", isError);
  feedback.classList.add("is-visible");
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

  submitButton.disabled = true;
  showFeedback(isRegister ? "Creating your account…" : "Signing you in…");

  const { data, error } = isRegister
    ? await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: formData.get("name").trim() },
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

  window.location.href = "index.html";
});
