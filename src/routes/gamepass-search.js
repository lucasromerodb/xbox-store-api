import fetch from "node-fetch";
import { Router } from "express";
const router = Router();

import { dataParser } from "../helpers/gamepass/saveAllGames.js";

// expected endpoint: /api/gamepass/search/9NG8S82N9F4D/es-ar
router.get("/:gameId/:market", async (req, res) => {
  if (!req.params.gameId) {
    res.status(500).send("Missing gameId parameter");
  }

  const { gameId, market } = req.params;

  const response = await fetch(`https://catalog.gamepass.com/products?language=en&market=${market || "us"}&hydration=MobileDetailsForConsole`, {
    method: "POST",
    mode: "no-cors",
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

// expected endpoint: /api/gamepass/search/price/9NG8S82N9F4D/ar
router.get("/price/:gameId/:market", async (req, res) => {
  if (!req.params.gameId || !req.params.gameId) {
    res.status(500).send("Missing gameId parameter");
  }

  const { gameId, market } = req.params;

  const response = await fetch(`https://catalog.gamepass.com/products?language=en&market=${market || "us"}&hydration=MobileDetailsForConsole`, {
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
