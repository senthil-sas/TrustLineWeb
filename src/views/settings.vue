<template>
  <div>
    <div class="px-4 py-2 align-center d-flex">
      <div class="font-weight-bold primaryColor">Settings</div>
      <v-progress-circular
            class="ml-2"
            indeterminate
            size="18"
            :width="2"
            color="blue"
            v-if="settingsLoader"
          ></v-progress-circular>
    </div>
   <v-row class="mb-2 mx-0 mt-0 px-4">
      <v-slide-group v-model="infoType" class="pa-0" mandatory hide-arrows>
        <v-slide-item v-for="(item, i) in Items" :key="i" v-bind:value="item" v-slot="{ active, toggle }">
          <span @click="$router.push({path:'settings',query: { tab: infoType.trim().toString() } }).catch(() => {})">
          <v-btn depressed :color="active ? 'activeColor white--text' : 'unActiveColor black--text'" height="26" min-width="50" class="fsize12 mr-2 rounded-sm text-center text-capitalize" :value="item" @click="toggle">
            {{ item }}
          </v-btn>
          </span>
        </v-slide-item>
      </v-slide-group>
      <v-spacer></v-spacer>
    </v-row>

    <v-divider class="mx-4 mb-2"></v-divider>

    <!--  Personal Profile Content -->

    <div class="px-4" v-if="this.infoType == 'General' && !settingsLoader">
      <label class="fsize13 primaryColor font-weight-bold pt-2 pb-1 l-height-28"
        >Personal Profile</label
      >
      <v-card class="px-4 py-4">
       <div class="row ma-0 pb-4">
          <v-flex xs12 sm4 md3 lg2 xl2 class="pa-0 text-center">
            <v-avatar class="avatar" size="90">
              <span>{{
                userDetails["accountName"] == undefined
                  ? "NA"
                  : userDetails["shortName"]
              }}</span>
            </v-avatar>
            <div></div>
          </v-flex>

          <v-flex xs12 sm8 md7 lg10 xl10 class="pa-0 align-center d-flex" v-if="$store.state.windowWidth > 599">
            <div>
              <div class="fsize16 primaryColor">
                {{ userDetails.accountName }}
              </div>
              <div class="fsize12 secondColor">{{ userDetails.accountId }}</div>
            </div>
          </v-flex>
        </div>

        <div class="row ma-0">
          <v-flex xs12 sm12 md6 lg6 xl6 class="pa-0">
            <div class="row ma-0">
              <div class="col-4 pa-0">
                <label class="secondColor fsize13">PAN</label>
              </div>
              <div class="col-8 pa-0">
                <label class="fsize13 primaryColor">{{
                 userDetails["panNo"] ? userDetails["panNo"] : 'NA'
                }}</label>
              </div>
            </div>
            <div class="row ma-0">
              <div class="col-4 pa-0">
                <label class="secondColor fsize13">E-mail</label>
              </div>
              <div class="col-8 pa-0">
                <label class="fsize13 primaryColor"
                  >{{ userDetails.emailAddr ? userDetails["emailAddr"]: 'NA' }}
                </label>
              </div>
            </div>
            <div class="row ma-0">
              <div class="col-4 pa-0">
                <label class="secondColor fsize13">Phone</label>
              </div>
              <div class="col-8 pa-0">
                <label class="fsize13 primaryColor">{{
                userDetails["cellAddr"] ?  userDetails["cellAddr"]: 'NA'}}</label>
              </div>
            </div>
            <div class="row ma-0">
              <div class="col-4 pa-0">
                <label class="secondColor fsize13">DP IDs</label>
              </div>
              <div class="col-8 pa-0">
                <label class="fsize13 primaryColor">
                  {{ userDetails.dpId ? userDetails["dpId"] : 'NA' }}
                </label>
              </div>
            </div>
            <div class="row ma-0">
              <div class="col-4 pa-0">
                <label class="secondColor fsize13">DP BO ID</label>
              </div>
              <div class="col-8 pa-0">
                <label class="fsize13 primaryColor">
                  {{
                    userDetails.dpAccountNumber ? userDetails["dpAccountNumber"]: 'NA'
                  }}
                </label>
              </div>
            </div>
          </v-flex>

          <v-flex xs0 sm0 md6 lg6 xl6 class="pa-0">
            <div class="row ma-0">
              <div class="col-4 pa-0">
                <label class="secondColor fsize13">Segments</label>
              </div>
              <div class="col-8 pa-0">
                <label class="fsize13 primaryColor">
                  <span>{{
                    getUserSessionDto.exch != undefined
                      ? getUserSessionDto.exch
                          .toString()
                          .replace('[""[]]', "")
                          .replaceAll(",", ", ")
                      : ""
                  }}</span></label
                >
              </div>
            </div>
            <div class="row ma-0">
              <div class="col-4 pa-0">
                <label class="secondColor fsize13">Products</label>
              </div>
              <div class="col-8 pa-0">
                <label class="fsize13 primaryColor">
                  {{ userDetails.convertProducts }}
                </label>
              </div>
            </div>
            <div class="row ma-0">
              <div class="col-4 pa-0">
                <label class="secondColor fsize13">Order Type</label>
              </div>
              <div class="col-8 pa-0">
                <label class="fsize13 primaryColor">
                  <span>{{
                    getUserSessionDto.prctyp != undefined
                      ? getUserSessionDto.prctyp
                          .toString()
                          .replace('[""[]]', "")
                          .replaceAll(",", ", ")
                      : ""
                  }}</span></label
                >
              </div>
            </div>
            <div class="row ma-0">
              <div class="col-4 pa-0">
                <label class="secondColor fsize13">Bank A/c No</label>
              </div>
              <div class="col-8 pa-0">
                <label class="fsize13 primaryColor">{{
                  userDetails.bankAccountNo ? userDetails.bankAccountNo : 'NA'
                }}</label>
              </div>
            </div>
            <div class="row ma-0">
              <div class="col-4 pa-0">
                <label class="secondColor fsize13">Bank Name</label>
              </div>
              <div class="col-8 pa-0">
                <label class="fsize13 primaryColor">{{
                  userDetails.bankName
                }}</label>
              </div>
            </div>
          </v-flex>
        </div>
      </v-card>


      <!-- Customer Support Details -->

      <!-- <customerSupport /> -->
    </div>

    <!-- Security Content -->

   <div class="mx-4 mb-4 target" v-if="this.infoType == 'Security' && this.isSecurityTab">
      <v-card class="px-4 py-4 mb-4">
        <form action>
          <v-row class="ma-0 " :class="$store.state.windowWidth > 374 ? 'd-flex' : 'd-block'">
            <div class="">
              <div>
                <div class="mb-4 h-72" :class="$store.state.windowWidth > 374 ? ' w-296' : 'w-100'">
                  <div>
                    <label class="fsize14 primaryColor pl-2">Password</label>
                    <span class="fsize12  linkColor float-right pr-2 cursor" @click="showResetPassword()">Change Password</span>
                  </div>
                  <input type="password" placeholder="***************" class="
                      h-40
                      rounded
                      px-4 py-2
                      border-input
                      fsize14
                      primaryColor
                    "
                    :class="$store.state.windowWidth > 374 ? ' w-296' : 'w-100'"
                     autocomplete disabled />
                </div>
              </div>
              <div>
                <div class="mb-4  h-72" :class="$store.state.windowWidth > 374 ? ' w-296' : 'w-100'">
                  <div>
                    <label class="fsize14 primaryColor pl-2">M-PIN</label>
                    <span class="fsize12  linkColor float-right pr-2 cursor" @click="showResetMpinHideShow()">
                      Change M-Pin
                    </span>
                  </div>
                  <input type="password" placeholder="***************" class="
                      h-40
                      rounded
                      px-4 py-2
                      border-input
                      fsize14
                      primaryColor
                    "
                    :class="$store.state.windowWidth > 374 ? ' w-296' : 'w-100'"
                     autocomplete disabled />
                </div>
                <div class="mb-4 h-72" :class="$store.state.windowWidth > 374 ? ' w-296' : 'w-100'">
                  <div>
                    <label class="fsize14 primaryColor pl-2">Security Questions</label>
                    <span class="fsize12 linkColor float-right pr-2 cursor" @click="showResetSquesHideShow()">
                      Change Questions
                    </span>
                  </div>
                  <input type="password" placeholder="***************" class="
                      h-40
                      rounded
                      px-4 py-2
                      border-input
                      fsize14
                      primaryColor
                    "
                    :class="$store.state.windowWidth > 374 ? ' w-296' : 'w-100'"
                     autocomplete disabled />
                </div>
              </div>
            </div>
          </v-row>
        </form>
      </v-card>
    </div>
    <!-- password reset  -->

    <div class="mt-4 px-4" v-if="this.infoType == 'Security' && this.isShowResetPass" >
      <label class="primaryColor fsize13 l-height-24 pt-3 pb-2 font-weight-600">Password Change</label>
      <v-card>
        <div class="row ma-0 pa-6">
          <v-flex xs12 sm12 md5 lg5 xl5 class="pa-0">
            <form>

              <div class="mb-1 h-86">
                <label class="fsize14 primaryColor padd-l-8"

                  >Current Password</label
                >
                <div
                  class="
                    pswborder
                    d-flex
                    justify-space-between
                    rounded
                    h-40
                    align-center
                    max-width-260
                  "
                >
                  <input
                    :type="passwordFieldType3"
                    v-model="currentPassword"
                    class="fsize14 outlineborder"
                    autocomplete
                  />
                  <div>
                    <span @click="toggleFieldTextType3()"> <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2"  :name="fieldTextType3 ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" /></span>
                  </div>
                </div>
                <div
                  class="error--text h-14 fsize10 mt-1"
                  v-if="this.currentPasswordError != ''"
                >
                  {{ currentPasswordError }}
                </div>
              </div>


              <div class="mb-1 h-86">
                <label class="fsize14 primaryColor padd-l-8"

                  >New Password</label
                >
                <div
                  class="
                    pswborder
                    d-flex
                    justify-space-between
                    rounded
                    h-40
                    align-center
                    max-width-260
                  "
                >
                  <input
                    :type="passwordFieldType4"
                    v-model="newPassword"
                    class="fsize14 outlineborder"
                    autocomplete
                  />

                  <div>
                    <span @click="toggleFieldTextType4()"> <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2"  :name="fieldTextType4 ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" /></span>
                  </div>
                </div>
                <div
                  class="error--text h-14 fsize10 mt-1"
                  v-if="this.newPasswordError != ''"
                >
                  {{ newPasswordError }}
                </div>
              </div>


              <div class="mb-1 h-86">
                <label class="fsize14 primaryColor padd-l-8"

                  >Confirm Password</label
                >
                <div
                  class="
                    pswborder
                    d-flex
                    justify-space-between
                    rounded
                    h-40
                    align-center
                    max-width-260
                  "
                >
                  <input
                    :type="passwordFieldType5"
                    v-model="confirmPassword"
                    class="fsize14 outlineborder"
                    autocomplete
                  />

                  <div>
                    <span @click="toggleFieldTextType5()"> <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2"  :name="fieldTextType5 ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" /></span>
                  </div>
                </div>
                <div
                  class="error--text h-14 fsize10 mt-1"
                  v-if="this.confirmPasswordError != ''"
                >
                  {{ confirmPasswordError }}
                </div>
              </div>

              <div class="max-width-260">
                <div class="float-right px-0">
                                    <v-btn
                    :color="$store.state.buttonThemeColor"
                    depressed
                    class="  fsize14 text-capitalize white--text"
                    width="60px"
                    @click="passwordChange()"
                    height="32px"
                    >Reset</v-btn
                  >
                  <v-btn
                    depressed
                    outlined
                    class="fb-btn black--text text-capitalize ml-2"
                    @click="securityTab()"
                    width="60px"
                    height="32px"
                    >Cancel</v-btn
                  >
                </div>
              </div>
            </form>
          </v-flex>
          <v-flex md1 lg1 xl1></v-flex>
          <v-flex xs12 sm12 md6 lg6 xl6 class="pa-0">
            <label class="fsize13 l-height-24 font-weight-bold primaryColor">Password Policy</label>
            <br />
            <label class="fsize12 l-height-24 primaryColor"
              >Password should be alphanumeric and at least 6 characters and
              maximum 12 characters. </label
            ><br />
            <label class="fsize13 l-height-24 font-weight-boldPar primaryColor"
              >Password should not be the same as your User/Login ID.</label
            ><br />
            <label class="fsize13 l-height-24 font-weight-boldPar primaryColor">
              For extra safety, it is recommended that you use a special
              character in the password. </label
            ><br />
            <label class="fsize13 l-height-24 font-weight-boldPar primaryColor">
              For security purposes, login password will expire every 14 days
              and will need to be reset by you.
            </label>
          </v-flex>
        </div>
      </v-card>
    </div>

    <!-- mpin reset -->

    <div class="px-4" v-if="this.infoType == 'Security' && this.isShowResetMpin">
      <label class="primaryColor fsize13 l-height-24 pt-3 pb-2 font-weight-600">Change M-PIN</label>
      <v-card>
        <div class="row ma-0 pa-6">
          <v-flex xs12 sm12 md5 lg5 xl5 class="pa-0">
            <form>
              <div class="mb-1 h-86">
                <label class="fsize14 primaryColor padd-l-8">New M-PIN</label>

                <div
                  class="
                    pswborder
                    d-flex
                    justify-space-between
                    rounded
                    h-40
                    align-center
                    max-width-260
                  "
                >
                  <input
                    :type="passwordFieldType"
                    v-model="newMpin"
                    maxlength="6"
                    @keypress="keyPressNumeric($event)"
                    class="fsize14 outlineborder"
                    autocomplete
                  />
                  <div>
                    <span @click="toggleFieldTextType()"> <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2"  :name="fieldTextType ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" /></span>
                  </div>
                </div>
                <div
                  class="error--text h-14 fsize10 mt-1"
                  v-if="this.newMpinError != ''"
                >
                  {{ this.newMpinError }}
                </div>
              </div>


              <div class="mb-1 h-86">
                <label class="fsize14 primaryColor l-height padd-l-8"

                  >Confirm M-PIN</label
                >
                <div
                  class="
                    pswborder
                    d-flex
                    justify-space-between
                    rounded
                    h-40
                    align-center
                    max-width-260
                  "
                >
                  <input
                    :type="passwordFieldType1"
                    v-model="confirmMpin"
                    maxlength="6"
                    class="w-225 fsize14 outlineborder"
                    autocomplete
                     @keypress="keyPressNumeric($event)"
                  />
                  <div>
                   <span @click="toggleFieldTextType1()"> <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2"  :name="fieldTextType1 ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" /></span>
                  </div>
                </div>
                <div
                  class="error--text h-14 fsize10 mt-1"
                  v-if="this.confirmMpinError != ''"
                >
                  {{ this.confirmMpinError }}
                </div>
              </div>

              <div class="max-width-260">
                <div class="float-right px-0">
                  <v-btn
                    :color="$store.state.buttonThemeColor"
                    depressed
                    class="  fsize14 text-capitalize white--text"
                    width="60px"
                    height="32px"
                    @click="resetNowMpin()"
                    >Reset</v-btn
                  >
                   <v-btn
                    depressed
                    outlined
                    class="fb-btn black--text text-capitalize ml-2"
                    @click="securityTab1()"
                    width="60px"
                    height="32px"
                    >Cancel</v-btn
                  >
                </div>
              </div>
            </form>
          </v-flex>
          <v-flex md1 lg1 xl1></v-flex>
          <v-flex xs12 sm12 md6 lg6 xl6 class="p-0">
            <label class="fsize13 l-height-24 font-weight-bold">M-PIN Policy</label>
            <br />
            <label class="fsize13 l-height-24 font-weight-boldPar primaryColor"
              >M-Pin should be only numeric and in 6-digits.</label
            >
            <br />
            <label class="fsize13 l-height-24 font-weight-boldPar primaryColor">
              Your M-Pin is as important as Password and do not keep easy and
              guessable and sequence numbers like 123456, etc.,
            </label>
          </v-flex>
        </div>
      </v-card>
    </div>

    <!-- security question reset -->

    <div class="px-4" v-if="this.infoType == 'Security' && this.isShowResetSques">
      <label class="primaryColor fsize13 l-height-24 pt-3 pb-2 font-weight-600">Security Questions Reset</label>
      <v-card>
        <div class="row ma-0 pa-6">
          <v-flex xs12 sm12 md5 lg5 xl5 class="pa-0">
            <form>
            <div class="mb-1 h-86">
              <label class="fsize14 primaryColor pl-2">Email ID</label>
              <div
                class="
                  pswborder
                  d-flex
                  justify-space-between
                  rounded
                  h-40
                  align-center
                  max-width-260
                "
              >
                <input
                  v-model="emailId"
                  class="fsize14 outlineborder"
                />
              </div>
              <div class="error--text h-14 fsize10 mt-1" v-if="this.emailError != ''">
                {{ emailError }}
              </div>
            </div>
            <div class="max-width-260">
                <div class="float-right px-0">
                  <v-btn
                    :color="$store.state.buttonThemeColor"
                    depressed
                    class="  fsize14 text-capitalize white--text"
                    width="60px"
                    height="32px"
                    @click="resetSecurityQuestions()"
                    >Reset</v-btn
                  >
                  <v-btn
                    depressed
                    outlined
                    class="fb-btn black--text text-capitalize ml-2"
                    @click="securityTab2()"
                    width="60px"
                    height="32px"
                    >Cancel</v-btn
                  >
                </div>
              </div>
            </form>
          </v-flex>
        </div>
        
      </v-card>
    </div>

    <!-- Market contents -->

    <div class="px-4 target" v-if="this.infoType == 'Markets' && !settingsLoader">
      <label class="fsize13 primaryColor font-weight-bold l-height-28 pt-2 pb-1"
        >Market Status</label
      >
      <v-card class="px-4 py-4">
        <div class="row ma-0">
          <div class="col-2 pa-0 ">
            <label class="fsize12 secondColor l-height-32-h-32">NSE</label>
            <br />
            <label class="fsize12 secondColor l-height-32-h-32">BSE</label>
            <br />
            <label class="fsize12 secondColor l-height-32-h-32">MCX</label>
          </div>
          <div class="col-9 pa-0 ">
            <div>
              <label class="fsize12 primaryColor l-height-32-h-32">{{ nseStatus }}</label>
            </div>
            <div>
              <label class="fsize12 primaryColor l-height-32-h-32">{{ bseStatus }}</label>
            </div>
            <div>
              <label class="fsize12 primaryColor l-height-32-h-32">{{ mcxStatus }}</label>
            </div>
          </div>
        </div>
      </v-card>
      <div class="mt-4">
        <label
          class="fsize13 primaryColor font-weight-bold pt-2 pb-1 l-height-28"
          >Market Messages</label
        >
        <v-card class="mb-4">
          <v-tabs class="primaryColor" v-model="activeTab" :color="$store.state.buttonThemeColor">
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#nse" class="fsize12 primaryColor">NSE</v-tab>
            <v-tab href="#bse" class="fsize12 primaryColor">BSE</v-tab>
            <v-tab href="#mcx" class="fsize12 primaryColor">MCX</v-tab>
          </v-tabs>
          <v-tabs-items v-model="activeTab">

            <v-tab-item :transition="false" id="nse" class="px-4 py-4">
              <div class="row ma-0">
                <div v-for="(item, index) in nseMessages" :key="index">
                  <div class="fsize13 secondColor l-height-24">{{ item }}</div>
                </div>
              </div>
              <div class="d-flex flex-column justify-center align-center pt-6" v-if="nseMessages.length == 0">
              <img width="15%" src="../assets/images/noData.svg" alt="noDataImg" class="mb-2" />
                No Data Found
              </div>
            </v-tab-item>

            <v-tab-item :transition="false" id="bse" class="px-4 py-4">
              <div class="row ma-0">
                <div v-for="(item, index) in bseMessages" :key="index">
                  <div class="fsize13 secondColor l-height-24">{{ item }}</div>
                </div>
              </div>
              
              <div class="d-flex flex-column justify-center align-center pt-6" v-if="bseMessages.length == 0">
              <img width="15%" src="../assets/images/noData.svg" alt="noDataImg" class="mb-2" />
                No Data Found
              </div>

            </v-tab-item>

            <v-tab-item :transition="false" id="mcx" class="px-4 py-4">
              <div class="row ma-0">
                <div v-for="(item, index) in mcxMessages" :key="index">
                  <div class="fsize13 secondColor l-height-24">{{ item }}</div>
                </div>
              </div>
              
              <div class="d-flex flex-column justify-center align-center pt-6" v-if="mcxMessages.length == 0">
              <img width="15%" src="../assets/images/noData.svg" alt="noDataImg" class="mb-2" />
                No Data Found
              </div>

            </v-tab-item>

          </v-tabs-items>
        </v-card>
      </div>
    </div>

    <!-- Build Info contents --> 
      <div class="px-4 pb-4 target" v-if="this.infoType == 'Build Info'">
      <label class="fsize13 primaryColor font-weight-bold l-height-24 pt-2 pb-1">Build Info</label>
      <v-card class="pa-4">
        <div class="row ma-0">
          <v-flex xs6 sm6 md6 lg6 xl6 class="p-0">
            <div class="secondColor pb-2 fsize13">Date  <span style="margin-left: 33px !important;">&nbsp;&nbsp; : </span>&nbsp;&nbsp; {{buildDate}} </div>
            <div class="secondColor pb-2 fsize13">Version <span style="margin-left: 17px !important;">&nbsp;&nbsp; : </span>&nbsp;&nbsp; {{buildVersion}}</div>
            <!-- <div class="secondColor pb-2 fsize13">Git  <span style="margin-left: 45px !important;">&nbsp;&nbsp; : </span>&nbsp;&nbsp; {{gitBranchName}}</div>
            <div class="secondColor pb-2 fsize13">Commit Id <span class="">&nbsp;&nbsp; : </span>&nbsp;&nbsp;  {{gitCommitId}} </div> -->
          </v-flex>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import customerSupport from "../components/customerSupport.vue";
