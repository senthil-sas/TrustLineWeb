<template>
  <form  id="orderWindowForm" class="d-flex flex-column" name="orderwindow" @submit.prevent="placeOrder()" @keyup.esc="hideOrderWindow()" :class="{ slideUpCss: showOrderWindow && removeCss, slideDownCss: !showOrderWindow && !removeCss }">
    <v-flex xs12 sm12 md4 lg6 xl6 class="orderWindow">
      <draggable>
        
        <template slot="header">
          <v-sheet class="headerclass" :class="orderType == 'buy' ? 'buyColor' : 'sellColor'" :style="$store.state.windowWidth < 330 ? 'height:auto !important' : ''">
            <v-row class="ma-0">
              <v-col class="pa-0">
                <div class="white--text fsize14 pb-1 text-capitalize">
                  {{
                    currentInstrument == null
                      ? scriptQuoteDetails.TSymbl
                      : currentInstrument
                  }} <span class="ml-2" v-if="nseBseType">{{ getCurrentLtp }}</span>
                  <!-- <v-progress-circular class="ml-2 flex-end" indeterminate v-if="windowLoading" size="18" :width="2" color="white"></v-progress-circular> -->
                </div>

                <!-- nse bse Radio switch -->
                <v-radio-group :disabled="modifyOrder" v-if="nseBseType" v-model="nseBseRadioSwitch" row class="orderWindowRadio pa-0 my-0 ml-0 d-flex align-center" height="24">
                 <span @click="nseBseRadioSwitch = 'NSE';nseBseSwitch('NSE')" class="fsize12 white--text d-flex align-center mr-2 cursor"> <customIcon style="height: 16px" class="mr-2" :name="nseBseRadioSwitch == 'NSE' ? 'radio-check' :'radio-blank'"  :width="'16'" :height="'16'" :color="'#ffffff'"  /> 
                  NSE: {{nseSwitchPrice}} </span> 
                  <span @click="nseBseRadioSwitch = 'BSE';nseBseSwitch('BSE')" class="fsize12 white--text d-flex align-center cursor"> <customIcon style="height: 16px" class="mr-2" :name="nseBseRadioSwitch == 'BSE' ? 'radio-check' :'radio-blank'"  :width="'16'" :height="'16'" :color="'#ffffff'"/>BSE: {{bseSwitchPrice}}</span>
                </v-radio-group>

                <!-- Check NaN, null, empty, undefined for #### priceRangeDetails.Ltp && getCurrentLtp-->
                <div v-else class="white--text fsize14 d-flex">
                  {{ getCurrentLtp}}
                </div>

              </v-col>
              <v-col class="pa-0">
                <div class="d-flex flex-column align-end">
                  <v-switch v-model="buySellRadio" :disabled="modifyOrder" dense @click="toggleOrderWindow()" hide-details inset class="orderSwitch ma-0" color="white"></v-switch>
                  <!-- Check for both CDS and BCD -->
                  <div class="white--text fsize12 pt-1 font-weight-600" v-if="lowerRange != 0 && upperRange != 0">
                    {{
                      `DPR: ${
                        currentExchange == "CDS" || currentExchange == "BCD"
                          ? parseFloat(lowerRange).toFixed(4)  : parseFloat(lowerRange).toFixed(2)
                      } - 
                ${
                  currentExchange == "CDS" || currentExchange == "BCD"
                    ? parseFloat(upperRange).toFixed(4): parseFloat(upperRange).toFixed(2)
                }`
                    }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-sheet>
        </template>

        <template slot="main">
          <v-sheet class="border-bottom-light orderwindow">
            <!-- order type tabs -->
            <v-tabs :show-arrows="true" @change="changeOrderTab()" v-model="orderTab" :color="orderType == 'buy' ? '#2992ec' : '#d13535'" dense max-width="30" class="orderWindowTab border-bottom-light">
              <v-tab class="primaryColor" :transition="false" :disabled="modifyOrder" @click="selectedIndex(item)" v-for="(item, index) in orderTypeList" :key="index">
                <v-tooltip max-width="200" top color="toolTipColor toolTipTop">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ item }}</span> </template><span class="fsize12">{{
                    item == "Regular"
                      ? "Regular order"
                      : item == "Cover"
                      ? "Cover order"
                      : item == "AMO"
                      ? "After Market Order (for the next day)"
                      : "Bracket order"
                  }}</span>
                </v-tooltip>
              </v-tab>
            </v-tabs>

            <v-tabs-items :transition="false"  class="px-2 py-2 border-bottom">
              <v-row class="ma-0 px-2 pb-3">
                <!-- priceBtns -->
                <v-col class="pa-0 mt-2">
                  <v-slide-group transition="none" v-model="prodType" mandatory class="pa-0 orderSlideGroup" hide-arrows>
                    <v-slide-item v-for="(item, i) in showproductItems" :key="i" v-bind:value="item" v-slot="{ active, toggle }">
                      <v-tooltip max-width="200" top color="toolTipColor toolTipTop">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn @change="setProductTab()" depressed v-bind="attrs" v-on="on" :class="modifyOrder ? 'disabledSlideBtn' : ''" :color="
                              active
                                ? orderType == 'buy'
                                  ? 'buyColor'
                                  : 'sellColor'
                                : 'unActiveColor'
                            " height="26" min-width="54" class="fsize11 px-1 mr-2 rounded-sm orderProdBtn" @click="toggle">
                            {{ item }}
                          </v-btn>
                        </template>
                        <span class="fsize12">{{
                          item == "MIS"
                            ? "Margin Intraday Squareoff: Requires lower margin. Has to be exited before market close."
                            : item == "CNC"
                            ? "CashNCarry: Longterm investment.Requires full upfront margin"
                            : item == "NRML"
                            ? "Normal: Carry forward positions overnight."
                            : ""
                        }}</span>
                      </v-tooltip>
                    </v-slide-item>
                  </v-slide-group>
                </v-col>
                <!-- priceBtns -->
                <v-col class="pa-0 mt-2 d-flex justify-end">
                  <v-slide-group transition="none" v-model="priceType" mandatory class="pa-0 orderSlideGroup" hide-arrows>
                    <v-slide-item v-for="(item, i) in showPriceItems" :key="i" v-bind:value="item" v-slot="{ active, toggle }">
                      <v-tooltip max-width="200" top color="toolTipColor toolTipTop">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn @click="toggle" v-bind="attrs" v-on="on" depressed :color="
                              active
                                ? orderType == 'buy'
                                  ? 'buyColor'
                                  : 'sellColor'
                                : 'unActiveColor'
                            " height="26" min-width="54" class="ml-2 px-1 fsize11 rounded-sm text-capitalize">
                            {{
                              item == "L"
                                ? "Limit"
                                : item == "MKT"
                                ? "Market"
                                : item
                            }}
                          </v-btn>
                        </template>
                        <span class="fsize12">{{
                          item == "L"
                            ? `${capitalizeFirstLetter(
                                orderType
                              )} at preferred price`
                            : item == "MKT"
                            ? `${capitalizeFirstLetter(
                                orderType
                              )} at Market price`
                            : item == "SL"
                            ? `${capitalizeFirstLetter(
                                orderType
                              )} at preferred price with a stoploss`
                            : `${capitalizeFirstLetter(
                                orderType
                              )} at market price with stoploss`
                        }}</span>
                      </v-tooltip>
                    </v-slide-item>
                  </v-slide-group>
                </v-col>
              </v-row>

              <!-- input fields common -->
              <v-row class="ma-0">
                <v-col cols="12" sm="6" md="4" lg="4" class="px-2 py-0">
                  <label class="line-height20 fsize12 primaryColor">Quantity</label>
                  <div>
                    <v-text-field id="qty" ref="qty" @input="quantityValidation" class="orderInput min-w-150" :min="0" v-model.number="quantity" :step="minlot" @keypress="checkQuantity($event)" height="40" dense type="number" autofocus single-line outlined hide-details autocomplete="off"></v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4" class="px-2 py-0">
                  <label class="line-height20 fsize12 primaryColor">Price</label>
                  <div>
                    <v-text-field id="price" class="orderInput min-w-150" @input="priceValidation" :disabled="!isPrice" :min="0" v-model.number="price" @keypress="decimalAllowed($event)" :step="tickPrice" height="40" dense type="number" single-line outlined hide-details >
                    </v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4" class="px-2 py-0">
                  <label class="line-height20 fsize12 primaryColor">{{ orderTypeList[orderTab] == 'Cover' ? 'SL Trigger Price' :'Trigger Price'}}</label>
                  <div>
                    <v-text-field id="triggerPrice" class="orderInput min-w-150" @input="triggerPriceValiation" :disabled="!isTrgPrice" :min="0"  v-model.number="triggerPrice" :step="tickPrice" @keypress="decimalAllowed($event)" height="40" dense type="number" single-line outlined hide-details ></v-text-field>
                  </div>
                </v-col>
              </v-row>
              
              <!-- input fields for bracket order -->
              <v-row class="mx-0 mb-0 mt-2" v-if="this.orderTypeList[this.orderTab] == 'Bracket'">
                <v-col cols="12" sm="6" md="4" lg="4" class="px-2 py-0">
                  <label class="line-height20 fsize12 primaryColor">Target</label>
                  <div>
                    <v-text-field id="targetPrice" class="orderInput min-w-150" @input="targetPriceValidation" :min="0" v-model="targetPrice" :step="tickPrice" height="40"  @keypress="decimalAllowed($event)"  dense type="number" single-line outlined hide-details></v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4" class="px-2 py-0">
                  <label class="line-height20 fsize12 primaryColor">Stoploss</label>
                  <div>
                    <v-text-field id="stopLossPrice" class="orderInput min-w-150" @input="stopLossPriceValidation" :min="0" v-model="stopLossPrice" :step="tickPrice" height="40"  @keypress="decimalAllowed($event)" dense type="number" single-line outlined hide-details></v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4" class="px-2 py-0">
                  <label class="line-height20 fsize12 primaryColor">Trailing Stoploss</label>
                  <div>
                    <v-text-field id="trailStopLossPrice" class="orderInput min-w-150" @input="trailPriceValidation" :min="0" v-model="trailStopLossPrice" :step="tickPrice" height="40"  @keypress="decimalAllowed($event)" dense type="number" single-line outlined hide-details></v-text-field>
                  </div>
                </v-col>
              </v-row>

              <v-row class="ma-0 pt-2 pl-3 line-height20 align-center">
                <v-tooltip max-width="200" top color="toolTipColor toolTipTop">
                  <template v-slot:activator="{ on, attrs }">
                    <label v-bind="attrs" v-on="on" class="More options cursor fsize12 user-select-none" @click="showMore = !showMore">More
                      <span class="chevron bottom"></span></label></template><span class="fsize12">More Options</span>
                </v-tooltip>
              </v-row>
              
              <!-- disclosed Qty field -->
              <v-row class="ma-0 d-flex justify-end align-center" v-if="showMore">
                <v-col class="pa-0"></v-col>
                <v-col class="py-0 pl-0 pr-7 d-flex flex-column">
                  <label class="fsize12 line-height20">Validity</label>
                  <v-slide-group v-model="validityType" mandatory class="pa-0" width="178" hide-arrows>
                    <v-slide-item v-for="(item, i) in showValidityItems" :key="i" v-bind:value="item" v-slot="{ active, toggle }">
                      <v-tooltip max-width="200" top color="toolTipColor toolTipTop">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn depressed v-bind="attrs" v-on="on" :color="
                              active
                                ? orderType == 'buy'
                                  ? 'buyColor'
                                  : 'sellColor'
                                : 'unActiveColor'
                            " height="26" min-width="54" class="fsize11 px-1 rounded-sm mr-2" :value="item" @click="toggle">
                            {{ item }}</v-btn>
                        </template><span class="fsize12">{{
                          item == "DAY"
                            ? "Regular day order"
                            : "Immediate or Cancel"
                        }}</span>
                      </v-tooltip>
                    </v-slide-item>
                  </v-slide-group>
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="4" class="px-2 py-0">
                  <label class="line-height20 fsize12 primaryColor">Disclosed Qty.</label>
                  <div>
                    <v-text-field id="discQty" class="orderInput min-w-150" @input="discQtyValidation" :min="0" v-model.number="disclosedQuantity" :disabled="!isDisclosedQty" height="40" dense type="number" single-line hide-details outlined></v-text-field>
                  </div>
                </v-col>
              </v-row>

              <div>
                <div class="error-msg ml-2 mt-2">{{this.errorMsg}}</div>
              </div>
            </v-tabs-items>
          </v-sheet>
        </template>

        <!-- footer -->
        <template slot="footer">
          <v-sheet class="px-4 py-3 footerOrderWindow">
            <v-row class="ma-0">
              <v-col class="pa-0 d-flex align-center ma-0">
                <div class="fsize12 secondaryColor">Margin required	&#8377; {{ruppesFormat(getAvailableMargin)}}</div>
              </v-col>
              <v-col class="pa-0 d-flex justify-end">
                <v-btn :loading="loading" type="submit" value="placeOrder" :disabled="loading" depressed height="40" width="100" class="text-capitalize rounded" :class="orderType == 'buy' ? 'buyColor' : 'sellColor'">{{ modifyOrder ? "Modify" : orderType }}</v-btn>
                <v-btn depressed outlined height="40" width="100" color="#9b9b9b" class="
                    text-capitalize
                    secondaryColor
                    rounded-sm-md
                    cancelbtn
                    ml-2
                  " @click="hideOrderWindow">Cancel</v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </template>

      </draggable>
    </v-flex>
  </form>
