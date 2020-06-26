require('./dataFormation.js');
const Sparkline = require('../site/sparkline');

class Stocks {
  constructor(parentID, template, document) {
    this.store = {};
    this.store.document = document;
    this.store.Stocks = this.store.document.querySelector(`#${parentID}`);
    this.store.stockTemplate = template;
    this.store.stocks = new Map();
    this.store.sparks = new Map();
  }

  updateStocks(result, testing = false) {
    const data = JSON.parse(result.body),
          stockName = data.name;
    let stockRow = this.getStockRow(stockName);
  
    if (typeof stockRow === 'undefined') {
      let div = this.store.document.createElement('div');
      div.setAttribute('id', `stock-id-${stockName}`);
      div.innerHTML = this.store.stockTemplate.dataFormation(data);
      this.store.Stocks.insertBefore(div, this.startDiv(this.store.Stocks, div));
      stockRow = this.createStock(this.store.Stocks, stockName);
    }
    stockRow = this.updateStockDisplay(data, stockRow);
    this.setStockRow(stockName, stockRow);
    if (!testing) {
      Sparkline.draw(stockRow.sparkline, this.getSparksArray(stockRow.sparkline.id, data.lastChangeBid, this.store.sparks));
    }
    this.updateParentGridRow(this.store.stocks.size);
    this.store.stocks = this.sortStocksGridRowBy('lastChangeBid', this.store.stocks);
  }

  sortStocksGridRowBy(str, stocks) {
    let arr = [];
    for(let i of stocks) {
      arr.push(i);
    }
    
    arr.sort(function(x, y) {
      return y[1][str].innerText - x[1][str].innerText;
    });
    
    let sorted = arr.reduce((accum, a) => {
      a[1].box.style.gridRow = accum.length + 1;
      return [...accum, a];
    }, []);

    return new Map(sorted);
  }

  updateParentGridRow(count) {
    this.store.Stocks.style.gridTemplateRows = `repeat(${count},auto)`
  }

  getStockRow(stockName) {
    return this.store.stocks.get(stockName);
  }
  setStockRow(stockName, stockData) {
    this.store.stocks.set(stockName, stockData);
  }

  getSparksArray(elemId, val, sparks) {
    let currentSpark = sparks.get(elemId);
    if (typeof currentSpark === 'undefined') {
      currentSpark = [0];
      sparks.set(elemId, currentSpark);
    }
    currentSpark.push(val.toFixed(2));
    if (currentSpark.length >= 9) { currentSpark.splice(1,1); }
    return currentSpark;
  }

  createStock(Stocks, stockName) {
    let stock = {};
    stock.box = Stocks.querySelector(`#stock-id-${stockName}`);
    stock.bestAsk = Stocks.querySelector(`#stock-bestAsk-${stockName}`);
    stock.bestBid = Stocks.querySelector(`#stock-bestBid-${stockName}`);
    stock.lastChangeAsk = Stocks.querySelector(`#stock-lastChangeAsk-${stockName}`);
    stock.lastChangeBid = Stocks.querySelector(`#stock-lastChangeBid-${stockName}`);
    stock.name = Stocks.querySelector(`#stock-name-${stockName}`);
    stock.sparkline = Stocks.querySelector(`#stock-sparkline-${stockName}`);
    return stock;
  }
  updateStockDisplay(data, stock) {
    stock.bestAsk.innerHTML = data.bestAsk.toFixed(4);
    stock.bestBid.innerHTML = data.bestBid.toFixed(4);
    stock.lastChangeAsk.innerHTML = data.lastChangeAsk.toFixed(4);
    stock.lastChangeBid.innerHTML = data.lastChangeBid.toFixed(4);
    stock.name.innerHTML = (data.name.slice(0, 3) + '-' + data.name.slice(3)).toUpperCase();
    return stock;
  }

  startDiv(ele) {
    return ele.getElementsByTagName('div')[0];
  }

}
module.exports = Stocks;