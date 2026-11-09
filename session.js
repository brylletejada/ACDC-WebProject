// Swaps the Register and Sign in buttons for a greeting and Sign out button when someone is signed in.
async function renderAuthHeader() {
  const actions = document.querySelector(".top-actions");
  if (!actions || !supabaseClient) return;

  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) return;

  const user = data.session.user;
  const name = user.user_metadata.full_name || user.email;

  const greeting = document.createElement("span");
  greeting.className = "user-greeting";
  greeting.textContent = `Hi, ${name.split(" ")[0]}`;

  const signOutButton = document.createElement("button");
  signOutButton.type = "button";
  signOutButton.className = "auth-button auth-button-outline";
  signOutButton.textContent = "Sign out";
  signOutButton.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.reload();
  });

  actions.replaceChildren(greeting, signOutButton);
}

renderAuthHeader();
