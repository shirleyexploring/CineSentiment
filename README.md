# 🎬 CineSentiment

**Real‑time movie reviews with transformer‑powered sentiment analysis**

CineSentiment is a lightweight full‑stack web app that lets anyone browse titles from [TMDb](https://www.themoviedb.org/), post reviews, and instantly see the mood of the crowd. A small **Node/Express + MongoDB** backend provides REST‑style endpoints, while a vanilla‑JS front‑end renders everything without a build step.

The latest release swaps the classic lexicon approach for a miniature **DistilBERT (SST‑2)** pipeline via the pure‑JS `@xenova/transformers` package, giving higher accuracy without adding Python or heavy server infrastructure.

---

## ✨ Features

| Area                | What you get                                                                                      |
|---------------------|----------------------------------------------------------------------------------------------------|
| **Discover**        | Search TMDb and pull posters, overviews & metadata                                                 |
| **Review**          | Auth‑free CRUD endpoints for user reviews stored in MongoDB                                        |
| **Sentiment**       | Live polarity from a tiny DistilBERT model (≈ 60 MB, cached in memory)                             |
| **Aggregation**     | Overall score & emoji badge recomputed every time a review is added / edited                      |
| **Pure vanilla UI** | Just open `index.html`—no bundler required                                                         |
| **Docker one‑liner**| `docker compose up --build` launches MongoDB + API + static site                                   |

---

## 🗂 Project structure

```text
CineSentiment
├── api/
│   ├── reviews.route.js      # CRUD endpoint definitions
│   └── reviews.controller.js # Call DAO + sentiment analyser
├── dao/
│   └── reviewsDAO.js         # Mongo queries
├── utils/
│   └── sentiment.js          # DistilBERT SST‑2 inference via @xenova/transformers
├── index.html                # Search / browse page
├── ReviewPage.html           # Per‑movie reviews view
├── script.js                 # Search / browse logic
├── ReviewPage.js             # Review CRUD + sentiment display
├── styles.css                # Basic responsive styling
├── server.js                 # Production Express entry (used by Docker)
├── index.js                  # Dev entry with Nodemon reload
├── debug-routes.mjs          # Tiny middleware to print every mounted route
├── package.json
└── docker-compose.yml
```

> **Why two entry points?** `index.js` auto‑reloads in development, while `server.js` is a slimmer build used by Docker.

---

## 🚀 Quick start

1. **Clone & install**

```bash
git clone https://github.com/shirleyexploring/CineSentiment.git
cd CineSentiment && npm install
```

2. **Environment** – copy `.env.example` to `.env` and fill in:

```dotenv
TMDB_API_KEY=your_tmdb_key
MONGODB_URI=mongodb://localhost:27017/cinesentiment
PORT=8000            # optional
```

3. **Run locally**

```bash
npm run dev      # back‑end w/ Nodemon
open index.html  # or serve statically with any HTTP server
```

4. **Or via Docker**

```bash
docker compose up --build
```

---

## 🔌 REST API

| Verb & route               | Purpose                                  | Body                                  |
|----------------------------|------------------------------------------|---------------------------------------|
| **GET** `/api/v1/reviews/movie/:id` | Reviews for a film + aggregate sentiment | –                                     |
| **POST** `/api/v1/reviews`          | Add a review                        | `{ movieId, user, rating, text }`     |
| **PUT** `/api/v1/reviews/:id`       | Edit a review                       | same as POST                          |
| **DELETE** `/api/v1/reviews/:id`    | Remove a review                     | –                                     |

Each response embeds a sentiment object:

```json
{
  "score": 0.87,          // −1 → +1
  "label": "positive"     // "negative" | "neutral" | "positive"
}
```

---

## 🧪 Testing

* **Unit & integration** – Jest + Supertest (API) – `npm test`
* **E2E** – Cypress (coming soon)

---

## 🚀 Migration Roadmap

Below is the forward‑looking migration plan—incremental milestones that will evolve the project toward a more robust, typed, and production‑ready stack:

### Structure & Tooling
* Migrate to **TypeScript** with `strictNullChecks`.
* Refactor server into `routes → controllers → services → daos`; add absolute import aliases (`@/utils`).
* Pre‑commit hooks (Husky) running ESLint + Prettier + tests.

### API & Logic
* Insert **zod** validation middleware; bump endpoints to `/api/v2` for versioning.
* Emit domain events (`review.created`, `review.updated`) and expose a WebSocket feed.

### Database
* Turn on Mongo `timestamps`; add compound index `{ movieId: 1, createdAt: -1 }`.
* If relational needs grow, migrate to **Postgres + Prisma** for typed joins & full‑text.

### Sentiment Engine
* Quantise DistilBERT to 8‑bit ONNX (≈ 15 MB) or fine‑tune MiniLM on IMDB for domain‑specific accuracy.
* Memoise identical sentences with a small LRU cache.

### Front‑end UX
* Skeleton loaders + optimistic UI; plot sentiment‑over‑time (Chart.js sparkline).
* Dark‑mode toggle, WCAG‑AA palette, full ARIA labels.

### Ops & Security
* GitHub Actions: lint → test → Docker build.
* Helmet headers, express‑rate‑limit, DOMPurify sanitisation.
* Prometheus `/metrics`, Pino JSON logs streaming to Loki/Grafana.

---

## 📝 License

MIT
