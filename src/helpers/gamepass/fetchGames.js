import fetch from "node-fetch";

export function dataParser(data) {
  if (!data) {
    console.error('❌ dataParser "data" is missing');
    return;
  }

  return Object.values(data).map((game) => ({
    id: game.StoreId,
    title: game.ProductTitle,
    EAPlay: game.IsEAPlay,
    imageTile: game.ImageTile,
    dateAdded: game.ConsoleComingSoonDate,
    platforms: {
      one: game.AllowedPlatforms && game.AllowedPlatforms.some((e) => e === "Windows.Xbox") && game.XboxConsoleGenCompatible && game.XboxConsoleGenCompatible.some((e) => e === "ConsoleGen8"),
      series: game.AllowedPlatforms && game.AllowedPlatforms.some((e) => e === "Windows.Xbox") && game.XboxConsoleGenCompatible && game.XboxConsoleGenCompatible.some((e) => e === "ConsoleGen9"),
      windows: game.AllowedPlatforms && game.AllowedPlatforms.some((e) => e === "Windows.Desktop"),
      cloud: game.Attributes && game.Attributes.some((e) => e.Name === "GameStreaming"),
    },
    price: game.Price, // TODO: idea -> compare prices with steam (based on steam region)
  }));
}

async function fetchIds(timestamp, list, location = "US", language = "en-us") {
  const LIST_OF_IDS = {
    all: "f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e",
    new: "f13cf6b4-57e6-4459-89df-6aec18cf0538",
    coming: "095bda36-f5cd-43f2-9ee1-0a72f371fb96",
    leaving: "393f05bf-e596-4ef6-9487-6d4fa0eab987",
  };

  try {
    // expected url: https://catalog.gamepass.com/sigls/v2/?language=en&market=us&id=f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e
    const response = await fetch(`https://catalog.gamepass.com/sigls/v2/?language=${language}&market=${location}&id=${LIST_OF_IDS[list]}`);
    // expected response: [ { MISC }, { id: "abc123" }. { id: "cba321" } ]
    const responseJson = await response.json();
    // expected data: { Products: ["abc123", "cba321"] }
    const data = { Products: responseJson.slice(1).map((e) => e.id) };

    return data;
  } catch (error) {
    console.error("❌ Failed to fetchIds... " + `https://catalog.gamepass.com/sigls/v2/?language=${language}&market=${location}&id=${LIST_OF_IDS[list]}`);
    console.error(error);
    return;
  }
}

export async function fetchDetails(timestamp, body = {}, list, location = "US", language = "en-us") {
  try {
    // expected url: https://catalog.gamepass.com/products?language=en&market=us&hydration=MobileDetailsForConsole
    const response = await fetch(`https://catalog.gamepass.com/products?language=${language}&market=${location}&hydration=MobileDetailsForConsole`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    const data = dataParser(responseJson.Products);
    return data;
  } catch (error) {
    console.error("❌ Failed to fetchDetails..." + `https://catalog.gamepass.com/products?language=${language}&market=${location}&hydration=MobileDetailsForConsole`);
    console.error(error);
    return;
  }
}

async function fetchAllIds() {
  const timestamp = new Date().toJSON();

  try {
    const all_Ids = await fetchIds(timestamp, "all");
    const new_Ids = await fetchIds(timestamp, "new");
    const coming_Ids = await fetchIds(timestamp, "coming");
    const leaving_Ids = await fetchIds(timestamp, "leaving");

    if (!all_Ids || !new_Ids || !coming_Ids || !leaving_Ids) {
      console.error("❌ fetchAllGames() failed. Missing ids...", { all_Ids: !!all_Ids, new_Ids: !!new_Ids, coming_Ids: !!coming_Ids, leaving_Ids: !!leaving_Ids });
    }

    return {
      ALL_IDS: all_Ids,
      NEW_IDS: new_Ids,
      COMING_IDS: coming_Ids,
      LEAVING_IDS: leaving_Ids,
    };
  } catch (error) {
    console.error("❌ fetchAllIds() failed. Missing ids...");
    console.error(error);
    return;
  }
}

async function getGames(NAME_SET) {
  const timestamp = new Date().toJSON();

  try {
    const all_Ids = await fetchIds(timestamp, "all");
    const new_Ids = await fetchIds(timestamp, "new");
    const coming_Ids = await fetchIds(timestamp, "coming");
    const leaving_Ids = await fetchIds(timestamp, "leaving");

    const all_Details = all_Ids ? await fetchDetails(timestamp, all_Ids, "all") : [];
    const new_Details = new_Ids ? await fetchDetails(timestamp, new_Ids, "new") : [];
    const coming_Details = coming_Ids ? await fetchDetails(timestamp, coming_Ids, "coming") : [];
    const leaving_Details = leaving_Ids ? await fetchDetails(timestamp, leaving_Ids, "leaving") : [];

    if (!all_Details || !new_Details || !coming_Details || !leaving_Details) {
      console.error("❌ init() failed. Missing details...", { all_Details: !!all_Details, new_Details: !!new_Details, coming_Details: !!coming_Details, leaving_Details: !!leaving_Details });
    }

    if (NAME_SET === "full" || NAME_SET === "gamepass") {
      return {
        updated_at: timestamp,
        all: all_Details,
        new: new_Details,
        coming: coming_Details,
        leaving: leaving_Details,
      };
    }

    if (NAME_SET === "extension") {
      return {
        updated_at: timestamp,
        all: all_Details && all_Details.length ? all_Details.map(({ id, title, EAPlay, platforms }) => ({ id, title, EAPlay, platforms })) : [],
        coming: coming_Details && coming_Details.length ? coming_Details.map(({ id, title, EAPlay, platforms, dateAdded }) => ({ id, title, EAPlay, platforms, dateAdded })) : [],
        leaving: leaving_Details && leaving_Details.length ? leaving_Details.map(({ id, title, EAPlay, platforms }) => ({ id, title, EAPlay, platforms })) : [],
      };
    }

    if (NAME_SET === "bot") {
      return {
        updated_at: timestamp,
        all: all_Details && all_Details.length ? all_Details.map(({ id, title }) => ({ id, title })) : [],
        new: new_Details && new_Details.length ? new_Details.map(({ id, title }) => ({ id, title })) : [],
        coming: coming_Details && coming_Details.length ? coming_Details.map(({ id, title, dateAdded }) => ({ id, title, dateAdded })) : [],
        leaving: leaving_Details && leaving_Details.length ? leaving_Details.map(({ id, title }) => ({ id, title })) : [],
      };
    }

    throw new Error("❌ getGames() failed. Invalid SET_NAME argument...");

  } catch (error) {
    console.error("❌ getGames() failed...");
    console.error(error);
    return;
  }
}

export default getGames;
