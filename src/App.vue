<template>
  <v-app v-resize="onMobileSize">
    <router-view />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "App",

  data: () => ({}),
  async created() {
    this.$store.commit('wsConnection/setIsConnect', false)

    var isWebsocketId = JSON.parse(localStorage.getItem('websocketId'))
    var isPrevious = JSON.parse(localStorage.getItem('previousSubscription'))

    !!isWebsocketId && isWebsocketId != "undefined" ? this.$store.commit("authtication/setWebsocketId", isWebsocketId) : '';
    !!isPrevious && isPrevious != "undefined" ? this.$store.commit("wsConnection/setPreviousSubsription", isPrevious) : '';

    var isChartData = JSON.parse(localStorage.getItem('chartData'))
    !!isChartData ? this.$store.commit("setChartData", isChartData) :''
    var isschartScrip = JSON.parse(localStorage.getItem('chartscrip'))
    !!isschartScrip ? this.$store.commit("orderWindow/setChartScripData", isschartScrip) :''
    var isMwData = JSON.parse(localStorage.getItem('mwList'))
    !!isMwData ? this.$store.commit("marketWatch/setMwGroupNames", isMwData) :''
       setInterval(()=>{
      this.$store.commit('setConnectivity')
    }, 100)
  },
  computed:{
    ...mapGetters("header", ['getIndex']),
  },
  methods:{
      onMobileSize(){
            window.innerWidth <=1023 ? this.$store.commit('setMobileView',true) : this.$store.commit('setMobileView',false);
            window.innerWidth > 1439 ? this.$store.commit('setLapView',true) : this.$store.commit('setLapView',false)
            window.innerWidth <=1023 ? this.$store.commit('header/setMenuList',true) : this.$store.commit('header/setMenuList',false)
            this.$store.commit('setWindowInnerHeight',window.innerHeight)
             this.$store.commit('setWindowInnerWidth',window.innerWidth)
            window.innerWidth >=1024 && this.$router.currentRoute.path == "/marketwatch" ? this.$router.push('/home').catch(() => { }) : ''
             this.$store.commit('header/setTabSelection' , this.getIndex)
        }
  },
};
</script>
<style>

.height-250 {
  height: 250px;
  overflow-y: auto;
}
.custom-height .v-application--wrap{
  overflow-y: hidden !important;
}
html {
  overflow-y: auto !important;
}
.orderalign {
  margin-left: auto !important;
}
.blueColor {
  color: #1077bd !important;
}
.bottom-0{
  bottom: 0px !important;
}
.imgLogin {
  width: 70% !important;
  height: 70% !important;
}
.custom-Card {
  border: 1px solid #eee !important;
  box-shadow: 1px 1px 4px #c4c4c4;
  background-color: #fff !important;
}
.secondColor {
  color: #56585a !important;
}
.w-100 {
  width: 100% !important;
}
.w-80{
  width: 80% !important;
}
.w-50 {
  width: 50% !important;
}
.w-25 {
  width: 25% !important;
}
.linkColor {
  cursor: pointer;
  color: #0075e1 !important;
}
@font-face {
  font-family: "Open Sans";
  src: local("Open Sans"),
    url(./assets/Open_Sans/OpenSans-Regular.ttf) format("truetype");
}
*{
   font-family: "Open Sans", sans-serif !important;
 }
/* orders and positions page css*/
.fsize12 {
  font-size: 12px !important;
}
.fsize11 {
  font-size: 11px !important;
}
.fsize9{
  font-size: 9px !important;
}
.fsize8{
  font-size: 8px !important;
}
.fsize14 {
  font-size: 14px !important;
}
.fsize20 {
  font-size: 20px !important;
}
.fsize13{
  font-size: 13px !important;
}
.fsize21{
  font-size: 21px !important;
}
.fsize18{
  font-size: 18px !important;
}
.fsize10{
  font-size: 10px !important;
}
.search-box input::-webkit-input-placeholder {
  color: #0075e1 !important;
}
.search-box input {
  transition-duration: 0.3s;
}
.search-box input:focus {
  width: 200px;
}
.searchwhole {
  margin: 0;
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #a7c4df !important;
  border-radius: 4px;
  transition: width 2s;
  transition-timing-function: cubic-bezier(0.1, 0.7, 1, 0.1);
}
.searchimg {
  height: 16px;
  width: 16px;
  margin-left: 5px;
  margin-bottom: 2px;
}
.placeholdsearch {
  font-size: 13px;
  height: 24px;
  margin-left: 5px;
  width: 100px;
  color: #56585a;
  outline: none;
}
.h-14 {
  height: 18px;
}
.h-86{
  height: 86px;
}
.unActiveColor {
  background-color: #e6e6e6 !important;
  color: #000000;
}
.activeColor {
  background-color: #2196f3 !important;
  color: #ffffff;
}
.v-btn {
  letter-spacing: 0px !important;
}

