import fetch from 'node-fetch';

const API_PRODUCT_DETAIL_CATALOG = 'https://displaycatalog.mp.microsoft.com/v7.0/products/';

/**
 * Given an array of products, it returns an array of objects with the following structure:
 * @param  {array} products
 */
function mapProducts(products) {
  return products.map(element => {

    // TODO: Code smell
    const url = new URL(API_PRODUCT_DETAIL_CATALOG);
    const params = {
      market: 'ar',
      languages: 'es-ar',
      bigIds: element.ProductId,
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    // --------------------------------------------------

    const hasPosterImage = element.LocalizedProperties[0].Images.find(item => item.ImagePurpose === "Poster");

    return {
      OriginalRequest: url.href,
      GameInfo: {
        Poster: hasPosterImage ? hasPosterImage.Uri : null,
        ShortTitle: element.LocalizedProperties[0].ShortTitle,
        ProductTitle: element.LocalizedProperties[0].ProductTitle,
        ShortDescription: element.LocalizedProperties[0].ShortDescription,
        ProductDescription: element.LocalizedProperties[0].ProductDescription,
        PublisherWebsiteUri: element.LocalizedProperties[0].PublisherWebsiteUri,
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
      Subscriptions: element.LocalizedProperties[0].EligibilityProperties.Affirmations,
    };
  })
}

/**
 * @param  {array} productIds
 */
async function getProductDetailCatalog(productIds = ['9NJRX71M5X9P', '9N9J38LPVSM3']) {

  if (productIds.length === 0) {
    return [];
  }

  const url = new URL(API_PRODUCT_DETAIL_CATALOG);
  const params = {
    market: 'ar',
    languages: 'es-ar',
    bigIds: productIds.join(','),
  }

  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  console.log('Request to:', url.href);

  try {
    const response = await fetch(url.href);
    const data = await response.json();

    if (data.Products && data.Products.length > 0) {
      return mapProducts(data.Products);
    } else {
      throw new Error('No games found');
    }
  } catch (error) {
    throw error;
  }
}

export default getProductDetailCatalog;