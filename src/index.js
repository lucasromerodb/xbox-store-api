// packages import

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import gamepass_bot from "./routes/gamepass-bot.js";
import gamepass_extension from "./routes/gamepass-extension.js";
import gamepass_full from "./routes/gamepass-full.js";
import gamepass_search from "./routes/gamepass-search.js";
import helmet from "helmet";
import morgan from "morgan";

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
app.use("/api/gamepass", gamepass_full);
app.use("/api/gamepass/full", gamepass_full);
app.use("/api/gamepass/extension", gamepass_extension);
app.use("/api/gamepass/bot", gamepass_bot);
app.use("/api/gamepass/search", gamepass_search);

// Listen
app.listen(app.get("port"), () => {
  console.log(`Example app listening on port http://localhost:${app.get("port")}`);
});