.l-height-24 {
  line-height: 24px !important;
}
.h-12{
  height: 12px !important;
}

/* settings page css*/

.l-height-28 {
  line-height: 28px !important;
}
.w-296 {
  width: 296px !important;
}
.h-40 {
  height: 40px !important;
}
.h-72 {
  height: 72px !important;
}
.cursor {
  cursor: pointer !important;
}
.border-input {
  border: solid 1px #a8a8a8 !important;
  box-shadow: none !important;
}
.font-weight-600{
  font-weight: 600 !important;
}
.font-weight-bold{
  font-weight: bold !important;
}
.font-weight-400{
  font-weight: 400 !important;
}
.pswborder {
  border: solid 1px #a8a8a8 !important;
}
.max-width-260{
 max-width: 260px;
}
.outlineborder {
  outline: none !important;
  text-indent: 10px;
}
.w-225 {
  width: 225px !important;
}
.fsize28{
  font-size: 28px;
}
.fsize16{
  font-size: 16px;
}
.l-height-32-h-32 {
  line-height: 32px !important;
  height: 32px !important;
}
.bg-red {
  background-color: #f75723 !important;
}
.cardHead {
  background-color: #1f3565 !important;
  color: #ffffff !important;
  height: 50px !important;
}
.cardBody {
  min-height: 170px !important;
}

.letter-space {
  letter-spacing: 0em !important;
}
.w-344 {
  width: 344px !important;
}
.w-300{
  width: 300px !important;
}
.h-170{
  height: 170px !important;
}
.inputWithImg {
  width: calc(100% - 20px);
}
.vh-70 {
  height: 70vh;
}
.outline-none{
  outline:  none !important;
  box-shadow: none !important;
}
.ofy-auto{overflow-y:auto ;}
.width-20{
  width:20% !important
}
.width-52{
  min-width:52% !important
}
.height-104{
  height: 104px !important;
}
.min-width-100{
  min-width: 100px;
}
.min-width-40{
  min-width: 40px;
}
.width-fit-content{
  width: fit-content !important;
}

.pos-reletive {
  position: relative !important;
}
.h-16 {
  height: 16px ;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  position: absolute;
  background-color: #ffffff;
  padding: 0px;
  z-index: 1;
  height: fit-content;
  top: 23px;
  left: -10px;
  min-height: 50px;
  width: 130px;
  margin-top: 8px !important;
  border-radius: 4px;
}
.theme--dark .dropdown-content{
  background-color: #1e1e1e !important;
  color: #eee !important;
}

.dropdown-content li::before {
  /* border-top-width: 7px !important; */
  border-bottom: 7px solid var(--color-border-4); 
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  content: "";
  right: 9px;
  position: absolute;
  top: 2%;
  bottom: -5px;
}
/* Tooltip arrow */
.dropdown-content::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 10%;
  margin-left: -5px;
  border-width: 8px;
  border-style: solid;
  border-color: transparent transparent rgb(219, 219, 219) transparent;
}

/* Links inside the dropdown */
.dropdown-content li {
  color: black;
  padding: 8px 10px;
  text-decoration: none;
  display: block;
  font-size: 12px;
}

/* Change color of dropdown links on hover */
.dropdown-content li:hover {
  background-color: #F1F1F1;
}

.position-absolute{
  position: absolute !important;
}

.right-0{
  right: 0 ;
}
.border-0075e1 {
  border: solid 1px #0075e1 !important;
}
.color-0075e1{
  color: #0075e1 !important;
}
.background-white{
  background-color: #ffffff !important;
}
.width-30{
  width: 30% !important;
}
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg .theme--light.v-btn.v-btn--disabled{
  background-color: #8db5f8 !important;
}
.v-btn.v-btn--disabled.v-btn--has-bg{
  background-color: #8db5f8 !important;
  background: #8db5f8 !important;
}
.v-btn.v-btn--disabled.v-btn--has-bg.sellColor{
  background-color: #ff6c6c !important;
  background: #ff6c6c !important;
}
.hidden-Overflow-y .v-navigation-drawer__content{
  overflow-y:  clip !important;
}
.content-height {
  height: calc(100vh - 56px) !important;
}
/* modify a dropdown list */
.overflowinherit .v-data-table__wrapper {
    overflow: inherit;
}

