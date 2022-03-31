import fetch from 'node-fetch';

const API_DEAL_PRODUCT_IDS = "https://reco-public.rec.mp.microsoft.com/channels/Reco/V8.0/Lists/Computed/Deal?Market=ar&Language=es&ItemTypes=Game&deviceFamily=Windows.Xbox&count=2000&skipitems=0";
const API_CATALOG = "https://displaycatalog.mp.microsoft.com/v7.0/products";
const API_CATALOG_PARAM_PRODUCT_IDS = "?bigIds=";
const API_CATALOG_PARAM_FILTER = "&market=AR&languages=es-ar";
const PRODUCTS_PER_GROUP = 50;


/**
 * Generic function to get data from an url
 * @param  {string} url
 * @return {object}
 */
async function fetcher(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;

  } catch (error) {
    console.error(error);
  }
}

/**
 * Given an url, it returns an array of arrays of productIds
 * @param  {string} url
 * @return {array}
 */
async function getProductIds(url) {
  const response = await fetch(url);
  const json = await response.json();

  const data = json.Items.filter(item => item.ItemType === "Game").map(item => item.Id);
  const productIdsGroup = [];

  for (let i = 0; i < data.length; i = i + PRODUCTS_PER_GROUP) {
    productIdsGroup.push(data.slice(i, i + PRODUCTS_PER_GROUP));
  }

  return productIdsGroup;
}

/**
 * Given an array of arrays of products, it returns a flatten array of products
 * @param  {array} groups
 */
function flatGroupsOfProducts(groups) {
  let data = [];

  for (let i = 0; i < groups.length; i++) {
    data = [...data, ...groups[i].Products];
  }

  return data;
}

/**
 * Given an array of products, it returns an array of objects with the following structure:
 * @param  {array} products
 */
function mapProduct(products) {
  return products.map(element => {
    const hasPosterImage = element.LocalizedProperties[0].Images.find(item => item.ImagePurpose === "Poster");

    return {
      OriginalRequest: `${API_CATALOG}${API_CATALOG_PARAM_PRODUCT_IDS}${element.ProductId}${API_CATALOG_PARAM_FILTER}`,
      GameInfo: {
        Poster: hasPosterImage ? hasPosterImage.Uri : null,
        ShortTitle: element.LocalizedProperties[0].ShortTitle,
        ProductTitle: element.LocalizedProperties[0].ProductTitle,
        ShortDescription: element.LocalizedProperties[0].ShortDescription,
        ProductDescription: element.LocalizedProperties[0].ProductDescription,
        PublisherWebsiteUri: element.LocalizedProperties[0].PublisherWebsiteUri,
      },
      Details: {
        ProductId: element.ProductId,
        OriginalReleaseDate: element.MarketProperties[0].OriginalReleaseDate,
        Category: element.Properties.Category,
        Categories: element.Properties.Categories,
        DeveloperName: element.LocalizedProperties[0].DeveloperName,
        PublisherName: element.LocalizedProperties[0].PublisherName,
        XboxLiveGoldRequired: element.Properties.XboxLiveGoldRequired,
        // TODO: PC - Desktop
        // TODO: Xbox
        // TODO: Game Pass
        // TODO: Rating
      },
      Price: {
        CurrencyCode: element.DisplaySkuAvailabilities[0].Availabilities[0].OrderManagementData.Price.CurrencyCode,
        MSRP: element.DisplaySkuAvailabilities[0].Availabilities[0].OrderManagementData.Price.MSRP,
      },
      Sale: {
        ListPrice: element.DisplaySkuAvailabilities[0].Availabilities[0].OrderManagementData.Price.ListPrice,
        WholesalePrice: element.DisplaySkuAvailabilities[0].Availabilities[0].OrderManagementData.Price.WholesalePrice,
        StartDate: element.DisplaySkuAvailabilities[0].Availabilities[0].Conditions.StartDate,
        EndDate: element.DisplaySkuAvailabilities[0].Availabilities[0].Conditions.EndDate,
      },
      Subscriptions: element.LocalizedProperties[0].EligibilityProperties.Affirmations,
    };
  })
}

/**
 * Given an array of products, it returns an array of elements who doesn't have a poster image
 * @param  {array} products
 */
function getProductsWithoutPoster(products) {
  return products.filter(element => element.GameInfo.Poster === null).map(element => element.OriginalRequest);
}

/**
 * Fetch data from the public API and returns an array of products with a custom structure
 */
async function scrapeAPI() {
  console.log('🔢 REQUESTING PRODUCT IDs');
  const arrayOfGroupsOfIds = await getProductIds(API_DEAL_PRODUCT_IDS);

  console.log('📦 MAKING GROUPS OF IDs');
  const arrayOfProductsRequest = [];
  for (let i = 0; i < arrayOfGroupsOfIds.length; i++) {
    const groupOfIds = arrayOfGroupsOfIds[i];
    const ids = groupOfIds.join(',');
    const urlCatalog = `${API_CATALOG}${API_CATALOG_PARAM_PRODUCT_IDS}${ids}${API_CATALOG_PARAM_FILTER}`;
    arrayOfProductsRequest.push(fetcher(urlCatalog));
  }

  try {
    console.log('🎯 EXECUTING ALL REQUESTS');
    const response = await Promise.all(arrayOfProductsRequest);
    const flatResponse = flatGroupsOfProducts(response);
    const customResponse = mapProduct(flatResponse);

    // Statistics
    console.log('\n------------------------------------------------------------------------------------------------\n')
    console.log('FINISH.\n')
    console.log('📦 There are', arrayOfProductsRequest.length, 'groups (max. products per group:', PRODUCTS_PER_GROUP, ')');
    console.log('🎯 Total products fetched', flatResponse.length);
    console.log('🖼 Products without poster: ', getProductsWithoutPoster(customResponse).length, getProductsWithoutPoster(customResponse));

    return customResponse;
  } catch (error) {
    console.log(error);
  }
}

scrapeAPI();
