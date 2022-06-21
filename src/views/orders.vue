<template>
  <div>
    <div class="d-flex align-center px-4 py-2">
      <div class="font-weight-bold primaryColor">Orders</div>
      <v-progress-circular
        class="ml-2"
        indeterminate
        v-if="orderLoader"
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
                      path: 'orders',
                      query: { tab: infoType.trim().toString() },
                    })
                    .catch(() => {})
                "
              >
                <v-btn
                  depressed
                  :color="
                    active
                      ? 'activeColor white--text'
                      : 'unActiveColor black--text'
                  "
                  height="26"
                  min-width="50"
                  class="fsize12 mr-2 rounded-sm text-center text-capitalize"
                  :value="item.name"
                  @click="toggle"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ item.name }}
                  <span v-if="item.length != 0"
                    >&nbsp; ({{ item.length }})</span
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
        v-if="this.showOrderlist.length > 0"
      >
        <span class="search-box mx-2" v-if="!$store.state.isMobileView">
          <span class="searchwhole">
            <customIcon  :name="'search'" class="searchimg" :width="'16'" :height="'16'" :color="$store.state.amogaColor"  />
            <span class="searchinput">
              <input
                class="placeholdsearch"
                placeholder="Search"
                autocorrect="off"
                v-model="searchorder"
                oninput="this.value = this.value.toUpperCase()"
              />
            </span>
          </span>
        </span>
        <v-tooltip top color="toolTipColor toolTipTop">
          <template v-slot:activator="{ on, attrs }">
             <a id="a2">  
              <span v-bind="attrs" v-on="on" v-if="!$store.state.isMobileView" @click="checkDownload(infoType, 'orders' , showOrderlist)">
          <customIcon  :name="'download'" class="mx-1 cursor d-flex" :width="'21'" :height="'21'" :color="$store.state.amogaColor"  />
          </span>
          </a>
          </template>
          <span>Download</span>
        </v-tooltip>
      </span>
    </v-row>
    <v-divider class="mx-4 mb-2"></v-divider>
    <!-- v-if="showList.length != 0" -->
    <v-card
      class="ma-4"
      v-if="
        (showOrderlist.length > 0 &&
          this.searchorder == '' &&
          !this.orderLoader) ||
        (orderSearchFilter.length > 0 &&
          this.searchorder !== '' &&
          !this.orderLoader)
      "
    >
      <v-simple-table v-if="!$store.state.isMobileView"
        transition="fade-transition"
        id="tableData"
        :class="{ overflowinherit: isDropped }"
      >
        <thead>
          <tr class="tableRow">
            <th
              v-if="getInfoType == 'Pending'"
              class="text-left d-flex align-center"
            >
              <!-- <v-checkbox :ripple="false" class="ma-0" v-model="checkBoxSelectAll" color="#1f3565" hide-details></v-checkbox> -->
              <input
                type="checkbox"
                v-model="checkBoxSelectAll"
                class="tableCheckBox"
              />
            </th>
            <th class="text-left tableHeader">Time</th>
            <th class="text-center tableHeader">Type</th>
            <th class="text-left tableHeader">Instrument</th>
            <th class="text-left tableHeader">Product</th>
            <th class="text-right tableHeader">Qty.</th>
            <th class="text-right tableHeader" v-if="getInfoType == 'Pending'">
              LTP
            </th>
            <th class="text-right tableHeader">Price</th>
            <th
              class="text-center tableHeader"
              v-if="getInfoType != 'Trade Book'"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody
          class=""
          @mouseleave="
            currentIndex = -1;
            isDropped = false;
          "
        >
          <tr
            class="tableRow"
            v-for="(item, index) in this.searchorder == ''
              ? this.showOrderlist
              : orderSearchFilter"
            :key="index"
            @mouseenter="
              isDropped = false;
              currentIndex = index;
            "
          >
            <td class="px-4 py-2" v-if="getInfoType == 'Pending'">
              <!-- <v-checkbox :ripple="false" class="ma-0" v-model="selectedCheckbox" :value="item" color="#1f3565" hide-details></v-checkbox> -->
              <input
                type="checkbox"
                v-model="selectedCheckbox"
                :value="item"
                class="tableCheckBox"
              />
            </td>

            <td
              class="text-left primaryColor px-4 py-2 tableContent"
              v-if="getInfoType != 'Trade Book'"
            >
              {{
                item.OrderedTime != null
                  ? item.OrderedTime.split(" ")[1]
                  : item.OrderedTime
              }}
            </td>
            <td lass="text-left primaryColor px-4 py-2 tableContent" v-else>
              {{ item.Time.split(" ")[1] }}
            </td>
            <td class="text-center px-4 py-2 tableContent">
              <button
                class="rounded-sm text-capitalize fsize10 px-3 py-1"
                :class="item.Trantype == 'B' ? 'buycolor' : 'sellcolor'"
              >
                {{ item.Trantype == "B" ? "BUY" : "SELL" }}
              </button>
            </td>
            <td class="text-left pos-reletive px-4 py-2 tableContent">
              {{
                item.formatScripName == null ? item.Trsym : item.formatScripName
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
                      v-if="getInfoType == 'Pending'"
                      @click="
                        isDropped = false;
                        callOrderWindow(
                          item.Trantype == 'B' ? 'buy' : 'sell',
                          item,
                          'modify'
                        );
                      "
                      class="primaryColor fsize12 cursor"
                    >
                      Modify
                    </li>
                    <li
                      @click="
                        callOrderWindow('buy', item);
                        isDropped = false;
                      "
                      v-if="getInfoType != 'Pending'"
                      class="primaryColor fsize12 cursor"
                    >
                      Buy
                    </li>
                    <li
                      @click="
                        callOrderWindow('sell', item);
                        isDropped = false;
                      "
                      v-if="getInfoType != 'Pending'"
                      class="primaryColor fsize12 cursor"
                    >
                      Sell
                    </li>
                    <li
                      v-if="getInfoType == 'Pending'"
                      @click="
                        cancelOrderPopup(item, index);
                        isDropped = false;
                      "
                      class="primaryColor fsize12 cursor"
                    >
                      Cancel
                    </li>
                    <li
                      @click="
                        getInfo(item, index);
                        isDropped = false;
                      "
                      class="primaryColor fsize12 cursor"
                    >
                      Info
                    </li>
                    <li @click="
                        isDropped = false;
                        callTrandingViewChart(item, 'order');
                      " class="primaryColor fsize12 cursor">
                      Chart
                    </li>
                  </ul>
                </transition>
              </div>
            </td>
            <td class="text-left px-4 py-2 tableContent">{{ item.Pcode }}</td>
            <td
              class="text-right px-4 py-2 tableContent"
              v-if="getInfoType != 'Trade Book'"
            >
              {{ item["Fillshares"] + " / " + item["Qty"] }}
            </td>
            <td class="text-right px-4 py-2 tableContent" v-else>
              {{ item["Qty"] }}
            </td>
            <td
              class="text-right px-4 py-2 tableContent"
              v-if="getInfoType == 'Pending'"
            >
              {{
                isNaN(parseFloat(item.ltp))
                  ? item.ltp
                  : item.Exchange == "CDS" || item.Exchange == "BCD"
                  ? parseFloat(item.ltp).toFixed(4)
                  : parseFloat(item.ltp).toFixed(2)
              }}
            </td>
            <td
              class="text-right px-4 py-2 tableContent"
              v-if="getInfoType != 'Trade Book'"
            >
              {{
                item.Exchange == "CDS" || item.Exchange == "BCD"
                  ? parseFloat(item.Prc).toFixed(4)
                  : parseFloat(item.Prc).toFixed(2)
              }}<span v-if="parseFloat(item.Trgprc) > 0"
                >&nbsp;/&nbsp;{{
                  item.Exchange == "CDS" || item.Exchange == "BCD"
                    ? parseFloat(item["Trgprc"]).toFixed(4)
                    : parseFloat(item["Trgprc"]).toFixed(2)
                }}
                trg.</span
              >
            </td>
            <td class="text-right px-4 py-2 tableContent" v-else>
              {{
                item.Exchange == "CDS" || item.Exchange == "BCD"
                  ? parseFloat(item.Price).toFixed(4)
                  : parseFloat(item.Price).toFixed(2)
              }}
            </td>
            <td
              class="text-center px-4 py-2 tableContent"
              v-if="getInfoType != 'Trade Book'"
            >
              <v-tooltip
                transition="scroll-y-reverse-transition"
                :disabled="
                  item.RejReason == '--' ||
                  item.RejReason == '' ||
                  item.RejReason == null
                "
                max-width="300"
                top
                color="toolTipColor toolTipTop"
              >
                <template v-slot:activator="{ on, attrs }">
                  <button
                    v-bind="attrs"
                    v-on="on"
                    class="rounded text-capitalize fsize10 min-width-100"
                    :class="
                      item.Status == 'rejected'
                        ? 'rejected-msg'
                        : item.Status == 'complete'
                        ? 'completed-msg'
                        : 'cancelled-msg'
                    "
                  >
                    {{
                      (item.Status == "cancelled after market order"
                        ? "Cancelled AMO"
                        : item.Status ==
                          "modify after market order req received"
                        ? "Modified AMO"
                        : item.Status == "after market order req received"
                        ? "AMO"
                        : item.Status
                      ).toUpperCase()
                    }}
                  </button>
                </template>
                <span class="fsize12">{{ item.RejReason }}</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="selectedCheckbox.length > 0 && getInfoType == 'Pending'">
          <tr class="tableRow">
            <td class="text-left tableContent" colspan="9">
              <v-btn
                min-width="80"
                @click="$store.commit('order/setMultipleCancelDialog', true)"
                depressed
                height="32"
                :color="$store.state.buttonThemeColor"
                class="text-capitalize white--text fsize14 ml-0 ma-2"
                >{{
                  selectedCheckbox.length == 1
                    ? "Cancel Order"
                    : `Cancel Orders (${selectedCheckbox.length})`
                }}</v-btn
              >
            </td>
          </tr>
        </tfoot>
      </v-simple-table>

         <div v-if="$store.state.isMobileView">
        <div
          class="row ma-0 px-3 py-2 border-bottom-mwSearch"
          v-for="(item, index) in this.searchorder == ''
            ? this.showOrderlist
            : orderSearchFilter"
          :key="index" @click="callBottomSheet(item)"
        >
          <div class="col-6 pa-0 ma-0 d-flex align-center">
            <button
              class="rounded-sm text-capitalize fsize10 px-3 py-1"
              :class="item.Trantype == 'B' ? 'buycolor' : 'sellcolor'"
            >
              {{ item.Trantype == "B" ? "BUY" : "SELL" }}
            </button>

            <label
              for=""
              v-if="getInfoType != 'Trade Book'"
              class="pl-2 fsize12"
            >
              {{ item["Fillshares"] + " / " + item["Qty"] }}</label
            >
          </div>
          <div class="col-6 pa-0 ma-0 d-flex justify-end align-center">
            <div class="mr-2 fsize12">
              {{
                getInfoType != "Trade Book"
                  ? item.OrderedTime != null
                    ? item.OrderedTime.split(" ")[1]
                    : item.OrderedTime
                  : item.Time.split(" ")[1]
              }}
            </div>
            <button
              v-if="getInfoType != 'Trade Book'"
              class="rounded text-capitalize fsize10 min-width-100"
              :class="
                item.Status == 'rejected'
                  ? 'rejected-msg'
                  : item.Status == 'complete'
                  ? 'completed-msg'
                  : 'cancelled-msg'
              "
            >
              {{
                (item.Status == "cancelled after market order"
                  ? "Cancelled AMO"
                  : item.Status == "modify after market order req received"
                  ? "Modified AMO"
                  : item.Status == "after market order req received"
                  ? "AMO"
                  : item.Status
                ).toUpperCase()
              }}
            </button>
          </div>
          <div
            class="
              row
              pa-0
              fsize14
              mx-0
              my-2
              d-flex
              w-100
              justify-space-between
            "
          >
            <div>
              {{
                item.formatScripName == null ? item.Trsym : item.formatScripName
              }}
            </div>
            <div v-if="getInfoType != 'Trade Book'">
              {{
                item.Exchange == "CDS" || item.Exchange == "BCD"
                  ? parseFloat(item.Prc).toFixed(4)
                  : parseFloat(item.Prc).toFixed(2)
              }}<span v-if="parseFloat(item.Trgprc) > 0"
                >&nbsp;/&nbsp;{{
                  item.Exchange == "CDS" || item.Exchange == "BCD"
                    ? parseFloat(item["Trgprc"]).toFixed(4)
                    : parseFloat(item["Trgprc"]).toFixed(2)
                }}
                trg.</span
              >
            </div>
          </div>
          <div class="row ma-0 d-flex justify-space-between fsize12">
            <div v-if="getInfoType == 'Pending'">
              <span>{{ item.Exchange }}</span>
              <span class="px-2">{{ item.Pcode }}</span>
              <span>{{ item.Prctype }}</span>
            </div>
            <div v-if="getInfoType == 'Pending'">
              <span>LTP</span>
              <span class="px-2">{{
                isNaN(parseFloat(item.ltp))
                  ? item.ltp
                  : item.Exchange == "CDS" || item.Exchange == "BCD"
                  ? parseFloat(item.ltp).toFixed(4)
                  : parseFloat(item.ltp).toFixed(2)
              }}</span>
            </div>

            <div v-if="getInfoType !== 'Pending'">
              <span>{{ item.Exchange }}</span>
            </div>
            <div v-if="getInfoType !== 'Pending'">
              <span class="px-2">{{ item.Pcode }}</span>
              <span>{{ item.Prctype }}</span>
            </div>
          </div>
        </div>
      </div>  
    </v-card>

    <div
      class="d-flex flex-column justify-center align-center vh-70"
      v-if="
        (!!showOrderlist &&
          showOrderlist.length == 0 &&
          this.searchorder == '' &&
          !this.orderLoader) ||
        (!!showOrderlist &&
          orderSearchFilter.length == 0 &&
          this.searchorder !== '' &&
          !this.orderLoader)
      "
    >
      <div>
        <img
          src="../assets/images/noData.svg"
          alt=""
          class="w-300 h-170 mb-4"
        />
      </div>
      <div class="primaryColor">NO ORDERS FOUND</div>
    </div>

    <!-- info dialog -->

    <v-dialog
      v-model="infoDialog"
      width="650px"
      transition="scroll-y-reverse-transition"
      :retain-focus="false"
    >
      <v-card class="pa-5">
        <v-slide-group v-model="infoItems" mandatory hide-arrows>
          <v-slide-item
            v-for="(item, i) in Items"
            :key="i"
            v-bind:value="item"
            v-slot="{ active, toggle }"
          >
            <v-btn
              depressed
              :color="active ? 'activeColor' : 'unActiveColor'"
              height="26"
              min-width="80"
              width="100px"
              class="
                rounded-sm
                fsize13
                mr-2
                text-center
                white--text
                text-capitalize
              "
              :value="item"
              @click="toggle"
            >
              {{ item }}
            </v-btn>
          </v-slide-item>
        </v-slide-group>
        <div class="d-flex align-baseline py-3">
          <button
            class="rounded-sm text-capitalize fsize10 px-3 py-1"
            :class="this.orderHistory.Action == 'B' ? 'buycolor' : 'sellcolor'"
          >
            {{ this.orderHistory.Action == "B" ? "BUY" : "SELL" }}
          </button>

          <div class="mx-2 fsize14">
            {{ this.orderHistory.Trsym }}
          </div>
          <div class="fsize9">{{ this.orderHistory["exchange"] }}</div>
          <div class="mt-1 fsize14 primaryColor orderalign">
            Nest.Order.No#{{ this.orderHistory["nestordernumber"] }}
          </div>
        </div>
        <v-divider class="mx-2 mb-2"></v-divider>

        <div v-if="infoItems == 'Information'" class="height-250">
          <div class="py-2">
            <div class="row ma-0">
              <div class="col-6 py-4 px-4">
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Quantity</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.orderHistory["Qty"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Price</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.orderHistory["Prc"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Avg.price</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.orderHistory["averageprice"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Trigger price</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.orderHistory["triggerprice"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Order type</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.orderHistory["Ordtype"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Product</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.orderHistory["productcode"] }}
                  </div>
                </div>
              </div>

              <v-divider vertical></v-divider>

              <div class="col-6 py-4 px-4">
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Validity</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.orderHistory["duration"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Exch. Order ID</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{
                      orderHistory.exchangeorderid == null
                        ? "NA"
                        : orderHistory.exchangeorderid
                    }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Time</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ this.orderHistory["filldateandtime"] }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Exch. Time</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{
                      orderHistory.ExchTimeStamp != null
                        ? orderHistory.ExchTimeStamp.split(" ")[1]
                        : orderHistory.ExchTimeStamp
                    }}
                  </div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div class="fsize12 secondaryColor mb-2">Placed by</div>
                  <div class="fsize12 primaryColor mb-2">
                    {{ getUserId }}
                  </div>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between">
                <div class="fsize12 secondaryColor mb-2 mt-1 px-4">
                  Reason: &nbsp;
                </div>
                <div
                  class="fsize12 primaryColor mb-2 mt-1"
                  v-if="
                    orderHistory.rejectionreason != undefined &&
                    orderHistory.rejectionreason != null &&
                    orderHistory.rejectionreason != ''
                  "
                >
                  {{ this.orderHistory["rejectionreason"] }}
                </div>
              </div>
            </div>
          </div>
          <v-divider></v-divider>
        </div>

        <div v-if="infoItems == 'History'" class="height-250">
          <v-simple-table class="px-3">
            <thead>
              <tr>
                <th class="text-left fsize12 secondColor">Time</th>
                <th class="text-center fsize12 secondColor">Status</th>
                <th class="text-center fsize12 secondColor">Exch. time</th>
                <th class="text-center fsize12 secondColor">Exch. update</th>
                <th class="text-center fsize12 secondColor">Qty</th>
                <th class="text-center fsize12 secondColor">Filled qty</th>
                <th class="text-center fsize12 secondColor">Avg. price</th>
                <th class="text-center fsize12 secondColor">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left fsize12 primaryColor">
                  {{
                    orderHistory.ExchTimeStamp != null
                      ? orderHistory.ExchTimeStamp.split(" ")[1]
                      : orderHistory.ExchTimeStamp
                  }}
                </td>
                <td class="text-center fsize12 primaryColor">
                  {{ orderHistory.Status }}
                </td>
                <td class="text-center fsize12 primaryColor">
                  {{
                    orderHistory.exchangetimestamp != null
                      ? orderHistory.exchangetimestamp.split(" ")[1]
                      : orderHistory.exchangetimestamp
                  }}
                </td>
                <td class="text-center fsize12 primaryColor">
                  {{ orderHistory.filldateandtime }}
                </td>
                <td class="text-center fsize12 primaryColor">
                  {{ orderHistory.Qty }}
                </td>
                <td class="text-center fsize12 primaryColor">
                  {{ orderHistory.filledShares }}
                </td>
                <td class="text-center fsize12 primaryColor">
                  {{ orderHistory.averageprice }}
                </td>
                <td class="text-center fsize12 primaryColor">
                  {{ orderHistory.Prc }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </div>
        <div class="row pt-4 ma-0 d-flex justify-end">
          <v-btn
            depressed
            outlined
            class="text-capitalize"
            width="60px"
            height="32px"
            @click="infoDialog = false"
            >Close</v-btn
          >
        </div>
      </v-card>
    </v-dialog>

    <!-- cancel order popup-->

    <v-dialog v-model="multipleCancelDialog" width="700px">
      <v-expand-transition>
        <v-card class="pa-5">
          <div class="pb-4">Cancel Order</div>
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
                    <span class="cancelled-msg px-2 py-1 rounded fsize11"
                      >CANCEL</span
                    >
                  </td>

                  <td class="text-left">
                    {{
                      item.formatScripName == null
                        ? item.Trsym
                        : item.formatScripName
                    }}
                    <span class="fsize10 secondaryColor">{{
                      item.Exchange
                    }}</span>
                  </td>

                  <td class="text-right">
                    <span>{{ item.Qty }}</span>
                  </td>

                  <td class="text-center">
                    <span>{{
                      item.Exchange == "CDS" || item.Exchange == "BCD"
                        ? parseFloat(item.Avgprc).toFixed(4)
                        : parseFloat(item.Avgprc).toFixed(2)
                    }}</span>
                  </td>

                  <td class="text-left">
                    <span>{{ item.Prctype }}</span>
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
              :color="$store.state.buttonThemeColor"
              class="fsize14 mr-2 text-capitalize white--text"
              :loading="singleCancelLoader"
              :disabled="singleCancelLoader"
              @click="cancelOrder(selectedCheckbox, 'multiple')"
              >Confirm</v-btn
            >
            <v-btn
              outlined
              height="32"
              min-width="80"
              color="#9b9b9b"
              depressed
              class="fsize14 text-capitalize secondaryColor"
              @click="$store.commit('order/setMultipleCancelDialog', false)"
            >
              Close
            </v-btn>
          </div>
        </v-card>
      </v-expand-transition>
    </v-dialog>

    <!-- single order cancel popup-->

    <v-dialog
      class="singleCancelDialog"
      v-model="singleCancelDialog"
      width="500px"
    >
      <v-expand-transition>
        <v-card class="pa-5">
          <div class="pb-4 fsize16 font-weight-bold">Cancel the Order?</div>
          <div class="text-left font-weight-bold mb-1 fsize14">
            {{
              cancelarray.formatScripName == null
                ? cancelarray.Trsym
                : cancelarray.formatScripName
            }}
          </div>
          <div class="text-left fsize13">#{{ cancelarray.Nstordno }}</div>
          <div class="text-right pt-4">
            <v-btn
              height="32"
              min-width="80"
              depressed
              :loading="singleCancelLoader"
              :disabled="singleCancelLoader"
              :color="$store.state.buttonThemeColor"
              class="fsize14 text-capitalize white--text"
              @click="cancelOrder(cancelarray, 'single')"
              >Confirm</v-btn
            >
            <v-btn
              outlined
              height="32"
              min-width="80"
              depressed
              class="ml-2 fsize14 text-capitalize"
              @click="$store.commit('order/setSingleCancelDialog', false)"
            >
              Close
            </v-btn>
          </div>
        </v-card>
      </v-expand-transition>
    </v-dialog>
    <bottomsheet :currentData="currentSheetData" v-on:from-child ="getChildData"/>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import window from "../mixins/orderWindow";
import commonFunc from "../mixins/commonFunctions";
import bottomsheet from '../components/bottomSheet.vue'
import customIcon from '../components/customIcon.vue'
export default {
  mixins: [commonFunc, window],
  data: () => ({
    searchorder: "",
    selectedCheckbox: [],
    infoDialog: false,
    Items: ["Information", "History"],
    infoItems: "Information",
    isDropped: false,
    currentIndex: -1,
    cancelarray: [],
    isRotate: false,
    currentSheetData: []
  }),
  components:{
    bottomsheet,
    customIcon
  },

  computed: {
    ...mapState("order", [
      "pendingOrderList",
      "completedOrderList",
      "tradeBookList",
      "showOrderlist",
      "tabList",
      "orderHistory",
      "orderLoader",
      "singleCancelLoader",
      "cancelMultiple",
    ]),
    ...mapGetters("order", ["getTradeList", "getInfoType"]),
    ...mapGetters("position", [{ getInfoTypePosition: "getInfoType" }]),
    ...mapGetters("position", [{ getInfoTypePosition: "getInfoType" }]),
    ...mapGetters("authtication", ["getUserId"]),
    ...mapGetters("order", [
      "getSingleCancelDialog",
      "getMultipleCancelDialog",
    ]),

    infoType: {
      get: function () {
        return this.getInfoType;
      },
      set: function (value) {
        if (value == "Pending") {
          this.selectedCheckbox = [];
        }
        localStorage.setItem("orderTab", JSON.stringify(value));
        return this.$store.commit("order/setTabActive", value);
      },
    },

    checkBoxSelectAll: {
      get: function () {
        this.$store.commit("order/setMultiple", this.selectedCheckbox.length);
        return this.showOrderlist
          ? this.selectedCheckbox.length == this.showOrderlist.length
          : false;
      },
      set: function (value) {
        var selected = [];
        if (value) {
          this.showOrderlist.forEach(function (item) {
            selected.push(item);
          });
        } else {
          this.cancelMultiple == 0 ? (this.selectedCheckbox = []) : "";
        }
        this.selectedCheckbox = selected;
      },
    },

    orderSearchFilter() {
      return this.showOrderlist.filter((post) => {
        return this.getInfoType == "Trade Book"
          ? post.Tsym.toLowerCase().includes(this.searchorder.toLowerCase())
          : post.Trsym.toLowerCase().includes(this.searchorder.toLowerCase());
      });
    },

    singleCancelDialog: {
      get() {
        return this.getSingleCancelDialog;
      },
      set(value) {
        if (!value) {
          this.$store.commit("order/setSingleCancelDialog", value);
        }
        return value;
      },
    },

    multipleCancelDialog: {
      get() {
        return this.getMultipleCancelDialog;
      },
      set(value) {
        if (!value) {
          this.$store.commit("order/setMultipleCancelDialog", value);
          return value;
        }
      },
    },
  },

  methods: {
     getChildData(data){
      if(data['page'] == 'Order'){
        const index = this.showOrderlist.indexOf(data.item)
        if(data['action'] == 'buy' || data['action'] == 'sell' || data['action'] == 'modify'){
        data['action'] == 'modify' ? this.callOrderWindow(data['item'].Trantype == 'B' ? 'buy' : 'sell' ,data.item, data['action']) :  this.callOrderWindow(data['action'] , data.item)
        }
         if(data['action'] == "cancel"){
          this.cancelOrderPopup(data.item, index)
        }
         if(data['action'] == 'info'){
          this.getInfo(data.item, index)
        }
        if(data['action'] == 'chart'){
          this.callTrandingViewChart(data.item, 'order')
        }
      }
    },
    callBottomSheet(val){
         this.currentSheetData = []
      var tempData = {
        where: 'Order',
        isOpen: true,
        item: val,
        tab: this.infoType
      }
      this.currentSheetData.push(tempData)
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
    getInfo(item, index) {
      this.$store.dispatch("order/getOrderHistory", item);
      this.infoDialog = true;
      this.infoItems = 0;
    },
    async callOrderWindow(orderType, value, type) {
      this.$store.commit("orderWindow/setWindowLoading", true);
      type == "modify"
        ? this.$store.commit("orderWindow/setOrderWindowModify", orderType)
        : this.$store.commit("orderWindow/setOrderWindow", orderType);
      this.$store.commit("orderWindow/setCurrentOrder", {
        data: value,
        page: "orders",
      });
      this.$store.dispatch("orderWindow/setInitialValues", {
        data: value,
        page: "orders",
        type: type == "modify" ? true : false,
      });
      this.$store.commit("orderWindow/setOrderType", orderType);
      this.$store.dispatch("orderWindow/getNewPriceRange");
      await this.$store.dispatch("orderWindow/getScripQuoteDetails", value);
      this.changeOrderTab();
    },

    cancelOrderPopup(val) {
      this.cancelarray = val;
      this.$store.commit("order/setSingleCancelDialog", true);
    },
    async cancelOrder(val, type) {
      
      if (type == "single") {
        await val.Pcode == 'BO' ? this.$store.dispatch("order/cancelBraketOrder", val): val.Pcode == 'CO' ? this.$store.dispatch("order/cancelCoverOrder", val) : this.$store.dispatch("order/cancelOrder", val);
      } else {
        for (let item of this.selectedCheckbox) {
          await item.Pcode == 'BO' ? this.$store.dispatch("order/cancelBraketOrder", item): item.Pcode == 'CO' ? this.$store.dispatch("order/cancelCoverOrder", item) : this.$store.dispatch("order/cancelOrder", item);
        }
      }
    },
  },
  watch: {
    cancelMultiple: function (val) {
      if (val == 0) {
        this.selectedCheckbox = [];
      }
    },
  },

  async created() {
    await this.$store.dispatch("order/getOrderList");
    var localTab = JSON.parse(localStorage.getItem("orderTab"));
    this.$route.query.tab
      ? this.$store.commit("order/setTabActive", this.$route.query.tab)
      : this.$store.commit("order/setTabActive", localTab);
  },
};
</script>