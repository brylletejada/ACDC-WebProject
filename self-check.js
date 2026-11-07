const majors = {
  technology: {
    title: "Technology",
    blurb: "You enjoy figuring out how things work and fixing problems. The Technology pathway builds digital skills, data, and AI know-how, and IT support is a common first job.",
    meta: ["2 courses", "11 weeks"]
  },
  business: {
    title: "Business",
    blurb: "You like leading, planning, and turning ideas into something real. The Business pathway covers entrepreneurship, marketing, finance, and leadership. A step-by-step journey for Business is coming next.",
    meta: ["2 courses", "5 weeks"]
  },
  psychology: {
    title: "Psychology",
    blurb: "You notice how people feel and why they act the way they do. The Psychology pathway explores behavior, the brain, and well-being. A step-by-step journey for Psychology is coming next.",
    meta: ["1 course", "Self-paced"]
  }
};
const majorOrder = ["technology", "business", "psychology"];

// Each question has exactly one answer per major, in a mixed order so the position never hints at the result.
const questions = [
  { text: "Your school club needs help. You'd rather…", answers: [
    { text: "Plan the fundraiser budget", major: "business" },
    { text: "Fix the club's website", major: "technology" },
    { text: "Help new members feel welcome", major: "psychology" } ] },
  { text: "A friend's laptop crashes the night before a deadline. You…", answers: [
    { text: "Try to figure out what went wrong and fix it", major: "technology" },
    { text: "Help them stay calm", major: "psychology" },
    { text: "Make a backup plan so they still finish on time", major: "business" } ] },
  { text: "In a group project, you usually…", answers: [
    { text: "Keep everyone getting along", major: "psychology" },
    { text: "Lead the group and split up the tasks", major: "business" },
    { text: "Handle the tools, slides, or tech", major: "technology" } ] },
  { text: "Which video would you click first?", answers: [
    { text: "\"I started a business at 17\"", major: "business" },
    { text: "\"Why we procrastinate\"", major: "psychology" },
    { text: "\"How AI actually works\"", major: "technology" } ] },
  { text: "Which problem would you most like to help solve?", answers: [
    { text: "Online scams and hacking", major: "technology" },
    { text: "Small shops struggling to stay open", major: "business" },
    { text: "Stress and anxiety among students", major: "psychology" } ] },
  { text: "On a free Saturday, you'd rather…", answers: [
    { text: "Talk with friends about what's on their minds", major: "psychology" },
    { text: "Build or tinker with an app, game, or gadget", major: "technology" },
    { text: "Sell something you made", major: "business" } ] },
  { text: "Which compliment would feel best?", answers: [
    { text: "\"Great idea. Let's launch it!\"", major: "business" },
    { text: "\"You figured it out!\"", major: "technology" },
    { text: "\"You really understand people.\"", major: "psychology" } ] },
  { text: "Which school subjects do you enjoy most?", answers: [
    { text: "Health or social studies", major: "psychology" },
    { text: "Economics or marketing", major: "business" },
    { text: "Math or computers", major: "technology" } ] },
  { text: "Where can you picture yourself working?", answers: [
    { text: "A tech company or IT team", major: "technology" },
    { text: "A school, clinic, or counseling office", major: "psychology" },
    { text: "Your own business", major: "business" } ] },
  { text: "This summer, you'd most like to learn…", answers: [
    { text: "How to manage money", major: "business" },
    { text: "How the brain works", major: "psychology" },
    { text: "Coding basics", major: "technology" } ] }
];

const resultKey = "acdc-pathways-selfcheck";
const savedKey = "acdc-pathways-saved";
const progressKey = "acdc-pathways-progress";
const quiz = document.getElementById("quiz");
let current = 0;
let answers = [];
let finishTimer;

const readJson = (key, fallback) => JSON.parse(localStorage.getItem(key) || "null") ?? fallback;

function show(html, focus = true) {
  quiz.innerHTML = html;
  if (focus) quiz.querySelector("h1").focus();
}

function renderIntro(focus = true) {
  const last = readJson(resultKey, null);
  show(`
    <p class="eyebrow">Skills self-check</p>
    <h1 tabindex="-1">Which pathway fits you?</h1>
    <p class="muted">Answer ${questions.length} quick questions about what you enjoy. There are no wrong answers. Pick whatever sounds most like you.</p>
    <ul class="quiz-facts"><li>${questions.length} questions</li><li>About 2 minutes</li><li>Answers stay on this device</li></ul>
    <div class="quiz-nav">
      <button class="primary-button" data-action="start">Start the quiz <span>→</span></button>
      ${last ? `<button class="text-button" data-action="last">See my last result</button>` : ""}
    </div>`, focus);
}

