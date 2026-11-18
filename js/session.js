// Replaces Register / Sign in with a name menu that opens Saved and Sign out.
async function renderAuthHeader() {
  const actions = document.querySelector(".top-actions");
  if (!actions || !supabaseClient) return;

  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) return;

  const user = data.session.user;
  const name = user.user_metadata.full_name || user.email;
  const firstName = name.split(" ")[0];

  const menu = document.createElement("div");
  menu.className = "user-menu";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "user-menu-trigger";
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-haspopup", "true");
  trigger.innerHTML = `<span>Hi, ${firstName}</span><span class="user-menu-caret" aria-hidden="true">▾</span>`;

  const panel = document.createElement("div");
  panel.className = "user-menu-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <a class="user-menu-item" href="saved.html">Saved</a>
    <button class="user-menu-item user-menu-signout" type="button">Sign out</button>
  `;

  function closeMenu() {
    menu.classList.remove("is-open");
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    menu.classList.add("is-open");
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  }

  trigger.addEventListener("click", event => {
    event.stopPropagation();
    if (menu.classList.contains("is-open")) closeMenu();
    else openMenu();
  });

  panel.querySelector(".user-menu-signout").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.reload();
  });

  document.addEventListener("click", event => {
    if (!menu.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  menu.append(trigger, panel);
  actions.replaceChildren(menu);
}

renderAuthHeader();
