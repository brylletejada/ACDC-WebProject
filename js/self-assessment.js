// Each answer adds one point to the major it belongs to (it, business, or cs).
const majors = {
  it: {
    title: "Information Technology",
    page: "information-technology.html",
    text: "You enjoy hands-on technology and keeping systems running. Information Technology focuses on networks, cybersecurity, cloud services, and supporting the people who rely on technology every day."
  },
  business: {
    title: "Business",
    page: "business.html",
    text: "You are drawn to people, ideas, and leadership. Business focuses on entrepreneurship, marketing, finance, and turning ideas into real impact for organizations and communities."
  },
  cs: {
    title: "Computer Science",
    page: "computer-science.html",
    text: "You love logic, puzzles, and building things with code. Computer Science focuses on programming, software development, data, and algorithms used to create new technology."
  }
};

const questions = [
  {
    question: "Which school project sounds the most exciting to you?",
    options: [
      { text: "Building an app or game that solves a problem", major: "cs" },
      { text: "Setting up and securing the computer network for the school", major: "it" },
      { text: "Planning a fundraiser and managing its budget", major: "business" }
    ]
  },
  {
    question: "A friend's laptop suddenly stops connecting to the internet. What do you do?",
    options: [
      { text: "Check the Wi-Fi settings, drivers, and router until it works again", major: "it" },
      { text: "Help them compare repair options that fit their budget", major: "business" },
      { text: "Wonder what went wrong in the software and how the program works inside", major: "cs" }
    ]
  },
  {
    question: "Which type of class do you enjoy the most?",
    options: [
      { text: "Economics, marketing, or accounting", major: "business" },
      { text: "Math and logic puzzles", major: "cs" },
      { text: "Computer labs and technology applications", major: "it" }
    ]
  },
  {
    question: "In a group project, which role do you usually take?",
    options: [
      { text: "The one who solves the hardest problem step by step", major: "cs" },
      { text: "The leader who organizes the team and presents the work", major: "business" },
      { text: "The one who makes the tech work — devices, file sharing, and tools", major: "it" }
    ]
  },
  {
    question: "How would you most like to spend a free weekend?",
    options: [
      { text: "Building a PC or setting up a smart home system", major: "it" },
      { text: "Coding a side project or learning a programming language", major: "cs" },
      { text: "Starting a small side hustle or selling something online", major: "business" }
    ]
  },
  {
    question: "Which job title sounds the most appealing?",
    options: [
      { text: "Entrepreneur or marketing manager", major: "business" },
      { text: "Cybersecurity analyst or network administrator", major: "it" },
      { text: "Software engineer or data scientist", major: "cs" }
    ]
  },
  {
    question: "What kind of problems do you like solving?",
    options: [
      { text: "Abstract puzzles and finding the most efficient solution", major: "cs" },
      { text: "Practical technical issues that keep things running smoothly", major: "it" },
      { text: "How to grow, sell, and persuade people", major: "business" }
    ]
  },
  {
    question: "What does your ideal workday look like?",
    options: [
      { text: "Supporting a team and keeping their systems reliable and secure", major: "it" },
      { text: "Meeting clients, networking, and making decisions together", major: "business" },
      { text: "Focused time designing and building software", major: "cs" }
    ]
  },
  {
    question: "Which skill do you most want to improve?",
    options: [
      { text: "Communication, negotiation, and leadership", major: "business" },
      { text: "Configuring systems, cloud platforms, and security tools", major: "it" },
      { text: "Programming and problem-solving with math", major: "cs" }
    ]
  },
  {
    question: "What kind of impact do you want to have in the future?",
    options: [
      { text: "Create technology or software that millions of people use", major: "cs" },
      { text: "Build businesses and jobs that help my community grow", major: "business" },
      { text: "Protect people's information and keep organizations connected", major: "it" }
    ]
  }
];

const $ = selector => document.querySelector(selector);
const answers = new Array(questions.length).fill(null);
let current = 0;

function renderQuestion() {
  const item = questions[current];
  const answered = answers.filter(answer => answer !== null).length;
  const percent = Math.round((answered / questions.length) * 100);

  $("#quizStep").textContent = `Question ${current + 1} of ${questions.length}`;
  $("#quizPercent").textContent = `${percent}% complete`;
  $("#quizProgressBar").style.width = `${percent}%`;
  $("#quizQuestion").textContent = item.question;
  $("#quizOptions").innerHTML = item.options.map((option, index) => `
    <label class="quiz-option">
      <input type="radio" name="answer" value="${index}" ${answers[current] === index ? "checked" : ""} />
      <span class="quiz-option-letter">${String.fromCharCode(65 + index)}</span>
      <span class="quiz-option-text">${option.text}</span>
    </label>`).join("");

  $("#quizBack").disabled = current === 0;
  $("#quizNext").disabled = answers[current] === null;
  $("#quizNext").textContent = current === questions.length - 1 ? "See my results →" : "Next →";
}

function showResults() {
  const scores = { it: 0, business: 0, cs: 0 };
  answers.forEach((answer, index) => scores[questions[index].options[answer].major]++);

  const ranked = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const topScore = scores[ranked[0]];
  const winners = ranked.filter(key => scores[key] === topScore);
  const best = majors[winners[0]];

  if (winners.length > 1) {
    const names = winners.map(key => majors[key].title);
    $("#resultTitle").textContent = `It's a tie: ${names.join(" and ")}`;
    $("#resultText").textContent = `You matched equally with ${names.join(" and ")}. Explore each major page to see which pathways and careers excite you most, or talk with ACDC for guidance.`;
  } else {
    $("#resultTitle").textContent = `Your best match: ${best.title}`;
    $("#resultText").textContent = best.text;
  }

  $("#resultBars").innerHTML = ranked.map(key => {
    const percent = Math.round((scores[key] / questions.length) * 100);
    return `
      <div class="result-row${winners.includes(key) ? " top" : ""}">
        <div class="result-label"><a href="${majors[key].page}">${majors[key].title}</a><span>${percent}%</span></div>
        <div class="result-bar"><span style="width: ${percent}%"></span></div>
      </div>`;
  }).join("");

  $("#resultLink").href = best.page;
  $("#resultLink").textContent = `Explore ${best.title} →`;
  $("#quizCard").hidden = true;
  $("#quizResults").hidden = false;
  $("#quizResults").focus();
}

$("#quizOptions").addEventListener("change", event => {
  answers[current] = Number(event.target.value);
  $("#quizNext").disabled = false;
});

$("#quizForm").addEventListener("submit", event => {
  event.preventDefault();
  if (answers[current] === null) return;
  if (current === questions.length - 1) {
    showResults();
    return;
  }
  current++;
  renderQuestion();
});

$("#quizBack").addEventListener("click", () => {
  if (current === 0) return;
  current--;
  renderQuestion();
});

$("#quizRetake").addEventListener("click", () => {
  answers.fill(null);
  current = 0;
  $("#quizResults").hidden = true;
  $("#quizCard").hidden = false;
  renderQuestion();
  $("#quizCard").scrollIntoView({ behavior: "smooth", block: "start" });
});

renderQuestion();

document.addEventListener("click", event => {
  const clicked = event.target.closest("button, a");
  if (!clicked) return;
  clicked.classList.remove("clicked");
  void clicked.offsetWidth;
  clicked.classList.add("clicked");
  setTimeout(() => clicked.classList.remove("clicked"), 280);
});
