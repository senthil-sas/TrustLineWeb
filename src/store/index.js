import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { which } from '../../package.json'
import authtication from '../store/modules/authtication'
import marketWatch from '../store/modules/marketWatch'
import settings from '../store/modules/settings'
import funds from '../store/modules/funds'
import apps from '../store/modules/apps'
import position from '../store/modules/positions'
import holdings from '../store/modules/holdings'
import order from './modules/order'
import header from './modules/headers'
import orderWindow from './modules/orderWindow'
import common from './Services/common'
import basket from './modules/basket'




// ws
import wsConnection from './modules/websocket'
import wsConnectionTr from './modules/WebsocketTr'

// images
import errorHandling from './Services/errorHandling'
import zebuFirstPageLogo from '../assets/images/loginLogoNew.png'
let internetCounter = 0

export default new Vuex.Store({
  state: {
    appName: 'TrustLine', 
    buttonThemeColor: "#2196f3",
    loginLogo: zebuFirstPageLogo ,
    projectName: 'TrustLine', 
    projectLink:  'Alice Blue', 
    apiDocumentaionLink: which == 'Live' ? 'https://abtradelite.adityabirlamoney.com/Document/' : 'https://connectuat.adityabirlamoney.com/Document/',
    counter: 0,
    sessionCounter: 0,
    fundsOrHoldingsLoader: false,
    isMobileView: false,
    isLapView: false,
    windowHeight:'',
    windowWidth: '',
    createAccount:'https://kyc.trustline.in/signup/refercode/Z9YjtpwthnE=',
    ssoQuery:'',
    chartFeed:'',
    currentChartData:'',
    upiPaymentUrl: 'https://fund.zebull.in/',
    upDateProfile: 'https://zkyc.zebull.in/zebuetrade/rekyc/diy',
    iconBlackColourCode: '#282828',
    iconLightColourCode: '#BEBEBE',
    amogaColor: '#2297D4',
    iconGrayColor: '#7B7B7B',
    hoverIconColor:'#0075E1',
    hoverIconBlackColor: '#200E32',
    isHaveInternet: false,
    symbolInfo:'',
  },

  mutations: {
    setCounterIncrease(state, data) {
      state.counter = data
    },
    setSessionCounter(state, payload) {
      state.sessionCounter = payload
    },
    setLoader(state , payload) {
      state.fundsOrHoldingsLoader = payload
    },
    setMobileView(state, payload){
      state.isMobileView = payload
    },
    setLapView(state , payload){
      state.isLapView = payload
    },
    setWindowInnerHeight(state,payload) {
      state.windowHeight = payload
    },
    setWindowInnerWidth(state, payload){
      state.windowWidth = payload
    },
    setSsoQuery(state , payload){
      state.ssoQuery = payload
    },
    setChartFeed(state , payload){
      state.chartFeed = payload
    },
    setChartData(state , payload){
      state.currentChartData = payload;
      localStorage.setItem('chartData' , JSON.stringify(payload))
    },
    setConnectivity(state, payload){
      state.isHaveInternet = navigator.onLine 
      if(!navigator.onLine && internetCounter == 0){
        errorHandling.toaster('Please check Your Internat connectivity', "danger", "", 5000)
        internetCounter = 1
      }else if(navigator.onLine){
        internetCounter = 0
      }
    },
    setSymbolInfo(state, payload){
      state.symbolInfo = payload
    }
  },

  modules: {
    authtication, settings, funds, apps, marketWatch, position, holdings, order,header,
    orderWindow, common, wsConnection, wsConnectionTr, basket
  },

  getters:{
    getSsoType: state =>{
      return state.ssoQuery
    },
    getChartfeed: state =>{
      return state.chartFeed
    },
    getChartData: state =>{
      return state.currentChartData
    }
  }

})
