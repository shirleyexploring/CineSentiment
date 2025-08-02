# CineSentiment

A lightweight full‑stack movie‑review website with **real‑time sentiment analysis**.  
Search titles via The Movie Database (TMDb), post reviews, and instantly see whether the crowd feels 👍 positive, 😐 neutral, or 👎 negative about each film.

---

## ✨ Features

| Area | What you get |
|------|--------------|
| **Discover** | Browse or search films using the TMDb API |
| **Review** | CRUD endpoints for user reviews stored in MongoDB |
| **Sentiment** | On‑the‑fly polarity scoring (positive / neutral / negative) via the `sentiment` npm module |
| **REST API** | `GET /api/v1/reviews/movie/:id`, `POST /api/v1/reviews/new`, etc. |
| **Responsive UI** | Vanilla JS + CSS—no heavy framework needed |
| **Docker‑ready** | One command boots MongoDB + the Node server for local dev |

---

## 🏗️ Tech stack

| Layer | Libraries / Services | Directory |
|-------|----------------------|-----------|
| **Front‑end** | Vanilla JS, TMDb fetches | `/index.html`, `/script.js`, `/styles.css` |
| **Back‑end** | Node 18, Express, CORS | `/server.js`, `/api/`, `/dao/` |
| **Database** | MongoDB Atlas (or local `mongod`) | connection via `mongodb` driver |
| **NLP** | [`sentiment`](https://www.npmjs.com/package/sentiment) | used inside `reviews.controller.js` |
| **Infra / Dev** | Docker, Docker Compose | `docker-compose.yml` |

Project tree (abridged):

```
moviereviews/
├── index.html
├── script.js
├── styles.css
├── server.js
├── index.js
├── api/
│   ├── reviews.route.js
│   └── reviews.controller.js
├── dao/
│   └── reviewsDAO.js
└── bin/         # helper scripts for demo pages
```

---

## 🚀 Quick start

### 1. Clone & install

```bash
git clone https://github.com/your-user/cinesentiment.git
cd cinesentiment/moviereviews

# initialise Node project if you haven't already
npm init -y

# install runtime deps
npm install express cors mongodb sentiment dotenv

# install dev helpers
npm install --save-dev nodemon
```

### 2. Create environment variables

Copy the sample and fill in your secrets:

```bash
cp .env.example .env
```

`.env`:

```env
TMDB_API_KEY=your_tmdb_key               # get one at https://www.themoviedb.org
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/yourdb
PORT=8000
```

### 3. Run the stack

```bash
# back‑end (auto‑reload)
npx nodemon index.js

# front‑end
open index.html     # or serve with Live Server / `npx serve`
```

Visit **http://localhost:8000/api/v1/reviews** to sanity‑check the API, then open the site in your browser to browse movies and submit reviews.

---

## 🐳 One‑command Docker

```yaml
# docker-compose.yml
version: "3.8"
services:
  api:
    build: .
    env_file: .env
    ports: ["8000:8000"]
    depends_on: [mongo]
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
```

```bash
docker compose up --build
```

---

## 📡 API reference

| Verb & route | Purpose | Body params |
|--------------|---------|-------------|
| **GET** `/api/v1/reviews/movie/:id` | All reviews + sentiment for a film | – |
| **POST** `/api/v1/reviews/new` | Add a review | `{ movieId, user, rating, text }` |
| **PUT** `/api/v1/reviews/:id` | Edit a review | same as POST |
| **DELETE** `/api/v1/reviews/:id` | Remove a review | – |

> Detailed controller logic lives in `/api/reviews.controller.js`.

---

## 🧪 Tests

_Coming soon:_ hook up Jest + Supertest:

```bash
npm install --save-dev jest supertest
npm test
```

---

## 🤝 Contributing

1. **Fork** ➜ `git checkout -b feature/your-idea`  
2. `npm run lint && npm test` (add tests for new logic)  
3. Open a PR—describe **why** as well as **what** you changed.

---

## 📄 License

Released under the MIT License. See `LICENSE` for details.

---

> **Need help?** Open an issue. Pull requests are welcome!
