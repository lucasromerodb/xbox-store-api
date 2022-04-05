# Xbox Store API

| ⚠️ This project is under heavy development

This implementation fetch game data from the Micosoft Xbox public API

## API for Product IDs Lists
### Base URI

```
https://reco-public.rec.mp.microsoft.com/channels/Reco/V8.0/Lists/Computed/
```

### Lists

```js
{
  Deal: 'Computed/Deal',
  New: 'Computed/New',
  TopPaid: 'Computed/TopPaid',
  TopFree: 'Computed/TopFree',
  BestRated: 'Computed/BestRated',
  MostPlayed: 'Computed/MostPlayed',
  ComingSoon: 'Computed/ComingSoon',
  Gold: 'collection/FreePlayDays',
}
```

### Params

```js
{
  market: 'ar',
  language: 'es-ar',
  itemType: 'Game',
  deviceFamily: 'Windows.Xbox',
  count: '2000',
  skipItems: '0',
}
```

## Games Catalog

### Base URI

```
https://displaycatalog.mp.microsoft.com/v7.0/products
```

### Params

```js
{
    market: 'ar',
    languages: 'es-ar',
    bigIds: '9NJRX71M5X9P,9N9J38LPVSM3',
  }
```

## Subscriptions IDs

| Requires research and confirmation

- Gold: `9ZH7BH6P9RM7`
- EA Play: `9N8KCDNKJJQ6` || `B0HFJ7PW900M`
- Game Pass: `9SJCZDHW896G` || `9WNZS2ZC9L74`
- Game Pass Ultimate: `9SQ1C79LQTJJ` <-- UNKNOWN. TO BE DEFINED.

## Sources
- Xbox Store: https://www.xbox.com/es-ar/games/all-games
- Microsoft Store: https://www.microsoft.com/es-ar/store/deals/games/xbox

---

🐦 [Follow me on Twitter](https://twitter.com/GamePassDayOne)