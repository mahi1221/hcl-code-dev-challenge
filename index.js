require('./site/index.html')
require('./site/style.css')

global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

const StockTicker = require('./es6/Stocks');
const TEMPLATE = `
<div class="stock-values">
    <div id="stock-name-{name}" class="stock-name">{name}</div>
    <div id="stock-bestAsk-{name}" class="stock-bestAsk">{bestAsk}</div>
    <div id="stock-bestBid-{name}" class="stock-bestBid">{bestBid}</div>
    <div id="stock-lastChangeAsk-{name}" class="stock-lastChangeAsk">{lastChangeAsk}</div>
    <div id="stock-lastChangeBid-{name}" class="stock-lastChangeBid">{lastChangeBid}</div>
    <div id="stock-sparkline-{name}" class="stock-sparkline"></div>
</div>`;

const stocks = new StockTicker('stock-data', TEMPLATE, window.document);
client.connect({}, function connectCallback() {
  client.subscribe("/fx/prices", stocks.updateStocks.bind(stocks));
}, error => console.log(error.headers.message));