.list{
  position: absolute;
  margin: 0;
  padding: 0;
  list-style-type: none;
  transform-origin: top;
  transition: transform .2s ease-in-out;
  overflow: hidden;
  z-index: 100;
  /* box-shadow: 0 1px 4px 3px #eee !important; */
   box-shadow: 0 5px 15px 0 rgba(0,0,0,.15) !important;
  /* -webkit-box-shadow: 0 1px 4px 3px #eee !important; */
  border-width: 1px;
  border-radius: 4px;
  box-sizing: border-box;
}
.mkWatchMoreList{
  width: 126px;
}
.expectMkWatchMoreList{
   width: 148px;
}
.list li{
    padding: 10px;
    background-color: #ffffff !important;
    border-bottom: solid thin #eee;
}
.list li:hover{
  background-color: #f0f0f1 !important;
}
.slide-enter{
  transform: scaleY(0);
}
.slide-leave-to{
  transform: scaleY(1);
  transition: transform 0s ease-out !important;
}
.alignDropDown{
  right: 0px;
  margin-top: 2px;
}
.postiveQuantity{
  color: #0075e1;
}
.negativeQuantity{
  color: #ff3b30;
}
.zeroQuantity{
  color: #929292;
}
.qtyInput {
  width: 140px !important;
}
.buyTable td{color: #4184F3;width: 34%;min-width: 50px;}
.sellTable td{color: #ff5722;width: 34%;min-width: 50px;}
.w-150{
width: 150px;
}
.bottom25{
  bottom: 25px !important;
}
.text-decoration-none{
  text-decoration: none !important;
}

/*  */
.hoverbtns {
  position: absolute;
  top: 50%;
  left: 12%;
  width: 64%;
  display: none;
}
.hoverBtnsAnalytic{
  position: absolute;
  top: 22%;
  right: 16px;
}

.hoverBtn {
  background: #ffffff;
  height: 25px;
  width: 35px;
  border: 1px solid #a2a2a2;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

.hoverBtn.buy {
  background: #4184f3;
  border: 1px solid #4184f3;
  color: #ffffff;
}
.hoverBtn.sell {
  background: #f75723;
  border: 1px solid #f75723;
  color: #ffffff;
}
:hover.hoverBtn:not(.buy):not(.sell) {
    background-color: #ccc;
}
.hoverparent:hover .hoverbtns {
  display: block !important;
}
.checkTab .v-tab{
  letter-spacing: 0px !important;
}
.row-disabled {
  background-color: #f5f5f5 !important;
  color: #929292 !important;
}
.theme--dark .row-disabled {
  background-color: #2e2e2e !important;
}
.v-navigation-drawer__content::-webkit-scrollbar {
    width: 5px;
}
.v-navigation-drawer__content::-webkit-scrollbar-thumb {
    --tw-bg-opacity: 2;
    background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
    border-radius: 9999px;
}
.v-navigation-drawer__content::-webkit-scrollbar-track {
    --tw-bg-opacity: 2;
    background-color: rgba(75, 85, 99, var(--tw-bg-opacity));
    --tw-shadow: 0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(216, 213, 213, 0.05);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.scrollModifty::-webkit-scrollbar {
    width: 5px;
}
.scrollModifty::-webkit-scrollbar-thumb {
    --tw-bg-opacity: 2;
    background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
    border-radius: 9999px;
}
.scrollModifty::-webkit-scrollbar-track {
    --tw-bg-opacity: 2;
    background-color: rgba(75, 85, 99, var(--tw-bg-opacity));
    --tw-shadow: 0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(216, 213, 213, 0.05);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

/* input field css */
.input-field {
  border: 1px solid #a2a2a2;
  border-radius: 4px;
  outline: none;
  height: 40px;
  width: 100%;
  padding: 8px 16px;
}
.error-msg {
  color: #ff0000;
  font-size: 12px;
  height: 16px;
  margin-top: 4px
}
.link-btn-apps{
  margin-left: 8px !important;
  border: 1px solid #2196f3  !important;
  font-size: 12px !important;
  color: #2196f3  !important;
}

/* bottom sheet */


.v-bottom-sheet.v-dialog{
  width: inherit;
}


.v-carousel__controls{
  background: none !important;
}

.v-image__image--cover {
    background-size: contain !important;
}
.align-carsoual-image{
    float: right;
    margin-top: 5%;
    margin-right: 15%;
}

.icon-arrow-right:before {
    content: "\e80f";
}

[class*=" icon-"]:before, [class^=icon-]:before {
    font-family: kiteicons;
    font-style: normal;
    font-weight: 400;
    display: inline-block;
    text-decoration: inherit;
    width: 1em;
    margin-right: 0.2em;
    text-align: center;
    font-variant: normal;
    text-transform: none;
    line-height: 1em;
    margin-left: 0.2em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.v-messages {
  min-height: 0px !important;
}
.v-text-field__details{
  min-height: 0px !important;
}
.funds .v-text-field__details{
  min-height: 14px !important;
  margin-bottom: 0px !important;
}
.v-input--selection-controls {
    margin-top: 0px !important; 
     padding-top: 0px !important;
}

.rupee-symbol {
    position: absolute;
    font-size: 18px;
    display: block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
}
.upi-offer {
    color: #fff;
    background: #15bf6a;
    display: inline-block;
    padding: 2px 6px;
    border-radius: 2px;
    font-weight: 800;
    line-height: 22px;
}
.rowHover:hover{
  background-color: #0000000a;
}
</style>
