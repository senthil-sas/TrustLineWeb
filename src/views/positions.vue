<template>
  <div>
    <div class="px-4 py-2 align-center d-flex">
      <div class="font-weight-bold primaryColor">Positions</div>
      <v-progress-circular
        class="ml-2"
        indeterminate
        v-if="postionLoader"
        size="18"
        :width="2"
        color="blue"
      ></v-progress-circular>
    </div>
    <v-row class="mb-2 mx-0 mt-0 px-4">
      <v-slide-group v-model="infoType" class="pa-0" mandatory hide-arrows>
        <v-slide-item
          v-for="(item, i) in tabList"
          :key="i"
          v-bind:value="item.name"
          v-slot="{ active, toggle }"
        >
          <v-tooltip top color="toolTipColor toolTipTop">
            <template v-slot:activator="{ on, attrs }">
              <span
                @click="
                  $router
                    .push({
                      path: 'positions',
                      query: {
                        tab: infoType ? infoType.trim().toString() : 'All',
                      },
                    })
                    .catch(() => {})
                "
              >
                <v-btn
                  depressed
                  v-bind="attrs"
                  v-on="on"
                  :color="
                    active
                      ? 'activeColor white--text'
                      : 'unActiveColor black--text'
                  "
                  height="26"
                  min-width="50"
                  class="fsize12 mr-2 rounded-sm text-center text-capitalize"
                  :value="item"
                  @click="toggle"
                >
                  {{ item.name }}
                  <span v-if="item.length != 0">
                    &nbsp; ({{ item.length }})</span
                  >
                </v-btn>
              </span>
            </template>
            <span>{{ item.toolTip }}</span>
          </v-tooltip>
        </v-slide-item>
      </v-slide-group>
      <v-spacer></v-spacer>

       <span
        class="float-right d-flex align-center"
        id="searchBarAndIcons"
        v-if="currentTableData.length > 0 && !$store.state.isMobileView"
      >
        <span class="search-box mx-2" >
          <span class="searchwhole">
           <customIcon  :name="'search'" class="searchimg" :width="'16'" :height="'16'" :color="$store.state.amogaColor"  />
            <span class="searchinput">
              <input
                class="placeholdsearch"
                placeholder="Search"
                autocorrect="off"
                v-model="searchPosition"
                oninput="this.value = this.value.toUpperCase()"
              />
            </span>
          </span>
        </span>
        <v-tooltip top color="toolTipColor toolTipTop">
          <template v-slot:activator="{ on, attrs }">
             <span v-bind="attrs" v-on="on" @click="downloadCsv('positions', currentTableData)">
          <customIcon   :name="'download'" class="mx-1 cursor d-flex" :width="'21'" :height="'21'" :color="$store.state.amogaColor"  />
          </span>
          </template>
          <span>Download</span>
        </v-tooltip>
      </span>
    </v-row>
    <v-divider class="mx-4 mb-2"></v-divider>


 <v-card
      class="ma-4 pa-4"
      v-if=" $store.state.isMobileView &&
        (currentTableData.length != 0 &&
          this.searchPosition == '' &&
          !this.postionLoader) ||
        (positionSearchFilter.length != 0 &&
          this.searchPosition !== '' &&
          !this.postionLoader)
      "
    >
    <div class="row ma-0 pa-0 d-flex-align-center justify-center fsize14"> Total P&L</div>
    <div class="row ma-0 pa-0 d-flex-align-center justify-center fsize14" :class="
                  parseFloat(totalGroup(currentTableData)) >= 0
                    ? 'positiveColor'
                    : 'negativeColor'
                "
                >{{ totalGroup(currentTableData) }}</div>
 </v-card>
    <v-card
      class="ma-4"
      v-if="
        (currentTableData.length != 0 &&
          this.searchPosition == '' &&
          !this.postionLoader) ||
        (positionSearchFilter.length != 0 &&
          this.searchPosition !== '' &&
          !this.postionLoader)
      "
    >
      <v-simple-table
        id="tableData"
        :class="{ overflowinherit: isDropped }"
        v-if="!$store.state.isMobileView"
      >
        <thead>
          <tr class="tableRow">
            <th class="text-left d-flex align-center">
              <input
                type="checkbox"
                v-model="checkboxSelectAll"
                :checkecd="selectedCheckbox.length > 0"
                class="tableCheckBox"
              />
            </th>
            <th class="text-center tableHeader">Type</th>
            <th class="text-left tableHeader">Instrument</th>
            <th class="text-right tableHeader">Qty</th>
            <th class="text-right tableHeader">Buy Avg</th>
            <th class="text-right tableHeader">Sell Avg</th>
            <th class="text-right tableHeader">LTP</th>
            <th class="text-right tableHeader">P/L</th>
          </tr>
        </thead>
        <tbody
          @mouseleave="
            currentIndex = -1;
            isDropped = false;
          "
        >
          <tr
            v-for="(item, index) in this.searchPosition == ''
              ? currentTableData
              : positionSearchFilter"
            :key="index"
            class="primaryColor tableRow"
            @mouseenter="
              isDropped = false;
              currentIndex = index;
            "
            :class="[item.Netqty == '0' ? 'row-disabled ' : '']"
          >
            <td class="px-4 py-2" style="min-height: 48px">
              <input
                type="checkbox"
                v-model="selectedCheckbox"
                :value="item"
                :disabled="
                  item.Netqty == '0' ||
                  (item.Netqty !== '0' &&
                    (item.Pcode == 'CO' || item.Pcode == 'BO'))
                "
                class="tableCheckBox"
              />
            </td>
            <td class="text-center px-4 py-2 tableContent">
              <button
                class="py-1 px-2 fsize10 rounded-sm"
                :class="
                  item.Pcode.toLowerCase() == 'mis'
                    ? 'misBtn'
                    : item.Pcode.toLowerCase() == 'nrml'
                    ? 'nrmlBtn'
                    : 'cncBtn'
                "
              >
                {{ item.Pcode }}
              </button>
            </td>
            <td class="text-left pos-reletive px-4 py-2 tableContent">
              {{
                item.formatScripName == null ? item.Tsym : item.formatScripName
              }}
              <span class="fsize10 secondaryColor">{{ item.Exchange }}</span>
              <div
                class="dropdown position-absolute right-0"
                v-if="currentIndex == index"
              >
                <v-tooltip top color="toolTipColor toolTipTop">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      id="moreOrderBtn"
                      @mouseover="getWindowHeight()"
                      @click="isDropped = !isDropped"
                      min-width="50"
                      max-width="50"
                      height="23"
                      outlined
                      depressed
                      v-bind="attrs"
                      v-on="on"
                      class="
                        d-flex
                        align-center
                        justify-center
                        pos-reletive
                        fsize12
                        text-capitalize
                        border-0075e1
                        rounded-sm
                        color-0075e1
                        background-white
                      "
                      >More
                    </v-btn>
                  </template>
                  <span>Options</span>
                </v-tooltip>

                <transition name="slide">
                  <ul
                    v-if="currentIndex == index && isDropped"
                    :class="isRotate ? 'bottom25' : ''"
                    class="pa-0 list expectMkWatchMoreList"
                  >
                    <li
                      @click="
                        isDropped = false;
                        callOrderWindow(
                          parseFloat(item.Netqty) < 0 ? 'sell' : 'buy',
                          item,
                          'Add'
                        );
                      "
                      v-if="item.Netqty != '0'"
                      class="primaryColor fsize12 cursor"
                    >
                      Add
                    </li>
                    <li
                      v-if="item.Netqty != '0'"
                      @click="
                        isDropped = false;
                        callOrderWindow(
                          parseFloat(item.Netqty) < 0 ? 'buy' : 'sell',
                          item,
                          'Exit'
                        );
                      "
                      class="primaryColor fsize12 cursor"
                    >
                      Exit
                    </li>
                    <li
                      v-if="item.Netqty == '0'"
                      @click="
                        isDropped = false;
                        callOrderWindow('buy', item, 'Buy');
                      "
                      class="primaryColor fsize12 cursor"
                    >
                      Buy
                    </li>
                    <li
                      @click="
                        isDropped = false;
                        callOrderWindow('sell', item, 'Sell');
                      "
                      v-if="item.Netqty == '0'"
                      class="primaryColor fsize12 cursor"
                    >
                      Sell
                    </li>
                    <li
                      v-if="
                        item.Netqty != '0' &&
                        item.Pcode != 'CO' &&
                        item.Pcode != 'BO'
                      "
                      @click="
                        callConvertDialog(item);
                        isDropped = false;
                      "
                      class="primaryColor fsize12 cursor"
                    >
                      Convert
                    </li>
                    <li
                      @click="
                        showDialog(item);
                        isDropped = false;
                      "
                      class="primaryColor fsize12 cursor"
                    >
                      Info
                    </li>
                     <li @click="
                        isDropped = false;
                        callTrandingViewChart(item, 'position');
                      " class="primaryColor fsize12 cursor">
                      Chart
                    </li>
                  </ul>
                </transition>
              </div>
            </td>
            <td
              class="text-right px-4 py-2 tableContent"
              :class="
                parseInt(item.Netqty) > 0
                  ? 'postiveQuantity'
                  : parseInt(item.Netqty) == 0
                  ? 'zeroQuantity'
                  : 'negativeQuantity'
              "
            >
              {{ item.Netqty }}
            </td>
            <td class="text-right px-4 py-2 tableContent">
              {{
                item.Exchange == "CDS" || item.Exchange == "BCD"
                  ? ruppesFormat(parseFloat(item.NetBuyavgprc).toFixed(4))
                  : ruppesFormat(parseFloat(item.NetBuyavgprc).toFixed(2))
              }}
            </td>
            <td class="text-right px-4 py-2 tableContent">
              {{
                item.Exchange == "CDS" || item.Exchange == "BCD"
                  ? ruppesFormat(parseFloat(item.NetSellavgprc).toFixed(4))
                  : ruppesFormat(parseFloat(item.NetSellavgprc).toFixed(2))
              }}
            </td>
            <td class="text-right px-4 py-2 tableContent">
              {{
                item.Exchange == "CDS" || item.Exchange == "BCD"
                  ? ruppesFormat(parseFloat(item.LTP).toFixed(4))
                  : ruppesFormat(parseFloat(item.LTP).toFixed(2))
              }}
            </td>
            <td
              class="text-right px-4 py-2 tableContent"
              :class="
                parseFloat(item.MtoM) >= 0 ? 'positiveColor' : 'negativeColor'
              "
            >
              {{ ruppesFormat(parseFloat(item.MtoM).toFixed(2)) }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr height="50px" class="primaryColor tableRow">
            <td class="px-4 py-2 tableContent" colspan="3">
              <v-btn
                v-if="selectedCheckbox.length > 0"
                :color="$store.state.buttonThemeColor"
                depressed
                @click="$store.commit('position/setPositionExitDialog', true)"
                min-width="78"
                height="32"
                class="text-capitalize white--text"
                >{{
                  selectedCheckbox.length == 0
                    ? "Exit"
                    : `Exit (${selectedCheckbox.length})`
                }}</v-btn
              >
            </td>
            <td colspan="4" class="text-right px-4 py-2 tableContent">
              Total P&L
            </td>
            <td colspan="1" class="text-right px-4 py-2 tableContent">
              <span
                :class="
                  parseFloat(totalGroup(currentTableData)) >= 0
                    ? 'positiveColor'
                    : 'negativeColor'
                "
                >{{ totalGroup(currentTableData) }}</span
              >
            </td>
          </tr>
        </tfoot>
      </v-simple-table>

      <div v-if="$store.state.isMobileView">
        <div
          class="row ma-0 px-3 py-2 border-bottom-mwSearch"
          v-for="(item, index) in this.searchPosition == ''
            ? currentTableData
            : positionSearchFilter"
          :key="index"
          :class="parseInt(item.Netqty) == 0 ? 'row-disabled' : '' " @click="callBottomSheet(item)"
        >
          <div class="row pa-0 ma-0 d-flex align-center justify-space-between w-100">
            <div
              class="fsize12"
              :class="
                parseInt(item.Netqty) > 0
                  ? 'postiveQuantity'
                  : parseInt(item.Netqty) == 0
                  ? 'zeroQuantity'
                  : 'negativeQuantity'
              "
            >
              {{ item.Netqty }}
            </div>
            <div class="fsize12">
              Sell Avg.
              {{
                item.Exchange == "CDS" || item.Exchange == "BCD"
                  ? ruppesFormat(parseFloat(item.NetSellavgprc).toFixed(4))
                  : ruppesFormat(parseFloat(item.NetSellavgprc).toFixed(2))
              }}
            </div>
            <div>
              <button
                class="py-1 px-2 fsize10 rounded-sm"
                :class="
                  item.Pcode.toLowerCase() == 'mis'
                    ? 'misBtn'
                    : item.Pcode.toLowerCase() == 'nrml'
                    ? 'nrmlBtn'
                    : 'cncBtn'
                "
              >
                {{ item.Pcode }}
              </button>
            </div>
          </div>
          <div
            class="row my-2 mx-0 pa-0 d-flex align-center justify-space-between w-100"
          >
            <div class="fsize14">
              {{
                item.formatScripName == null ? item.Tsym : item.formatScripName
              }}
            </div>
            <div
              class="fsize12"
              :class="
                parseFloat(item.MtoM) >= 0 ? 'positiveColor' : 'negativeColor'
              "
            >
              {{ ruppesFormat(parseFloat(item.MtoM).toFixed(2)) }}
            </div>
          </div>
          <div class="row pa-0 ma-0 d-flex align-center justify-space-between w-100">
            <div class="fsize10 secondaryColor">{{ item.Exchange }}</div>
            <div class="fsize12">
              Buy Avg.
              {{
                item.Exchange == "CDS" || item.Exchange == "BCD"
                  ? ruppesFormat(parseFloat(item.NetBuyavgprc).toFixed(4))
                  : ruppesFormat(parseFloat(item.NetBuyavgprc).toFixed(2))
              }}
            </div>
            <div class="fsize12">
              LTP
              {{
                item.Exchange == "CDS" || item.Exchange == "BCD"
                  ? ruppesFormat(parseFloat(item.LTP).toFixed(4))
                  : ruppesFormat(parseFloat(item.LTP).toFixed(2))
              }}
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <div
      class="d-flex flex-column justify-center align-center vh-70"
      v-if="
        (!!currentTableData &&
          currentTableData.length == 0 &&
          this.searchPosition == '' &&
          !this.postionLoader) ||
        (!!currentTableData &&
          positionSearchFilter.length == 0 &&
          this.searchPosition !== '' &&
          !this.postionLoader)
      "
    >
      <div>
        <img
          src="../assets/images/noData.svg"
          alt=""
          class="w-300 h-170 mb-4"
        />
      </div>
      <div class="primaryColor">NO POSITIONS FOUND</div>
    </div>

    <!-- info dialog -->

    <v-dialog
      v-model="infoDialog"
      width="650px"
      transition="scroll-y-reverse-transition"
    >
      <v-card class="pa-5">
        <div class="d-flex align-baseline py-3 border-bottom-dark">
          <button
            class="rounded-sm py-1 px-2 text-capitalize fsize10"
            v-bind:class="[
              this.postionInfodetails.Pcode == 'NRML' ? 'nrmlBtn' : 'misBtn ',
            ]"
          >
            {{ this.postionInfodetails.Pcode }}
          </button>
          <div class="mx-2 fsize14">
            {{
              this.postionInfodetails.InsdisplayName != null
                ? this.postionInfodetails.InsdisplayName
                : this.postionInfodetails.Tsym
            }}
          </div>
          <div class="fsize9">{{ this.postionInfodetails["Exchange"] }}</div>
        </div>
        <div class="py-2 border-bottom-dark">
          <div class="row ma-0">
            <div class="col-6 py-4 pr-2 pl-0 border-right">
              <div class="d-flex align-center justify-space-between">
                <div class="fsize12 secondaryColor mb-2">Quantity</div>
                <div class="fsize12 primaryColor mb-2">
                  {{ this.postionInfodetails["Netqty"] }}
                </div>
              </div>
              <div class="d-flex align-center justify-space-between">
                <div class="fsize12 secondaryColor mb-2">Avg.price</div>
                <div class="fsize12 primaryColor mb-2">
                  {{ this.postionInfodetails["netbuyamt"] }}
                </div>
              </div>
              <div class="d-flex align-center justify-space-between">
                <div class="fsize12 secondaryColor mb-2">Last Traded Price</div>
                <div class="fsize12 primaryColor mb-2">
                  {{ this.postionInfodetails["LTP"] }}
                </div>
              </div>
              <div class="d-flex align-center justify-space-between">
                <div class="fsize12 secondaryColor mb-2">Order type</div>
                <div class="fsize12 primaryColor mb-2">Day</div>
              </div>
              <div class="d-flex align-center justify-space-between">
                <div class="fsize12 secondaryColor mb-2">Product</div>
                <div class="fsize12 primaryColor mb-2">
                  {{ this.postionInfodetails["Pcode"] }}
                </div>
              </div>
              <div class="d-flex align-center justify-space-between">
                <div class="fsize12 secondaryColor mb-2">Valitity</div>
                <div class="fsize12 primaryColor mb-2">
                  {{ this.postionInfodetails["Expdate"] }}
                </div>
              </div>
            </div>
            <div class="col-6 py-4 pr-2 pl-0">
              <div class="py-1 px-4">
                <div class="pl-4 fsize14 primaryColor mb-2">Buys</div>
                <div class="d-flex justify-space-between">
                  <div class="pl-4 fsize12 secondaryColor mb-2">Qty</div>
                  <div class="width-30 fsize12 primaryColor mb-2">
                    {{ this.postionInfodetails["Bqty"] }}
                  </div>
                </div>
                <div class="d-flex justify-space-between">
                  <div class="pl-4 fsize12 secondaryColor mb-2">Price</div>
                  <div class="width-30 fsize12 primaryColor mb-2">
                    {{ this.postionInfodetails["NetBuyavgprc"] }}
                  </div>
                </div>

                <div class="d-flex justify-space-between">
                  <div class="pl-4 fsize12 secondaryColor mb-2">Value</div>
                  <div class="width-30 fsize12 primaryColor mb-2">
                    {{ this.postionInfodetails["netbuyamt"] }}
                  </div>
                </div>

                <hr class="my-2" />
                <div class="pl-4 fsize14 primaryColor mb-2">Sells</div>
                <div class="d-flex justify-space-between">
                  <div class="pl-4 fsize12 secondaryColor mb-2">Qty</div>
                  <div class="width-30 fsize12 primaryColor mb-2">
                    {{ this.postionInfodetails["Sqty"] }}
                  </div>
                </div>
                <div class="d-flex justify-space-between">
                  <div class="pl-4 fsize12 secondaryColor mb-2">Price</div>
                  <div class="width-30 fsize12 primaryColor mb-2">
                    {{ this.postionInfodetails["NetSellavgprc"] }}
                  </div>
                </div>

                <div class="d-flex justify-space-between">
                  <div class="pl-4 fsize12 secondaryColor mb-2">Value</div>
                  <div class="width-30 fsize12 primaryColor mb-2">
                    {{ this.postionInfodetails["netSellamt"] }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row pt-4 ma-0 d-flex justify-end">
          <v-btn
            depressed
            outlined
            class="fsize14 text-capitalize"
            width="60px"
            height="32px"
            @click="infoDialog = false"
            >Close</v-btn
          >
        </div>
      </v-card>
    </v-dialog>

    <!-- exit dialog popup -->
    <v-dialog v-model="exitPositionDialog" max-width="700px">
      <v-expand-transition>
        <v-card class="pa-5">
          <div class="pb-4">
            {{
              this.selectedCheckbox.length > 1
                ? "Exit Positions"
                : "Exit Position"
            }}
          </div>
          <div class="">
            <v-simple-table class="border-ededed">
              <thead>
                <tr>
                  <th></th>
                  <th class="text-left"><span>Instrument</span></th>
                  <th class="text-right"><span>Qty</span></th>
                  <th class="text-center"><span>Price</span></th>
                  <th class="text-left"><span>Type</span></th>
                  <th class="text-left"><span>Product</span></th>
                  <th class="text-left"><span>Validity</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in this.selectedCheckbox" :key="index">
                  <td class="text-center">
                    <button
                      class="rounded-sm text-capitalize fsize10 px-3 py-1"
                      :class="item.Netqty > 0 ? 'sellcolor' : 'buycolor'"
                    >
                      {{ item.Netqty > 0 ? "SELL" : "BUY" }}
                    </button>
                  </td>

                  <td class="text-left">
                    {{
                      item.formatScripName == null
                        ? item.Tsym
                        : item.formatScripName
                    }}
                    <span class="fsize10 secondaryColor">{{
                      item.Exchange
                    }}</span>
                  </td>

                  <td class="text-right">
                    <span>{{ Math.abs(item.Netqty) }}</span>
                  </td>

                  <td class="text-center">
                    <span>--</span>
                  </td>

                  <td class="text-left">
                    <span>MKT</span>
                  </td>

                  <td class="text-left">
                    <span>{{ item.Pcode == "M" ? "MIS" : "NRML" }}</span>
                  </td>
                  <td class="text-left">
                    <span>DAY</span>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </div>
          <div class="text-right pt-4">
            <v-btn
              height="32"
              min-width="80"
              depressed
              :loading="exitLoader"
              :disabled="exitLoader"
              :color="$store.state.buttonThemeColor"
              class="fsize14 text-capitalize white--text"
              @click="exitAllPositions()"
              >Confirm</v-btn
            >
            <v-btn
              height="32"
              outlined
              min-width="80"
              depressed
              class="ml-2 secondaryColor fsize14 text-capitalize"
              @click="$store.commit('position/setPositionExitDialog', false)"
            >
              Close
            </v-btn>
          </div>
        </v-card>
      </v-expand-transition>
    </v-dialog>

    <!-- convert dialog box -->
    <v-dialog v-model="positionConvertDialog" width="500px">
      <v-expand-transition>
        <v-card>
           <div class="pb-2 px-8 pt-4 d-flex align-center justify-space-between">
           {{
                  convertDialogData.formatScripName == null
                    ? convertDialogData.Tsym
                    : convertDialogData.formatScripName
                }}
          <!-- <span>Are you sure want to logout?</span> -->
          <button type="button" @click="positionConvertDialog = false" class="fsize21 float-right" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
          <div class="pt-4 px-8 pb-4">
            <v-sheet class="d-flex align-center justify-space-between my-2">
              <div class="d-flex flex-column align-center">
                <div class="secondaryColor fsize12 mb-1" style="width: -webkit-fill-available;">Type</div>
                <div class="d-flex align-center">
                  <input type="radio" checked><p class="primaryColor fsize14 mb-0 ml-2">DAY</p>
                </div>
              </div>
              <div class="d-flex flex-column">
                <p class="secondaryColor mb-1 fsize12">Product</p>
                <p class="primaryColor fsize14 mb-0">
                  <span>{{ convertDialogData["Pcode"] }}</span>
                  <span class="px-2 fsize16">
                    &#x2192;
                  </span>
                  <span>{{
                      convertDialogData["Pcode"] == "NRML" ||
                      convertDialogData["Pcode"] == "CNC"
                        ? "MIS"
                        : convertDialogData["Exchangeseg"] == "nse_cm" ||
                          convertDialogData["Exchangeseg"] == "bse_cm"
                        ? "CNC"
                        : "NRML"
                    }}</span>
                </p>
              </div>
              <div class="d-flex flex-column">
                <p class="secondaryColor fsize12 mb-1">Quantity</p>
                <v-text-field
                  height="32"
                  @input="qtyErr = inputFieldValidator()"
                  :step="Math.abs(minlot)"
                  :min="0"
                  :max="convertDialogData.Netqty"
                  class="body-2 qtyInput"
                  v-model.number="convertQty"
                  outlined
                  type="number"
                  autofocus
                  hide-no-data
                  hide-details
                  solo
                  tile
                  flat
                  dense
                ></v-text-field>
              </div>
            </v-sheet>
            <div class="d-flex justify-space-between pt-4">
              <div class="fsize12 red--text">{{ qtyErr }}</div>
              <div>
                <v-btn
                  height="32"
                  :loading="convertionLoader"
                  :disabled="convertionLoader"
                  min-width="80"
                  depressed
                  :color="$store.state.buttonThemeColor"
                  class="fsize14 text-capitalize white--text"
                  @click="positionConvert()"
                  >Convert</v-btn
                >
                <v-btn
                  height="32"
                  min-width="80"
                  outlined
                  depressed
                  class="ml-2 fsize14 text-capitalize"
                  @click="
                    $store.commit('position/setPositionConvertDialog', false)
                  "
                >
                  Close
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-expand-transition>
    </v-dialog>

    <bottomsheet :currentData="currentSheetData" v-on:from-child ="getChildData"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import commonFunc from "../mixins/commonFunctions";
import window from "../mixins/orderWindow";
import toaster from "../store/Services/errorHandling";
import bottomsheet from '../components/bottomSheet.vue'
import customIcon from '../components/customIcon.vue'
export default {
  mixins: [commonFunc, window],
  data: () => ({
    searchPosition: "",
    infoDialog: false,
    selectedCheckbox: [],
    postionInfodetails: [],
    convertDialog: false,
    isDropped: false,
    currentIndex: -1,
    convertDialogData: [],
    convertQty: Number,
    qtyErr: "",
    isRotate: true,
    currentSheetData: []
  }),
  components:{
    bottomsheet,
    customIcon
  },

  computed: {
    ...mapState("position", [
      "totalPnl",
      "currentTableData",
      "tabList",
      "postionLoader",
      "positionConvertData",
      "exitLoader",
      "convertionLoader",
      "currentTotalPnl",
    ]),
    ...mapState("orderWindow", ["minlot"]),
    ...mapGetters("position", [
      "getPositionExitDialog",
      "getPositionConvertDialog",
    ]),

    positionSearchFilter() {
      return this.currentTableData.filter((post) => {
        return post.Tsym.toLowerCase().includes(
          this.searchPosition.toLowerCase()
        );
      });
    },

    checkboxSelectAll: {
      get: function () {
        var _checked = [];
        this.currentTableData.forEach((item) => {
          if (
            item.Netqty != "0" &&
            item.Pcode !== "CO" &&
            item.Pcode !== "BO"
          ) {
            _checked.push(item);
          }
        });
        return this.currentTableData && _checked.length > 0
          ? this.selectedCheckbox.length == _checked.length
          : false;
      },
      set: function (value) {
        var checked = [];
        if (value) {
          this.currentTableData.forEach((item) => {
            if (
              item.Netqty != "0" &&
              item.Pcode !== "CO" &&
              item.Pcode !== "BO"
            ) {
              checked.push(item);
            }
          });
        }
        this.selectedCheckbox = checked;
      },
    },

    exitPositionDialog: {
      get() {
        return this.getPositionExitDialog;
      },
      set(value) {
        if (!value) {
          this.$store.commit("position/setPositionExitDialog", value);
          return value;
        }
      },
    },

    positionConvertDialog: {
      get() {
        return this.getPositionConvertDialog;
      },
      set(value) {
        if (!value) {
          this.$store.commit("position/setPositionConvertDialog", value);
          return value;
        }
      },
    },

    infoType: {
      get() {
        return this.$store.state.position.infoType;
      },
      set(value) {
        this.$store.commit("position/setCurrentTab", value);
        this.$store.commit("position/setCurrentTableData", value);
        this.selectedCheckbox = [];
        localStorage.setItem("positionTab", JSON.stringify(value));
      },
    },
  },
  created() {
    this.$store.dispatch("position/getPositions");
    this.selectedCheckbox = [];
  },

  methods: {
     getChildData(data){
      if(data['page'] == 'Position'){
        if(data['action'] == 'buy' || data['action'] == 'sell' || data['action'] == 'Add' || data['action'] == 'Exit'){
       data['action'] == 'Add' ? this.callOrderWindow(parseFloat(data['item'].Netqty) < 0 ? 'sell' : 'buy' ,data.item, data['action']) : data['action'] == 'Exit' ? this.callOrderWindow(parseFloat(item.Netqty) < 0 ? 'buy' : 'sell', item, data['action']) :  this.callOrderWindow(data['action'] , data.item , data['action'] == 'buy' ? 'Buy' : 'Sell')
        }
         if(data['action'] == "Convert"){
          this.callConvertDialog(data.item)
        }
         if(data['action'] == 'info'){
          this.showDialog(data.item)
        }
        if(data['action'] == 'squareOff'){
          this.selectedCheckbox.push(data['item'])
          this.exitAllPositions()
        }
        if(data['action'] == 'chart'){
          this.callTrandingViewChart(data.item, 'position')
        }
        
      }
    },
    callBottomSheet(val){
         this.currentSheetData = []
      var tempData = {
        where: 'Position',
        isOpen: true,
        item: val,
      }
      this.currentSheetData.push(tempData)
    },

    totalGroup: function (group) {
      let total = [];
      if (group) {
        group.forEach((val) => {
          total.push(val.MtoM);
        });
        return this.ruppesFormat(
          parseFloat(
            total.reduce(function (total, num) {
              return parseFloat(total) + parseFloat(num);
            }, 0)
          ).toFixed(2)
        );
      }
    },
    getWindowHeight() {
      var offsetHeight =
        this.$store.state.windowHeight -
        document.getElementById("moreOrderBtn").getBoundingClientRect().top;
      var dropdownHeight = 125;
      offsetHeight < dropdownHeight
        ? (this.isRotate = true)
        : (this.isRotate = false);
    },
    showDialog(item) {
      this.postionInfodetails = item;
      this.infoDialog = true;
    },
    // call order window
    async callOrderWindow(orderType, value, type) {
      if (type == "Exit" && (value.Pcode == "CO" || value.Pcode == "BO")) {
        toaster.toaster(
          "",
          "primary",
          "Exit BO and CO Order From OrderBook",
          5000
        );
        this.$store.commit(
          "header/setTabSelection",
          this.$store.state.isMobileView ? 2 : 1
        );
        this.$router
          .push({ path: "orders", query: { tab: "Pending" } })
          .catch(() => {});
      } else {
        this.$store.commit("orderWindow/setWindowLoading", true);
        this.$store.dispatch("orderWindow/setInitialValues", {
          data: value,
          page: "positions",
        });
        this.$store.commit("orderWindow/setCurrentOrder", {
          data: value,
          page: "positions",
        });
        this.$store.commit("orderWindow/setOrderWindow", orderType);
        this.$store.commit("orderWindow/setOrderType", orderType);
        this.$store.dispatch("orderWindow/getNewPriceRange");
        await this.$store.dispatch("orderWindow/getScripQuoteDetails", value);
        this.changeOrderTab();
      }
    },

    async callConvertDialog(value) {
      this.$store.commit("orderWindow/setCurrentOrder", {
        data: value,
        page: "positions",
      });
      await this.$store.dispatch("orderWindow/getScripQuoteDetails", value);
      this.$store.commit("position/setPositionConvertDialog", await true);
      this.convertDialogData = value;
      this.convertQty = Math.abs(this.convertDialogData.Netqty);
    },

    async exitAllPositions() {
      await this.$store.dispatch(
        "position/exitPosition",
        this.selectedCheckbox
      );
      this.selectedCheckbox = [];
    },

    inputFieldValidator() {
      if (this.convertQty.toString() == "") {
        return "Quantity cannot not be empty";
      } else if (this.convertQty == 0) {
        return "Quantity should not be Zero";
      } else if (this.convertQty % this.minlot != 0) {
        return "Quantity should be multiple of " + this.minlot;
      } else if (this.convertQty > this.convertDialogData.Netqty) {
        return (
          "Quantity should not greater then " + this.convertDialogData.Netqty
        );
      }
    },

    /**
     * Covert Position
     * @author senthil
     * @since 13/12/21
     */
    async positionConvert() {
      if (this.qtyErr == "") {
        await this.$store.dispatch("position/positionConversion", {
          data: this.convertDialogData,
          qty: this.convertQty,
        });
      }
    },
  },

  mounted() {
    var localTab = JSON.parse(localStorage.getItem("positionTab"));
    this.$route.query.tab
      ? (this.infoType = this.$route.query.tab)
      : (this.infoType = localTab);
    // this.$store.commit("position/setCurrentTab", this.infoType);
    // this.$store.commit("position/setCurrentTableData", this.infoType);
  },
};
</script>