import fetch from "node-fetch";
import queryComposer from "../helpers/queryComposer.js";
import gameMapper from "../helpers/gameMapper.js";

import { Router } from "express";
const router = Router();

const API_PRODUCT_DETAIL_CATALOG = "https://displaycatalog.mp.microsoft.com/v7.0/products/";

router.get("/:list", async (req, res) => {
  if (!req.params.list) {
    res.status(500).send("Missing list parameter");
  }

  try {
    // GET PRODUCT ID LIST
    const URL_LIST_IDS = new URL(`http://localhost:3000/api/list/${req.params.list}`);
    queryComposer(URL_LIST_IDS, req.query);

    const LIST_IDS_RES = await fetch(URL_LIST_IDS.href);
    const LIST_IDS_DATA = await LIST_IDS_RES.json();

    if (!LIST_IDS_DATA.length) {
      res.status(404).send("No products ids found");
    }

    // GET PRODUCT DETAILS
    const URL_CATALOG = new URL(API_PRODUCT_DETAIL_CATALOG);
    const URL_CATALOG_QUERY_PARAMS = {
      bigIds: LIST_IDS_DATA.join(","),
      market: req.query.market || "ar",
      languages: req.query.language || "es-ar",
    };

    queryComposer(URL_CATALOG, URL_CATALOG_QUERY_PARAMS);

    const GAMES_RES = await fetch(URL_CATALOG.href);
    const GAMES_DATA = await GAMES_RES.json();

    if (GAMES_DATA.Products && GAMES_DATA.Products.length > 0) {
      const games = gameMapper(GAMES_DATA.Products);
      res.json(games);
    } else {
      res.status(404).send("No games found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
