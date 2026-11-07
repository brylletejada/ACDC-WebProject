# ACDC Pathways prototype

This is a no-build web prototype for the ACDC student opportunity hub. The page is plain HTML, CSS, and JavaScript. Its content (pathways, resources, opportunities, and the Technology journey) comes from a small API on Cloudflare Pages Functions backed by a Cloudflare D1 database.

## Run it

You need [Node.js](https://nodejs.org/) (LTS) for Wrangler, Cloudflare's command-line tool. Wrangler runs through `npx`, so there is nothing else to install.

1. Open the project folder in VS Code or IntelliJ IDEA.
2. Create and fill the local database (once, and again after adding a migration):

```bash
npx wrangler d1 migrations apply acdc-pathways --local
```

3. Start the site and API together:

```bash
npx wrangler pages dev
```

4. Visit the address Wrangler prints (usually `http://localhost:8788`).

Opening `index.html` directly or with `python3 -m http.server` still shows the page, but the content sections stay empty because the API is not running.

## Backend

| Path | Purpose |
|---|---|
| `functions/api/pathways/index.js` | `GET /api/pathways`: the pathway buttons and cards |
| `functions/api/pathways/[id]/journey.js` | `GET /api/pathways/technology/journey`: ordered journey steps for one pathway |
| `functions/api/resources.js` | `GET /api/resources`: learning resources |
| `functions/api/opportunities.js` | `GET /api/opportunities?pathway=technology&type=...`: opportunity cards (filters optional) |
| `functions/_lib/content.js` | Shared JSON responses and database-row-to-page mapping |
| `migrations/0001_create_content_tables.sql` | Tables: `pathways`, `resources`, `opportunities`, `journey_steps` |
| `migrations/0002_seed_content.sql` | The current prototype content |
| `wrangler.toml` | Cloudflare project name and the `DB` database binding |

Saved items and career-map progress still live in the browser's local storage. They move to the database only if students get accounts.

### One-time Cloudflare setup

1. Log in: `npx wrangler login`.
2. Create the database: `npx wrangler d1 create acdc-pathways`. Copy the `database_id` it prints into `wrangler.toml`.
3. Make sure `name` in `wrangler.toml` matches the Pages project name in the Cloudflare dashboard.
4. Apply the migrations to the hosted database: `npx wrangler d1 migrations apply acdc-pathways --remote`.
5. Push the branch. Cloudflare reads the `DB` binding from `wrangler.toml` on the next deploy.

Cloudflare does not apply migrations on deploy. Whenever you add a file to `migrations/`, run step 4 again before or right after deploying.

### Changing content

Add a new numbered migration instead of editing applied ones, for example `migrations/0003_add_business_journey.sql` with `INSERT` or `UPDATE` statements, then apply it locally and remotely.

## Current prototype features

- ACDC brand colors from the supplied guide: `#45147c`, `#8d198f`, `#cb6ce6`, `#2C3892`, `#9d5ee5`, and `#DBCCFF`.
- Official primary and light ACDC logo assets from the supplied brand guide.
- Open Sans and Montserrat typography with bold, all-caps headings.
- Responsive desktop and mobile layout.
- Main navigation for Explore, Learning resources, Opportunities, and Student support.
- "Where do you want to start?" pathway buttons in the hero, with Technology recommended and a link to the skills self-check for students who are not sure.
- A four-step Technology journey: course, build skills, internship or job (sample), and mentor support.
- Skills self-check page (`self-check.html`, `self-check.js`): a 10-question quiz that suggests Technology, Business, or Psychology, shows how the answers matched each pathway, and saves the result in browser local storage. Edit the questions in the `questions` list at the top of `self-check.js`; each question needs exactly one answer per pathway.
- Detail modal for pathway, resource, and opportunity cards.
- Save/bookmark behavior and the chosen pathway stored in browser local storage.
- Career-map progress card calculated from the student's choices: choose a pathway, explore one pathway, and save something to the plan.
- Clear pointer cursors, keyboard focus outlines, hover states, and a short click pulse for buttons and links.
- Prototype career-search cards for Server Architect/Cybersecurity, Software Engineer, and IT Support Specialist.
- External reference links to LinkedIn and Indeed search pages.

## Suggested next implementation step

Add a `mentors` table and endpoint once ACDC confirms who students should contact. Add `users` and `saved_items` tables only if students will sign in.

The external career cards are intentionally sample records. They link to public search pages instead of scraping a website in the browser. For a production version, use an approved API or a server-side integration and follow each service's terms and privacy rules.

The ACDC content used as inspiration includes Technology, Business, and Psychology learning pathways, a Browse → Sign Up → Learn → Earn journey, weekly discussion support, and volunteer opportunities. Confirm final copy and links with ACDC before treating the prototype content as production information.
