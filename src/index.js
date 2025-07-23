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
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // máximo 10 requests por IP por minuto
  message: "Too many requests, please try again later.",
});

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
app.use("/api/gamepass", apiLimiter, gamepass_full);
app.use("/api/gamepass/full", apiLimiter, gamepass_full);
app.use("/api/gamepass/extension", apiLimiter, gamepass_extension);
app.use("/api/gamepass/bot", apiLimiter, gamepass_bot);
app.use("/api/gamepass/search", apiLimiter, gamepass_search);

// Listen
app.listen(app.get("port"), () => {
  console.log(`Example app listening on port http://localhost:${app.get("port")}`);
});
