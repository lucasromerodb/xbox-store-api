# Xbox Store API

| ⚠️ This project is under heavy development

This implementation fetch game data from the Micosoft Xbox public API

## Categories for Xbox Games

| Base URI API: `https://reco-public.rec.mp.microsoft.com/channels/Reco/V8.0/Lists/Computed/`

- Deals: `Deal?Market=ar&Language=es&ItemTypes=Game&deviceFamily=Windows.Xbox&count=2000&skipitems=0`
- New Games: `New?Market=ar&Language=es&ItemTypes=Game&deviceFamily=Windows.Xbox&count=2000&skipitems=0`
- Top Paid: `TopPaid?Market=ar&Language=es&ItemTypes=Game&deviceFamily=Windows.Xbox&count=2000&skipitems=0`
- Top Free: `TopFree?Market=ar&Language=es&ItemTypes=Game&deviceFamily=Windows.Xbox&count=2000&skipitems=0`
- Best Rated: `BestRated?Market=ar&Language=es&ItemTypes=Game&deviceFamily=Windows.Xbox&count=2000&skipitems=0`
- Mos Played: `MostPlayed?Market=ar&Language=es&ItemTypes=Game&deviceFamily=Windows.Xbox&count=2000&skipitems=0`
- Coming Soon: `ComingSoon?Market=ar&Language=es&ItemTypes=Game&deviceFamily=Windows.Xbox&count=2000&skipitems=0`

| You can change `Market={COUNTRY_ISO}` and `Language={LANGUAGE_ISO}`

## Game Data
| Base API URI: `https://displaycatalog.mp.microsoft.com/v7.0/products`
- Params: `?bigIds={PRODUCT_ID1,PRODUCT_ID_2}&market=AR&languages=es-ar`

## Subscriptions IDs

| Requires research and confirmation

- Gold: `9ZH7BH6P9RM7`
- EA Play: `9N8KCDNKJJQ6`
- Game Pass: `9SJCZDHW896G`
- Game Pass Ultimate: `9SQ1C79LQTJJ` <-- UNKNOWN. TO BE DEFINED.

## Sources
- Xbox Store: https://www.xbox.com/es-ar/games/all-games
- Microsoft Store: https://www.microsoft.com/es-ar/store/deals/games/xbox

---

🐦 [Follow me on Twitter](https://twitter.com/GamePassDayOne)