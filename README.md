# Game Pass API Documentation

> [!IMPORTANT]
> This project is under heavy development.

> [!NOTE]
> Made by [@impuestito_org](https://x.com/impuestito_org)

## Overview
This Express.js API provides access to Xbox Game Pass game information, including current games, new additions, upcoming games, and games leaving the service. The API fetches data from Microsoft's official Game Pass catalog and provides it in a structured format.

## Base URL
- Development: `http://localhost:3000`
- Production: Your production URL

## Server Configuration
- Port: 3000 (default) or specified by `process.env.PORT`
- CORS: Enabled
- JSON formatting: 2 spaces
- Security: Helmet middleware enabled
- Logging: Morgan middleware (combined format)

## Data Updates
- Initial data fetch occurs on server start
- Scheduled updates run daily at 12:00 PM (noon) using cron
- Older data (>7 days) is automatically cleaned up

## API Routes

### Game Pass Full Data
Base path: `/api/gamepass` or `/api/gamepass/full`

- `GET /` - Returns complete Game Pass data
- `GET /all` - Returns all current Game Pass games
- `GET /new` - Returns newly added games
- `GET /coming` - Returns upcoming games
- `GET /leaving` - Returns games leaving soon

Response includes full game details including:

```json
{
  "id": "string",
  "title": "string",
  "EAPlay": boolean,
  "imageTile": "string",
  "dateAdded": "string",
  "platforms": {
    "one": boolean,
    "series": boolean,
    "windows": boolean,
    "cloud": boolean
  },
  "price": object
}
```


### Game Pass Extension Data
Base path: `/api/gamepass/extension`

- `GET /` - Returns simplified data for extensions
- `GET /all` - Returns all current games (simplified)
- `GET /new` - Returns new games (simplified)
- `GET /coming` - Returns upcoming games (simplified)
- `GET /leaving` - Returns leaving games (simplified)

Response includes simplified game data:

```json
{
  "id": "string",
  "title": "string",
  "EAPlay": boolean,
  "platforms": object
}
```

### Game Pass Bot Data
Base path: `/api/gamepass/bot`

- `GET /` - Returns basic data for bot usage
- `GET /all` - Returns all games (basic info)
- `GET /new` - Returns new games (basic info)
- `GET /coming` - Returns upcoming games (basic info)
- `GET /leaving` - Returns leaving games (basic info)
- `GET /updates` - Returns combined new/coming/leaving games
- `GET /search` - Returns searchable game data

Response includes minimal game data:
```json
{
  "id": "string",
  "title": "string"
}
```


### Game Pass Search
Base path: `/api/gamepass/search`

- `GET /:gameId/:market` - Search for specific game details
  - `gameId`: Game's Store ID
  - `market`: Market code (e.g., "us", "es-ar")

- `GET /price/:gameId/:market` - Get specific game price
  - `gameId`: Game's Store ID
  - `market`: Market code for pricing

### Games List
Base path: `/api/list`

- `GET /:list` - Returns game IDs for different categories
  - Available lists:
    - `Deal`
    - `New`
    - `TopPaid`
    - `TopFree`
    - `BestRated`
    - `MostPlayed`
    - `ComingSoon`
    - `Gold`

## Data Storage
The API stores data in JSON files:
- `output-full.json`: Complete game data
- `output-extension.json`: Simplified data for extensions
- `output-bot.json`: Basic data for bot usage

Data is stored in `./output/` directory with timestamped subdirectories for historical data.

## Error Responses
- `404`: Resource not found
- `500`: Server error or missing parameters

## Rate Limiting
Currently no rate limiting implemented. Consider implementing for production use.

## Data Sources
- Game Pass Catalog API: `https://catalog.gamepass.com`
- Microsoft Store API: `https://displaycatalog.mp.microsoft.com`
- Recommendations API: `https://reco-public.rec.mp.microsoft.com`

## Development

### Prerequisites
- Node.js
- npm/yarn

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
```

### Project Structure

```
src/
├── helpers/
│ ├── gamepass/
│ │ ├── saveAllGames.js
│ │ └── removeOlderFolders.js
│ ├── gameMapper.js
│ └── queryComposer.js
├── routes/
│ ├── gamepass-full.js
│ ├── gamepass-extension.js
│ ├── gamepass-bot.js
│ ├── gamepass-search.js
│ ├── games.js
│ └── list.js
└── index.js
```

---

# Official Microsoft Xbox Store API (research)


## Endpoints

### /api/list

- IDs for Deal: `/api/list/Deal`,
- IDs for New: `/api/list/New`,
- IDs for TopPaid: `/api/list/TopPaid`,
- IDs for TopFree: `/api/list/TopFree`,
- IDs for BestRated: `/api/list/BestRated`,
- IDs for MostPlayed: `/api/list/MostPlayed`,
- IDs for ComingSoon: `/api/list/ComingSoon`,
- IDs for Gold: `/api/list/FreePlayDays`,

### /api/games

- Deal catalog: `/api/games/Deal`,
- New catalog: `/api/games/New`,
- TopPaid catalog: `/api/games/TopPaid`,
- TopFree catalog: `/api/games/TopFree`,
- BestRated catalog: `/api/games/BestRated`,
- MostPlayed catalog: `/api/games/MostPlayed`,
- ComingSoon catalog: `/api/games/ComingSoon`,
- Gold catalog: `/api/games/FreePlayDays`,

## Query params (defaults)

### Valid for `/api/list` & `/api/games`

- `market=ar`
- `language=es-ar`
- `itemTypes=Game`
- `deviceFamily=Windows.Xbox`
- `count=2000`
- `skipItems=0`

---

# Microsoft API

This implementation fetch game data from the Micosoft Xbox public API

## API for Product IDs Lists

### Base URI

```
https://reco-public.rec.mp.microsoft.com/channels/Reco/V8.0/Lists/api/list/
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
