<template>
  <div class="TVChartContainer" :id="containerId" />
</template>

<script>
import store from "../store";
import chart from "../mixins/chartTicker";
import { widget } from "../../public/charting_library";
import axios from "axios";
function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
/* eslint-disable */

export default {
  name: "TVChartContainer",
  props: {
    symbol: {
      default: "NIFTY 50::NSE::Index",
      type: String,
    },
    interval: {
      default: "D",
      type: String,
    },
    containerId: {
      default: "tv_chart_container",
      type: String,
    },
    datafeedUrl: {
      default:"https://a3.aliceblueonline.com/rest/AliceBlueAPIService/chart",
      type: String,
    },
    libraryPath: {
      default: "/charting_library/",
      type: String,
    },
    chartsStorageUrl: {
      default: "https://a3.aliceblueonline.com/rest/AliceBlueAPIService",
      type: String,
    },
    chartsStorageApiVersion: {
      default: "1.1",
      type: String,
    },
    clientId: {
      default: "ALICEBLUE",
      type: String,
    },
    userId: {
      default: store.state.authtication.userId,
      type: String,
    },
    fullscreen: {
      default: false,
      type: Boolean,
    },
    autosize: {
      default: true,
      type: Boolean,
    },
    studiesOverrides: {
      type: Object,
    },
  },
  data() {
    return {
      customSymbol: "",
    };
  },
  created: function () {
    this.$root.$refs.TVChartContainer = this;
  },
  tvWidget: null,
  mounted() {
  !localStorage.getItem('tradingview.chart.lastUsedTimeBasedResolution') ? localStorage.setItem("tradingview.chart.lastUsedTimeBasedResolution", "1D") : ''
    let temp ={
      data: "initial",
       where: 'chart'
    }
    this.refresh(temp);
  },
  destroyed() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  },
  methods: {
    createChart(datafeedUrl) {
      this.feed = this.createFeed(datafeedUrl);
    },
    createFeed(datafeedUrl) {
      let Datafeed = {};
      Datafeed.DataPulseUpdater = function (datafeed, updateFrequency) {
        this._datafeed = datafeed;
        this._subscribers = {};
        this._requestsPending = 0;
        var that = this;
        var update = function () {
          if (that._requestsPending > 0) {
            return;
          }
          for (var listenerGUID in that._subscribers) {
            var subscriptionRecord = that._subscribers[listenerGUID];
            var resolution = subscriptionRecord.resolution;
            var datesRangeRight = parseInt(
              (new Date().valueOf() / 1000).toFixed()
            );
            //	BEWARE: please note we really need 2 bars, not the only last one
            //	see the explanation below. `10` is the `large enough` value to work around holidays
            var datesRangeLeft =
              datesRangeRight - that.periodLengthSeconds(resolution, 10);
            that._requestsPending++;
            (function (_subscriptionRecord) {
              // eslint-disable-line
              that._datafeed.getBars(
                _subscriptionRecord.symbolInfo,
                resolution,
                datesRangeLeft,
                datesRangeRight,
                function (bars) {
                  that._requestsPending--;
                  //	means the subscription was cancelled while waiting for data
                  if (!that._subscribers.hasOwnProperty(listenerGUID)) {
                    return;
                  }
                  if (bars.length === 0) {
                    return;
                  }
                  var lastBar = bars[bars.length - 1];
                  if (
                    !isNaN(_subscriptionRecord.lastBarTime) &&
                    lastBar.time < _subscriptionRecord.lastBarTime
                  ) {
                    return;
                  }
                  var subscribers = _subscriptionRecord.listeners;
                  //	BEWARE: this one isn't working when first update comes and this update makes a new bar. In this case
                  //	_subscriptionRecord.lastBarTime = NaN
                  var isNewBar =
                    !isNaN(_subscriptionRecord.lastBarTime) &&
                    lastBar.time > _subscriptionRecord.lastBarTime;
                  //	Pulse updating may miss some trades data (ie, if pulse period = 10 secods and new bar is started 5 seconds later after the last update, the
                  //	old bar's last 5 seconds trades will be lost). Thus, at fist we should broadcast old bar updates when it's ready.
                  if (isNewBar) {
                    if (bars.length < 2) {
                      throw new Error(
                        "Not enough bars in history for proper pulse update. Need at least 2."
                      );
                    }
                    var previousBar = bars[bars.length - 2];
                    for (var i = 0; i < subscribers.length; ++i) {
                      subscribers[i](previousBar);
                    }
                  }
                  _subscriptionRecord.lastBarTime = lastBar.time;
                  for (var j = 0; j < subscribers.length; ++j) {
                    subscribers[j](lastBar);
                  }
                },
                //	on error
                function () {
                  that._requestsPending--;
                }
              );
            })(subscriptionRecord);
          }
        };
        if (typeof updateFrequency != "undefined" && updateFrequency > 0) {
          setInterval(update, updateFrequency);
        }
      };
      Datafeed.DataPulseUpdater.prototype.periodLengthSeconds = function (
        resolution,
        requiredPeriodsCount
      ) {
        var daysCount = 0;
        if (resolution === "D") {
          daysCount = requiredPeriodsCount;
        } else if (resolution === "M" || resolution === "1M") {
          daysCount = 31 * requiredPeriodsCount;
        } else if (resolution === "W" || resolution === "1W") {
          daysCount = 7 * requiredPeriodsCount;
        } else {
          daysCount = (requiredPeriodsCount * resolution) / (24 * 60);
        }
        return daysCount * 24 * 60 * 60;
      };
      Datafeed.DataPulseUpdater.prototype.subscribeDataListener = function (
        symbolInfo,
        resolution,
        newDataCallback,
        listenerGUID
      ) {
        this._datafeed._logMessage("Subscribing " + listenerGUID);
        if (!this._subscribers.hasOwnProperty(listenerGUID)) {
          this._subscribers[listenerGUID] = {
            symbolInfo: symbolInfo,
            resolution: resolution,
            lastBarTime: NaN,
            listeners: [],
          };
        }
        this._subscribers[listenerGUID].listeners.push(newDataCallback);
      };
      Datafeed.DataPulseUpdater.prototype.unsubscribeDataListener = function (
        listenerGUID
      ) {
        this._datafeed._logMessage("Unsubscribing " + listenerGUID);
        delete this._subscribers[listenerGUID];
      };
      Datafeed.Container = function (updateFrequency) {
        this._configuration = {
          supports_search: false,
          supports_group_request: false,
          supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
          supports_marks: false,
          supports_timescale_marks: false,
        };
        this._barsPulseUpdater = new Datafeed.DataPulseUpdater(
          this,
          updateFrequency || 10 * 1000
        );
        // this._quotesPulseUpdater = new Datafeed.QuotesPulseUpdater(this);
        this._enableLogging = true;
        this._callbacks = {};
        this._initializationFinished = true;
        this._fireEvent("initialized");
        this._fireEvent("configuration_ready");
      };
      Datafeed.Container.prototype._fireEvent = function (event, argument) {
        if (this._callbacks.hasOwnProperty(event)) {
          var callbacksChain = this._callbacks[event];
          for (var i = 0; i < callbacksChain.length; ++i) {
            callbacksChain[i](argument);
          }
          this._callbacks[event] = [];
        }
      };
      Datafeed.Container.prototype._logMessage = function (message) {
        if (this._enableLogging) {
          var now = new Date();
        }
      };
      Datafeed.Container.prototype.on = function (event, callback) {
        if (!this._callbacks.hasOwnProperty(event)) {
          this._callbacks[event] = [];
        }
        this._callbacks[event].push(callback);
        return this;
      };
      Datafeed.Container.prototype.onReady = function (callback) {
        let that = this;
        if (this._configuration) {
          setTimeout(function () {
            callback(that._configuration);
          }, 0);
        } else {
          this.on("configuration_ready", function () {
            callback(that._configuration);
          });
        }
      };
      Datafeed.Container.prototype._symbolResolveURL = "/symbols";
      Datafeed.Container.prototype._prevSymbol = this.customSymbol;
      Datafeed.Container.prototype.resolveSymbol = function (
        symbolName,
        onSymbolResolvedCallback,
        onResolveErrorCallback
      ) {
        this._logMessage("GOWNO :: resolve symbol " + symbolName);
        this._logMessage("GOWNO :: this._prevSymbol " + this._prevSymbol);
        if (symbolName && symbolName.split("::").length < 2) {
          symbolName = this._prevSymbol;
        }
        this._send(
          datafeedUrl + this._symbolResolveURL,
          {
            symbol: symbolName ? symbolName.toUpperCase() : "",
          },
          function (dataObj) {
            dataObj.full_name = symbolName;

            onSymbolResolvedCallback(dataObj);
          }
        );
        this._prevSymbol = symbolName;
        localStorage.removeItem("_lastBar");
        localStorage.removeItem("chart_Ticker");
      };

      Datafeed.Container.prototype._historyURL = "/history";
      Datafeed.Container.prototype.getBars = function (
        symbolInfo,
        resolution,
        rangeStartDate,
        rangeEndDate,
        onDataCallback,
        onErrorCallback
      ) {
        store.commit('setSymbolInfo', symbolInfo)
        // chart.methods.passData(symbolInfo)
        localStorage.setItem(
          "tradingview.chart.lastUsedTimeBasedResolution",
          resolution
        );
        if (rangeStartDate > 0 && (rangeStartDate + "").length > 10) {
          throw new Error([
            "Got a JS time instead of Unix one.",
            rangeStartDate,
            rangeEndDate,
          ]);
        }
        this._send(
          datafeedUrl + this._historyURL,
          {
            symbol: symbolInfo.ticker || "",
            resolution: resolution,
            from: rangeStartDate,
            exchange: symbolInfo.exchange,
            to: rangeEndDate,
            user: store.state.authtication.userId,
          },
          function (data) {
            var nodata = data.s === "no_data";
            var bars = [];
            //	data is JSON having format {s: "status" (ok, no_data, error),
            //  v: [volumes], t: [times], o: [opens], h: [highs], l: [lows], c:[closes], nb: "optional_unixtime_if_no_data"}
            var barsCount = nodata ? 0 : data.t.length;
            var volumePresent = typeof data.v != "undefined";
            var ohlPresent = typeof data.o != "undefined";
            for (var i = 0; i < barsCount; ++i) {
              var barValue = {
                time: data.t[i] * 1000,
                close: data.c[i],
              };
              if (ohlPresent) {
                barValue.open = data.o[i];
                barValue.high = data.h[i];
                barValue.low = data.l[i];
              } else {
                barValue.open = barValue.high = barValue.low = barValue.close;
              }
              if (volumePresent) {
                barValue.volume = data.v[i];
              }
              localStorage.setItem("_lastBar", JSON.stringify(barValue));
              localStorage.setItem("loadChart", "true");
              bars.push(barValue);
            }
            //API call to get scrip quote data
            if (Object.keys(symbolInfo).length > 0) {

              localStorage.removeItem("chart_Ticker");
            }

            onDataCallback(bars, {
              noData: nodata,
              nextTime: data.nb || data.nextTime,
            });
          }
        );
      };
      Datafeed.Container.prototype.subscribeBars = function (
        symbolInfo,
        resolution,
        onRealtimeCallback,
        listenerGUID,
        onResetCacheNeededCallback
      ) {
        store.commit("setChartFeed", { resolution, onRealtimeCallback });
        chart.methods.webSocketData("");
        // if(value !==  "intial" && store.state.chartFeed != ''){

        //   // // // this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback);
      };
      Datafeed.Container.prototype.unsubscribeBars = function (listenerGUID) {
        this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
      };
      Datafeed.Container.prototype._send = function (url, params, callback) {
        var request = url;
        if (params) {
          for (var i = 0; i < Object.keys(params).length; ++i) {
            var key = Object.keys(params)[i];
            var value = encodeURIComponent(params[key]);
            request += (i === 0 ? "?" : "&") + key + "=" + value;
          }
        }
        this._logMessage("New request: " + request);
        axios
          .get(request)
          .then((response) => {
            callback(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      return new Datafeed.Container();
    },
    refresh(item) {
      
      var currentChart = "";
      let getLocal = JSON.parse(localStorage.getItem("chartData"))
      item.data == "initial"
        ? (currentChart = getLocal['data'])
        : (currentChart = item.data);
      localStorage.setItem("chartData", JSON.stringify(getLocal));
        if(!currentChart.chartSymbol.includes('::INDEX')){
        var temp = {
          value: currentChart,
          from: item.where,
          page: "chart",
          token: currentChart.chartToken,
          exch : currentChart.chartExchange
        };
        this.$store.dispatch("orderWindow/getScripQuoteDetails", temp);
      }
 this.customSymbol = currentChart.chartSymbol
      var tempData = {
        data: [],
        where: "chart",
        subscribe: currentChart.websocketSub ? currentChart.websocketSub : currentChart.ex + '|' + currentChart.token + '#',
      };
      currentChart.chart != '::index' ? this.$store.dispatch("wsConnection/websocketSubscription", tempData) : ''
      let prevResolution = localStorage.getItem('tradingview.chart.lastUsedTimeBasedResolution')
      if (item.data == "initial") {
      this.createChart(this.datafeedUrl);
      const widgetOptions = {
        symbol: this.customSymbol,
        // BEWARE: no trailing slash is expected in feed URL
        datafeed: this.feed,
        interval: prevResolution ? prevResolution : this.interval,
        container_id: this.containerId,
        library_path: this.libraryPath,
        locale: getLanguageFromURL() || "en",
        disabled_features: [
          "use_localstorage_for_settings",
          "header_fullscreen_button",
          "header_compare",
          "header_symbol_search"
        ],
        enabled_features: ["study_templates", "hide_left_toolbar_by_default"],
        charts_storage_url: this.chartsStorageUrl,
        user_id: this.userId,
        fullscreen: this.fullscreen,
        autosize: this.autosize,
        studies_overrides: this.studiesOverrides,
        timezone: "Asia/Kolkata",
        charts_storage_api_version: this.chartsStorageApiVersion,
        client_id: this.clientId,
        auto_save_delay: 5
      };
      
        const tvWidget = new widget(widgetOptions);
      this.tvWidget = tvWidget;
    //   tvWidget.onChartReady(function() {
    // tvWidget.onContextMenu(function(indicators) {
    //     return [{
    //         position: "top",
    //         text: indicators,
    //         click: function() { alert("First clicked."); }
    //     },
    //     { text: "-", position: "top" },
    //     { text: "-Objects Tree..." },
    //     {
    //         position: "top",
    //         text: "Second top menu item 2",
    //         click: function() { alert("Second clicked."); }
    //     }, {
    //         position: "bottom",
    //         text: "Bottom menu item",
    //         click: function() { alert("Third clicked."); }
    //     }];
    // })
    //   })
      }else{
        this.tvWidget.setSymbol(this.customSymbol, this.tvWidget.symbolInterval().interval, function(){})
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.TVChartContainer {
  height: calc(100vh - 56px);
}
</style>