<template>
  <div>
    <v-container fluid>
      <div class="basket-card pa-8" style="margin:60px auto;max-width:800px">
        <div class="d-flex flex-wrap justify-space-between pa-4 ">
          <div class="d-flex">
            {{ getAppName ? getAppName : '' }}
          </div>
          <div class="d-flex align-center">
            <div>
              <customIcon :name="'sidelogo'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
            </div>
            <div>
              <v-divider vertical class="mx-4"></v-divider>
            </div>
            <div>
              <span>{{ getUserId }}</span>
            </div>
          </div>
        </div>
        <div v-if="getBasketItems.length > 0">
        <table class="pos-reletive normal-table">
          <thead>
            <tr>
              <th></th>
              <th class="fsize14 text-left">Instrument</th>
              <th class="fsize14 text-left">Qty.</th>
              <th class="fsize14 text-left">Price</th>
              <th class="fsize14 text-left">Type</th>
              <th class="fsize14 text-left">Prod.</th>
              <th class="fsize14 text-left">Val.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(i,id) in getBasketItems" :key="id" @mouseenter="isDropped = false;currentIndex = id" @mouseleave="isDropped = false;currentIndex = -1">
              <td class="fsize14">
                <button class="rounded-sm text-capitalize fsize10 px-3 py-1" :class="i.transactionType.toLowerCase() == 'buy' ? 'buycolor' : 'sellcolor'">
                  {{ i.transactionType }}
                </button>
              </td>
              <td class="pos-reletive fsize14" @mouseleave="currentIndex = -1; isDropped = false">{{i.tradingSymbol}}
                <div class="dropdown position-absolute right-0" v-if="currentIndex == id">
                  <v-btn @click="isDropped = !isDropped" min-width="50" max-width="50" height="23" outlined depressed class="d-flex align-center justify-center pos-reletive fsize12 text-capitalize border-0075e1 rounded-sm color-0075e1 background-white">
                    More </v-btn>
                  <transition name="slide">
                    <ul v-if="currentIndex == id && isDropped" class="pa-0 list expectMkWatchMoreList">
                      <!-- <li @click="callOrderWindow(i.transactionType.toLowerCase(), i);isDropped = false;" class="primaryColor fsize12 cursor">
                        Modify
                      </li> -->
                      <li @click="deleteCurrentOrder(id,'delete'); isDropped = false;" class="primaryColor fsize12 cursor">
                        Delete
                      </li>
                    </ul>
                  </transition>
                </div>
              </td>
              <td class="fsize14">{{i.quantity}}</td>
              <td class="fsize14">{{i.price}}</td>
              <td class="fsize14">{{i.orderType}}</td>
              <td class="fsize14">{{i.product}}</td>
              <td class="fsize14">{{i.validity}}</td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-end py-6">
          <v-btn :loading="$store.state.loading" @click="placeOrder()" height="40" width="100" depressed color="primary" class="text-capitalize fsize14 mx-4">Place</v-btn>
          <v-btn @click.once="windowClose()" height="40" width="100" depressed outlined class="text-capitalize fsize14 ">Cancel</v-btn>
        </div>
        </div>
      </div>
    </v-container>
    <orderWindow v-if="showOrderWindow" />
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import orderWindow from "../mixins/orderWindow";
export default {
  mixins: [orderWindow],
  name: "Basket",
  data() {
    return {
      isDropped: false,
      currentIndex: -1,
    };
  },
  components: {
    customIcon: () => import("../components/customIcon.vue"),
    orderWindow:() => import("../components/orderWindow.vue"),
  },
  computed: {
    ...mapGetters("authtication", [
      "getUserId",
      "getUserSession",
      "getUserSessionDto",
    ]),
    ...mapGetters("basket", ["getBasketItems", "getVendorDetails","getAppName"]),
  },
  methods: {
    getBasket() {
      var basketSession = localStorage.getItem("basketSessionId");
      var basketAppCode = localStorage.getItem("basketAppCode");
      if (basketSession && basketAppCode) {
        this.$store.dispatch("basket/getBasket", {
          sessionId: basketSession,
          apiKey: basketAppCode,
        });
      }
    },
    deleteCurrentOrder(index, type) {
      this.$store.commit("basket/SET_BASKET_ITEMS", {
        index: index,
        type: type,
      });
    },
    async callOrderWindow(orderType, value) {
      this.$store.dispatch("orderWindow/setInitialValues", {
        data: value,
        page: "basket",
      });
      this.$store.commit("orderWindow/setWindowLoading", true);
      this.$store.commit("orderWindow/setCurrentOrder", {
        data: value,
        page: "basket",
      });
      await this.$store.commit("orderWindow/setOrderWindow", true);
      await this.$store.commit("orderWindow/setRemoveCss", true);
      await this.$store.commit("orderWindow/setOrderType", orderType);
      await this.$store.dispatch("orderWindow/getNewPriceRange");
      await this.$store.dispatch("orderWindow/getScripQuoteDetails", "");
      await this.changeOrderTab();
    },
    windowClose() {
      window.close();
    },
    placeOrder() {
      this.$store.dispatch("orderWindow/placeBasketOrder", {
        data: this.getBasketItems,
        page: "basket",
      });
    },
  },
  created() {
    this.getBasket();
  },
};
</script>

<style>
.basket-card {
  border-radius: 5px;
  background-color: #fff;
  margin: 60px auto;
  -webkit-box-shadow: 0 0 20px #eee;
  box-shadow: 0 0 20px #eee;
}
.normal-table {
  width: 100%;
  overflow: auto;
}
.normal-table th,
td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>