</template>

<script>
import orderWindowjs from "../mixins/orderWindow";
import customIcon from '../components/customIcon.vue'
import commonFunc from "../mixins/commonFunctions";
export default {
  mixins: [orderWindowjs,commonFunc],
  components:{
    customIcon
  }
};
</script>

<style>
.headerclass {
  cursor: move;
  padding: 12px 18px !important;
  background: #2992ec;
  height: 74px;
  /* width: 550px; */
  border-radius: 3px 3px 0 0 !important;
}
.orderWindowRadio .v-icon.v-icon {
  font-size: 16px !important;
  color: #ffffff !important;
}
.orderWindowRadio .v-input--selection-controls .v-input__slot > .v-label,
.v-input--selection-controls .v-radio > .v-label {
  font-size: 12px !important;
}
.orderWindowRadio .v-input--selection-controls__input {
  width: 16px !important;
  height: 16px !important;
}
.orderWindowRadio .v-input--selection-controls__input {
  margin-right: 4px !important;
}
.orderWindowRadio .v-input--radio-group.v-input--radio-group--row .v-radio {
  margin-right: 12px !important;
}
.orderWindowRadio .theme--light.v-label {
  color: #ffffff !important;
}
.orderWindowTab .v-tabs-bar {
  height: 38px !important;
}
.orderWindowTab .v-tab {
  font-size: 12px !important;
  text-transform: inherit !important;
  font-weight: normal !important;
  letter-spacing: inherit !important;
}
.prodTypeBtn {
  padding: 5px 8px;
  border-radius: 2px;
  font-size: 11px;
  width: 60px;
  height: 26px;
  text-align: center;
  color: #282828 !important;
  background-color: #e6e6e6;
  cursor: pointer;
}
.line-height20 {
  line-height: 20px !important;
}
.line-height24 {
  line-height: 24px !important;
}
.buyColor {
  background-color: #2992ec !important;
}
.sellColor {
  background-color: #d13535 !important;
}
.unActiveColor {
  background-color: #e6e6e6 !important;
}
.v-btn.buyColor,
.v-btn.sellColor {
  color: #ffffff !important;
  text-transform: capitalize !important;
}
.v-btn:not(.v-btn--outlined).unActiveColor {
  color: #282828 !important;
  text-transform: inherit !important;
}
.orderSlideGroup .v-slide-group__content > .v-btn.v-btn:nth-child(2) {
  margin-left: 8px !important;
}
.border-a8a8a8 {
  border: solid 1px #a8a8a8;
}
.orderField {
  width: 150px;
  height: 40px;
  outline: none !important;
  box-shadow: none !important;
}
.chevron::before {
  border-style: solid;
  border-width: 0.1em 0.1em 0 0 !important;
  content: "";
  display: inline-block;
  height: 8px;
  left: 2px;
  position: relative;
  top: 2px;
  transform: rotate(-225deg);
  vertical-align: top;
  width: 8px;
  margin-top: 4px;
}
.chevron.bottom:before {
  top: 0;
  transform: rotate(135deg);
}
.orderWindow .v-btn {
  letter-spacing: 0 !important;
}
.v-input--selection-controls__ripple {
  height: 0px !important;
}
.v-input--switch.v-input--dense.v-input--switch--inset .v-input--switch__track {
  height: 16px !important;
  width: 38px !important;
  top: calc(50% - 12px);
  left: -3px;
}
.v-input--switch.v-input--dense .v-input--switch__thumb {
  width: 12px !important;
  height: 12px !important;
}
.v-input--is-disabled.orderInput {
  background: url(../assets/images/strip.svg) !important;
  color: #a8a8a8 !important;
}
.v-input--is-focused:focus {
  border: #000000 !important;
}
.footerOrderWindow {
  background: #f3f3f3 !important;
}
.theme--dark .footerOrderWindow {
  background: #1e1e1e !important;
}
.pointer-events-none {
  pointer-events: none;
  cursor: disabled;
}
.orderProdBtn .v-slide-item--active.v-btn--disabled {
  background: #a7d3f9 !important;
  opacity: 0.5 !important;
}
.disabledSlideBtn {
  opacity: 0.5 !important;
  pointer-events: none;
}
button:disabled {
  cursor: not-allowed;
}
.theme--dark.v-sheet.orderwindow {
  background: #686868 !important;
}

