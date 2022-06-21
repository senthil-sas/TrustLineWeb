import axios, { Axios } from "axios"
import store from '@/store'
import Vue from 'vue'


var BASEURL = 'https://a3.aliceblueonline.com/rest/AliceBlueAPIService/'

const searchUrl = `https://a3.aliceblueonline.com/rest/DataApiService/v2/exchange/getScripForSearch`;

var newBrodBaseUrl = 'https://a3.aliceblueonline.com/rest/MarketWatchService/'

const basketUrl = `https://a3.aliceblueonline.com/rest/AliceBlueAdminService/`;

const AXIOS = axios.create({
  baseURL: `${BASEURL}`,
});


const NEWAXIOS = axios.create({
  baseURL: `${newBrodBaseUrl}`,
});

const BASKETAXIOS = axios.create({
  baseURL: `${basketUrl}`,
});

const service = new Vue({

  data: () => ({
    headers: {
      "Content-Type": "application/json",
    },
    webHeaders : {
      'Content-Type' : 'text/plain'
    },
  }),

  methods: {
    getAuthHeaders () {
      let headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + store.state.authtication.userId + " " + store.state.authtication.userSessionId,
      };
      return headers;
    },

    /**
    * User login Service
    * @since 10/04/21
    */
    userLogin: function (jsonObj) {
      return AXIOS.post(`/customer/getUserLoggedInStatus`, jsonObj, {
        headers: this.headers,
      });
    },
    quickLogin: function (jsonObj) {
      return AXIOS.post(`/customer/quickLogin`, jsonObj, {
        headers: this.headers,
      });
    },
    /**
     * Method to check Mpin
     * @since 10/04/21
     */
    userMpin: function (jsonObj) {
      return AXIOS.post(`/sso/verifyMpin`, jsonObj, {
        headers: this.headers,
      });
    },

    /**
     * Method to check Password
     * @since 10/04/21
     */
    userPassword: function (jsonObj) {
      return AXIOS.post(`/customer/getEncryptionKey`, jsonObj, {
        headers: this.headers,
      });
    },

    getOrderInfo: function (jsonObj) {
      return AXIOS.post(`/placeOrder/orderHistory`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    /**
     * Method to check Password Decryption
     * @since 10/04/21
     */
    passwordencrypted: function (jsonObj) {
      return AXIOS.post(`/customer/webLogin`, jsonObj, {
        headers: this.headers,
      });
    },

    /**
     * Method to check Reset Password
     * @since 12/04/21
     */
    userPasswordReset: function (jsonObj) {
      return AXIOS.post(`/customer/changePassword`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    /**
     * Method to Reset Mpin
     * @since 12/04/21
     */
    resetMpin: function (jsonObj) {
      return AXIOS.post(`/customer/updateMpin`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    /**
     * Method to check Security Questions
     * @since 10/04/21
     */
    securityQuestion: function (jsonObj) {
      return AXIOS.post(`/sso/validAnswer`, jsonObj, {
        headers: this.headers,
      });
    },

    /**
     * Method to fetch Market Watch List
     * @since 10/04/21
     */

    fetchMWList: function (jsonObj) {
      return AXIOS.post(`/marketWatch/fetchMWList`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    /**
     * Method to get fetch Market watch scrip list
     * @since 10/04/21
     */

    fetchMWScripList: function (jsonObj) {
      return AXIOS.post(`/marketWatch/fetchMWScrips`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    getSearchScrip: function (jsonObj) {
      return AXIOS.post(searchUrl, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    getPriceRange: function (jsonObj) {
      return AXIOS.post(`/ScripDetails/getPriceRange`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    getSecurityInfoDepthInfo: function (jsonObj) {
      return AXIOS.post(`/ScripDetails/getSecurityInfo`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    addScripToMW: function (jsonObj) {
      return AXIOS.post(`/marketWatch/addScripToMW`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    deleteScripToMW: function (jsonObj) {
      return AXIOS.post(`/marketWatch/deleteMWScrip`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    fetchOrder: function (jsonObj) {
      return AXIOS.post(`/placeOrder/fetchOrderBook`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    getPositionData: function (jsonObj) {
      return AXIOS.post(`/positionAndHoldings/positionBook`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    getPositionAveragePrice (jsonObj) {
      return AXIOS.post(`/avgPrice/getPositionAvgPrice`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    getHoldingData: function (jsonObj) {
      return AXIOS.post(`/positionAndHoldings/holdings`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    getFundsData: function (jsonObj) {
      return AXIOS.post(`/limits/getRmsLimits`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    getAccountDetails: function (jsonObj) {
      return AXIOS.post(`/customer/accountDetails`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    placeOrder: function (jsonObj) {
      return AXIOS.post(`/placeOrder/copyPlaceOrder`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    orderCancel: function (jsonObj) {
      return AXIOS.post(`/placeOrder/cancelOrder`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    getPositionSquareOff: function (jsonObj) {
      return AXIOS.post(`/positionAndHoldings/positionSqrOff`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    convertPosition: function (jsonObj) {
      return AXIOS.post(`/positionAndHoldings/positionConvertion`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    getScripQuoteDetails: function (jsonObj) {
      return AXIOS.post(`/ScripDetails/getScripQuoteDetails`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    logout: function (jsonObj) {
      return AXIOS.post(`/customer/logout`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    executeOrder: function (jsonObj) {
      return AXIOS.post(`/placeOrder/executePlaceOrder`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    modifyOrder: function (jsonObj) {
      return AXIOS.post(`/placeOrder/modifyOrder`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    getIndexDetails: function (jsonObj) {
      return AXIOS.post(`/ScripDetails/getIndexDetails`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    unblock: function (jsonObj) {
      return AXIOS.post(`/customer/unblockUser`, jsonObj, {
        headers: this.headers,
      });
    },

    forgotPass: function (jsonObj) {
      return AXIOS.post(`/customer/forgotPassword`, jsonObj, {
        headers: this.headers,
      });
    },
    payInpayOutConnToken: function (jsonObj) {
      return AXIOS.get(`/pay/getOMSessionToken`, {
        headers: this.getAuthHeaders(),
      });
    },
    payOutWidthdraw: function () {
      return AXIOS.get(`/pay/getOMSessionToken`, {
        headers: this.headers,
      });
    },
    generateAPIKey: function (jsonObj) {
      return AXIOS.post(`/api/generateApiKey`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    getAPIKeyService: function (jsonObj) {
      return AXIOS.post(`/api/getApiKey`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    regenerateAPIKeyService: function (jsonObj) {
      return AXIOS.post(`/api/regenerateApiKey`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    getMarketstatus: function (jsonObj) {
      return AXIOS.post(`/ScripDetails/getMarketStatus`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    getVendor: function (jsonObj) {
      return AXIOS.post(`/api/getVendorList`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    authAccessVendor: function (jsonObj) {
      return AXIOS.post(`/api/authorizeAccessforVendor`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    revokeVendor: function (jsonObj) {
      return AXIOS.post(`/api/revokeAuthorizeAccessforVendor`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    getNewPriceRange: function (jsonObj) {
      return AXIOS.post(`/ScripDetails/getNewPriceRange`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    getMarketMessages: function (jsonObj) {
      return AXIOS.post("/exchange/getExchangeMessage", jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    //reset2FA
    resetTwoFa: function (jsonObj) {
      return AXIOS.post("/customer/reset2fa", jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    fundsData: function (jsonObj) {
      return AXIOS.post("/limits/getRmsLimits", jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    saveTwoFa (jsonObj) {
      return AXIOS.post("/customer/saveAns", jsonObj, {
        headers: this.headers,
      });
    },
    secrityAlertTrade (jsonObj) {
      return AXIOS.post("/more/getSecTradeAlert", jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    cancelCoverOrder (jsonObj) {
      return AXIOS.post("/placeOrder/exitCoverOrder", jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    /**
     * Method to drag and drop list
     * @author Bharath
     * @since 19/07/21
     * @param {*} jsonObj
     */
    sortingMWList (jsonObj) {
      return AXIOS.post(`/marketWatch/sortMWScrip`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    /**
     * Method to exit Braket Order
     * @author Bharath
     * @since 04/08/21
     * @param {*} jsonObj
     */
    exitBoOrder (jsonObj) {
      return AXIOS.post(`/placeOrder/exitBracketOrder`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    /**
     * User login Authorize Service customer
     * @author Bharath
     * @since 11/08/21
     */
    userAuthorize: function (jsonObj) {
      return AXIOS.post(`/sso/authorizeVendor`, jsonObj, {
        headers: this.headers,
      });
    },
    /**
     * get previous day close price
     * @author senthil
     * @since 14/08/21
     */
    getPreviousDayClose (jsonObj) {
      return AXIOS.post(`/analytics/getPreviousDayPrice`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    /**
  * User intial Create mpin
  * @author Bharath
  * @since 11/08/21
  */
    userCreateMpin: function (jsonObj) {
      return AXIOS.post(`/customer/createMpin`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    withDraw: function () {
      return AXIOS.get(`${"backOfficeSso/" + "validateSession?SessionId=" + store.state.authtication.websocketId + "&ClientCode=" + store.state.authtication.userId}`, {
        headers: this.headers
      })
    },
    depositOrWidthdrawl() {
      return AXIOS.get(`/pay/getOMSessionToken`, {
        headers: this.getAuthHeaders(),
      });
    },
    createWsSession (jsonObj) {
      return AXIOS.post(`customer/createWebSocSess`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    inValidateSession (jsonObj) {
      return AXIOS.post(`customer/InvalidateWebSocSess`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    getAuthCode(jsonObj) {
      return AXIOS.post(`/customer/checkVendorAuthorization`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },
    fetchTradeBook(jsonObj) {
      return AXIOS.post(`/placeOrder/fetchTradeBook`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },

    pludgeData(jsonObj) {
      return AXIOS.post(`/cdsl/pledgeData`, jsonObj, {
        headers: this.getAuthHeaders(),
      });
    },





    // ownBrodcast 

    newMwList(jsonObj){
      return NEWAXIOS.post('codifiMW/getMWList', jsonObj, {
        headers: this.headers,
      });
    },

    newGenMwName(jsonObj){
      return NEWAXIOS.post('codifiMW/createMW', jsonObj, {
        headers: this.headers,
      });
    },
    getNewMwScrips(jsonObj){
      return NEWAXIOS.post('codifiMW/getMWScrips', jsonObj, {
        headers: this.headers,
      });
    },

    addNewMwScrip(jsonObj){
      return NEWAXIOS.post('codifiMW/addScripToMW', jsonObj, {
        headers: this.headers,
      });
    },

    deleteMwScrip(jsonObj){
      return NEWAXIOS.post('codifiMW/deleteScripFromMw', jsonObj, {
        headers: this.headers,
      });
    },
    newSortScrip(jsonObj){
      return NEWAXIOS.post('codifiMW/sortMwScrips', jsonObj, {
        headers: this.headers,
      });
    },

    getBankDetails(jsonObj){
      return AXIOS.post('limits/getPayInDetails', jsonObj, {
        headers: this.getAuthHeaders()
      })
    },
    checkMargin(jsonObj){
      return AXIOS.post('placeOrder/checkMargin', jsonObj, {
        headers: this.getAuthHeaders()
      })
    },

    getBasketData (jsonObj) {
      return BASKETAXIOS.post('jsPublisher/getPublisher', jsonObj, {
        headers: this.headers,
})
    },
    makePayment(jsonObj){
      return AXIOS.post('/payment/createPayment', jsonObj, {
        headers: this.getAuthHeaders()
      })
    },
    updateOrSetUPI_ID(jsonObj){
      return AXIOS.post('limits/setUpiId', jsonObj, {
        headers: this.getAuthHeaders()
      })
    },
    verifyPayment(jsonObj) {
      return AXIOS.post('/payment/verifyPayment', jsonObj, {
        headers: this.getAuthHeaders()
      })
    },
    getBalence(json){
      return AXIOS.post('limits/payOutCheckBalance', json, {
        headers: this.getAuthHeaders()
      })
    },
    withDraw(json){
      return AXIOS.post('limits/payOut', json, {
        headers: this.getAuthHeaders()
      })
    },
    checkVendor(jsonObj){
      return AXIOS.post('sso/getAppDetails', jsonObj, {
        headers: this.headers
      })
    }
  },
});

export default service;