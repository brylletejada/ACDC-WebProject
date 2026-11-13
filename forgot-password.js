const steps = {
  email: document.querySelector('[data-step="email"]'),
  code: document.querySelector('[data-step="code"]'),
  password: document.querySelector('[data-step="password"]')
};
const resendButton = steps.code.querySelector('[data-action="resend"]');
let resetEmail = "";

function showFeedback(form, message, isError = false) {
  const feedback = form.querySelector(".auth-feedback");
  feedback.textContent = message;
  feedback.classList.toggle("is-error", isError);
  feedback.classList.add("is-visible");
}

function showStep(name) {
  Object.entries(steps).forEach(([key, form]) => {
    form.hidden = key !== name;
  });
  steps[name].querySelector("input").focus();
}

function setBusy(form, isBusy) {
  form.querySelector(".auth-submit").disabled = isBusy;
}

function sendResetCode(email) {
  return supabaseClient.auth.resetPasswordForEmail(email);
}

steps.email.addEventListener("submit", async event => {
  event.preventDefault();
  const form = steps.email;

  if (!supabaseClient) {
    showFeedback(form, "Password reset isn't set up yet. Add your Supabase project details to supabase-config.js.", true);
    return;
  }

  resetEmail = form.email.value.trim();
  setBusy(form, true);
  showFeedback(form, "Sending your code…");

  const { error } = await sendResetCode(resetEmail);
  setBusy(form, false);

  if (error) {
    showFeedback(form, error.message, true);
    return;
  }

  steps.code.querySelector(".reset-email").textContent = resetEmail;
  showStep("code");
});

steps.code.addEventListener("submit", async event => {
  event.preventDefault();
  const form = steps.code;

  setBusy(form, true);
  showFeedback(form, "Verifying your code…");

  const { error } = await supabaseClient.auth.verifyOtp({
    email: resetEmail,
    token: form.code.value.trim(),
    type: "recovery"
  });
  setBusy(form, false);

  if (error) {
    showFeedback(form, "That code is invalid or has expired. Check your email or request a new code.", true);
    return;
  }

  showStep("password");
});

resendButton.addEventListener("click", async () => {
  resendButton.disabled = true;
  showFeedback(steps.code, "Sending a new code…");

  const { error } = await sendResetCode(resetEmail);
  resendButton.disabled = false;

  if (error) {
    showFeedback(steps.code, error.message, true);
    return;
  }

  steps.code.code.value = "";
  showFeedback(steps.code, `A new code was sent to ${resetEmail}.`);
});

steps.password.addEventListener("submit", async event => {
  event.preventDefault();
  const form = steps.password;
  const password = form.password.value;

  if (password !== form.confirmPassword.value) {
    showFeedback(form, "Passwords don't match.", true);
    return;
  }

  setBusy(form, true);
  showFeedback(form, "Updating your password…");

  const { error } = await supabaseClient.auth.updateUser({ password });

  if (error) {
    setBusy(form, false);
    showFeedback(form, error.message, true);
    return;
  }

  await supabaseClient.auth.signOut();
  window.location.href = "login.html?reset=success";
});
