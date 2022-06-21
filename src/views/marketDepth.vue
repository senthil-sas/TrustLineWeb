<template>
  <v-sheet class="mkdepth">
    <div flat class="d-flex align-center px-2 pt-2 pb-1">
      <div class="w-25 text-center">
        <p class="mb-1 fsize12  secondaryColor">Open</p>
        <p class="mb-1 fsize12 primaryColor">{{setTofixed(formatNum(priceRageData.openrate))}}</p>
      </div>
      <div class="w-25 text-center">
        <p class="mb-1 fsize12  secondaryColor">High</p>
        <p class="mb-1 fsize12 primaryColor">{{setTofixed(formatNum(priceRageData.highrate))}}</p>
      </div>
      <div class="w-25 text-center">
        <p class="mb-1 fsize12  secondaryColor">Low</p>
        <p class="mb-1 fsize12 primaryColor">{{setTofixed(formatNum(priceRageData.lowrate))}}</p>
      </div>
      <div class="w-25 text-center">
        <p class="mb-1 fsize12  secondaryColor">Close</p>
        <p class="mb-1 fsize12 primaryColor">{{setTofixed(formatNum(priceRageData.previouscloserate))}}</p>
      </div>
    </div>
    <div class="row ma-0 pa-2">
      <table class="w-50 col-6 pa-0 buyTable wrap">
        <thead>
          <tr>
            <th class="font-weight-normal primaryColor pb-2 pr-4 fsize10 text-left">BID</th>
            <th class="font-weight-normal primaryColor pb-2 pr-2 fsize10 text-right">ORDERS</th>
            <th class="font-weight-normal primaryColor pb-2 pr-2 fsize10 text-right">QTY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left fsize12 pb-1 pr-4">{{setTofixed(formatNum(priceRageData.BPrice1))}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.BOrders1}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.BQty1}}</td>
          </tr>
          <tr>
            <td class="text-left fsize12 pb-1 pr-4">{{setTofixed(formatNum(priceRageData.BPrice2))}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.BOrders2}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.BQty2}}</td>
          </tr>
          <tr>
            <td class="text-left fsize12 pb-1 pr-4">{{setTofixed(formatNum(priceRageData.BPrice3))}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.BOrders3}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.BQty3}}</td>
          </tr>
          <tr>
            <td class="text-left fsize12 pb-1 pr-4">{{setTofixed(formatNum(priceRageData.BPrice4))}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.BOrders4}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.BQty4}}</td>
          </tr>
          <tr>
            <td class="text-left fsize12 pb-1 pr-4">{{setTofixed(formatNum(priceRageData.BPrice5))}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.BOrders5}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.BQty5}}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="text-left fsize12 py-1 pr-4">Total</td>
            <td colspan="2" class="text-right fsize12 py-1 pr-2">{{ruppesFormat(formatNum(priceRageData.totalbuyqty))}}</td>
          </tr>
        </tfoot>
      </table>
      <table class="w-50 col-6 pa-0 sellTable wrap">
        <thead>
          <tr>
            <th class="font-weight-normal primaryColor pb-2 pr-4 fsize10 text-left">OFFER</th>
            <th class="font-weight-normal primaryColor pb-2 pr-2 fsize10 text-right">ORDERS</th>
            <th class="font-weight-normal primaryColor pb-2 pr-2 fsize10 text-right">QTY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left fsize12 pb-1 pr-4">{{setTofixed(formatNum(priceRageData.SPrice1))}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.SOrders1}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.SQty1}}</td>
          </tr>
          <tr>
            <td class="text-left fsize12 pb-1 pr-4">{{setTofixed(formatNum(priceRageData.SPrice2))}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.SOrders2}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.SQty2}}</td>
          </tr>
          <tr>
            <td class="text-left fsize12 pb-1 pr-4">{{setTofixed(formatNum(priceRageData.SPrice3))}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.SOrders3}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.SQty3}}</td>
          </tr>
          <tr>
            <td class="text-left fsize12 pb-1 pr-4">{{setTofixed(formatNum(priceRageData.SPrice4))}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.SOrders4}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.SQty4}}</td>
          </tr>
          <tr>
            <td class="text-left fsize12 pb-1 pr-4">{{setTofixed(formatNum(priceRageData.SPrice5))}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.SOrders5}}</td>
            <td class="text-right fsize12 pb-1 pr-2">{{priceRageData.SQty5}}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="text-left fsize12 py-1 pr-4">Total</td>
            <td colspan="2" class="text-right fsize12 py-1 pr-2">{{ruppesFormat(formatNum(priceRageData.totalsellqty))}}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="d-flex w-100 pa-2 fsize12">
      <div class="w-50 pr-2">
        <div class="d-flex justify-space-between">
          <div class="secondaryColor pb-1">Volume</div>
          <div class="primaryColor pb-1">{{ruppesFormat(priceRageData.volume)}}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="secondaryColor pb-1">LTQ</div>
          <div class="primaryColor pb-1">{{priceRageData.lasttradedqty}}</div>
        </div>
        <div class="d-flex justify-space-between"  v-if="priceRageData.Exchg != 'NSE' && priceRageData.Exchg != 'BSE'">
          <div class="secondaryColor pb-1">Expiry</div>
          <div class="primaryColor pb-1">{{scripData['expDt'] && scripData['expDt'] != "NA" ? scripData['expDt'] : 'NA'}}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="secondaryColor pb-1">Lower Circuit</div>
          <div class="primaryColor pb-1">{{formatNum(priceRageData.lowercircuitlimit)}}</div>
        </div>
        <!-- <div class="d-flex justify-space-between">
          <div class="secondaryColor pb-1">LUT</div>
          <div class="primaryColor pb-1">{{priceRageData.lasttradedtime}}</div>
        </div>
        <div class="d-flex justify-space-between" v-if="priceRageData.Exchg != 'NFO'">
          <div class="secondaryColor pb-1">52 Week High</div>
          <div class="primaryColor pb-1">{{priceRageData.yearlyhighprice == '0' ? 'NA' : formatNum(priceRageData.yearlyhighprice)}}</div>
        </div> -->
      </div>
      <div class="w-50">
        <div class="d-flex justify-space-between">
          <div class="secondaryColor pb-1">Avg.Price</div>
          <div class="primaryColor pb-1">{{formatNum(priceRageData.weightedavg)}}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="secondaryColor pb-1">LTT</div>
          <div class="primaryColor pb-1">{{priceRageData.lasttradedtime}}</div>
        </div>
        <div class="d-flex justify-space-between" v-if="priceRageData.Exchg != 'NSE' && priceRageData.Exchg != 'BSE'">
          <div class="secondaryColor pb-1">OI</div>
          <div class="primaryColor pb-1">{{priceRageData.openinterest}}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="secondaryColor pb-1">Upper Circuit</div>
          <div class="primaryColor pb-1">{{formatNum(priceRageData.highercircuitlimit)}}</div>
        </div>
        <!-- <div class="d-flex justify-space-between">
          <div class="secondaryColor pb-1">TTV</div>
          <div class="primaryColor pb-1">{{convertLacs(priceRageData.volume,priceRageData.weightedavg)}}</div>
        </div>
        <div class="d-flex justify-space-between" v-if="priceRageData.Exchg != 'NFO'">
          <div class="secondaryColor pb-1">52 Week Low</div>
          <div class="primaryColor pb-1">{{priceRageData.yearlylowprice == '0' ? 'NA' : formatNum(priceRageData.yearlylowprice)}}</div>
        </div> -->
      </div>
    </div>
  </v-sheet>
</template>

<script>
import { mapState } from "vuex";
import commonFunc from "../mixins/commonFunctions";
export default {
  mixins: [commonFunc],
  computed: {
    ...mapState("marketWatch", ["priceRageData", "securityInfoData"]),
  },
  props:{
    scripData: Object
  },
  methods: {
    setTofixed(val) {
      let exchange = this.priceRageData.Exchg;
      return exchange == "CDS" || exchange == "BCD"
        ? parseFloat(val).toFixed(4)
        : parseFloat(val).toFixed(2);
    },
  },
};
</script>