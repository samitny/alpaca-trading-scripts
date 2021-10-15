// 
// RUN EXAMPLE:
// ```
// $ node buy-bitcoin-hourly.js > buy-bitcoin-hourly.log
// ```
// 

// Initialize Alpaca library
// 
// @todo - UPDATE!!!! - THIS USES AN OLDER VERSION OF THE ALPACA LIBRARY.
// 
const Alpaca = require('@alpacahq/alpaca-trade-api');
const alpaca = new Alpaca({
  keyId: API_KEY,
  secretKey: API_SECRET,
  paper: PAPER,
});

// Define 1 hour in milliseconds
const HOUR_MS = 1000*60*60;

// Define lock variable
// * If trade fails once, block future trades until script is restarted
// * This is not needed, but keep until code out of beta
let _locked = false;

// 
// Create a market order
// @todo use createLimitOrder instead for safety reasons
// 
async function createMarketOrder({ side, symbol, qty }) {
  if (_locked === true) {
    throw new Error('createMarketOrder blocked by _lock');
  }
  
  _locked = true;

  const res = await alpaca.createOrder({
    symbol: symbol,
    qty: qty,
    side: side,
    time_in_force: 'gtc',
    type: 'market',
  });

  _locked = false;

  return res;
}

setInterval(() => {
  createMarketOrder({
    side: 'buy',
    symbol: 'BTCUSD',
    qty: 0.001, // $60,000 per 1 Bitcoin == each trade is $60
  })
  .then(result => console.log('result', result))
  .catch(error => console.error('error', error));
}, HOUR_MS);
