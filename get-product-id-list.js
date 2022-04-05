import fetch from 'node-fetch';

const API_PRODUCT_ID_LIST = 'https://reco-public.rec.mp.microsoft.com/channels/Reco/V8.0/Lists/';

const PRODUCT_ID_LISTS = {
  Deal: 'Computed/Deal',
  New: 'Computed/New',
  TopPaid: 'Computed/TopPaid',
  TopFree: 'Computed/TopFree',
  BestRated: 'Computed/BestRated',
  MostPlayed: 'Computed/MostPlayed',
  ComingSoon: 'Computed/ComingSoon',
  Gold: 'collection/FreePlayDays',
};

async function getProductIdsList(list = 'Deal') {
  const url = new URL(`${API_PRODUCT_ID_LIST}${PRODUCT_ID_LISTS[list]}`);
  const params = {
    market: 'ar',
    language: 'es-ar',
    itemTypes: 'Game',
    deviceFamily: 'Windows.Xbox',
    count: '2000',
    skipItems: '0',
  };

  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  console.log('Request to:', url.href);

  try {
    const response = await fetch(url.href);
    const data = await response.json();

    if (data.Items && data.Items.length > 0) {
      return data.Items.map(element => element.Id);
    } else {
      throw new Error(`(${data.Code}) ${data.Message}`);
    }
  } catch (error) {
    throw error;
  }
};

export default getProductIdsList;