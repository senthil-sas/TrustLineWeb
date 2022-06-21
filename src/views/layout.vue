<template>
  <v-app class="custom-height">
    <v-navigation-drawer mobile-breakpoint="1024" :class="$store.state.isMobileView ? 'overflow-y-hidden' : 'overflow-y-auto'" class="customize" v-model="drawer" app width="64">
      <div width="64">
        <div @click="navigatePage('/home')" class="cursor d-flex justify-center align-center mx-2" style="height: 56px; border-bottom: solid 1px #D6D6D6">
          <!-- <customIcon :name="'sidelogo'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode"/> -->
        </div>

        <v-tabs class="sidebar mt-3" vertical v-model="selectedItem" :color="$store.state.buttonThemeColor">
          <v-tab class="sidebarTab" v-for="(item, i) in menuList" @click="changeRoute(item)" :key=i>
            <div class="menu">
              <customIcon :name="item.svg.toLowerCase()" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
              <div class="fsize11 primaryColor text-overflow">{{ item.text == 'marketwatch' ? 'MW List' : item.text }}</div>
            </div>
          </v-tab>
        </v-tabs>
      </div>
    </v-navigation-drawer>

    <v-app-bar height="56" app flat class="appheader border-bottom-dark pa-0">
      <v-app-bar-nav-icon v-if="$store.state.isMobileView" @click="drawer = !drawer" class="ma-0">
        <customIcon :name="'drawer'" :width="'24'" :height="'24'" :color="'#6F6F6F'" />
      </v-app-bar-nav-icon>
      <div class="row ma-0  pa-0 " :class="$store.state.isMobileView && !$store.state.isLapView ? 'justify-end' : 'justify-space-between'">
        <div :widthChangeByView="!$store.state.isMobileView && !$store.state.isLapView ? '400' : !$store.state.isMobileView && $store.state.isLapView ? '450' : '0'">
          <div class="row ma-0  d-flex justify-space-around text-uppercase" :class="$store.state.isMobileView && !$store.state.isLapView ? '' : ''" v-if="!$store.state.isMobileView">
            <div class="text-center fsize12 px-3 width-20 primaryColor hovershow">
              <div class="w-100">{{niftyFiftyArray.name}}</div>
              <div>
                <span :class="parseFloat(niftyFiftyArray.change) >= 0 ? 'positiveColor' : 'negativeColor'">{{niftyFiftyArray.value}}</span>
                <span :class="parseFloat(niftyFiftyArray.change) >= 0 ? 'positiveColor' : 'negativeColor'" class="ml-1">{{niftyFiftyArray.change ? `(${niftyFiftyArray.change}%)` : ''}}</span>
              </div>
              <label class="hoverBtn indexChart" style="top: 15px;position: absolute; display: none" @click="callTrandingViewChart(niftyFiftyArray,'header')">
                <customIcon :name="'chart'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
              </label>
            </div>
            <div class="text-center fsize12 border-lft px-3 width-20 primaryColor hovershow">
              <div class="w-100">{{niftyBankArray.name}}</div>
              <div>
                <span :class="parseFloat(niftyBankArray.change) >= 0 ? 'positiveColor' : 'negativeColor'">{{niftyBankArray.value}}</span>
                <span :class="parseFloat(niftyBankArray.change) >= 0 ? 'positiveColor' : 'negativeColor'" class="ml-1">{{niftyBankArray.change ? `(${niftyBankArray.change}%)` : ''}}</span>
              </div>
              <label class="hoverBtn indexChart" style="top: 15px;position: absolute; display: none" @click="callTrandingViewChart(niftyBankArray,'header')">
                <customIcon :name="'chart'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
              </label>
            </div>
            <div class="text-center fsize12 border-lft px-3 width-20 primaryColor hovershow">
              <div class="w-100">{{senSexArray.name}}</div>
              <div>
                <span :class="parseFloat(senSexArray.change) >= 0 ? 'positiveColor' : 'negativeColor'">{{senSexArray.value}}</span>
                <span :class="parseFloat(senSexArray.change) >= 0 ? 'positiveColor' : 'negativeColor'" class="ml-1">{{senSexArray.change ? `(${senSexArray.change}%)`: ''}}</span>
              </div>
              <label class="hoverBtn indexChart" style="top: 15px;position: absolute; display: none" @click="callTrandingViewChart(senSexArray,'header')">
                <customIcon :name="'chart'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
              </label>

            </div>
            <div class="text-center fsize12 border-lft px-3 width-20 primaryColor hovershow">
              <div class="w-100">{{indiaVixArray.name}}</div>
              <div>
                <span :class="parseFloat(indiaVixArray.change) >= 0 ? 'positiveColor' : 'negativeColor'">{{indiaVixArray.value}}</span>
                <span :class="parseFloat(indiaVixArray.change) >= 0 ? 'positiveColor' : 'negativeColor'" class="ml-1">{{indiaVixArray.change ? `(${indiaVixArray.change}%)` : ''}}</span>
              </div>
              <label class="hoverBtn indexChart" style="top: 15px;position: absolute; display: none" @click="callTrandingViewChart(indiaVixArray,'header')">
                <customIcon :name="'chart'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
              </label>
            </div>
            <div class="text-center fsize12 border-lft px-3 width-20 primaryColor hovershow">
              <div class="w-100">{{niftyFinServiceArray.name}}</div>
              <div>
                <span :class="parseFloat(niftyFinServiceArray.change) >= 0 ? 'positiveColor' : 'negativeColor'">{{niftyFinServiceArray.value}}</span>
                <span :class="parseFloat(niftyFinServiceArray.change) >= 0 ? 'positiveColor' : 'negativeColor'" class="ml-1">{{niftyFinServiceArray.change ? `(${niftyFinServiceArray.change}%)` : ''}}</span>
              </div>
              <label class="hoverBtn indexChart" style="top: 15px;position: absolute; display: none" @click="callTrandingViewChart(niftyFinServiceArray,'header')">
                <customIcon :name="'chart'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
              </label>
            </div>
          </div>
        </div>
        <div class="pr-6 d-flex align-center">
          <div class="d-flex flex-column justify-end text-end">
            <v-menu max-width="190" right bottom :offset-y="true" transition="slide-y-transition" :position-y="300" rounded>
              <template v-slot:activator="{ on, attrs }">
                <div text v-bind="attrs" v-on="on" class="fsize12">
                  <div class="primaryColor">{{ getUserSessionDto.accountName}}</div>
                  <div class="secondaryColor">{{ getUserId}}</div>
                </div>
              </template>
              <v-list class="py-0">
                <v-list-item class="body-2 header_menu" @click="navigatePage('/settings')">
                  <v-list-item-icon>
                    <customIcon :name="'settings'" :width="'20'" :height="'20'" :color="$store.state.iconGrayColor" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <span class="ml-2">Settings</span>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="body-2 header_menu " @click="logoutDialog = true">
                  <v-list-item-icon>
                    <customIcon :name="'logout'" :width="'20'" :height="'20'" :color="$store.state.amogaColor" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <a class="ml-2">Logout</a>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

        </div>
      </div>
    </v-app-bar>

    <v-main class="">
      <div :widthChangeByView="!$store.state.isMobileView && !$store.state.isLapView ? '400' : !$store.state.isMobileView && $store.state.isLapView ? '450' : '0'" class="wrapper-router overflow-y-auto content-height">
        <router-view></router-view>
      </div>
      <mkWatch class="basket-wrapper" v-if="!$store.state.isMobileView" />
    </v-main>

    <orderWindow v-if="showOrderWindow" />

    <v-dialog v-model="logoutDialog" width="400px">
      <v-card>
        <div class="pb-2 px-4 pt-4">
          <!-- <span class="fsize20 orange--text mr-2">&#9888;</span>  -->
          Are you sure want to logout?
          <!-- <span>Are you sure want to logout?</span> -->
          <button type="button" @click="logoutDialog = false" class="fsize21 float-right" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="row ma-0 pa-4 secondColor">
          <span class="fsize13"> Please be advised, all sessions, including API and algo based applications/sessions, will be logged out.</span>
        </div>
        <div class="px-4 pt-2 pb-4 d-flex align-end justify-end">
          <v-btn depressed :color="$store.state.buttonThemeColor" :loading="logoutLoader" :disabled="logoutLoader" @click="$store.dispatch('header/logout');$store.commit('orderWindow/setOrderWindow',false);" class="flat text-capitalize fsize14 white--text ">Confirm</v-btn>
          <v-btn depressed color="#fff" outlined @click="logoutDialog = false" class="flat  text-capitalize fsize14 black--text ml-3">Cancel</v-btn>

        </div>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import mkWatch from "../views/marketWatch.vue";
