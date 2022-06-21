<template>
  <div>
    <div class="px-4 py-2 d-flex align-center">
      <div class="font-weight-bold primaryColor">Holdings</div>
      <v-progress-circular class="ml-2" indeterminate v-if="fundsOrHoldingsLoader" size="18" :width="2" color="blue"></v-progress-circular>
    </div>
    <v-row class="mb-2 mx-0 mt-0 px-4">
      <v-slide-group v-model="infoType" class="pa-0" mandatory hide-arrows>
        <v-slide-item v-for="(item, i) in tabList" :key="i" v-slot="{ active, toggle }">
          <v-btn depressed :color="
              active ? 'activeColor white--text' : 'unActiveColor black--text'
            " height="26" min-width="50" class="fsize12 rounded-sm text-center text-capitalize" :value="item.name" @click="toggle">
            {{ item.name }}
            <span v-if="item.length != 0">&nbsp;({{ item.length }})</span>
          </v-btn>
        </v-slide-item>
      </v-slide-group>

      <v-spacer></v-spacer>

     <span class="float-right d-flex align-center" id="searchBarAndIcons" v-if="holdingList.length > 0 ">
        <span class="search-box mx-2" v-if="!$store.state.isMobileView">
          <span class="searchwhole">
             <customIcon  :name="'search'" class="searchimg" :width="'16'" :height="'16'" :color="$store.state.amogaColor"  />
            <span class="searchinput">
              <input class="placeholdsearch" placeholder="Search" autocorrect="off" v-model="searchHolding" oninput="this.value = this.value.toUpperCase()" />
            </span>
          </span>
        </span>
        <v-btn 
        v-if="getHoldingCount() != holdingList.length"
              height="24"
              min-width="80"
              depressed
              :disabled="cdslLoader"
              :color="$store.state.buttonThemeColor"
              class="fsize14 mr-2 pa-0 text-capitalize white--text" > <span class="d-flex rounded px-1 cursor"  @click="selectedCheckbox = [];$store.dispatch('holdings/callCdsl', holdingList)"> <span><customIcon  :name="'unlock'" class="mx-1 cursor d-flex" :width="'16'" :height="'16'" :color="'#ffffff'"  /></span> <span class="fsize12 mr-1 white--text">Authorisation </span></span></v-btn>
       <span v-if="!$store.state.isMobileView">
        <v-tooltip top color="toolTipColor toolTipTop">
          <template v-slot:activator="{ on, attrs }">
           <span v-bind="attrs" v-on="on" @click="downloadCsv('holdings',holdingList)" >
          <customIcon  :name="'download'" class="mx-1 cursor d-flex" :width="'21'" :height="'21'" :color="$store.state.amogaColor"  />
          </span>
          </template>
          <span>Download</span>
        </v-tooltip>
        </span>
      </span>

    </v-row>
    
    <v-divider class="mx-4 mb-2"></v-divider>
    <!-- v-if="showList.length != 0" -->

    <div v-if="!cdslLoader">
      <v-card class="ma-4 pa-4" v-if="
        (holdingList.length != 0 &&
          this.searchHolding == '' &&
          !this.fundsOrHoldingsLoader && $store.state.isMobileView) ||
        (this.searchHolding !== '' &&
          holdingSearchFilter.length != 0 &&
          !this.fundsOrHoldingsLoader && $store.state.isMobileView)
      ">
      <div class="row ma-0 pa-0 d-flex-align-center">
        <div class="fsize12 col-6 ma-0 pa-0">
          Invested
        </div>
         <div class="fsize12 col-6 ma-0 pa-0">
          Current
        </div>
      </div>
        <div class="row mx-0 mb-2 mt-0 px-0 pb-2 pt-0 d-flex-align-center border-bottom-mwSearch">
        <div class="fsize10 col-6 ma-0 pa-0 primaryColor">
        {{(ruppesFormat((totalInvestment).toFixed(2)))}}
        </div>
         <div class="fsize10 col-6 ma-0 pa-0 primaryColor">
          {{ruppesFormat((totalcurrentValue).toFixed(2)) }}
        </div>
      </div>
         <div class="row ma-0 pa-0 d-flex-align-center">
        <div class="fsize12 col-6 ma-0 pa-0">
          P&L
        </div>
         <div class="fsize12 col-6 ma-0 pa-0">
          Today's P&L
        </div>
      </div>
        <div class="row ma-0 pa-0 d-flex-align-center">
        <div class="fsize10 col-6 ma-0 pa-0">
           <div class=" mb-1" :class="totalPnl >= 0 ? 'positiveColor' : 'negativeColor'">{{ruppesFormat(totalPnl.toFixed(2))}} <span class="ml-2" :class="totalPnlChange >= 0 ? 'positiveColor' : 'negativeColor'">({{totalPnlChange.toFixed(2)}}%)</span></div>
        </div>
         <div class="fsize10 col-6 ma-0 pa-0 primaryColor">
         <div class=" mb-1" :class="daysPnl >= 0 ? 'positiveColor' : 'negativeColor'">{{ruppesFormat(daysPnl.toFixed(2))}}<span class="ml-2" :class="totalPnlChange >= 0 ? 'positiveColor' : 'negativeColor'">({{daysPnlChange.toFixed(2)}}%)</span></div>
        </div>
      </div>
      </v-card>
    <v-card class="ma-4" v-if="
        (holdingList.length != 0 &&
          this.searchHolding == '' &&
          !this.fundsOrHoldingsLoader) ||
        (this.searchHolding !== '' &&
          holdingSearchFilter.length != 0 &&
          !this.fundsOrHoldingsLoader)
      ">
      <v-simple-table id="tableData" class="border-bottom-light primaryColor overflow-y-auto" :fixed-header="true" height="auto" :class="{ overflowinherit: isDropped }" v-if="!$store.state.isMobileView">
        <thead>
          <tr class="fixed-header tableRow">
            <th class="text-left fsize1 tableHeader">Instrument</th>
            <th class="text-right tableHeader">Qty.</th>
            <th class="text-right tableHeader">Buy Avg.</th>
            <th class="text-right tableHeader">LTP</th>
            <th class="text-right tableHeader">Buy Value</th>
            <th class="text-right tableHeader">P&L</th>
            <th class="text-right tableHeader">Net chg.</th>
          </tr>
        </thead>
        <tbody class="primaryColor" @mouseleave="
            currentIndex = -1;
            isDropped = false;
          ">
          <tr v-for="(item, index) in this.searchHolding == ''
              ? holdingList
              : holdingSearchFilter" :key="index" class="hoverParent tableRow" @mouseenter="
              isDropped = false;
              currentIndex = index;
            ">
            <td class="text-left px-4 py-2 pos-reletive tableContent">
              {{ item.ExchSeg1 == "NSE" && item.Nsetsym != "0"
                  ? item.Nsetsym
                  : item.Bsetsym }}
              <div class="dropdown position-absolute right-0" v-if="currentIndex == index">
                <v-tooltip top color="toolTipColor toolTipTop">
                  <template v-slot:activator="{ on, attrs }">

                    <v-btn id="moreOrderBtn" @mouseover="getWindowHeight()" @click="isDropped = !isDropped" min-width="50" max-width="50" height="23" outlined depressed v-bind="attrs" v-on="on" class="
                    d-flex align-center justify-center
                    pos-reletive fsize12 text-capitalize  border-0075e1
                    color-0075e1
                    rounded-sm
                    background-white">More
                    </v-btn>
                  </template>
                  <span>Options</span>
                </v-tooltip>

                <transition name="slide">
                  <ul v-if="currentIndex == index && isDropped" :class="isRotate ? 'bottom25' : ''" class="pa-0 list expectMkWatchMoreList">
                    <li  @click="
                        isDropped = false;
                        callOrderWindow('sell', item);
                      " class="primaryColor fsize12 cursor">
                      Exit
                    </li>
                    <li @click="
                        isDropped = false;
                        callOrderWindow('buy', item);
                      " class="primaryColor fsize12 cursor">
                      Add
                    </li>
                     <li @click="
                        isDropped = false;
                        callTrandingViewChart(item, 'holdings');
                      " class="primaryColor fsize12 cursor">
                      Chart
                    </li>
                  </ul>
                </transition>
              </div>
            </td>
            <td class="text-right px-4 py-2 tableContent">
              <span v-if="parseInt(item.Btst) != 0">
                <span v-if="parseInt(item.SellableQty) != 0">{{ item.SellableQty }} &nbsp;</span>( T1: {{ item.Btst }} )</span>
              <span v-if="parseInt(item.Btst) == 0">{{ item.SellableQty }}</span>
            </td>
            <td class="text-right px-4 py-2 tableContent">{{ item["Price"] }}</td>
            <td class="text-right px-4 py-2 tableContent">
              {{  item.ExchSeg1 == "NSE" && item.Nsetsym != "0" ? item.LTnse : item.LTbse }}
            </td>
            <td class="text-right px-4 py-2 tableContent">
              {{ item.buyValue }}
            </td>
            <td class="text-right px-4 py-2 tableContent" :class="parseFloat(item.pnl) >= 0 ? 'positiveColor' : 'negativeColor'">
              {{ ruppesFormat(item.pnl) }}
            </td>
            <td class="text-right px-4 py-2 tableContent" :class="parseFloat(item.perChg) >= 0 ? 'positiveColor' : 'negativeColor'">
              {{ item.perChg }}%
            </td>
          </tr>
        </tbody>
          <tfoot>

          <tr class="">
            <td colspan='7'>
               <v-row class="ma-0 pa-6 w-100">
                 <v-col class="pa-0 ">
                   <div class="secondaryColor fsize12 mb-1">Total Investment</div>
                   <div class="fsize20 primaryColor">{{(ruppesFormat((totalInvestment).toFixed(2)))}}</div>
                 </v-col>
                 <v-col class="pa-0 ">
                   <div class="secondaryColor fsize12 mb-1">Current value</div>
                   <div class="fsize20">{{ruppesFormat((totalcurrentValue).toFixed(2)) }}</div>
                 </v-col>
                 <v-col class="pa-0 ">
                   <div class="secondaryColor fsize12 mb-1">Day's P&L</div>
                   <div class="fsize20 mb-1" :class="daysPnl >= 0 ? 'positiveColor' : 'negativeColor'">{{ruppesFormat(daysPnl.toFixed(2))}}</div>
                   <div class="fsize14" :class="daysPnlChange >= 0 ? 'positiveColor' : 'negativeColor'">( {{daysPnlChange.toFixed(2)}}%)</div>
                 </v-col>
                 <v-col class="pa-0 ">
                   <div class="secondaryColor fsize12 mb-1">Total P&L</div>
                   <div class="fsize20 mb-1" :class="totalPnl >= 0 ? 'positiveColor' : 'negativeColor'">{{ruppesFormat(totalPnl.toFixed(2))}}</div>
                   <div class="fsize14" :class="totalPnlChange >= 0 ? 'positiveColor' : 'negativeColor'">({{totalPnlChange.toFixed(2)}}%)</div>
                 </v-col>
               </v-row>
            </td>
          </tr>
        </tfoot>
      </v-simple-table>


      <div v-if="$store.state.isMobileView">
        <div class="row ma-0 px-3 py-2 border-bottom-mwSearch"  v-for="(item, index) in this.searchHolding == ''
              ? holdingList
              : holdingSearchFilter" :key="index" @click="callBottomSheet(item)">
              <div class="row pa-0 ma-0 d-flex align-center justify-space-between w-100">
                <div class="fsize12">Qty. <span v-if="parseInt(item.Btst) != 0">
                <span v-if="parseInt(item.SellableQty) != 0">{{ item.SellableQty }} &nbsp;</span>( T1: {{ item.Btst }} )</span>
              <span v-if="parseInt(item.Btst) == 0">{{ item.SellableQty }}</span>| Avg. {{item["Price"]}}</div>
              <div class="fsize12" :class="parseFloat(item.perChg) >= 0 ? 'positiveColor' : 'negativeColor'">
              {{ item.perChg }} %</div>
              </div>
              <div class="row my-2 mx-0 pa-0 d-flex align-center justify-space-between w-100">  
                 <div class="fsize14">
              {{
                 item.ExchSeg1 == "NSE" && item.Nsetsym != "0" ? item.Nsetsym : item.Bsetsym
              }} <span class="ml-1 fsize10 secondaryColor">{{  item.ExchSeg1 == "NSE" && item.Nsetsym != "0" ? item.ExchSeg1 : item.ExchSeg2}}</span>
            </div> 
            <div
              class="fsize12"
              :class="parseFloat(item.pnl) >= 0 ? 'positiveColor' : 'negativeColor'"
            >
              {{ ruppesFormat(item.pnl) }}
            </div>
            </div>
             <div class="row pa-0 ma-0 d-flex align-center justify-space-between w-100">
                <div class="fsize12">Invested {{item["buyValue"]}}</div>
              <div class="fsize12" >
              LTP {{  item.ExchSeg1 == "NSE" && item.Nsetsym != "0" ? item.LTnse : item.LTbse }}</div>
              </div>
        </div>
      </div>
    </v-card>
  </div>
  <div class="row ma-0 pa-0 d-flex align-center justify-center" style="height: calc(100vh - 60px) !important" v-if="cdslLoader">
    <v-progress-circular class="ml-2" indeterminate v-if="cdslLoader" size="22" :width="2" color="blue"></v-progress-circular>
  </div>
    <div class="d-flex flex-column justify-center align-center vh-70" v-if="
        (!!holdingList &&
          holdingList.length == 0 &&
          this.searchHolding == '' &&
          !this.fundsOrHoldingsLoader) ||
        (!!holdingList &&
          holdingSearchFilter.length == 0 &&
          this.searchHolding !== '' &&
          !this.fundsOrHoldingsLoader)
      ">
      <div>
        <img src="../assets/images/noData.svg" alt="" class="w-300 h-170 mb-4" />
      </div>
      <div>NO HOLDINGS FOUND</div>
    </div>
    <bottomsheet :currentData="currentSheetData" v-on:from-child ="getChildData"/>

    <v-dialog
      v-model="cdslDialog"
      scrollable
      width="600px"
      max-width="600px"
    >
      <v-card class="pr-4 ">
        <v-card-title> 
          <div class="row ma-0 pa-0 ">
            <v-flex xs12 sm12 md5 lg5 xl5 class="pa-0">
              <img src="../assets/images/cdsl.svg" alt=""> </v-flex>
             <v-flex xs12 sm12 md7 lg7 xl7 class="pa-0">
              <div class="fsize14">e-DIS Transaction Verification</div>
