// This file controls the major buttons on the homepage.
const $ = selector => document.querySelector(selector);

const viewport = $("#majorViewport");
const track = document.querySelector(".major-track");
const choices = [...document.querySelectorAll(".major-choice")];
let currentIndex = 0;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function getCardScrollLeft(index) {
  const card = choices[index];
  return card.getBoundingClientRect().left - viewport.getBoundingClientRect().left + viewport.scrollLeft;
}

function getMaxIndex() {
  const maxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
  let maxIndex = 0;
  for (let i = 0; i < choices.length; i++) {
    if (getCardScrollLeft(i) <= maxScroll + 1) maxIndex = i;
  }
  return maxIndex;
}

function scrollToCard(index, behavior = "smooth") {
  const maxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
  const left = Math.min(Math.max(0, getCardScrollLeft(index)), maxScroll);
  viewport.scrollTo({ left, behavior });
}

function updateCarousel(direction) {
  currentIndex = Math.max(0, Math.min(currentIndex + direction, getMaxIndex()));
  scrollToCard(currentIndex);
  $("#majorPosition").textContent = `Showing option ${currentIndex + 1} of ${choices.length}`;
}

$("#majorPrev").addEventListener("click", () => updateCarousel(-1));
$("#majorNext").addEventListener("click", () => updateCarousel(1));

window.addEventListener("resize", () => {
  currentIndex = Math.max(0, Math.min(currentIndex, getMaxIndex()));
  scrollToCard(currentIndex, "auto");
  $("#majorPosition").textContent = `Showing option ${currentIndex + 1} of ${choices.length}`;
});

document.addEventListener("click", event => {
  const placeholder = event.target.closest("[data-placeholder]");
  if (placeholder) showToast("S.Majors is a placeholder for future major pages.");
});

// Add a short visual pulse so every clicked button or link gives feedback.
document.addEventListener("click", event => {
  const clicked = event.target.closest("button, a");
  if (!clicked) return;
  clicked.classList.remove("clicked");
  void clicked.offsetWidth;
  clicked.classList.add("clicked");
  setTimeout(() => clicked.classList.remove("clicked"), 280);
}, true);
