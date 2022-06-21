<template>
  <div>
    <div class="px-4  py-2 d-flex align-center">
      <div class="font-weight-bold primaryColor" v-if="!$store.state.isMobileView"><span class="fsize16"> Welcome, </span><span class="fsize14">{{getUserSessionDto['accountName']}}</span></div>
      <v-progress-circular class="ml-2" indeterminate size="18" v-if="fundsOrHoldingsLoader" :width="2" color="blue"></v-progress-circular>
    </div>
    <v-row class="ma-0 px-4">
      <v-slide-group v-model="infoType" class="pa-0" mandatory hide-arrows>
        <v-slide-item v-for="(item, i) in Items" :key="i" v-bind:value="item" v-slot="{ active, toggle }">
          <v-btn depressed :color="
              active ? 'activeColor white--text' : 'unActiveColor black--text'
            " height="26" min-width="50" class="fsize12 mr-2 rounded-sm text-center text-capitalize" :value="item" @click="toggle">
            {{ item }}
          </v-btn>
        </v-slide-item>
      </v-slide-group>
      <v-spacer></v-spacer>
    </v-row>

    <v-divider class="mx-4 my-2"></v-divider>

    <div v-if="!this.fundsOrHoldingsLoader">
      <v-card class="ma-4 py-4 px-10" v-if="infoType == 'Home'">
        <v-row class="ma-0 pa-0  mx-auto container">
          <v-col xs="12" sm="12" md="12" lg="12" xl="12" class="pa-0">
            <v-row class="ma-0">
             <label class="primaryColor d-flex align-center h-40  fsize16"><span class="pr-2"> <customIcon class="mt-1" :name="'funds'" :width="'18'" :height="'18'" :color="$store.state.iconBlackColourCode" /> </span>Equity</label>
            </v-row>

            <v-row class="ma-0 pb-8">
              <v-col xs="6" sm="6" md="6" lg="6" xl="6" class="pa-4">
                <div>
                  <label class="fsize14 secondColor">Margin available</label>
                </div>
                <div>
                  <label class="fsize28 primaryColor">{{
                 this.fundsLimit.net == undefined ? 'NA' :  ruppesFormat(formatNum(this.fundsLimit.net)) 
                  }}</label>
                </div>
              </v-col>
              <v-divider vertical color="#eee" v-if="!$store.state.isMobileView"></v-divider>

              <v-col xs="6" sm="6" md="6" lg="6" xl="6" class="pa-4">
                <div   :class="!$store.state.isMobileView ? 'd-flex l-height-32-h-32' : 'd-contents'">
                  <div class="fsize14 secondColor " :class="!$store.state.isMobileView ? 'width-52' : ''">Margins used</div>
                  <div class="fsize16 primaryColor width-fit-content">{{
                   this.fundsLimit.subtotal == undefined ? 'NA' : ruppesFormat(formatNum(this.fundsLimit.subtotal))
                  }}</div>
                </div>
                <div  :class="!$store.state.isMobileView ? 'd-flex l-height-32-h-32' : 'd-contents'">
                  <div class="fsize14 secondColor " :class="!$store.state.isMobileView ? 'width-52' : ''">Opening balance</div>
                  <div class="fsize16 primaryColor width-fit-content">{{
                  this.fundsLimit.cashmarginavailable == undefined ? 'NA' :  ruppesFormat(formatNum(this.fundsLimit.cashmarginavailable)) 
                  }}</div>
                </div>
              </v-col>
            </v-row>

            <v-row class="ma-0 pa-0 mx-auto">
             <label class="primaryColor d-flex align-center h-40  fsize16">
                <span class="pr-2"><customIcon class="mt-1" :name="'holdings'" :width="'18'" :height="'18'" :color="$store.state.iconBlackColourCode" /> </span>Holdings
              </label>
            </v-row>

            <v-row class="ma-0 pb-8">
              <v-col xs="6" sm="6" md="6" lg="6" xl="6" class="pa-4">
                <div>
                  <label class="fsize14 secondColor">P&L</label>
                </div>
                <div>
                  <label class="fsize28" :class="totalPnl >= 0 ? 'positiveColor' : 'negativeColor'">{{ruppesFormat(totalPnl.toFixed(2))}}</label>
                  <div class="fsize14" :class="totalPnlChange >= 0 ? 'positiveColor' : 'negativeColor'">({{totalPnlChange.toFixed(2)}}%)</div>
                </div>
              </v-col>
              <v-divider vertical color="#eee" v-if="!$store.state.isMobileView"></v-divider>
              <v-col xs="6" sm="6" md="6" lg="6" xl="6" class="pa-4">
                <div :class="!$store.state.isMobileView ? 'd-flex l-height-32-h-32' : 'd-contents'" class="mb-2">
                  <div class="fsize14 secondColor " :class="!$store.state.isMobileView ? 'width-52' : ''">Current value</div>
                  <div class="fsize16 width-fit-content" :class="totalcurrentValue >= 0 ? 'positiveColor' : 'negativeColor'">{{ruppesFormat(totalcurrentValue.toFixed(2))}}</div>
                </div>
                <div :class="!$store.state.isMobileView ? 'd-flex l-height-32-h-32' : 'd-contents'" class="mb-2">
                  <div class="fsize14 secondColor " :class="!$store.state.isMobileView ? 'width-52' : ''">Investment</div>
                  <div class="fsize16 width-fit-content" :class="totalInvestment >= 0 ? 'positiveColor' : 'negativeColor'">{{ruppesFormat(totalInvestment.toFixed(2))}}</div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import commonFunc from "../mixins/commonFunctions";
import customIcon from '../components/customIcon.vue'
export default {
  mixins: [commonFunc],
  data: () => ({
    Items: ["Home"],
    infoType: "Home",
  }),
  components:{
    customIcon
  },
  computed: {
    ...mapState("funds", ["fundsLimit"]),
    ...mapGetters("authtication", ["getUserSessionDto"]),
    ...mapState(["fundsOrHoldingsLoader"]),
    ...mapState("holdings", [
      "totalInvestment",
      "totalcurrentValue",
      "totalPnl",
      "totalPnlChange",
    ]),
  },
  mounted() {
    this.$store.dispatch("funds/getFundsLimits");
    this.$store.dispatch("holdings/getHoldings");
  },
  created() {
    if(localStorage.getItem('basketOrder') == 'true'){
      this.$router.push('/basket');
    }
  }
};
</script>
<style>
</style>