<div class="fsize14">Convenient. Dependable. Secure</div>
              </v-flex>
          </div></v-card-title>
        <v-card-text style="height: 250px;" class="scrollModifty">
          <div class="row rounded px-4 py-2" style="background-color: #e8f4fd;" :class="$store.state.windowWidth < 375 ? 'flex-column': 'flex-row'">
 <v-flex xs1 sm1 md1 lg1 xl1 class="pa-0 mt-2">
 <customIcon  :name="'info'" class="mx-1 cursor" :width="'21'" :height="'21'" :color="$store.state.amogaColor"  />
 </v-flex>
  <v-flex xs11 sm11 md11 lg11 xl11 class="pa-0 mt-2">
 <div>
              Disclaimer: This is electronic trade slip, which allows us to debit your Demat Holding with stocks approved by you. Through this authorization, you will be able to sell the stocks for delivery. The authorization is valid for one day only. At any point of time you can generate or reset your TPIN using the CDSL link 
              <div>
               <a href=" https://edis.cdslindia.com/home/generatepin" target="_blank" class="text-decoration-none"> https://edis.cdslindia.com/home/generatepin</a> where it will ask for your BOID and PAN. The user can always regenerate the TPIN using the above CDSL link. To change TPIN use the link 
              </div>
              <div>
                <a href="https://edis.cdslindia.com/home/changepin" target="_blank" class="text-decoration-none">https://edis.cdslindia.com/home/changepin</a>
              </div>

            </div>
 </v-flex>
          </div>
         <div class="d-flex align-center justify-space-between my-4 " v-if="pludgeUrl == ''">
          <div class="primaryColor">Select Instruments</div>
          <div class="primaryColor">Qty</div>
              </div>
        </v-card-text>
        <v-card-actions class="pr-0">
         <div class="d-flex align-center justify-end w-100 ">
           <form :action="pludgeUrl" name="frmDIS" id="contact-form" method="post" v-if="pludgeDpId">
    <input type="hidden" id="DPId" name="DPId" :value="pludgeDpId" />
    <input type="hidden" id="ReqId" name="ReqId" :value="pludgeReqId" />
    <input type="hidden" id="Version" name="Version" :value="pludgeVersion" />
    <input type="hidden" id="TransDtls" name="TransDtls" :value="pludgeTransId" />
     <v-btn type="submit"
              height="32"
              min-width="80"
              depressed
              :color="$store.state.buttonThemeColor"
              class="fsize14 mr-2 text-capitalize white--text" 
              >Continue to CDSL</v-btn
            >
  </form>
           <v-btn
              outlined
              height="32"
              min-width="80"
              color="#9b9b9b"
              depressed
              class="fsize14 text-capitalize secondaryColor"
              @click="cdslDialog = false"
            >
              Close
            </v-btn>
        </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import commonFunc from "../mixins/commonFunctions";