import { mapState, mapGetters } from "vuex";
import customIcon from '../components/customIcon.vue'
export default {
  data: () => ({
    infoType: "General",
    //Reset Password
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    fieldTextType3: false,
    fieldTextType4: false,
    fieldTextType5: false,
    passwordFieldType3: "password",
    passwordFieldType4: "password",
    passwordFieldType5: "password",
    isShowResetPass: false,
    isShowResetMpin: false,
    isShowResetSques: false,
    activeTab: 0,
    isSecurityTab: true,
    //Reset M-Pin
    newMpin: "",
    confirmMpin: "",
    fieldTextType: false,
    fieldTextType1: false,
    passwordFieldType: "password",
    passwordFieldType1: "password",
    //Reset Security questions
    emailId: "",

    sliceName: "",
    mcxarray: "",
    mkstatNse: "",
    mkstatBse: "",
    mkstatMcx: "",
    submit: false,
    emailError: "",
    confirmMpinError: "",
    newMpinError: "",
    newPasswordError: "",
    currentPasswordError: "",
    confirmPasswordError: "",
    buildDate:'14-06-2022',
    buildVersion:'v2.0.0.1',
    gitBranchName:'v2.0.0.1_14_06_22_18_00',
    gitCommitId:'f92aca7',
  }),

  components: { customerSupport, customIcon },

  watch: {
    infoType: function (val) {
      if (val == "Security") {
        this.isSecurityTab = true;
        this.isShowResetPass = false;
        this.submit = false;
        this.currentPassword = this.confirmPassword = this.newPassword = "";
      } else {
        this.isSecurityTab = false;
      }
      if (val == "Security") {
        this.isSecurityTab1 = true;
        this.isShowResetMpin = false;
        this.submit = false;
        this.newMpin = this.confirmMpin = "";
      } else {
        this.isSecurityTab = false;
      }
      if (val == "Security") {
        this.isSecurityTab2 = true;
        this.isShowResetSques = false;
      } else {
        this.isSecurityTab = false;
      }
      if (val == "Markets") {
        this.$store.dispatch("settings/marketStatus");
        this.callMktMsg();
      }
      localStorage.setItem("settingsTab", JSON.stringify(val))
    },
    confirmMpin: function () {
      this.confirmMpinError = "";
    },
    newMpin: function () {
      this.newMpinError = "";
    },
    currentPassword: function () {
      this.currentPasswordError = "";
    },
    newPassword: function () {
      this.newPasswordError = "";
    },
    confirmPassword: function () {
      this.confirmPasswordError = "";
    },
    emailId: function () {
      this.emailError = "";
    },
  },

  computed: {
    ...mapState("settings", [
      "userDetails",
      "resetMpin",
      "resetSQues",
      "resetPass",
      "marketStatus",
      "nseStatus",
      "bseStatus",
      "mcxStatus",
      "nseMessages",
      "bseMessages",
      "mcxMessages",
      "generateApiKey",
      "apiKeyDetails",
      "apiAvailble",
      "apikeys",
      "expriedapi",
      "regenerateApiKey",
      "settingsLoader",
      "apiLoader",
    ]),
    ...mapGetters("authtication", ["getUserSessionDto", "getUserId"]),
    ...mapGetters("settings", ["getgenerateApiDialog"]),
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
     Items: {
      get(){
        return this.$store.state.isMobileView ? ["General", "Security", "Markets"] : ["General", "Security", "Markets", "Build Info"]
      },
      set(){
      }
    },
  },

  methods: {
    securityTab() {
      this.isSecurityTab = true;
      this.isShowResetPass = false;
    },
    securityTab1() {
      this.isSecurityTab = true;
      this.isShowResetMpin = false;
    },
    securityTab2() {
      this.isSecurityTab = true;
      this.isShowResetSques = false;
    },
    showResetPassword() {
      this.isSecurityTab = false;
      this.isShowResetPass = true;
      this.currentPassword = this.confirmPassword = this.newPassword = null
      this.newPasswordError = "";
      this.currentPasswordError = "";
      this.confirmPasswordError = "";
      this.fieldTextType3 = this.fieldTextType4 = this.fieldTextType5 = false
      this.passwordFieldType4  = this.passwordFieldType3 = this.passwordFieldType5  = "password"
    },
    showResetMpinHideShow() {
      this.isSecurityTab = false;
      this.isShowResetMpin = true;
      this.newMpinError = "";
      this.newMpin = "";
      this.confirmMpin = "";
      this.confirmMpinError = "";
      this.fieldTextType = this.fieldTextType1 = false
       this.passwordFieldType = this.passwordFieldType1  = "password"
    },
    showResetSquesHideShow() {
      this.isSecurityTab = false;
      this.isShowResetSques = true;
      this.emailError = "";
      this.emailId = "";
    },

    toggleFieldTextType3() {
      this.fieldTextType3 = !this.fieldTextType3;
      this.passwordFieldType3 =
        this.passwordFieldType3 === "password" ? "text" : "password";
    },
    toggleFieldTextType4() {
      this.fieldTextType4 = !this.fieldTextType4;
      this.passwordFieldType4 =
        this.passwordFieldType4 === "password" ? "text" : "password";
    },
    toggleFieldTextType5() {
      this.fieldTextType5 = !this.fieldTextType5;
      this.passwordFieldType5 =
        this.passwordFieldType5 === "password" ? "text" : "password";
    },
    toggleFieldTextType() {
      this.fieldTextType = !this.fieldTextType;
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    toggleFieldTextType1() {
      this.fieldTextType1 = !this.fieldTextType1;
      this.passwordFieldType1 =
        this.passwordFieldType1 === "password" ? "text" : "password";
    },

    // change Security questions
    resetSecurityQuestions() {
      if (this.emailId == "") {
        this.emailError = "Please enter an Email ID";
      } else if (this.emailId != "") {
        var filter =
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(this.emailId)) {
          this.emailError = "Please provide a valid email address";
          return false;
        } else {
          this.emailError = "";
        }
        if (this.emailError == "") {
          this.$store
            .dispatch("settings/getResetSques", this.emailId)
            .then(() =>
              setTimeout(() => {
                this.securityTab2();
              }, 500)
            );
        }
      }
    },

    // change M-PIN
    resetNowMpin() {
      if (!!this.confirmMpin && !!this.newMpin) {

        if(this.newMpin.length != 6 || this.confirmMpin.length != 6){
          this.newMpin.length != 6 ? (this.newMpinError = "new M-PIN Should be 6 Digits") : ''
          this.confirmMpin.length != 6  ? (this.confirmMpinError = "Confirm M-PIN Should be 6 Digits") : ''
        }else{
        this.newMpin == this.confirmMpin && this.newMpin.length == 6 && this.confirmMpin.length == 6
          ? ""
          : (this.confirmMpinError =
              "New M-PIN and Confirm M-PIN doesn't match");
        }
      } else {
        !!this.newMpin ? "" : (this.newMpinError = "Please Enter new M-PIN");
        !!this.confirmMpin
          ? ""
          : (this.confirmMpinError = "Please Enter Confirm M-PIN");
      }
      if (this.newMpinError == "" && this.confirmMpinError == "") {
        this.$store
          .dispatch("settings/getResetMpin", this.confirmMpin)
          .then(() =>
            setTimeout(() => {
              this.securityTab1();
            }, 500)
          );
      }
    },

    // change password
    passwordChange() {
      if (
        !!this.newPassword &&
        this.confirmPassword &&
        !!this.currentPassword
      ) {
        let jsonObj = {
          oldPassword: this.currentPassword,
          newPassword: this.confirmPassword,
          preLogin: "Y",
          userId: this.getUserId,
          userSessionID: this.userSessionId,
        };
        this.newPassword == this.confirmPassword
          ? this.$store
              .dispatch("authtication/resetPassword", jsonObj)
              .then(() =>
                setTimeout(() => {
                  this.securityTab();
                }, 500)
              )
          : (this.confirmPasswordError =
              "New Password and Confirm Password doesn't match");
      } else {
        !!this.newPassword
          ? ""
          : (this.newPasswordError = "Please Enter New Password");
        !!this.confirmPassword
          ? ""
          : (this.confirmPasswordError = "Please Enter Confirm Password");
        !!this.currentPassword
          ? ""
          : (this.currentPasswordError = "Please Enter Current Password");
      }
    },

    // Market Messages
    async callMktMsg() {
      await this.$store.dispatch("settings/getMarketMessages", "NSE");
      await this.$store.dispatch("settings/getMarketMessages", "BSE");
      await this.$store.dispatch("settings/getMarketMessages", "MCX");
    },

    keyPressNumeric(event) {
      if (event.keyCode != 13) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[0-9]/.test(inp)) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }
      }
    },

    // Dialog close Function
    closeGenerateApiDialog(bool) {
      this.$store.commit("settings/setGenerateApiDialog", bool);
    },
  },

  mounted() {
    this.$store.dispatch("settings/getCustomerDetails");
    var localTab = JSON.parse(localStorage.getItem("settingsTab"));
    this.$route.query.tab ? this.infoType = this.$route.query.tab : this.infoType = localTab;
  },
};
</script>
