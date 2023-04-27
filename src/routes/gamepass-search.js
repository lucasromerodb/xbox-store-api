import fetch from "node-fetch";
import { Router } from "express";
const router = Router();

import { dataParser } from "../helpers/gamepass/saveAllGames.js";

router.get("/:gameId/:locale", async (req, res) => {
  if (!req.params.gameId) {
    res.status(500).send("Missing gameId parameter");
  }

  const { gameId, locale } = req.params;
  const language = locale.split("-")[0];
  const market = locale.split("-")[1];

  const response = await fetch(`https://catalog.gamepass.com/products?language=${language || "en"}&market=${market || "US"}&hydration=MobileDetailsForConsole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Products: [`${gameId}`] }),
  });
  const responseJson = await response.json();

  if (responseJson.Products.length <= 0) {
    res.status(500).send("Missing gameId parameter");
  }

  const data = dataParser(responseJson.Products);

  res.send(data[0]);
});

router.get("/price/:gameId/:locale", async (req, res) => {
  if (!req.params.gameId || !req.params.gameId) {
    res.status(500).send("Missing gameId parameter");
  }

  const { gameId, locale } = req.params;
  const language = locale.split("-")[0];
  const market = locale.split("-")[1];

  const response = await fetch(`https://catalog.gamepass.com/products?language=${language || "en"}&market=${market || "US"}&hydration=MobileDetailsForConsole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Products: [`${gameId}`] }),
  });
  const responseJson = await response.json();

  if (responseJson.Products.length <= 0) {
    res.status(500).send("Missing gameId parameter");
  }

  const data = Object.values(responseJson.Products).map((game) => ({
    id: game.StoreId,
    price: game.Price,
  }));

  res.send(data[0]);
});

export default router;
