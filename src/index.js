import express from "express";
const app = express();

import list from "./routes/list.js";
import games from "./routes/games.js";

// config
app.set("port", process.env.PORT || 3000);
app.set("json spaces", 2);

// routes
app.use("/api/list", list);
app.use("/api/games", games);

app.listen(app.get("port"), () => {
  console.log(`Example app listening on port http://localhost:${app.get("port")}`);
});
