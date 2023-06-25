function renderFilterOptions() {
    var filter1Options = [ "ETHBTC", "LTCBTC", "BCHBTC", "XRPBTC", "ADABTC", "LINKBTC", "DOTBTC", "XLMBTC", "EOSBTC", "XMRBTC", "BTCUSDT", "BTCUSDC", "BTCDAI", "BTCTUSD", "BTCPAX", "BTCBUSD", "BTCBUSD", "", "", "BTCUSDS" ];  
    var filter2Options = ["1m", "3m", "5m", "15m", "30m", "1h","2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"];
    
    var filter1Select = document.getElementById("filter1");
    var filter2Select = document.getElementById("filter2");

    // Render filter1 options
    filter1Options.forEach(function(option) {
      var optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.text = option;
      optionElement.className = "option"
      filter1Select.appendChild(optionElement);
    });

    // Render filter2 options
    filter2Options.forEach(function(option) {
      var optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.text = option;
      optionElement.className = "option"
      filter2Select.appendChild(optionElement);
    });
  }

  // Call the function to render filter options
  renderFilterOptions();

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click()

async function getFeeds(query) {
  var url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyDxisDE4fXgCbQD58bCF6QUUziucQvAp0o&cx=157101ab2c5134d76&q=${query}&sort=date`
  try {
    const data = await fetch(url, {
        method: 'GET'});

    const datum = await data.json();
    const response = datum.items
    
    console.log(response)
    document.getElementById("content").innerHTML = ""

      // Get the outer div element
      const outerDiv = document.getElementById("content");

      // Loop through the new items and create the inner divs
      response.forEach(item => {
          // Create the inner div element
          const innerDiv = document.createElement("li");
          innerDiv.className = "single-feed";
          
          // Create the inner elements using the template
          innerDiv.innerHTML = `
          <a href=${item.link}><h3>${item.title}</h3></a>
          <a href=${item.link}><p style="font-size:small; padding-top: 0.2cm; text-decoration: none; color: green;">${item.link}</p></a>
          <p>${item.htmlSnippet}</p>
          `;
          
          // Append the inner div to the outer div
          outerDiv.appendChild(innerDiv);
      }); 
  } catch(err) {
    console.error(err)
  }
}

async function getChart() {
  var symbol = document.getElementById("filter1").value
  var interval = document.getElementById("filter2").value
  getFeeds(symbol)
  var input_data = {
    "symbol": symbol,
    "interval": interval
  }

  const url = 'http://127.0.0.1:5000/history'
  
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input_data),
      });

      const data = await response.json();
      
      // console.log(data)

      document.getElementById("chartbox").innerHTML = ""
  
      var chart = LightweightCharts.createChart(document.getElementById('chartbox'), {
        width: 1000,
          height: 500,
        layout: {
          backgroundColor: '#000000',
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
        },
        crosshair: {
          mode: LightweightCharts.CrosshairMode.Normal,
        },
        priceScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
        timeScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
          timeVisible: true,
          secondsVisible: false,
        },
      });
      
      var candleSeries = chart.addCandlestickSeries({
        upColor: '#00ff00',
        downColor: '#ff0000', 
        borderDownColor: 'rgba(255, 144, 0, 1)',
        borderUpColor: 'rgba(255, 144, 0, 1)',
        wickDownColor: 'rgba(255, 144, 0, 1)',
        wickUpColor: 'rgba(255, 144, 0, 1)',
      });

      candleSeries.setData(data);
      
      var binanceSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`);
      
      binanceSocket.onmessage = function (event) {	
        var message = JSON.parse(event.data);
      
        var candlestick = message.k;
      
        console.log(candlestick)
      
        candleSeries.update({
          time: candlestick.t / 1000,
          open: candlestick.o,
          high: candlestick.h,
          low: candlestick.l,
          close: candlestick.c
        })
      }
    } catch (err) {
      console.error(err);
      throw err;
  }
}

getChart()