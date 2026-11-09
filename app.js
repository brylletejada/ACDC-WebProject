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

function getSlideStep() {
  const firstCard = choices[0];
  const gap = parseInt(getComputedStyle(track).gap, 10) || 16;
  return firstCard.getBoundingClientRect().width + gap;
}

function updateCarousel(direction) {
  const maxIndex = Math.max(0, Math.ceil((track.scrollWidth - viewport.clientWidth) / getSlideStep()));
  currentIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));
  viewport.scrollTo({ left: currentIndex * getSlideStep(), behavior: "smooth" });
  $("#majorPosition").textContent = `Showing option ${currentIndex + 1} of ${choices.length}`;
}

$("#majorPrev").addEventListener("click", () => updateCarousel(-1));
$("#majorNext").addEventListener("click", () => updateCarousel(1));

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