.orderWindowTab .v-tabs-bar .v-tab:not(.v-tab--active) {
  color: #282828 !important;
}
.slideDownCss {
  transition: transform 0.25s ease-out !important;
  animation-duration: 0.55s;
  -webkit-animation: fadeOutDown;
  animation: fadeOutDown;

  top: auto;
  bottom: 0px;
}
.slideUpCss {
  -webkit-animation: fadeInUp 0.25s ease;
  animation: fadeInUp 0.25s ease;
}

.orderSwitch .v-input--switch--inset .v-input--switch__track,
.v-input--switch--inset .v-input--selection-controls__input {
  width: 24px !important;
}

@-webkit-keyframes fadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translateY(20px);
  }
  to {
    opacity: 1;
    -webkit-transform: translateY(0);
  }
}
@keyframes fadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translateY(20px);
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
}

@-webkit-keyframes fadeOutDown {
  0% {
    opacity: 1;
  }
  to {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }
}
@keyframes fadeOutDown {
  0% {
    opacity: 1;
  }
  to {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translateY(-20px);
  }
  to {
    opacity: 1;
    -webkit-transform: translateY(0);
  }
}
@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translateY(-20px);
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
}
.orderWindowTab .v-tabs > .v-tabs-bar .v-tab--disabled .v-tab--active {
  color: unset !important;
}
.min-w-150{
  min-width: 150px;
}
@media (max-width: 1023px) {
  #draggable-container {
    left: 10% !important;
    top: 0 !important;
    display: block !important;
    width: auto !important;
  }
}
@media (max-width: 629px) {
  #draggable-container {
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    margin: 0;
    width: 100%;
    overflow-y: auto;
  }
}
</style>