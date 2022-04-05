import getProductIdsList from './get-product-id-list.js';
import getProductDetailCatalog from './get-product-detail-catalog.js';

async function scrapApi() {
  const ids = await getProductIdsList('Deal');
  const games = await getProductDetailCatalog(ids);
  console.log(games);
  return games;
}

scrapApi();