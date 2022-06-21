<template>
  <div>
      <div class="px-4 py-2 d-flex align-center">
      <div class="font-weight-bold primaryColor">3rd Party Integrations</div>
      <v-progress-circular
            class="ml-2"
            indeterminate
            v-if="appsLoader"
            size="18"
            :width="2"
            color="blue"
          ></v-progress-circular>
    </div>
    <v-row class="ma-0 px-4">
       <v-slide-group v-model="infoType" class="pa-0" mandatory hide-arrows>
        <v-slide-item
          v-for="(item, i) in tabList"
          :key="i"
          v-slot="{ active, toggle }"
        >
        <span @click="
                  $router
                    .push({
                      path: 'apps',
                      query: {
                        tab: infoType == 1 ? 'API' : 'Apps',
                      },
                    })
                    .catch(() => {})
                ">
                  <v-btn
            depressed
            :color="active ? 'activeColor white--text' : 'unActiveColor black--text'"
            height="26"
            min-width="50"
            class="fsize12 rounded-sm text-center text-capitalize mr-2"
            :value="item.name"
            @click="toggle"
          >
            {{ item.name }}
            <span v-if="item.length != 0">&nbsp;({{item.length}})</span>
          </v-btn>
        </span>
        
        </v-slide-item>
      </v-slide-group>
        <a href="https://abfspl.freshdesk.com/support/tickets/new" target="_blank" class="text-decoration-none">
       <v-btn
            outlined
            
            height="26"
            min-width="50"
            class="fsize12 rounded-sm text-center text-capitalize link-btn-apps"
          >
        Support
          </v-btn>
       </a>
    </v-row>

    <v-divider class="mx-4 my-2"></v-divider>

    <div class="mb-4" v-if="vendorList.length > 0 && !this.appsLoader && infoType == 0">
      <v-card class="mx-4" >
        <v-sheet tile v-for="(n, index) in vendorList" :key="index">
        <div class="row ma-0">
          <v-flex xs12 sm9 md9 lg9 xl9 class="pa-3">
            <label
              class="
                fsize16
                primaryColor
                font-weight-bold
                l-height-28
                ml-2
                pt-2
                pb-1
              "
              >{{ n.vendorName }}</label
            >
            <div>
              <span class="fsize11 secondColor ml-2">by {{ n.developer }}</span>
            </div>
            <div>
              <p class="fsize13 secondColor ml-2">
                {{ n.description }}
              </p>
            </div>
          </v-flex>
          <v-flex xs12 sm3 md3 lg3 xl3 class="pa-3  d-flex align-center justify-center">
            <v-btn
              :color="
                n.authorizationStatus == 0 ||
                n.authorizationStatus == 3 ||
                n.authorizationStatus == 4
                  ? 'primary'
                  : 'bg-red'
              "
              min-width="96"
              depressed
              class="text-capitalize  white--text fsize14 ma-0 bg-red rounded"
              @click="getInfo(n)"
            >
              {{
                n.authorizationStatus == 0 ||
                n.authorizationStatus == 3 ||
                n.authorizationStatus == 4
                  ? "Authorize"
                  : "Revoke"
              }}
            </v-btn>
          </v-flex>
        </div>
        <v-divider></v-divider>
        </v-sheet>
      </v-card>
    </div>
     <div class="d-flex flex-column justify-center align-center vh-70" v-if="vendorList.length == 0 && !this.appsLoader && infoType == 0">
         <div> <img src="../assets/images/noData.svg" alt="" class="w-300 h-170 mb-4"></div>
         <div> NO APPS FOUND</div>
    </div>

    <v-row class="justify-center">
      <v-dialog v-model="authorizeDialog" width="400">
        <v-card height="317">
          
             <div class="fsize14 cardHead d-flex align-center justify-center">
                Authorize {{ this.vendorName }}
              </div>

          <div class="primaryColor cardBody ml-4 mt-8">
             <div class="text-center fsize14 text-center">
                Permission required by the app
              </div>
              <ul class="fsize14 ml-4 pt-4 mb-8 primaryColor">
                <li>Access holding and positions portfolio</li>
                <li>Place, modify, and cancel otders</li>
                <li>View your account balance and margins</li>
                <li>View your profile details</li>
              </ul>
          </div>
          <v-card-actions class="pa-3 pr-3">
            <v-spacer></v-spacer>

            <v-btn
            :color="$store.state.buttonThemeColor"
              depressed
              class="rounded white--text text-capitalize btn32-clr-b"
              @click="conformAuthorize()"
            >
              Agree
            </v-btn>
                <v-btn
                min-width="70px"
              depressed
              outlined
              class="rounded text-capitalize"
              @click="$store.commit('apps/setAuthorizeDialog' , false)"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

       <!-- API generate Dialog  -->
       <div class="ma-4" v-if=" !this.appsLoader && infoType == 1">
        <label class="fsize13 primaryColor font-weight-bold l-height-28 pt-2 pb-1 ">API Settings</label>   
        <v-card class="px-4 py-4">
          <v-row class="ma-0">
            <v-col md="3" xs="12" sm="12" class="pa-0">
              <label class="fsize13 secondColor py-2">Keys</label>
            </v-col>
            <v-col md="9" xs="12" sm="12" class="pa-0">
              <label class="fsize13 primaryColor py-2">{{
                apiKeyDetails.api_key
              }}</label>
            </v-col>
          </v-row>
          <v-row class="ma-0 pt-2">
            <v-col md="3" xs="12" sm="12" class="pa-0">
              <label class="fsize13 secondColor py-2">Valid Upto</label>
            </v-col>
            <v-col md="9" xs="12" sm="12" class="pa-0">
              <label class="fsize13 primaryColor py-2">
                {{
                  apiKeyDetails.expiry_date != null
                    ? apiKeyDetails.expiry_date.split(" ")[0]
                    : apiKeyDetails.expiry_date
                }}
              </label>
            </v-col>
          </v-row>

          <v-btn depressed class="white--text btn32-clr-b mt-5 rounded-md text-capitalize" :color="$store.state.buttonThemeColor" width="151px" height="33px" @click="callGenerateDialog(true)">
            {{apiKeyDetails.available == true ? 'Regenerate API Key' : 'Generate API Key'}}
          </v-btn>
        </v-card>
      </div>

    <v-dialog v-model="generateApiDialog" width="400px">
      <v-card>
        <div class="pb-2 px-4 pt-4">
          <span>Are you sure want to {{apiKeyDetails.available == true ? 'Regenerate' : 'Generate' }} API Key?</span
          ><button
            type="button"
            @click="closeGenerateApiDialog(false)"
            class="fsize18 float-right"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="px-4 pt-1 pb-4 height-104 d-flex align-end justify-end">
          <v-btn
            :loading="apiLoader"
            :disabled="apiLoader"
            depressed
            :color="$store.state.buttonThemeColor"
            @click="
                    apiKeyDetails.available == true
                      ? $store.dispatch('settings/getReGenerateAPIKeys')
                      : $store.dispatch('settings/generateApiKey')
                  "
            class="flat text-capitalize fsize14 white--text"
            >Confirm</v-btn
          >
           <v-btn
            outlined
            depressed
            @click="closeGenerateApiDialog(false)"
            class="flat text-capitalize fsize14 black--text ml-3"
            >Cancel</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  data: () => ({
    vendorId:'',
    vendorName:'',
    infoType: null,
  }),
  methods: {
    revokeApp(value){
      var jsonObject = {
        vendorId: value["vendorId"],
      };
      this.$store.dispatch('apps/getRevokeVendor', jsonObject)
    },
    getInfo(val) {
       var isAuthorize =  val.authorizationStatus == 0 || val.authorizationStatus == 3 || val.authorizationStatus == 4  ? true : false
    
    this.vendorName = val["vendorName"];
      this.vendorId = val["vendorId"];
      isAuthorize ? this.$store.commit('apps/setAuthorizeDialog' , true) : this.revokeApp(val)
    },
    conformAuthorize(){
       var jsonObj = {
        vendorId: this.vendorId,
      };
      this.$store.dispatch("apps/setAuthorize" , jsonObj)
    },
    callGenerateDialog(value) {
      this.$store.commit("settings/setGenerateApiDialog", value);
    },
      closeGenerateApiDialog(bool) {
      this.$store.commit("settings/setGenerateApiDialog", bool);
    },
  },
  computed: {
    ...mapState("apps", ["vendorList", "authorizeVendor","revokeVendor" , 'tabList', 'authorizeDialog', 'appsLoader']),
    ...mapState("settings", ["apiKeyDetails", "apiLoader"]),
    ...mapGetters("settings", ['getgenerateApiDialog']),
     generateApiDialog: {
      get() {
        return this.getgenerateApiDialog;
      },
      set(value) {
        if (!value) {
          this.$store.commit("settings/setGenerateApiDialog", value);
        }
        return value;
      },
    },
  },
  watch:{
    infoType:function(value) {
      localStorage.setItem("appsTab", JSON.stringify(value));
    }
  },

   mounted() {
     this.$store.dispatch("apps/getVendorList");
     this.$store.dispatch("settings/getApiKey");
      var localTab = JSON.parse(localStorage.getItem("appsTab"));
    this.$route.query.tab
      ? (this.infoType = this.$route.query.tab == 'Apps' ? 0 : 1)
      : (this.infoType = !this.infoType ? 0 : localTab == 0 ? 0 : 1);
      
  },
};
</script>