import orderWindow from "../components/orderWindow.vue";
import { mapGetters, mapState } from "vuex";
import customIcon from "../components/customIcon.vue";
import commonFunc from "../mixins/commonFunctions";
export default {
  mixins: [commonFunc],
  data: () => ({
    drawer: null,
    showMenu: false,
    logoutDialog: false,
  }),
  computed: {
    ...mapGetters("authtication", [
      "getUserId",
      "getUserSession",
      "getUserSessionDto",
    ]),
    ...mapGetters("header", ["getIndex"]),

    ...mapState("header", [
      "niftyFiftyArray",
      "niftyFinServiceArray",
      "niftyBankArray",
      "indiaVixArray",
      "senSexArray",
      "logoutLoader",
      "menuList",
      "tabSelection",
    ]),

    ...mapState("orderWindow", ["showOrderWindow", "windowLoading"]),
    selectedItem: {
      get() {
        return this.tabSelection;
      },
      set(newValue) {
        this.$store.commit("header/setTabSelection", newValue);
      },
    },
    isMobileView() {
      return this.$store.state.isMobileView;
    },
  },
  async beforeCreate() {
    (await this.$store.state.wsConnection.isValidSession) &&
    !this.$store.state.wsConnection.isConnect
      ? this.$store.dispatch("wsConnection/connect", "layout")
      : "";
    await this.$store.dispatch("wsConnectionTr/connect");
  },
  async created() {
    await this.$store.dispatch("header/getIndex", "NSE");
    await this.$store.dispatch("header/getIndex", "BSE");
    localStorage.removeItem("isMpin");
    localStorage.removeItem("whichStep");
    localStorage.removeItem("secQuestion");
  },
  components: {
    mkWatch,
    orderWindow,
    customIcon,
  },
  methods: {
    getImgUrl(img) {
      var images = require.context("../assets/menu/", false, /\.svg$/);
      return images("./" + img + ".svg");
    },

    changeRoute(val) {
      this.$router.push("/" + val.text).catch(() => {});
    },

    // callHeartBeat() {
    //   this.interval = setInterval(() => this.$store.dispatch("wsConnectionTr/sendHeartBeat" , "hb"), 120000);
    // },

    navigatePage(route) {
      this.selectedItem = route == "/home" ? 0 : this.menuList.length - 1;
      this.$router.push(route).catch(() => {});
    },
  },
  mounted() {
    this.selectedItem = this.menuList.findIndex(
      (std) => std.text === this.$router.currentRoute.path.replace("/", "")
    );
    const theme = localStorage.getItem("dark_theme");
    if (theme) {
      if (theme == "true") {
        this.$vuetify.theme.dark = true;
        this.updateThemeVal("dark");
      } else {
        this.$vuetify.theme.dark = false;
        this.updateThemeVal("light");
      }
    }
    // this.callHeartBeat();
  },

  // beforeDestroy() {
  //   clearInterval(this.interval);
  // }
};
</script>

