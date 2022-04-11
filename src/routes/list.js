import fetch from "node-fetch";
import queryComposer from "../helpers/queryComposer.js";

import { Router } from "express";
const router = Router();

const API_PRODUCT_ID_LIST = "https://reco-public.rec.mp.microsoft.com/channels/Reco/V8.0/Lists/";

const PRODUCT_ID_LISTS = {
  Deal: "Computed/Deal",
  New: "Computed/New",
  TopPaid: "Computed/TopPaid",
  TopFree: "Computed/TopFree",
  BestRated: "Computed/BestRated",
  MostPlayed: "Computed/MostPlayed",
  ComingSoon: "Computed/ComingSoon",
  Gold: "collection/FreePlayDays",
};

router.get("/:list", async (req, res) => {
  if (!req.params.list) {
    res.status(500).send("Missing list parameter");
  }

  const URL_LIST_IDS = new URL(`${API_PRODUCT_ID_LIST}${PRODUCT_ID_LISTS[req.params.list]}`);
  const URL_LIST_IDS_QUERY_PARAMS = {
    market: req.query.market || "ar",
    language: req.query.language || "es-ar",
    itemTypes: req.query.itemTypes || "Game",
    deviceFamily: req.query.deviceFamily || "Windows.Xbox",
    count: req.query.count || "2000",
    skipItems: req.query.skipItems || "0",
  };

  queryComposer(URL_LIST_IDS, URL_LIST_IDS_QUERY_PARAMS);

  try {
    const IDS_RES = await fetch(URL_LIST_IDS.href);
    const IDS_DATA = await IDS_RES.json();

    if (IDS_DATA.Items && IDS_DATA.Items.length > 0) {
      const ids = IDS_DATA.Items.map((element) => element.Id);
      res.json(ids);
    } else {
      res.status(404).send(`(${IDS_DATA.Code}) ${IDS_DATA.Message}`);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
