# ACDC Pathways prototype

This is a no-build web prototype for the ACDC student opportunity hub. It is intentionally made with plain HTML, CSS, and JavaScript so the team can open it in Visual Studio Code or IntelliJ IDEA without setting up a framework first.

## Run it

1. Open the project folder in VS Code or IntelliJ IDEA.
2. Open `index.html` in a browser, or use a simple local server:

```bash
python3 -m http.server 8000
```

3. Visit `http://localhost:8000`.

## Current prototype features

- ACDC brand colors from the supplied guide: `#45147c`, `#8d198f`, `#cb6ce6`, `#2C3892`, `#9d5ee5`, and `#DBCCFF`.
- Official primary and light ACDC logo assets from the supplied brand guide.
- Open Sans and Montserrat typography with bold, all-caps headings.
- Responsive desktop and mobile layout.
- Main navigation for Explore, Learning resources, Opportunities, and Student support.
- "Where do you want to start?" pathway buttons in the hero, with Technology recommended and a link to the skills self-check for students who are not sure.
- A four-step Technology journey: course, build skills, internship or job (sample), and mentor support.
- Detail modal for pathway, resource, and opportunity cards.
- Save/bookmark behavior and the chosen pathway stored in browser local storage.
- Career-map progress card calculated from the student's choices: choose a pathway, explore one pathway, and save something to the plan.
- Clear pointer cursors, keyboard focus outlines, hover states, and a short click pulse for buttons and links.
- Prototype career-search cards for Server Architect/Cybersecurity, Software Engineer, and IT Support Specialist.
- External reference links to LinkedIn and Indeed search pages.

## Suggested next implementation step

Replace the arrays at the top of `app.js` with API/database data. A simple first version of the database can use five core tables: `users`, `pathways`, `resources`, `opportunities`, and `saved_items`. The `pathways` table can connect to many resources and opportunities through join tables such as `pathway_resources` and `pathway_opportunities`.

The external career cards are intentionally sample records. They link to public search pages instead of scraping a website in the browser. For a production version, use an approved API or a server-side integration and follow each service's terms and privacy rules.

The ACDC content used as inspiration includes Technology, Business, and Psychology learning pathways, a Browse → Sign Up → Learn → Earn journey, weekly discussion support, and volunteer opportunities. Confirm final copy and links with ACDC before treating the prototype content as production information.