<style scoped>
.wrapper-router {
  float: left;
  width: 100%;
  min-height: 1px;
  transition: all 0.1s;
}
.sidebar {
  width: 64px !important;
}
.v-navigation-drawer__content {
  overflow: clip !important;
}
.border-lft {
  border-left: 1px solid #ededed;
}
::v-deep.v-menu__content {
  top: 60px !important;
  right: 18px !important;
  left: auto !important;
}
/* .v-icon.v-icon{
  font-size: 20px !important;
} */
::v-deep.v-input--dense > .v-input__control > .v-input__slot {
  margin-bottom: 0px !important;
}

.hovershow:hover .indexChart {
  display: block !important;
}

.sidebar .v-tab {
  min-width: 64px !important;
  text-transform: capitalize !important;
  font-weight: normal !important;
  color: #282828 !important;
  padding: 8px 0px !important;
  letter-spacing: normal !important;
}
.sidebar .v-tab--active {
  color: #0065be !important;
}
.sidebar .v-tab--active {
  filter: invert(68%) sepia(49%) saturate(6379%) hue-rotate(183deg)
    brightness(93%) contrast(104%) !important;
}
.sidebar .v-tab:hover {
  filter: invert(68%) sepia(49%) saturate(6379%) hue-rotate(183deg)
    brightness(93%) contrast(104%) !important;
}
.theme--light .darkThemeImg {
  display: contents !important;
}
.theme--dark .sidebar .v-tab .unactive_img {
  display: contents !important;
}
.theme--dark .sidebar .v-tab--active .unactive_img {
  display: inline-block !important;
}
.theme--dark .sidebar .v-tab {
  height: 56px !important;
  text-transform: capitalize !important;
  font-weight: normal !important;
  color: #ffffff !important;
  padding: 8px 0px !important;
  letter-spacing: normal !important;
}
.theme--light .sidebar .v-tab {
  height: 56px !important;
  text-transform: capitalize !important;
  font-weight: normal !important;
  color: #282828 !important;
  padding: 8px 0px !important;
  letter-spacing: normal !important;
}
.theme--dark.v-tabs > .v-tabs-bar {
  background: #363636 !important;
}
.theme--dark.v-navigation-drawer {
  background-color: #1e1e1e !important;
}
.theme--dark.v-app-bar.v-toolbar {
  background-color: #1e1e1e !important;
}
[widthChangeByView="400"] {
  width: calc(100% - 400px) !important;
}
[widthChangeByView="450"] {
  width: calc(100% - 450px) !important;
}
[widthChangeByView="0"] {
  width: calc(100% - 0px) !important;
}
.v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 24px !important;
}
.text-overflow {
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  width: 60px;
}
</style>