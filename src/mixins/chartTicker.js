import store from "../store";
export default {
  data() {
    return {
      checkData: ''
    }
  },
  methods: {
    webSocketData(data) {
      var preVolume = null;
      var curVolume;

      var tick = data;
      var localResolution = localStorage.getItem(
        "tradingview.chart.lastUsedTimeBasedResolution"
      );
      var currentGraph = store.state.orderWindow.chartScripData

      var currBarVol;
      var lotSize;
      var open;
      var high;
      var low;
      var close;
      var volume;
      var date;
      let time;
      var tempRes;
      var tickerLtp;
      
      if (localStorage.getItem("loadChart") == "true" && store.state.chartFeed.resolution == localResolution) {
        // || (store.state.symbolInfo.ticker == store.state.currentChartData['data']['chartToken'])
        if (
          (tick && store.state.currentChartData['data']['chartToken'] == tick['tk'])  || !tick
        ) {
          store.state.currentChartData.data.chartSymbol.includes('::INDEX') ? currentGraph['LTP'] = store.state.currentChartData.data['ltp'] : ''
          tickerLtp = store.state.currentChartData.data.chart == '::index' ? store.state.currentChartData.data['value'] : currentGraph['LTP']
          !!tick["lp"] ? currentGraph['LTP'] = tickerLtp =  tick["lp"] : ''

          var prevBar = JSON.parse(localStorage.getItem("_lastBar"));
          preVolume = currentGraph["TradeVolume"];
          if(!store.state.currentChartData.data.chartSymbol.includes('::INDEX')){
          curVolume = currentGraph['curVolume'] ? currentGraph['curVolume']  : preVolume
          }
          curVolume =
           Number(preVolume) > Number(curVolume) ? preVolume : curVolume;
            !!tick["v"] ? currentGraph['curVolume'] = curVolume = tick["v"] : ''
          lotSize =  store.state.orderWindow.chartScripData["BodLotQty"] 
          volume = currentGraph["TradeVolume"];

          open = tickerLtp
          high = tickerLtp
          low = tickerLtp
          close = tickerLtp

          if (prevBar == undefined || prevBar == null) {
            prevBar = {
              time: new Date().getTime(),
              close: close,
              open: open,
              high: high,
              low: low,
              volume: 0,
            };
          }
          if (!!tick["ltt"]) {
            const changedDate = tick["ltt"].replace(
              /(..)\/(..)\/(....) (..):(..):(..)/,
              "$3-$2-$1 $4:$5:$6"
            );
            date = new Date(changedDate);
          }
          time =
            !!date && date !== "NA" && !isNaN(date)
              ? date.getTime()
              : new Date().getTime();

          let bar = null;
          if (localResolution === "D" || localResolution === "1D") {
           
            time = new Date().getTime() + 330 * 60 * 1000;
            volume = Number(curVolume);
            if (Number(tickerLtp) > prevBar["high"]) {
              prevBar["high"] = Number(tickerLtp);
              high = Number(tickerLtp);
            } else {
              high = prevBar["high"];
            }
            if (Number(tickerLtp) < prevBar["low"]) {
              prevBar["low"] = Number(tickerLtp);
              low = Number(tickerLtp);
            } else {
              low = prevBar["low"];
            }
            prevBar["close"] = Number(tickerLtp);
            open = prevBar["open"];
            bar = {
              time: Number(time),
              close: Number(close),
              open: Number(open),
              high: Number(high),
              low: Number(low),
              volume: Number(volume),
            };
          } else {
            if (localResolution == "1" || localResolution == "1M") {
              tempRes = 1;
            } else if (localResolution == "5") {
              tempRes = 5;
            } else if (localResolution == "15") {
              tempRes = 15;
            } else if (localResolution == "30") {
              tempRes = 30;
            } else if (localResolution == "60") {
              tempRes = 60;
            }
            volume =
              (Number(curVolume) - Number(preVolume)) * Number(lotSize);
            var coeff;
            if (
              (localResolution == "30" || localResolution == "60") &&
              store.state.currentChartData.data['chartExchange'] != "MCX"
            ) {
              coeff = 1000 * 60 * tempRes;
              time = Math.floor(time / coeff) * coeff;
              if (localResolution == "30") {
                var roundOffedDateTime = new Date(time).toLocaleString(
                  "en-US",
                  {
                    timeZone: "IST",
                  }
                );
                var roundOffedTime = roundOffedDateTime.split(" ")[1];
                var timeDiff = roundOffedTime.split(":")[1];
                if (timeDiff == "00") {
                  time = time + 900000;
                } else if (timeDiff == "30") {
                  time = time - 900000;
                }
              } else if (localResolution == "60") {
                var currentTime = new Date().getTime();
                var roundOffedDateTime60 = new Date(
                  currentTime
                ).toLocaleString("en-US", {
                  timeZone: "IST",
                });
                var roundOffedTime60 = roundOffedDateTime60.split(" ")[1];
                var timeDiff60 = roundOffedTime60.split(":")[1];
                if (
                  parseInt(timeDiff60) >= 0 &&
                  parseInt(timeDiff60) <= 14
                ) {
                  time = time - 900000;
                } else if (
                  parseInt(timeDiff60) >= 15 &&
                  parseInt(timeDiff60) <= 59
                ) {
                  time = time + 900000;
                }
              }
            } else {
              coeff = 1000 * 60 * tempRes;
              time = Math.floor(time / coeff) * coeff;
            }

            /** New bar to be created. Save current bar data in Previous Bar */
            if (
              !!prevBar &&
              !!prevBar["time"] &&
              time > prevBar["time"]
            ) {
              prevBar["open"] = tickerLtp;
              prevBar["high"] = tickerLtp;
              prevBar["low"] = tickerLtp;
              preVolume = curVolume;
              prevBar["volume"] = preVolume;
            }
            if (Number(tickerLtp) > prevBar["high"]) {
              prevBar["high"] = Number(tickerLtp);
              high = Number(tickerLtp);
            } else {
              high = prevBar["high"];
            }
            if (Number(tickerLtp) < prevBar["low"]) {
              prevBar["low"] = Number(tickerLtp);
              low = Number(tickerLtp);
            } else {
              low = prevBar["low"];
            }
            prevBar["close"] = Number(tickerLtp);
            open = prevBar["open"];
            bar = {
              time: Number(time),
              close: Number(close),
              open: Number(open),
              high: Number(high),
              low: Number(low),
              volume: Number(volume),
            };
          }

          let barValue = {
            time: Number(time),
            close: Number(close),
            open: Number(open),
            high: Number(high),
            low: Number(low),
            volume: Number(preVolume),
          };
          localStorage.setItem("_lastBar", JSON.stringify(barValue));
          localStorage.setItem(
            "previousBarTime",
            JSON.stringify(tick["ltt"])
          );
          store.state.chartFeed.onRealtimeCallback(bar);

        }
      }

    },
    passData(symbol){
      var temp = {
        data : {
          where : "symbolInfo",
          chartSymbol: symbol.full_name,
          chartExchange:  symbol.exchange.includes('::INDEX') ? symbol.exchange.split('::')[0] :symbol.exchange,
          exch : symbol.exchange.includes('::INDEX') ? symbol.exchange.split('::')[0] :symbol.exchange,
          chartToken : symbol.ticker,
          token : symbol.ticker
        },
        page : "chart" 
      }
      if(!store.state.currentChartData.data.where){
        console.log(symbol , temp)
      }
      
    }
  }
}