import window from "../mixins/orderWindow";
import bottomsheet from '../components/bottomSheet.vue'
import customIcon from '../components/customIcon.vue'
import errorHandling from '../store/Services/errorHandling'
export default {
  mixins: [commonFunc,window],
  data: () => ({
    searchHolding: "",
    infoType: "Stocks",
    isDropped: false,
    currentIndex: -1,
    isRotate: true,
    currentSheetData: [],
    selectedCheckbox: [],
  }),
  components:{
    bottomsheet,
    customIcon,
  },
  methods: {
    passToaster(){
      errorHandling.toaster('', 'danger', 'Please select any one Instruments', 3000)
    },
    pushOrPopData(item){
      
      if(this.selectedCheckbox.length > 0){
        const index = this.selectedCheckbox.indexOf(item)
        index == -1 ? this.selectedCheckbox.push(item) : index > 0 ? this.selectedCheckbox.splice(index) : this.selectedCheckbox.pop(item)
      }
      if(this.selectedCheckbox.length == 0){
        this.selectedCheckbox.push(item)
      }
    },
      getChildData(data){
      if(data['page'] == 'Holdings'){
        if(data['action'] == 'Add' || data['action'] == 'Exit'){
          this.callOrderWindow(data['action'] == 'Add' ? 'buy' : 'sell', data.item )
        } if(data['action'] == 'chart'){
          this.callTrandingViewChart(data.item, 'holdings')
        }
      }
    },
    callBottomSheet(val){
         this.currentSheetData = []
      var tempData = {
        where: 'Holdings',
        isOpen: true,
        item: val,
      }
      this.currentSheetData.push(tempData)
    },
    getWindowHeight(){
      var offsetHeight = this.$store.state.windowHeight - document.getElementById("moreOrderBtn").getBoundingClientRect().top
      var dropdownHeight = 100;
      offsetHeight < dropdownHeight ? this.isRotate = true : this.isRotate = false
    },
    // call order window
    async callOrderWindow(orderType, value) {
      if(orderType == "buy"){
          this.callWindow(orderType, value)
      }else{
        if(value.authFlag) {
          this.callWindow(orderType, value)
        }else{
          this.$store.dispatch('holdings/callCdsl', this.holdingList)
        }
      }
    },
     async callWindow(orderType, value){
        this.$store.commit("orderWindow/setWindowLoading",true)
          this.$store.commit("orderWindow/setCurrentOrder", {
            data: value,
            page: "holdings",
          });
          this.$store.dispatch("orderWindow/setInitialValues", {
            data: value,
            page: "holdings",
          });
          this.$store.commit("orderWindow/setOrderWindow", orderType);
          this.$store.commit("orderWindow/setOrderType", orderType);
          this.$store.dispatch('orderWindow/getNewPriceRange')
          await this.$store.dispatch("orderWindow/getScripQuoteDetails", value);
          this.changeOrderTab();
      },
    getHoldingCount(){
      var count = 0;
      this.holdingList.forEach(el => {
        el.authFlag ? count++ : ''
      })
      return count
    }
  },
  computed: {
    ...mapState("holdings", [
      "holdingList",
      "tabList",
      "totalInvestment",
      "totalcurrentValue",
      "totalPnl",
      "totalPnlChange",
      "daysPnl",
      "daysPnlChange",
      "cdslLoader",
      "pludgeTransId",
      "pludgeDpId",
      "pludgeReqId",
      "pludgeVersion",
      "pludgeUrl"
    ]),
    ...mapState(["fundsOrHoldingsLoader"]),
    holdingSearchFilter() {
      return this.holdingList.filter((post) => {
        return post.Nsetsym.toLowerCase().includes(
          this.searchHolding.toLowerCase()
        ) || post.Bsetsym.toLowerCase().includes(
          this.searchHolding.toLowerCase()
        )
      });
    },
cdslDialog: {
      get: function () {
        return this.$store.state.holdings.cdslDialog;
      },
      set: function (newValue) {
        this.$store.commit("holdings/setCdslDialog", newValue);
      },
    },

    checkboxSelectAll: {
      get: function () {
        var _checked = [];
        this.holdingList.forEach((item) => {
           !item.authFlag ?  _checked.push(item) : ''
        });
        return this.holdingList && _checked.length > 0
          ? this.selectedCheckbox.length == _checked.length
          : false;
      },
      set: function (value) {
        var checked = [];
        if (value) {
          this.holdingList.forEach((item) => {
            !item.authFlag ?  checked.push(item) : ''
          });
        }
        this.selectedCheckbox = checked;
      },
    },
  },
   created() {
     this.$store.dispatch("holdings/getHoldings");
  },
};
</script>