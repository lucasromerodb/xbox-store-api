import fetch from "node-fetch";
import fs from "fs";

// import { readFile } from "fs/promises";
// const games = JSON.parse(await readFile(new URL("./response.json", import.meta.url)));

function saveFile(dir, content, fileName) {
  fs.writeFile(`${dir}/${fileName}.json`, content, function (err) {
    if (err) return console.log(err);
    console.log(`✅ ${fileName}.json Saved!`);
  });
}

function dataParser(data) {
  return Object.values(data).map((game) => ({
    id: game.StoreId,
    title: game.ProductTitle,
    EAPlay: game.IsEAPlay,
    platforms: {
      one: game.AllowedPlatforms && game.AllowedPlatforms.some((e) => e === "Windows.Xbox") && game.XboxConsoleGenCompatible && game.XboxConsoleGenCompatible.some((e) => e === "ConsoleGen8"),
      series: game.AllowedPlatforms && game.AllowedPlatforms.some((e) => e === "Windows.Xbox") && game.XboxConsoleGenCompatible && game.XboxConsoleGenCompatible.some((e) => e === "ConsoleGen9"),
      windows: game.AllowedPlatforms && game.AllowedPlatforms.some((e) => e === "Windows.Desktop"),
      cloud: game.Attributes && game.Attributes.some((e) => e.Name === "GameStreaming"),
    },
    // price: game.Price, // TODO: idea -> compare prices with steam (based on steam region)
  }));
}

async function fetchIds(timestamp, list, location = "US", language = "en-us") {
  const LIST_OF_IDS = {
    all: "f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e",
    new: "f13cf6b4-57e6-4459-89df-6aec18cf0538",
    coming: "095bda36-f5cd-43f2-9ee1-0a72f371fb96",
    leaving: "393f05bf-e596-4ef6-9487-6d4fa0eab987",
  };

  const response = await fetch(`https://catalog.gamepass.com/sigls/v2/?language=${language}&market=${location}&id=${LIST_OF_IDS[list]}`);
  const responseJson = await response.json();
  const data = { Products: responseJson.slice(1).map((e) => e.id) };

  saveFile(`./extension_output/${timestamp}`, JSON.stringify(responseJson), `gp-ids-${list}`);
  return data;
}

async function fetchDetails(timestamp, body = {}, list, location = "US", language = "en-us") {
  const response = await fetch(`https://catalog.gamepass.com/products?language=${language}&market=${location}&hydration=MobileDetailsForConsole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const responseJson = await response.json();
  const data = dataParser(responseJson.Products);

  saveFile(`./extension_output/${timestamp}`, JSON.stringify(responseJson), `gp-details-${list}`);

  return data;
}

async function init() {
  const timestamp = new Date().toJSON();
  fs.mkdirSync(`./extension_output/${timestamp}`);

  const all_Ids = await fetchIds(timestamp, "all");
  const new_Ids = await fetchIds(timestamp, "new");
  const coming_Ids = await fetchIds(timestamp, "coming");
  const leaving_Ids = await fetchIds(timestamp, "leaving");

  const all_Details = await fetchDetails(timestamp, all_Ids, "all");
  const new_Details = await fetchDetails(timestamp, new_Ids, "new");
  const coming_Details = await fetchDetails(timestamp, coming_Ids, "coming");
  const leaving_Details = await fetchDetails(timestamp, leaving_Ids, "leaving");

  const content = {
    all: all_Details,
    new: new_Details,
    coming: coming_Details,
    leaving: leaving_Details,
  };

  try {
    saveFile(`./extension_output/${timestamp}`, JSON.stringify(content), "gp-results");
    saveFile(`./extension_output`, JSON.stringify(content), "output");
  } catch (err) {
    console.error(err);
  }
}

init();
