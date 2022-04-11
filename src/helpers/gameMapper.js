/**
 * Given an array of products, it returns an array of objects with the following structure:
 * @param  {array} games
 */
function gameMapper(games) {
  return games.map((game) => {
    const hasPosterImage = game.LocalizedProperties[0].Images.find((item) => item.ImagePurpose === "Poster");

    return {
      GameInfo: {
        Poster: hasPosterImage ? hasPosterImage.Uri : null,
        ShortTitle: game.LocalizedProperties[0].ShortTitle,
        ProductTitle: game.LocalizedProperties[0].ProductTitle,
        ShortDescription: game.LocalizedProperties[0].ShortDescription,
        ProductDescription: game.LocalizedProperties[0].ProductDescription,
        PublisherWebsiteUri: game.LocalizedProperties[0].PublisherWebsiteUri,
      },
      Price: {
        CurrencyCode: game.DisplaySkuAvailabilities[0].Availabilities[0].OrderManagementData.Price.CurrencyCode,
        MSRP: game.DisplaySkuAvailabilities[0].Availabilities[0].OrderManagementData.Price.MSRP,
      },
      Sale: {
        ListPrice: game.DisplaySkuAvailabilities[0].Availabilities[0].OrderManagementData.Price.ListPrice,
        WholesalePrice: game.DisplaySkuAvailabilities[0].Availabilities[0].OrderManagementData.Price.WholesalePrice,
        StartDate: game.DisplaySkuAvailabilities[0].Availabilities[0].Conditions.StartDate,
        EndDate: game.DisplaySkuAvailabilities[0].Availabilities[0].Conditions.EndDate,
      },
      Details: {
        ProductId: game.ProductId,
        OriginalReleaseDate: game.MarketProperties[0].OriginalReleaseDate,
        Category: game.Properties.Category,
        Categories: game.Properties.Categories,
        DeveloperName: game.LocalizedProperties[0].DeveloperName,
        PublisherName: game.LocalizedProperties[0].PublisherName,
        XboxLiveGoldRequired: game.Properties.XboxLiveGoldRequired,
        // TODO: PC - Desktop
        // TODO: Xbox
        // TODO: Game Pass
        // TODO: Rating
      },
      Subscriptions: game.LocalizedProperties[0].EligibilityProperties.Affirmations,
    };
  });
}

export default gameMapper;
