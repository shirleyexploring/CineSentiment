import express from "express"
import cors from "cors"
import path from "path";                 
import { fileURLToPath } from "url";

const origRoute = express.Router.route;
express.Router.route = function (path, ...rest) {
  console.log('⇢ registering route:', path);
  return origRoute.call(this, path, ...rest);
};

import reviews from "./api/reviews.route.js"

const app = express()

app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

app.use(express.static(__dirname));

app.get("/", (_, res) =>
  res.sendFile(path.join(__dirname, "index.html"))
);


app.use("/api/v1/reviews", reviews)
app.use((req, res) => {
    res.status(404).json({ error: "not found" });
  });

    export default app
