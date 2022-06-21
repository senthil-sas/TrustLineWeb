<template>
  <v-card tile :width="!$store.state.isMobileView && !$store.state.isLapView ? '400' : !$store.state.isMobileView && $store.state.isLapView ? '450' : '100%'" class="mkWatch" right absolute @mouseleave="
      currentIndex = -1;isDropped = false;">
    <div class="d-flex align-center border-bottom-mwSearch">
      <customIcon  :name="'search'" class="mt-1 pl-2" :width="'16'" :height="'16'" :color="$store.state.amogaColor"  /> 
      <v-text-field height="40" class="fsize13" v-model="search" hide-no-data hide-details solo tile flat dense open-on-clear label="Search" @input="search ? search = search.toString().toUpperCase() : ''" @keyup.esc="onClickOutside"></v-text-field>
      <span v-if="search.length > 0" @click="search = ''" class="cursor"> <customIcon  :name="'close'" class="mt-2 pr-2" :width="'20'" :height="'20'" :color="$store.state.amogaColor"  />  </span>
      <span v-if="!loading" class="secondaryColor fsize14 pr-4">{{ mwList.length }}/25</span>
    </div>
    <div class="height-2">
      <v-progress-linear :active="loading" :indeterminate="loading" rounded-lg height="2" color="blue"></v-progress-linear>
    </div>

    <!-- search list dropdown in mkWatch -->
    <v-sheet transition="fade-transition" tile class="searchContent" v-click-outside="onClickOutside">
      <ul class="pl-0">
        <li class=" searchlist px-2 py-3 body-2  border-bottom-light d-flex align-center " v-for="(item, index) in searchList" :key="index">
          <span @click="addorDeleteScrip(item, item.checked ? 'del' : 'add')" class="mr-5">
            <a>
              <customIcon :name="item.checked ? 'checked-outline' : 'check-outline'" :width="'24'" :height="'24'" :color="item.checked ? $store.state.amogaColor :'#757575'"/>
            </a></span>
          <!-- <v-checkbox  v-model="item.checked" class="ma-0 v-midlle" hide-details></v-checkbox> -->
          <a @click="addorDeleteScrip(item,'add', true)" class="fsize14 searchScrip">{{
             item.exch == 'NSE' || item.exch == 'BSE' ? item.symbol : item.formattedInsName }}
              <div class="fsize11 secondaryColor" v-if="item.exch == 'NSE' || item.exch == 'BSE'"> {{item.formattedInsName}}</div></a>
          <v-spacer></v-spacer>
          <button class="fsize10 pa-0 rounded min-width-40" :class="
              item.exch == 'NSE'
                ? 'buycolor'
                : item.exch == 'BSE'
                ? 'sellcolor'
                : item.exch == 'NFO'
                ? 'cancelled-msg'
                : 'cancelled-msg'
            " depressed min-width="36" max-width="36" height="26">
            {{ item.exch }} 
          </button>
        </li>
      </ul>
    </v-sheet>

    <div class="scrollContents" v-if="!nodata">
      <v-expansion-panels transition="fade-transition" :readonly="true" v-model="depthExpand" flat tile accordion>
        <draggable class="w-100" @start="drag = true" :list="mwList" @end="drag = false;sortList;">
          <v-expansion-panel tile class="ma-0 hoverparent" v-for="(item, index) in mwList" :key="index">
            <v-expansion-panel-header hide-actions @mouseenter="; 
                isDropped = false;
                currentIndex = index;" @click="$store.state.isMobileView ? callBottomSheet(item) : '' ">
              <div class="d-flex justify-space-between align-center pb-2" :data-font-size="tableFontSize">
                <span class="primaryColor">{{
                    item.scripName
                  }}</span><span :class="
                      parseFloat(item.PerChange) >= 0
                        ? 'positiveColor'
                        : 'negativeColor'
                    ">{{ item.ex == 'CDS' || item.ex == 'BCD' ? parseFloat(item.ltp).toFixed(4) : parseFloat(item.ltp).toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-space-between align-center primaryColor" :sub-data-font-size="tableFontSize">
                <span class="secondaryColor d-flex align-center">{{ item.ex }} <span class="ml-1 mt-1" v-if="item.holFlag == 1"> <customIcon :name="'holdings'" :width="'12'" :height="'12'" :color="$store.state.iconBlackColourCode" />  </span></span><span :class="
                      parseFloat(item.PerChange) >= 0
                        ? 'positiveColor'
                        : 'negativeColor'
                    ">{{ parseFloat(item.Change).toFixed(2) }}
                  <span>({{ item.PerChange }}%)</span></span>
              </div>
              <div class="hoverbtns" v-if="currentIndex == index && !$store.state.isMobileView">
                <div class=" d-flex justify-end" >
                <div class="d-flex align-center  absolute">
                  <v-tooltip top color="toolTipColor toolTipTop">
                    <template v-slot:activator="{ on, attrs }">
                      <label class="hoverBtn mr-2 buy" v-if="item.insType.toLowerCase() != 'index'" @click="callOrderWindow('buy', item)" v-bind="attrs" v-on="on">B</label>
                    </template>
                    <span>Buy</span>
                  </v-tooltip>

                  <v-tooltip top color="toolTipColor toolTipTop">
                    <template v-slot:activator="{ on, attrs }">
                      <label class="hoverBtn mr-2 sell" v-if="item.insType.toLowerCase() != 'index'" @click="callOrderWindow('sell', item)" v-bind="attrs" v-on="on">S</label>
                    </template>
                    <span>Sell</span>
                  </v-tooltip>

                  <v-tooltip top color="toolTipColor toolTipTop">
                    <template v-slot:activator="{ on, attrs }">
                       <label  class="hoverBtn mr-2" v-bind="attrs" v-on="on" @click="callTrandingViewChart(item, 'mkWatch')">
                      <customIcon class="hoverImg d-flex align-center"  :name="'chart'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
                       </label>
                    </template>
                    <span>Chart</span>
                  </v-tooltip>

                  <v-tooltip top color="toolTipColor toolTipTop">
                    <template v-slot:activator="{ on, attrs }">
                     <label  class="hoverBtn mr-2" v-bind="attrs" v-on="on" @click="openPanel(index, item)" v-if="item.insType.toLowerCase() != 'index'">
                      <customIcon  class="hoverImg d-flex align-center"   :name="'depth'" :width="'20'" :height="'20'" :color="$store.state.iconBlackColourCode" /></label>
                    </template>
                    <span>Market Depth</span>
                  </v-tooltip>

                  <v-tooltip top color="toolTipColor toolTipTop">
                    <template v-slot:activator="{ on, attrs }">
                       <label  class="hoverBtn mr-2 " v-bind="attrs" v-on="on" @click="addorDeleteScrip(item, 'del')">
                      <customIcon  class="hoverImg d-flex align-center"   :name="'delete'" :width="'20'" :height="'20'" :color="$store.state.iconBlackColourCode" /></label>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>

                  <div>
                    <v-tooltip top color="toolTipColor toolTipTop">
                      <template v-slot:activator="{ on, attrs }">
                         <v-btn @mouseover="getWindowHeight()" id="moreBtn" v-if="currentIndex == index && item.insType.toLowerCase() != 'index'" @click="isDropped = !isDropped" min-width="30" max-width="35" height="25" outlined color="grey" depressed v-bind="attrs" v-on="on" class="hoverBtn d-flex align-center mr-2 text-capitalize fsize12">
                         <customIcon class="d-flex align-center"  :name="'more'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
                        </v-btn>
                      </template>
                      <span>More</span>
                    </v-tooltip>

                    <transition name="slide">
                      <ul :class="isRotate ? 'bottom25' : ''" v-if="currentIndex == index && isDropped" class="pa-0 list mkWatchMoreList alignDropDown">
                        <li @click="
                              callalertDialog(item);
                              isDropped = false;
                            " class="primaryColor fsize12 cursor">
                          Alert
                        </li>
                        <li @click="
                              isDropped = false;
                              getInfo(item);
                            " class="primaryColor fsize12 cursor">
                          Info
                        </li>
                        <!-- <li v-if="item.Exchange == 'NFO'" @click="
                              isDropped = false;
                              $store.dispatch('authtication/generateAuthCode',{url:'option/optionchain/0',symbol:item.symbolname});
                            " class="primaryColor fsize12 cursor">
                          Option Chain
                        </li> -->
                      </ul>
                    </transition>
                  </div>
                </div>
              </div>
              </div>

            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <!-- market depth -->
              <v-sheet class="mkdepth">
                <div class="depthLoaderCard" v-if="depthLoader">
                  <v-progress-circular indeterminate size="28" :width="2" color="blue"></v-progress-circular>
                </div>
                <div v-else>
                  <mkDepth :scripData="item"/>
                </div>
              </v-sheet>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </draggable>
      </v-expansion-panels>
    </div>

    <!-- No data Part -->
    <div class="scrollContents d-flex flex-column align-center justify-center" v-if="nodata && !loading">
      <img width="50%" src="../assets/images/noData.svg" alt="noDataImg" class="mb-2" />
      NO DATA FOUND
    </div>

    <!-- Footer Tabs -->
    <div class="border-top">
      <div class="footerTab border-top-midDark w-100">
        <v-bottom-navigation class="justify-start" height="40" min-width="auto" max-width="auto" :value="value" absolute mandatory tile color="primary white">
          <v-btn class="font-weight-bold border-right-dark" @change="changeTab(index)" active-class="activeMkBtn" max-width="60" min-width="48" height="40" v-for="(item, index) in 5" :key="index">
            {{ item }}
          </v-btn>
        </v-bottom-navigation>
        <v-menu transition="scroll-y-reverse-transition" left top :offset-y="true" min-width="100" :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn :ripple="false" v-bind="attrs" v-on="on" tile depressed active-class="activeMkBtn" class="float-right settingsIcon" max-width="60" min-width="48" height="40">
              <customIcon :name="'settings'" :width="'18'" :height="'18'" :color="$store.state.iconBlackColourCode" />
            </v-btn>
          </template>
          <v-card class="pa-2 d-flex flex-column" height="150">
            <label class="fsize12 primaryColor mb-1">Font Resize</label>
            <v-btn-toggle color="blue accent-4" class="mb-2 font-weight-bold" v-model="toggleBtns" mandatory dense>
              <v-btn class="fsize12" v-for="(item, index) in settingsList" :key="index" @click="fontResizer(item)">{{ item }}</v-btn>
            </v-btn-toggle>
            <span class="fsize12 primaryColor mb-1">Sort by</span>
            <v-btn-toggle color="blue accent-4" class="font-weight-bold" v-model="filterToggle" dense>
              <v-btn class="fsize12" v-for="(item, index) in filterList" :key="index" @click="sortedArray(item.toLowerCase())">{{ item }}</v-btn>
            </v-btn-toggle>
          </v-card>
        </v-menu>
      </div>
    </div>

    <!-- Alert dialog -->

    <v-dialog v-model="alertDialog" width="500px">
      <v-expand-transition>
        <v-card class="pa-0">
          <div class="border-bottom-dark fsize16 font-weight-bold px-4 pt-4 pb-2">
            Security Trade Alert
          </div>
          <div class="px-3 pb-4">
            <div class="py-3">
              <div class="pb-2 d-flex justify-space-between">
                <div>
                  <span class="fsize13 primaryColor">
                    {{
                      alertData.cName
                    }}
                  </span>
                  <span class="fsize9 secondColor ml-3">
                    {{ alertData.Exchange }}
                  </span>
                </div>
                <div class="fsize13 primaryColor">{{ alertData.ltp }}</div>
              </div>

              <div>
                <div @keypress.enter="alertSubscribe()">
                  <v-text-field type="number" v-model.number="alertPrice" label="Alert me when price reaches..." @keypress="keyPressAlphaNumeric($event)" min="0" outlined hide-details :required="false" dense class="mt-2 fsize13"></v-text-field>
                  <div class="red--text fsize12 mt-2 ml-2 h-16">
                    <span v-if="alertPrice == '' && submitted">Please Enter Price</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-right">
              <v-btn height="32" min-width="80" depressed :loading="alertLoader" :disabled="alertLoader" :color="$store.state.buttonThemeColor" class="fsize14 text-capitalize white--text" @click="alertSubscribe()">Submit</v-btn>
              <v-btn height="32" min-width="80" depressed class="ml-2 fsize14 text-capitalize" outlined @click="$store.commit('marketWatch/setAlertDialog', false)">
                Cancel
              </v-btn>

            </div>
          </div>
        </v-card>
      </v-expand-transition>
    </v-dialog>

    <!-- info dialog -->

    <v-dialog v-model="infoDialog" width="650px" :transition="$store.state.appName == 'Zebull' ? 'slide-x-reverse-transition' : 'slide-x-transition'">
      <v-card class="pa-5">
        <div class="d-flex align-baseline py-3">
          <div class="mx-2 fsize14">
            {{ this.currentInfoData.cName }}
          </div>
          <div class="fsize9">{{ this.currentInfoData["ex"] }}</div>
          <div class="mt-1 fsize14 primaryColor orderalign">
            Price Range : {{ this.securityInfoData.LCircuitLimit }} -
            {{ this.securityInfoData.HCircuitLimit }}
          </div>
        </div>
        <v-divider class="mx-2 mb-2"></v-divider>
        <div class="">
          <div class="py-2">
            <div class="row ma-0">
              <div class="col-6 py-4 px-4">
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Expiry</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{
                      securityInfoData.ExpiryDte != null
                        ? securityInfoData.ExpiryDte.split("-")[0]
                        : securityInfoData.ExpiryDte
                    }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Spot Price</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.currentInfoData["spotprice"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Tick Size</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.securityInfoData["TickSize"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Min Lot</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.securityInfoData["Blq"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">
                    Last Trading Date
                  </div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.securityInfoData["LastTradingDate"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Start Date</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.securityInfoData["IsuStartDate"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Open Interest</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.securityInfoData["openinterest"] }}
                  </div>
                </div>
              </div>
              <v-divider vertical></v-divider>

              <div class="col-6 py-4 px-4">
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Price Quatation</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.securityInfoData["PriceQuatation"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">
                    Max Quantity (in Lots)
                  </div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.securityInfoData["MaxOrderSize"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Time</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.securityInfoData["LTT"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Exchange time</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.securityInfoData["LTT"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">End Date</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.securityInfoData["PriceQuatation"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">
                    Total Trade Volume
                  </div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.currentInfoData["TradeVolume"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Market Type</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.securityInfoData["MarketType"] }}
                  </div>
                </div>
              </div>
              <div class="row pt-4 ma-0 d-flex justify-end">
                <v-btn depressed outlined class="  fsize14 text-capitalize" width="60px" height="32px" @click="infoDialog = false">Close</v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- authorization Dialog  -->
    <v-dialog v-model="authDialog" width="344px" transition="slide-y-transition">
      <v-card class="pa-6">
        <div class="Img-div text-center rounded">
           <customIcon :name="'loginlogo'" :width="'72'" :height="'40'" :color="$store.state.amogaColor" />
        </div>
        <div class="
                  fsize20
                  primaryColor
                  font-weight-regular
                  mb-2
                  text-center
                ">
          Authorize {{ $store.state.projectName }}
        </div>
        <div class="text-center fsize14 text-center">
          Permission required by the app
        </div>
        <ul class="fsize14 ml-4 pt-4 mb-8 primaryColor">
          <li>Access holding and positions portfolio</li>
          <li>Place, modify, and cancel otders</li>
          <li>View your account balance and margins</li>
          <li>View your profile details</li>
        </ul>
        <v-btn depressed :color="$store.state.buttonThemeColor" @click="vaildateAuthorize" :loading="getAuthorizatonLoader" :disabled="getAuthorizatonLoader" class="flat w-100 text-capitalize fsize14 white--text">Authorize</v-btn>
        <v-btn depressed color="#f9f9f9" class=" w-100
                    text-capitalize
                    primaryColor
                    rounded-sm-md
                    cancelbtn
                    mt-2
                  " @click="$store.commit('marketWatch/setAuthDialog', false);">Cancel</v-btn>
      </v-card>
    </v-dialog>

    <bottomsheet :currentData="currentSheetData" v-on:from-child ="getChildData"/>

  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mkDepth from "../views/marketDepth.vue";
import draggable from "vuedraggable";
import window from "../mixins/orderWindow";
import bottomsheet from '../components/bottomSheet.vue'
import customIcon from '../components/customIcon.vue'
import commonFunc from "../mixins/commonFunctions";

export default {
  mixins: [window,commonFunc],
  data: () => ({
    value: 0,
    search: "",
    depthExpand: null,
    settingsList: ["S", "M", "L", "XL"],
    filterList: ["A-Z", "(%)", "LTP", "Exc"],
    tableFontSize: "M",
    toggleBtns: 1,
    filterToggle: "",
    infoDialog: false,
    currentInfoData: "",
    alertData: "",
    alertPrice: "",
    submitted: false,
    isDropped: false,
    currentIndex: -1,
    isRotate: false,
    currentSheetData: []
  }),

  components: { mkDepth, draggable, bottomsheet,customIcon },

  computed: {
    ...mapState("marketWatch", [
      "mwList",
      "mwGroupNames",
      "nodata",
      "searchList",
      "depthLoader",
      "securityInfoData",
      "loading",
      "alertLoader",
    ]),
    ...mapActions("marketWatch", ["sortList"]),
    ...mapGetters("marketWatch", ["getAlertDialog"]),
    ...mapGetters("authtication", [
      "getUserId",
      "getUserSession",
      "getUserSessionDto",
      "getAuthorizatonLoader",
      "getAuthorizeItem",
    ]),

    alertDialog: {
      get() {
        return this.getAlertDialog;
      },
      set(value) {
        if (!value) {
          this.$store.commit("marketWatch/setAlertDialog", value);
        }
        return value;
      },
    },
    authDialog: {
      get() {
        return this.$store.state.marketWatch.authDialog;
      },
      set(value) {
        if (!value) {
          this.$store.commit("marketWatch/setAuthDialog", value);
        }
        return value;
      },
    },
  },

  methods: {
    getChildData(data){
      if(data['page'] == 'MkWatch'){
        if(data['action'] == 'buy' || data['action'] == 'sell'){
          this.callOrderWindow(data['action'], data.item)
        }
         if(data['action'] == "chart"){
          this.callTrandingViewChart(data.item, 'mkWatch')
        }
         if(data['action'] == 'depth'){
          const index = this.mwList.indexOf(data.item)
          this.openPanel(index, data.item)
        }
         if(data['action'] == 'del'){
          this.addorDeleteScrip(data.item, 'del')
        }
         if(data['action'] == 'Alert'){
          this.callalertDialog(data.item)
        }
         if(data['action'] == 'info'){
          this.getInfo(data.item)
        }
      }
    },
       callBottomSheet(val){
         this.openPanel(null, "item")
         this.currentSheetData = []
      var tempData = {
        where: 'MkWatch',
        isOpen: true,
        item: val,
      }
      this.currentSheetData.push(tempData)
    },
   
    getWindowHeight() {
      var offsetHeight =
        this.$store.state.windowHeight -
        document.getElementById("moreBtn").getBoundingClientRect().top;
      var dropdownHeight = 90;
      offsetHeight < dropdownHeight
        ? (this.isRotate = true)
        : (this.isRotate = false);
    },
    async fetchMwList(value) {
      let json = {
        userId: this.getUserId,
        mwId: this.mwGroupNames[value]['maketWatchId'],
      };
      this.isFirstCall = true;
      await this.$store.dispatch("marketWatch/getNewMwScripList", json);
    },
    onClickOutside() {
      this.search = "";
      this.$store.commit("marketWatch/setSearchList", []);
    },
    async addorDeleteScrip(data, type, isSingle) {
      this.openPanel(null, "item")
      var exchangeInput = data.exch;
      var isValidExchange = false;
      this.getUserSessionDto["exch"].forEach((element) => {
        if (element == exchangeInput) {
          isValidExchange = true;
        }
      });
      var tab = localStorage.getItem("tabIndex");
      let addOrDel = {
        userId: this.getUserId,
        mwId: this.mwGroupNames[tab]['maketWatchId'],
        scripData :[
        {
            exch : data.exch == undefined ? data.ex : data.exch,
            token : data.token,
        }
        ],
      };
      let fetchMw = {
        userId: this.getUserId,
        mwId: this.mwGroupNames[tab]['maketWatchId'],
      };
      if (type == "del") {
        this.$store.dispatch("marketWatch/deleteScripFromList", {
          addDel: addOrDel,
          fetchMw: fetchMw,
          data: data,
        });
      } else if (type == "add") {
          this.$store.dispatch("marketWatch/addScripList", {
            addDel: addOrDel,
            fetchMw: fetchMw,
            data: data,
          });
      } 
      // else {
      //   errorHandling.toaster('', "danger", "Scrip Can't be added" , 3000)
      // }
      if (isSingle) {
        this.onClickOutside();
      }
    },

    /***
     * @author Senthil
     * Market depth open Close function
     ***/
    async openPanel(index, item) {
      this.depthExpand == index
        ? (this.depthExpand = null)
        : (this.depthExpand = index);
      this.depthExpand != null
        ? this.callDepth(item)
        : this.$store.dispatch("wsConnection/depthSubscription", "")

        
    },

    async callDepth(item) {
      this.$store.commit("marketWatch/setDepthLoader", true);
      this.$store.commit("marketWatch/setPriceRange", []);
      this.$store.dispatch("marketWatch/getNewPriceRange", item);
      this.$store.dispatch(
        "wsConnection/depthSubscription",
        item.ex + "|" + item.token
      );
    },

    /***
     * @author Senthil
     * font Resize Method
     ***/
    fontResizer(value) {
      this.tableFontSize = value;
    },

    /***
     * @author Senthil
     * Date 04-12-2021
     * sorting market watch method
     ***/
    async sortedArray(sortType) {
      this.activeFilterItem =
        this.activeFilterItem == ""
          ? sortType
          : sortType == this.activeFilterItem
          ? sortType == "a-z"
            ? "z-a"
            : sortType == "(%)"
            ? "despercentage (%)"
            : sortType == "ltp"
            ? "desltp"
            : sortType == "exc"
            ? "desexchange"
            : "a-z"
          : sortType;
      this.activeFilterItem == "a-z"
        ? this.mwList.sort((a, b) =>
            a.scripName > b.scripName ? 1 : b.scripName > a.scripName ? -1 : 0
          )
        : this.activeFilterItem == "(%)"
        ? this.mwList.sort((a, b) =>
            parseFloat(a.PerChange) > parseFloat(b.PerChange)
              ? 1
              : parseFloat(b.PerChange) > parseFloat(a.PerChange)
              ? -1
              : 0
          )
        : this.activeFilterItem == "ltp"
        ? this.mwList.sort((a, b) =>
            parseFloat(a.ltp) > parseFloat(b.ltp)
              ? 1
              : parseFloat(b.ltp) > parseFloat(a.ltp)
              ? -1
              : 0
          )
        : this.activeFilterItem == "z-a"
        ? this.mwList.sort((a, b) =>
            b.TradSym > a.TradSym ? 1 : a.TradSym > b.TradSym ? -1 : 0
          )
        : this.activeFilterItem == "despercentage (%)"
        ? this.mwList.sort((a, b) =>
            parseFloat(b.PerChange) > parseFloat(a.PerChange)
              ? 1
              : parseFloat(a.PerChange) > parseFloat(b.PerChange)
              ? -1
              : 0
          )
        : this.activeFilterItem == "desltp"
        ? this.mwList.sort((a, b) =>
            parseFloat(b.ltp) > parseFloat(a.ltp)
              ? 1
              : parseFloat(a.ltp) > parseFloat(b.ltp)
              ? -1
              : 0
          )
        : this.activeFilterItem == "desexchange"
        ? this.mwList.sort((a, b) =>
            b.ex > a.ex ? 1 : a.ex > b.ex ? -1 : 0
          )
        : this.mwList.sort((a, b) =>
            a.ex > b.ex ? 1 : b.ex > a.ex ? -1 : 0
          );
      this.openPanel(null, "item");
      await this.$store.dispatch("marketWatch/sortList");
    },

    isScripAlreadyHere(item) {
      return this.mwList == undefined ||
        this.mwList == null ||
        this.mwList.length == 0
        ? true
        : this.mwList.some((element) => element.token != item.token);
    },

    /***
     * @author Senthil
     * footer tabs
     ***/
    async changeTab(value) {
      value = value ? value : 0;
      this.fetchMwList(value);
      this.onClickOutside();
      localStorage.setItem("tabIndex", parseInt(value));
      this.depthExpand = null;
      this.$store.state.wsConnection.preDepthSubsription != ""
        ? this.$store.dispatch("wsConnection/depthSubscription", "")
        : "";
    },

    async callOrderWindow(orderType, value) {
      this.$store.dispatch("orderWindow/setInitialValues", {
        data: value,
        page: "mkWatch",
      });
      this.$store.commit("orderWindow/setWindowLoading", true);
      this.$store.commit("orderWindow/setCurrentOrder", {
        data: value,
        page: "mkWatch",
      });
    await  this.$store.commit("orderWindow/setOrderWindow", true);
     await this.$store.commit("orderWindow/setRemoveCss", true);
     await this.$store.commit("orderWindow/setOrderType", orderType);
     await this.$store.dispatch("orderWindow/getNewPriceRange");
     await this.$store.dispatch("orderWindow/getScripQuoteDetails", "");
     await this.changeOrderTab();
      // this.$store
    },

    getInfo(currentData) {
      this.$store.dispatch("marketWatch/getSecurityInfo", currentData);
      this.infoDialog = true;
      this.currentInfoData = currentData;
    },
    async vaildateAuthorize() {
      let user = {
        userId: this.getUserId,
        vendor: "Amoga",
        callBackUrl: this.getAuthorizeItem.baseUrl,
      };
      await this.$store.dispatch("authtication/authorizeVenfor", user);
    },

    callalertDialog(val) {
      this.alertPrice = "";
      this.alertData = val;
      this.submitted = false;
      this.$store.commit("marketWatch/setAlertDialog", true);
    },

    async alertSubscribe() {
      this.submitted = true;
      if (this.alertPrice != "" && this.alertPrice != "") {
        await this.$store.dispatch("marketWatch/alertDialog", {
          data: this.alertData,
          alertPrice: this.alertPrice,
        });
      }
    },

    validate(evt) {
      return /^[0-9]*\.?[0-9]*$/.test(this.alertPrice + evt.key);
    },
    keyPressAlphaNumeric(event) {
      if (event.keyCode != 13) {
        var inp = String.fromCharCode(event.keyCode);
         if ((/[0-9.]/.test(inp) && !this.alertPrice.toString().includes('.')) ||  (/[0-9.]/.test(inp) && this.alertPrice.toString().includes('.') && this.alertPrice.toString().split('.')[1].length < 4)) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }
      }
    },
  },
  mounted() {
    // await this.$store.dispatch("marketWatch/getMwlistNames");
    this.value = parseInt(localStorage.getItem("tabIndex"));
    this.changeTab(this.value);
    // this.$store.dispatch('wsConnection/inValidateSession');
  },
  watch: {
    // search scrips in marketWatch
    search: async function (value) {
      !!value
        ? await this.$store.dispatch(
            "marketWatch/getSearchScripts",
            value.toString().toUpperCase()
          )
        : "";
    },
  },
};
</script>

<style scoped>
.mkWatch {
  position: fixed;
  right: 0;
  top: 56px;
  height: calc(100vh - 56px);
  resize: horizontal;
  border-left: 1px solid#a2a2a2 !important;
}

.scrollContents {
  height: calc(100vh - 138px);
  overflow-y: auto;
}

.activeMkBtn {
  background-color: #dee9fe !important;
  color: #0028ff !important;
  font-weight: bold !important;
}

.settingsBtnGroup {
  color: #170055 !important;
  background-color: #dfd3ff !important;
}

.theme--dark .activeMkBtn {
  background-color: #213b52 !important;
  color: #2992ec !important;
}

::v-deep .v-input__slot {
  box-shadow: none !important;
}

input[type="text"] {
  text-indent: 20px !important;
}

.searchlist {
  list-style: none !important;
}

.searchContent {
  z-index: 2;
  max-height: calc(100vh - 145px) !important;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  background: white;
}

::v-deep .v-expansion-panel-header {
  display: block !important;
  padding: 8px 16px !important;
  transition: none !important;
  line-height: unset !important;
}

::v-deep .v-expansion-panel:not(:first-child)::after {
  border-top: none !important;
}

::v-deep .v-expansion-panel {
  transition: none !important;
  border-bottom: 1px solid #e9e9e9 !important;
}

.theme--dark .v-expansion-panel {
  border-bottom: 1px solid #393939 !important;
}

.theme--dark .searchContent ul {
  background-color: #1e1e1e;
}

::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
::v-deep .v-expansion-panel::before {
  box-shadow: none !important;
}
/* ::v-deep .v-icon {
  font-size: 18px !important;
} */
::v-deep .v-item-group.v-bottom-navigation {
  width: 87% !important;
  box-shadow: none !important;
}
::v-deep .theme--light.v-btn.v-btn--has-bg {
  background-color: transparent;
}
/* tabs overwrite */
.mkWatch .theme--light.v-tabs .v-tab--active {
  opacity: 0.12 !important;
}
.footerTab {
  position: absolute;
  bottom: 0;
}
.settingsIcon {
  width: calc(100% - 50px);
}
.hoverImg {
  max-width: 60%;
}
.depthLoaderCard {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 377px;
}

.theme--dark .stsImglight {
  display: none;
}
.theme--light .stsImgdark {
  display: none;
}

/* font-resize class binding */
[data-font-size="S"] {
  font-size: 12px !important;
}
[data-font-size="M"] {
  font-size: 14px !important;
}
[data-font-size="L"] {
  font-size: 16px !important;
}
[data-font-size="XL"] {
  font-size: 18px !important;
}
[sub-data-font-size="S"] {
  font-size: 10px !important;
}
[sub-data-font-size="M"] {
  font-size: 11px !important;
}
[sub-data-font-size="L"] {
  font-size: 12px !important;
}
[sub-data-font-size="XL"] {
  font-size: 13px !important;
}
.searchScrip {
  color: #282828;
}
.height-2{height:2px !important;}
.v-expansion-panel-header:before{
  background-color: white !important;
}
</style>