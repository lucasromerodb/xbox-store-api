// packages import
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cron from "node-cron";
import getGames from "./helpers/gamepass/saveAllGames.js";

// routes import
import gamepass from "./routes/gamepass.js";

// app setup
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

// config
app.set("port", process.env.PORT || 3000);
app.set("json spaces", 2);

// routes
app.use("/api/gamepass", gamepass);

// Game Pass initial fetch
getGames();

// Game Pass scheduled fetch (every midnight)
cron.schedule("0 12 * * *", () => {
  getGames();
});

// Listen
app.listen(app.get("port"), () => {
  console.log(`Example app listening on port http://localhost:${app.get("port")}`);
});
