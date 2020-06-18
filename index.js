/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

function connectCallback() {
  const body = {
    "name": "usdjpy",
    "bestBid": 106.7297012204255,
    "bestAsk": 107.25199883791178,
    "openBid": 107.22827132623534,
    "openAsk": 109.78172867376465,
    "lastChangeAsk": -4.862314256927661,
    "lastChangeBid": -2.8769211401569663
  }
  client.send("/fx/prices", body, "Test Message");
  client.subscribe('/fx/prices', function (priceData) {
    showData(JSON.parse(priceData.body));
  }) 
  // document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
}

function showData(data) {
  if(data){
    document.getElementById('tabledata').innerHTML = ("<tr><td>" + data.name + "</td><td>" + data.bestBid + "</td><td>" + data.bestAsk + "</td><td>" + data.lastChangeBid + "</td><td>" + data.lastChangeAsk + "</td><td><span id='sparkline'>" + sparkline + "</span></td></tr>");
    var sparkline = new Sparkline(document.getElementById("sparkline"));
    const showPrice = [data.bestBid, data.bestAsk, data.lastChangeBid, data.lastChangeAsk]
    const calculatedPrice = (showPrice) => { showPrice.push((data.bestBid + data.bestAsk ) / 2 ) }
    sparkline.draw(showPrice, calculatedPrice);
  }
}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
})


const exampleSparkline = document.getElementById('example-sparkline')
Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])