function renderQuestion() {
  const question = questions[current];
  const chosen = answers[current];
  const isLast = current === questions.length - 1;
  show(`
    <div class="quiz-progress">Question ${current + 1} of ${questions.length}
      <div class="quiz-track"><span style="width:${(current + 1) / questions.length * 100}%"></span></div>
    </div>
    <h1 class="quiz-question" tabindex="-1">${question.text}</h1>
    <div class="quiz-options" role="group" aria-label="Answers">
      ${question.answers.map((answer, index) => `
        <button class="quiz-option ${chosen === index ? "selected" : ""}" data-answer="${index}" aria-pressed="${chosen === index}">
          <span class="option-letter">${"ABC"[index]}</span>${answer.text}
        </button>`).join("")}
    </div>
    <div class="quiz-nav">
      <button class="text-button" data-action="back">← Back</button>
      ${isLast
        ? `<span class="quiz-hint">Pick an answer to see your results</span>`
        : `<button class="primary-button" data-action="next" ${chosen === undefined ? "disabled" : ""}>Next <span>→</span></button>`}
    </div>`);
}

function finishQuiz() {
  const result = score(answers);
  localStorage.setItem(resultKey, JSON.stringify({ ...result, completedAt: new Date().toISOString() }));
  renderResults(result);
}

function score(chosen) {
  const counts = Object.fromEntries(majorOrder.map(id => [id, 0]));
  chosen.forEach((answerIndex, questionIndex) => { counts[questions[questionIndex].answers[answerIndex].major] += 1; });
  const percents = Object.fromEntries(majorOrder.map(id => [id, Math.round(counts[id] / chosen.length * 100)]));
  const best = Math.max(...Object.values(counts));
  return { percents, top: majorOrder.filter(id => counts[id] === best) };
}

function resultMajor(id, saved) {
  const major = majors[id];
  let action;
  if (id === "technology") {
    action = `<a class="primary-button" href="index.html#journey" data-choose="technology">See your Technology journey <span>→</span></a>`;
  } else if (saved.includes(id)) {
    action = `<button class="outline-button" disabled>Saved to your plan ✓</button>`;
  } else {
    action = `<button class="outline-button" data-save="${id}">Save ${major.title} to my plan</button>`;
  }
  return `
    <article class="result-major">
      <h2>${major.title}</h2>
      <p>${major.blurb}</p>
      <div class="modal-chips">${major.meta.map(label => `<span class="modal-chip">${label}</span>`).join("")}</div>
      ${action}
    </article>`;
}

function renderResults({ percents, top }) {
  const names = top.map(id => majors[id].title);
  const heading = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  const saved = readJson(savedKey, []);
  const ranked = [...majorOrder].sort((a, b) => percents[b] - percents[a]);
  show(`
    <p class="eyebrow">Your results</p>
    <h1 tabindex="-1">You might enjoy ${heading}</h1>
    <p class="muted">${top.length > 1 ? "Your answers fit more than one pathway equally, so take a look at each one." : "Based on what you enjoy, this pathway could be a good place to start."}</p>
    ${top.map(id => resultMajor(id, saved)).join("")}
    <div class="result-bars">
      <p class="eyebrow">How your answers matched each pathway</p>
      ${ranked.map(id => `
        <div class="result-row ${top.includes(id) ? "top" : ""}">
          <span>${majors[id].title}</span>
          <div class="result-track"><span style="width:${percents[id]}%"></span></div>
          <strong>${percents[id]}%</strong>
        </div>`).join("")}
    </div>
    <div class="quiz-nav">
      <button class="outline-button" data-action="retake">Retake the quiz</button>
      <a class="text-button" href="index.html">Back to home</a>
    </div>
    <p class="small-note">Your result is saved on this device only.</p>`);
}

quiz.addEventListener("click", event => {
  const answer = event.target.closest("[data-answer]");
  if (answer) {
    answers[current] = Number(answer.dataset.answer);
    quiz.querySelectorAll("[data-answer]").forEach(button => {
      button.classList.toggle("selected", button === answer);
      button.setAttribute("aria-pressed", button === answer);
    });
    if (current === questions.length - 1) {
      clearTimeout(finishTimer);
      finishTimer = setTimeout(finishQuiz, 400);
    } else {
      quiz.querySelector('[data-action="next"]').disabled = false;
    }
    return;
  }
  const choose = event.target.closest("[data-choose]");
  if (choose) {
    const progress = readJson(progressKey, {});
    progress.pathway = choose.dataset.choose;
    localStorage.setItem(progressKey, JSON.stringify(progress));
    return;
  }
  const save = event.target.closest("[data-save]");
  if (save) {
    const saved = readJson(savedKey, []);
    if (!saved.includes(save.dataset.save)) saved.push(save.dataset.save);
    localStorage.setItem(savedKey, JSON.stringify(saved));
    save.textContent = "Saved to your plan ✓";
    save.disabled = true;
    return;
  }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "start" || action === "retake") {
    current = 0;
    answers = [];
    renderQuestion();
  } else if (action === "last") {
    renderResults(readJson(resultKey, null));
  } else if (action === "back") {
    clearTimeout(finishTimer);
    if (current === 0) renderIntro();
    else { current -= 1; renderQuestion(); }
  } else if (action === "next") {
    current += 1;
    renderQuestion();
  }
});

renderIntro(false);
