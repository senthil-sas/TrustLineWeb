<template>
  <v-app>
    <v-layout row wrap align-center justify-center class="opansans-font ma-0" style="height:calc(100vh - 56px) !important;margin-top:56px !important">
      <v-flex xs12 sm12 md6 lg6 xl6 id="imgPart" d-flex align-center flex-column justify-center v-if="!$store.state.isMobileView">
        <img src="../assets/images/DashboardBottom.svg" alt="">
      </v-flex>
      <v-flex xs12 sm12 md6 lg6 xl6 align-center justify-center>
        <v-layout row wrap align-center flex-column justify-center>
          <!-- <img src="../assets/images/diamond.svg" class="alignLoginRightImg" alt="LoginIcon" Lazy="load" decode="async" /> -->
          <div v-if="$store.state.ssoQuery != ''" class="d-flex flex-column align-center pb-2 text-center w-100">
            <img :src="vendorDetails['imageUrl']" alt="">
            <!-- <customIcon class="pb-2" :name="'amoga'" :width="'50'" :height="'50'" :color="$store.state.amogaColor" /> -->
            {{ vendorDetails['appName'] }}
          </div>
          <div class="rounded custom-Card pa-6 w-344">
            <div :class="
                this.whichStep == 'authorize'
                  ? 'Img-div text-center'
                  : 'Img-div'
              " v-if="
                this.whichStep == 'userId' ||
                this.whichStep == 'Forget' ||
                this.whichStep == 'Unblock' ||
                this.whichStep == 'authorize' ||
                this.whichStep == 'createMpin'
              ">
              <img width="124px " :src="$store.state.loginLogo"  alt="Logo" Lazy="load" decode="async" />
            </div>
            <!-- UserId div Start -->
            <div v-if="this.whichStep == 'userId'">
              <div class="fsize20 primaryColor font-weight-regular mb-2">
                Welcome to {{ $store.state.projectName }}
              </div>
              <div class="secondColor fsize14 mb-4">
                Sign in to your account with valid credentials
              </div>

              <form action="" @submit.prevent="checkUserId">
                <div class="mb-3">

                  <label class="fsize14 primaryColor pl-2">User ID</label>
                  <input type="text" v-model="userId" @input="$event.target.value = $event.target.value.toUpperCase()" placeholder="Enter your User ID" class="primaryColor input-field fsize14" @keypress="errorMessages = null" maxlength="50" ref="user" autofocus autocomplete="off">
                  <div class="error-msg">
                    <span v-if="errorMessages">{{errorMessages}}</span>
                  </div>

                </div>
                <v-btn depressed :color="$store.state.buttonThemeColor" :loading="userIdLoader" :disabled="userIdLoader" @click="checkUserId" class="flat w-100 text-capitalize fsize14 white--text">Next</v-btn>
              </form>
              <div class="
                  mt-2
                  mb-4
                  d-flex
                  justify-space-between
                  fsize12
                  letter-space
                  linkColor
                ">
                <span @click="checkIsMpinOrPasswordForget('Forget')">Forgot Password?</span>
                <span @click="checkIsMpinOrPasswordForget('Unblock')">Unblock Account</span>
              </div>
              <div class="d-flex justify-center fsize12 letter-space">
                <span class="primaryColor">New to {{ $store.state.projectLink }}?</span>
                <a class="linkColor pl-1 text-decoration-none" :href="$store.state.createAccount" target="_blank">Create an account </a>
              </div>
            </div>
            <!-- UserId div End  -->
            <div v-if="this.whichStep == 'Password' || this.whichStep == 'M-Pin' || this.whichStep == '2FA'">
              <div class="Img-avater text-center mb-4">
                <v-avatar color="#D8ECFF" size="90"> </v-avatar>
                <div class="fsize21 mt-4">{{ getUserId }}</div>
                <div class="d-flex justify-center fsize10 letter-space linkColor" @click="ChangeUser">
                  Switch Account
                </div>
              </div>
              <form action="" @submit.prevent="checkVaildPassOrMpin">
                <div class="mb-3">
                  <label class="fsize12 primaryColor l-height-24 pl-2">
                    {{ this.whichStep == '2FA' ? this.userQuestions[0]['Ques'] : this.whichStep }}</label>
                  <div class="
                          pswborder
                          rounded
                          d-flex
                          align-center
                          justify-space-between
                          w-100
                          h-40
                        ">
                    <span class="inputWithImg cursor">
                      <input ref="mpin" :placeholder="this.whichStep == '2FA' ? 'Enter your Answer' : 'Enter your ' +this.whichStep" v-model="newPassAndMpin" :type="passwordFieldTypePassOrMpin" :maxlength="this.whichStep == 'M-Pin' ? '6' : '50'" autocomplete="off" @keypress="keyPressNumeric($event)" class="
                              w-100
                              border-none
                              h-40
                              outline-none
                              rounded
                              py-2
                              px-4
                              fsize14
                              primaryColor
                            " required />
                    </span>
                    <span class="rounded d-flex align-center h-40" @click="toggleFieldTextTypePassOrMpin()">
                      <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2" :name="passOrMpinShowOrHide ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
                    </span>
                  </div>
                  <div class="error-msg">
                    <span v-if="passwordAndMpinErrorMessage">{{passwordAndMpinErrorMessage}}</span>
                  </div>
                </div>
                <v-btn depressed :color="$store.state.buttonThemeColor" :loading="passOrMpinLoader" :disabled="passOrMpinLoader" @click="checkVaildPassOrMpin" class="flat w-100 text-capitalize fsize14 white--text">{{this.whichStep == '2FA' ? 'Login' : 'Next'}}</v-btn>
              </form>
              <div class="
                  mt-2
                  mb-4
                  d-flex
                  justify-space-between
                  fsize12
                  letter-space
                  linkColor
                ">
                <span @click="checkIsMpinOrPasswordForget('Forget')">
                  {{
                    this.whichStep == "Password" || this.whichStep == '2FA'
                      ? "Forgot Password"
                      : "Forgot M-Pin?"
                  }}</span>
                <span @click="checkIsMpinOrPasswordForget('Unblock')">Unblock Account</span>
              </div>
              <div class="d-flex justify-center fsize12 letter-space">
                <span class="primaryColor">New to {{ $store.state.projectLink }}?</span>
                <a class="linkColor pl-1 text-decoration-none" :href="$store.state.createAccount" target="_blank">Create an account</a>
              </div>
            </div>

            <div v-if="this.whichStep == 'createMpin'">
              <div :class="
                  this.whichStep == 'createMpin'
                    ? 'fsize20 primaryColor font-weight-regular mb-4'
                    : 'fsize20 primaryColor font-weight-regular mb-2'
                "> {{ this.whichStep == "2FA" ? "Security Questions" : "Create Mpin" }}
              </div>

              <form action="" @keyup.enter="vaidateAnswer">
                <div class="mb-3">
                  <div class="fsize12 secondColor l-height-24 pl-2">
                    {{ this.whichStep == '2FA' ? this.userQuestions[0]['Ques'] : 'New M-Pin' }}</div>
                  <div class="pswborder rounded d-flex align-center justify-space-between w-100 h-40">
                    <span class="inputWithImg cursor">
                      <input ref="twofa" class="w-100
                              border-none
                              h-40
                              outline-none
                              rounded
                              py-2
                              px-4
                              fsize14
                              primaryColor" placeholder="Enter your Answer" :maxlength="this.whichStep == '2FA' ? '50' : '6'" autocomplete="off" v-model="secQuesOneAndNewMpin" :type="isSecQues1" autofocus @keypress="keyPressNumeric($event)" />
                    </span>
                    <span class="rounded d-flex align-center h-40" @click="toggleFieldTextTypeSecQ1()">
                      <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2" :name="isSecQues1ShowOrHide ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
                    </span>
                  </div>
                  <div class="error-msg">
                    <span v-if="securityAndCreateMpinErrorMessage1">{{securityAndCreateMpinErrorMessage1}}</span>
                  </div>
                  <div class="fsize12 secondColor l-height-24 pl-2">
                    {{ this.whichStep == '2FA' ? this.userQuestions[1]['Ques'] : 'Confirm M-Pin' }}</div>
                  <div class="pswborder rounded d-flex align-center justify-space-between w-100 h-40">
                    <span class="inputWithImg cursor">
                      <input class="w-100
                              border-none
                              h-40
                              outline-none
                              rounded
                              py-2
                              px-4
                              fsize14
                              primaryColor" placeholder="Enter your Answer" :maxlength="this.whichStep == '2FA' ? '50' : '6'" autocomplete="off" v-model="secQuesTwoAndConMpin" outlined :type="isSecQues2" @keypress="keyPressNumeric($event)" />
                    </span>
                    <span class="rounded d-flex align-center h-40" @click="toggleFieldTextTypeSecQ2()">
                      <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2" :name="isSecQues2ShowOrHide ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
                    </span>
                  </div>
                  <div class="negativeColor fsize12 h-12">
                    <span v-if="this.whichStep == '2FA' && questsErrorMessage != ''">{{ questsErrorMessage }}</span>
                    <span v-else-if="securityAndCreateMpinErrorMessage2">{{ securityAndCreateMpinErrorMessage2 }}</span>
                  </div>
                </div>
                <v-btn depressed :color="$store.state.buttonThemeColor" :loading="createOr2faLoader" :disabled="createOr2faLoader" @click="vaidateAnswer" class="flat w-100 text-capitalize fsize14 white--text">{{ this.whichStep == "2FA" ? "Login" : "Create" }}</v-btn>
              </form>
              <div class="
                  mt-2
                  mb-4
                  d-flex
                  justify-space-between
                  fsize12
                  letter-space
                  linkColor
                ">
                <span>Forgot Security Questions</span>
                <span @click="checkIsMpinOrPasswordForget('Unblock')">Unblock Account</span>
              </div>
              <div class="d-flex justify-center fsize12">
                <span class="primaryColor">Back to</span>
                <span class="linkColor pl-1" @click="clearLocal">Login</span>
              </div>
            </div>

            <div v-if="this.whichStep == 'Forget' || this.whichStep == 'Unblock'">
              <div class="fsize20 primaryColor font-weight-regular mb-2">
                {{
                  this.whichStep == "Forget"
                    ? "Account Recovery"
                    : "Account Unblock"
                }}
              </div>
              <div class="secondColor fsize14 mb-4">
                {{
                  this.whichStep == "Forget"
                    ? "Reset your password with valid Data."
                    : "Unblock your " +
                      $store.state.projectLink +
                      " Account with vaild data."
                }}
              </div>

              <form action="" @keyup.enter="vailDateAccount">
                <div class="mb-3">
                  <label class="fsize14 primaryColor pl-2">User ID</label>
                  <input ref="unblock" type="text" v-model="forgetUser" placeholder="Enter your User ID" class="primaryColor input-field fsize14" maxlength="50" @input="forgetUser = forgetUser.toUpperCase()" autofocus autocomplete="off">
                  <div class="error-msg">
                    <span v-if="forgetUserErrorMessage">{{forgetUserErrorMessage}}</span>
                  </div>

                  <label class="fsize14 primaryColor pl-2">PAN Number</label>
                  <input type="text" v-model="panNumber" maxlength="10" placeholder="Enter your PAN Number" class="primaryColor input-field fsize14" @input="panNumber = panNumber.toUpperCase()" autocomplete="off">
                  <div class="error-msg">
                    <span v-if="panErrorMessage">{{panErrorMessage}}</span>
                  </div>
                  <div class="negativeColor fsize12 h-12">
                    <span v-if="
                        (this.whichStep == 'Forget' ||
                          this.whichStep == 'Unblock') &&
                        unblockErrorMessage != ''
                      ">{{ unblockErrorMessage }}</span>
                  </div>
                </div>
                <v-btn depressed :color="$store.state.buttonThemeColor" @click="vailDateAccount" :loading="forgetOrUnblockLoader" :disabled="forgetOrUnblockLoader" class="flat w-100 text-capitalize fsize14 white--text">{{ this.whichStep == "Forget" ? "Reset" : "Unblock" }}</v-btn>
              </form>

              <div class="d-flex justify-center fsize12 mt-4">
                <span class="primaryColor">Back to</span>
                <span class="linkColor pl-1" @click="clearLocal">Login</span>
              </div>
            </div>
            <div v-if="this.whichStep == 'authorize'">
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
              <ul class="fsize14 ml-4 pt-4 mb-4  primaryColor">
                <li>Access holding and positions portfolio</li>
                <li>Place, modify, and cancel otders</li>
                <li>View your account balance and margins</li>
                <li>View your profile details</li>
              </ul>
              <v-btn depressed :color="$store.state.buttonThemeColor" @click="vaildateAuthorize" :loading="authorizeLoader" :disabled="authorizeLoader" class="flat w-100 text-capitalize fsize14 white--text">Authorize</v-btn>
            </div>

            <div v-if="this.whichStep == 'reset'">
              <div class="fsize20 primaryColor font-weight-regular mb-4">
                Reset Password
              </div>

              <form action="" @keyup.enter="vailDateResetPassword">
                <div class="mb-3">
                  <label class="fsize12 secondColor l-height-24 pl-2">
                    Current Password</label>
                  <div class="pswborder rounded d-flex align-center justify-space-between w-100 h-40">
                    <span class="inputWithImg cursor">
                      <input ref="reset" class="w-100
                              border-none
                              h-40
                              outline-none
                              rounded
                              py-2
                              px-4
                              fsize14
                              primaryColor" placeholder="Enter Current Password" maxlength="50" autocomplete="off" v-model="currentPass" :type="isCurrentPassIcon" autofocus />
                    </span>
                    <span class="rounded d-flex align-center h-40" @click="toggleFieldTextTypeCurrentPass()">
                      <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2" :name="curentPassShowOrHide ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
                    </span>
                  </div>
                  <div class="error-msg">
                    <span v-if="currentPassErrorMessage">{{currentPassErrorMessage}}</span>
                  </div>

                  <label class="fsize12 secondColor l-height-24 pl-2">
                    New Password</label>
                  <div class="pswborder rounded d-flex align-center justify-space-between w-100 h-40">
                    <span class="inputWithImg cursor">
                      <input class="w-100
                              border-none
                              h-40
                              outline-none
                              rounded
                              py-2
                              px-4
                              fsize14
                              primaryColor" placeholder="Enter New Password" maxlength="50" autocomplete="off" v-model="newPass" :type="isNewPassIcon" />
                    </span>
                    <span class="rounded d-flex align-center h-40" @click="toggleFieldTextTypeNewPass()">
                      <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2" :name="newPassShowOrHide ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
                    </span>
                  </div>
                  <div class="error-msg">
                    <span v-if="newPassErrorMessage">{{newPassErrorMessage}}</span>
                  </div>
                  <label class="fsize12 secondColor l-height-24 pl-2">
                    Confirm Password</label>
                  <div class="pswborder rounded d-flex align-center justify-space-between w-100 h-40">
                    <span class="inputWithImg cursor">
                      <input class="w-100
                              border-none
                              h-40
                              outline-none
                              rounded
                              py-2
                              px-4
                              fsize14
                              primaryColor" placeholder="Enter Confirm Password" maxlength="50" autocomplete="off" v-model="confirmPass" :type="isConfirmPassIcon" :error-messages="confirmPassErrorMessage" />
                    </span>
                    <span class="rounded d-flex align-center h-40" @click="toggleFieldTextTypeConfirmPass()">
                      <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2" :name="confirmPassShowOrHide ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
                    </span>
                  </div>
                  <div class="error-msg">
                    <span v-if="newPassErrorMessage">{{newPassErrorMessage}}</span>
                  </div>
                </div>
                <v-btn depressed :color="$store.state.buttonThemeColor" @click="vailDateResetPassword" :loading="resetLoader" :disabled="resetLoader" class="flat w-100 text-capitalize fsize14 white--text">Reset</v-btn>
              </form>

              <div class="d-flex justify-center fsize12 mt-4">
                <span class="primaryColor">Back to</span>
                <span class="linkColor pl-1" @click="clearLocal">Login</span>
              </div>
            </div>
            <div v-if="this.whichStep == 'Reset 2FA'">
              <div class="
                  fsize20
                  primaryColor
                  font-weight-regular
                  mb-4
                  text-center
                ">
                Reset 2FA
              </div>
              <div class="fsize14 mb-2 secondColor text-center">
                Please select a Any Five Questions
              </div>

              <form action="" @keyup.enter="vaildateResetQues">
                <div class="w-100 mb-4 vh-70 ofy-auto">
                  <!-- <form > -->
                  <div v-for="(item, index) in this.userQuestions" :key="index">
                    <div class="row ma-0 py-2 pr-2 align-center">
                      <label class="fsize12 secondColor cursor l-height-24">
                        <input type="checkbox" ref="qes0" v-model="item.checked" :value="item.checkedValue" @click="checkBox($event, item)" class="mr-2" />
                        {{ item.ques }}</label>
                      <div class="
                          pswborder
                          rounded
                          d-flex
                          align-center
                          justify-space-between
                          w-100
                          h-40
                        ">
                        <span class="inputWithImg cursor">
                          <input :disabled="!item.checked" v-model="item.value" :type="item.passwordFieldType" minlength="1" maxlength="20" class="
                              w-100
                              border-none
                              h-40
                              outline-none
                              rounded
                              py-2
                              px-4
                              fsize14
                              primaryColor
                            " required />
                        </span>
                        <span class="rounded d-flex align-center h-40" @click="toggleFieldTextType(item)">
                          <customIcon class="rounded h-40 InputWithImg cursor pt-2 pr-2" :name="item.fieldTextType ? 'eyeopen' : 'eyeclose'" :width="'24'" :height="'24'" :color="$store.state.iconBlackColourCode" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- </form> -->
                </div>
              </form>

              <v-btn depressed :color="$store.state.buttonThemeColor" @click="vaildateResetQues" :loading="reset2faLoader" :disabled="reset2faLoader" class="flat w-100 text-capitalize fsize14 white--text">Save</v-btn>
            </div>
          </div>

          <!-- <div class="mt-8 d-flex ">
           <a  target="_blank" >  <img src="../assets/images/appleStoreIcon.svg" alt="" class="mr-4 cursor"> </a>
          <a href="https://play.google.com/store/apps/details?id=com.codifi.aliceblue" target="_blank"> <img src="../assets/images/playStoreIcon.svg" alt="" class="cursor"> </a>
           </div> -->
        </v-layout>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import errorHandling from "../store/Services/errorHandling";
import customIcon from "../components/customIcon.vue";
export default {
  components: {
    customIcon,
  },
  data: () => ({
    newPassAndMpin: "",
    passwordShow: false,
    secQuesOneAndNewMpin: "",
    secQuesTwoAndConMpin: "",
    forgetUser: "",
    panNumber: "",
    errorMessages: "",
    ssoMode: null,
    vendorName: null,
    redirectionUrl: null,
    confirmPass: "",
    confirmPassErrorMessage: "",
    newPass: "",
    newPassErrorMessage: "",
    currentPass: "",
    currentPassErrorMessage: "",
    selectedArray: [],
    counter: 0,

    // passOrMpinicon
    passwordFieldTypePassOrMpin: "password",
    passOrMpinShowOrHide: false,

    // sec-q
    isSecQues1: "password",
    isSecQues2: "password",
    isSecQues1ShowOrHide: false,
    isSecQues2ShowOrHide: false,
    // reset
    isCurrentPassIcon: "password",
    curentPassShowOrHide: false,
    isNewPassIcon: "password",
    newPassShowOrHide: false,
    isConfirmPassIcon: "password",
    confirmPassShowOrHide: false,

    abmlPassword: null,
    dateOfBirth: null,
    interval: 4000,
  }),

  methods: {
    toggleFieldTextTypePassOrMpin() {
      this.passOrMpinShowOrHide = !this.passOrMpinShowOrHide;
      this.passwordFieldTypePassOrMpin = this.passOrMpinShowOrHide
        ? "text"
        : "password";
    },
    toggleFieldTextTypeSecQ1() {
      this.isSecQues1ShowOrHide = !this.isSecQues1ShowOrHide;
      this.isSecQues1 = this.isSecQues1ShowOrHide ? "text" : "password";
    },
    toggleFieldTextTypeSecQ2() {
      this.isSecQues2ShowOrHide = !this.isSecQues2ShowOrHide;
      this.isSecQues2 = this.isSecQues2ShowOrHide ? "text" : "password";
    },
    toggleFieldTextTypeCurrentPass() {
      this.curentPassShowOrHide = !this.curentPassShowOrHide;
      this.isCurrentPassIcon = this.curentPassShowOrHide ? "text" : "password";
    },
    toggleFieldTextTypeNewPass() {
      this.newPassShowOrHide = !this.newPassShowOrHide;
      this.isNewPassIcon = this.newPassShowOrHide ? "text" : "password";
    },
    toggleFieldTextTypeConfirmPass() {
      this.confirmPassShowOrHide = !this.confirmPassShowOrHide;
      this.isConfirmPassIcon = this.confirmPassShowOrHide ? "text" : "password";
    },
    checkQuickLogin() {
      if (!!this.abmlPassword && !!this.dateOfBirth) {
        let jsonObj;
        this.$store.state.ssoQuery == ""
          ? (jsonObj = {
              userId: this.getUserId,
              password: this.abmlPassword,
              pan: this.dateOfBirth,
            })
          : (jsonObj = {
              userId: this.getUserId,
              password: this.abmlPassword,
              pan: this.dateOfBirth,
              callBackUrl: this.$store.state.ssoQuery.redirectUrl,
              loginMode: this.$store.state.ssoQuery.mode,
              vendor: this.$store.state.ssoQuery.vendor,
            });

        this.dateOfBirth.length == 8
          ? this.$store.dispatch("authtication/abmlLoginservice", jsonObj)
          : this.$store.commit(
              "authtication/setDateOfBirthErrorMessage",
              "Please Enter a correct DOB in DDMMYYYY Format"
            );
      } else {
        this.$store.commit(
          "authtication/setAbmlPassErrorMessage",
          "Please Enter Your Password"
        );
        this.$store.commit(
          "authtication/setDateOfBirthErrorMessage",
          "Please Enter Your Date Of Birth"
        );
      }
    },
    checkUserId() {
      if (!!this.getUserId) {
        let userfetch = {
          userId: this.getUserId,
        };
        this.$store.dispatch("authtication/getUserId", userfetch);
        this.$store.commit("authtication/setPasswordAndMpinErrorMessage", "");
        this.resetPassAndMpin();
      } else {
        this.errorMessages = "Please Enter Your UserID";
      }
    },
    checkVaildPassOrMpin() {
      if (!!this.newPassAndMpin) {
        if (this.whichStep == "2FA") {
          let mapObject = {
            answer1: this.newPassAndMpin,
            userId: this.getUserId,
            sCount: this.userQuestions.length.toString(),
            sIndex: this.userQuestions[0]["index"],
          };
          this.$store.state.ssoQuery
            ? (mapObject.vendor = this.$store.state.ssoQuery.appcode)
            : "";
          this.$store.dispatch("authtication/vailDateSecQues", mapObject);
          this.reset2FA();
          this.resetPasswordField();
        } else if (this.whichStep == "M-Pin") {
          let userfetch;
          this.$store.state.ssoQuery == ""
            ? (userfetch = {
                mpin: this.newPassAndMpin,
                userId: this.getUserId,
              })
            : (userfetch = {
                mpin: this.newPassAndMpin,
                userId: this.getUserId,
                callBackUrl: this.$store.state.ssoQuery.redirectUrl,
                loginMode: this.$store.state.ssoQuery.mode,
                vendor: this.$store.state.ssoQuery.appcode,
              });
          this.newPassAndMpin.length == 6
            ? this.$store.dispatch("authtication/callMpin", userfetch)
            : this.$store.commit(
                "authtication/setPasswordAndMpinErrorMessage",
                "Please Enter 6 Digits"
              );
        } else {
          var userId = this.getUserId;
          var password = this.newPassAndMpin;
          this.$store.dispatch("authtication/encryptPassword", {
            userId,
            password,
          });
        }
      } else {
        if (this.whichStep == "2FA") {
          this.$store.commit(
            "authtication/setPasswordAndMpinErrorMessage",
            "Please Enter Your Vaild Answer"
          );
        } else {
          this.$store.commit(
            "authtication/setPasswordAndMpinErrorMessage",
            this.whichStep == "M-Pin"
              ? "Please Enter your Mpin"
              : "Please Enter your Password"
          );
        }
      }
    },
    clearLocal() {
      localStorage.clear();
      this.$store.commit("authtication/setWhichStep", "userId");
      this.$store.commit("authtication/setUserId", "");
      this.newPassAndMpin = null;
      this.secQuesOneAndNewMpin = null;
      this.secQuesTwoAndConMpin = null;
      this.$nextTick(() => {
        this.$refs.user.focus();
      });
    },
    vaidateAnswer() {
      if (!!this.secQuesTwoAndConMpin && !!this.secQuesOneAndNewMpin) {
        if (this.whichStep == "2FA") {
          let mapObject;
          this.$store.state.ssoQuery == ""
            ? (mapObject = {
                answer1: this.secQuesOneAndNewMpin,
                answer2: this.secQuesTwoAndConMpin,
                userId: this.getUserId,
                sCount: this.userQuestions.length.toString(),
                sIndex:
                  this.userQuestions[0]["index"] +
                  "|" +
                  this.userQuestions[1]["index"],
              })
            : (mapObject = {
                answer1: this.secQuesOneAndNewMpin,
                answer2: this.secQuesTwoAndConMpin,
                userId: this.getUserId,
                sCount: this.userQuestions.length.toString(),
                sIndex:
                  this.userQuestions[0]["index"] +
                  "|" +
                  this.userQuestions[1]["index"],
                callBackUrl: this.$store.state.ssoQuery.redirectUrl,
                loginMode: this.$store.state.ssoQuery.mode,
                vendor: this.$store.state.ssoQuery.vendor,
              });
        }
        this.whichStep == "2FA"
          ? this.$store.dispatch("authtication/vailDateSecQues", mapObject)
          : "";

        let json = {
          userId: this.getUserId,
          mpin: this.secQuesTwoAndConMpin,
        };
        this.whichStep == "createMpin" && this.secQuesOneAndNewMpin.length != 6
          ? this.$store.commit(
              "authtication/setQuesAndMpinErrorMessageOne",
              "New Mpin should be 6 Digits"
            )
          : "";
        this.whichStep == "createMpin" && this.secQuesTwoAndConMpin.length != 6
          ? this.$store.commit(
              "authtication/setQuesAndMpinErrorMessageTwo",
              "Confirm Mpin should be 6 Digits"
            )
          : "";
        this.whichStep == "createMpin" &&
        this.secQuesTwoAndConMpin.length == 6 &&
        this.secQuesOneAndNewMpin.length == 6 &&
        this.secQuesOneAndNewMpin != this.secQuesTwoAndConMpin
          ? this.$store.commit(
              "authtication/setQuesAndMpinErrorMessageTwo",
              "Confirm mpin does not match new Mpin"
            )
          : "";
        this.whichStep == "createMpin" &&
        this.secQuesTwoAndConMpin.length == 6 &&
        this.secQuesOneAndNewMpin.length == 6 &&
        this.secQuesOneAndNewMpin == this.secQuesTwoAndConMpin
          ? this.$store.dispatch("authtication/createMpin", json)
          : "";
      } else {
        !!this.secQuesOneAndNewMpin
          ? ""
          : this.$store.commit(
              "authtication/setQuesAndMpinErrorMessageOne",
              this.whichStep == "2FA"
                ? "Please Enter your Answer"
                : "New Mpin is Cannot Empty"
            );
        !!this.secQuesTwoAndConMpin
          ? ""
          : this.$store.commit(
              "authtication/setQuesAndMpinErrorMessageTwo",
              this.whichStep == "2FA"
                ? "Please Enter your Answer"
                : "Confirm Mpin is Cannot Empty"
            );
      }
    },
    checkIsMpinOrPasswordForget(key) {
      this.newPassAndMpin = null;
      this.forgetUser = null;
      this.panNumber = null;
      this.$store.commit("authtication/setForgetUserErrorMessage", "");
      this.$store.commit("authtication/setPanErrorMessage", "");
      this.$store.commit("authtication/setPasswordAndMpinErrorMessage", "");
      if (this.whichStep == "M-Pin") {
        this.$store.commit("authtication/setWhichStep", "Password");
        this.$refs.mpin.focus();
      } else {
        this.$store.commit("authtication/setWhichStep", key);
      }
    },

    ChangeUser() {
      this.$store.commit("authtication/setWhichStep", "userId");
      this.$store.commit("authtication/setUserId", "");
      localStorage.setItem("currentUser", JSON.stringify(""));
      this.newPassAndMpin = null;
      requestAnimationFrame(() => {
        this.$refs.user.focus();
      });
    },

    keyPressNumeric(event) {
      this.$store.commit("authtication/setPasswordAndMpinErrorMessage", "");
      this.$store.commit("authtication/setQuesAndMpinErrorMessageOne", "");
      this.$store.commit("authtication/setQuesAndMpinErrorMessageTwo", "");
      this.$store.commit("authtication/setQuestionsErrorMessage", "");
      if (
        event.keyCode != 13 &&
        (this.whichStep == "M-Pin" || this.whichStep == "createMpin")
      ) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[0-9]/.test(inp)) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }
      }
    },

    vailDateAccount() {
      if (!!this.forgetUser && !!this.panNumber) {
        let unblock = {
          pan: this.panNumber,
          email: "",
          userId: this.forgetUser.toUpperCase(),
        };

        let forget = {
          userId: this.forgetUser.toUpperCase(),
          pan: this.panNumber,
          email: "",
          dob: "",
        };
        this.whichStep == "Forget"
          ? this.$store.dispatch("authtication/forgetPassword", forget)
          : this.$store.dispatch("authtication/unblockAccount", unblock);
      } else {
        !!this.forgetUser
          ? ""
          : this.$store.commit(
              "authtication/setForgetUserErrorMessage",
              "Please Enter your UserID"
            );
        !!this.panNumber
          ? ""
          : this.$store.commit(
              "authtication/setPanErrorMessage",
              "Please Enter PAN Number"
            );
      }
    },

    vaildateAuthorize() {
      let user = {
        userId: this.getUserId,
        vendor: this.$store.state.ssoQuery.appcode,
      };
      this.$store.dispatch("authtication/authorizeVenfor", user);
    },

    vailDateResetPassword() {
      if (!!this.currentPass && !!this.newPass && !!this.confirmPass) {
        var user = this.getUserId;
        let jsonObj = {
          oldPassword: this.currentPass,
          newPassword: this.confirmPass,
          preLogin: "Y",
          userId: user,
          userSessionID: this.userSessionId,
        };
        this.newPass == this.confirmPass
          ? this.$store.dispatch("authtication/resetPassword", jsonObj)
          : (this.confirmPassErrorMessage =
              "Confirm Password does not match New Password");
      } else {
        !!this.currentPass
          ? ""
          : (this.currentPassErrorMessage =
              "Please Enter your Current Password");
        !!this.newPass
          ? ""
          : (this.newPassErrorMessage = "Please Enter your New Password");
        !!this.confirmPass
          ? ""
          : (this.confirmPassErrorMessage =
              "Please Enter your Confirm Password");
      }
    },

    toggleFieldTextType(val) {
      for (let item of this.selectedArray) {
        if (val.sindex == item.sindex) {
          val.fieldTextType = !val.fieldTextType;
          val.passwordFieldType =
            val.passwordFieldType === "password" ? "text" : "password";
        }
      }
    },

    checkBox(e, val) {
      if (e.target.checked === true) {
        if (this.counter < 5) {
          val.checked = true;
          for (let item of this.userQuestions) {
            if (item.sindex == val.sindex) {
              this.selectedArray.push(item);
            }
          }
          this.counter++;
        } else {
          e.target.checked = false;
          val.checked = false;
          errorHandling.toaster(
            "",
            "danger",
            "You Already Selected Five Questions",
            3000
          );
        }
      } else if (this.counter > 0) {
        this.counter--;
        for (let item of this.selectedArray) {
          if (item.sindex == val.sindex) {
            const index = this.selectedArray.indexOf(item);
            if (index !== -1) {
              this.selectedArray.splice(index, 1);
            }
          }
        }
      }
    },

    vaildateResetQues() {
      var checkCount = 0;
      var res = "";
      for (let item of this.selectedArray) {
        item.value != "" ? (checkCount = checkCount + 1) : "";
        res += item.sindex + "|" + item.value + "|";
      }

      let json = {
        userId: this.getUserId,
        ques_Ans: res.substring(0, res.length - 1),
      };
      checkCount > 0 && checkCount < 5
        ? errorHandling.toaster(
            "",
            "danger",
            "Please Fill a selected Questions",
            3000
          )
        : "";
      checkCount == 5
        ? this.$store.dispatch("authtication/saveSecQues", json)
        : "";
    },

    resetPasswordField() {
      this.currentPass = null;
      this.newPass = null;
      this.confirmPass = null;
      this.curentPassShowOrHide = false;
      this.newPassShowOrHide = false;
      this.confirmPassShowOrHide = false;
      this.currentPassErrorMessage = "";
      this.newPassErrorMessage = "";
      this.newPassErrorMessage = "";
      this.isConfirmPassIcon = "password";
      this.isNewPassIcon = "password";
      this.isCurrentPassIcon = "password";
    },

    resetPassAndMpin() {
      this.passOrMpinShowOrHide = false;
      this.newPassAndMpin = null;
      this.passwordFieldTypePassOrMpin = "password";
      this.$store.commit("authtication/setPasswordAndMpinErrorMessage", "");
    },
    reset2FA() {
      this.secQuesTwoAndConMpin = null;
      this.secQuesOneAndNewMpin = null;
      this.isSecQues1ShowOrHide = false;
      this.isSecQues2ShowOrHide = false;
      (this.isSecQues1 = "password"),
        (this.isSecQues2 = "password"),
        this.$store.commit("authtication/setQuesAndMpinErrorMessageTwo", "");
      this.$store.commit("authtication/setQuesAndMpinErrorMessageOne", "");
    },
  },

  watch: {
    currentPass: function () {
      this.currentPassErrorMessage = "";
    },
    newPass: function () {
      this.newPassErrorMessage = "";
    },
    confirmPass: function () {
      this.confirmPassErrorMessage = "";
    },
    passwordAndMpinErrorMessage: function () {
      this.passwordAndMpinErrorMessage != "" ? (this.newPassAndMpin = "") : "";
    },
    forgetUserErrorMessage: function () {
      this.forgetUserErrorMessage != "" ? (this.forgetUser = "") : "";
    },
    panErrorMessage: function () {
      this.panErrorMessage != "" ? (this.panNumber = "") : "";
    },
    panNumber: function (value) {
      value ? this.$store.commit("authtication/setPanErrorMessage", "") : "";
      value
        ? this.$store.commit("authtication/setUnblockErrorMessage", "")
        : "";
    },
    forgetUser: function (value) {
      value
        ? this.$store.commit("authtication/setForgetUserErrorMessage", "")
        : "";
      value
        ? this.$store.commit("authtication/setUnblockErrorMessage", "")
        : "";
    },
    securityAndCreateMpinErrorMessage1: function () {
      this.securityAndCreateMpinErrorMessage1 != ""
        ? (this.secQuesOneAndNewMpin = "")
        : "";
    },
    securityAndCreateMpinErrorMessage2: function () {
      this.securityAndCreateMpinErrorMessage2 != ""
        ? (this.secQuesTwoAndConMpin = "")
        : "";
    },
    unblockErrorMessage: function () {
      this.unblockErrorMessage != "" ? (this.forgetUser = "") : "";
      this.unblockErrorMessage != "" ? (this.panNumber = "") : "";
    },
    questsErrorMessage: function () {
      this.questsErrorMessage != "" ? (this.secQuesOneAndNewMpin = "") : "";
      this.questsErrorMessage != "" ? (this.secQuesTwoAndConMpin = "") : "";
    },
  },
  computed: {
    userId: {
      get: function () {
        return this.$store.state.userId;
      },
      set: function (newValue) {
        this.$store.commit("authtication/setUserId", newValue.toUpperCase());
      },
    },
    whichStep: {
      get: function () {
        if (this.$store.state.authtication.whichStep == '"userId"') {
          this.$nextTick(() => this.$refs.user.focus());
        } else if (
          this.$store.state.authtication.whichStep == "Password" ||
          this.$store.state.authtication.whichStep == "M-Pin" ||
          this.$store.state.authtication.whichStep == "2FA"
        ) {
          this.$nextTick(() => this.$refs.mpin.focus());

          this.$store.state.authtication.whichStep == "2FA" ||
          this.$store.state.authtication.whichStep == "Password"
            ? this.resetPassAndMpin()
            : "";
        } else if (this.$store.state.authtication.whichStep == "createMpin") {
          this.$nextTick(() => this.$refs.twofa.focus());
        } else if (this.$store.state.authtication.whichStep == "reset") {
          this.$nextTick(() => this.$refs.reset.focus());
        } else if (
          this.$store.state.authtication.whichStep == "Unblock" ||
          this.$store.state.authtication.whichStep == "Forget"
        ) {
          this.$nextTick(() => this.$refs.unblock.focus());
        }
        return this.$store.state.authtication.whichStep;
      },
      set: function (value) {},
    },
    ...mapState("authtication", [
      "userQuestions",
      "passwordAndMpinErrorMessage",
      "userSessionId",
      "forgetUserErrorMessage",
      "securityAndCreateMpinErrorMessage1",
      "securityAndCreateMpinErrorMessage2",
      "panErrorMessage",
      "questsErrorMessage",
      "unblockErrorMessage",
      "userIdLoader",
      "passOrMpinLoader",
      "createOr2faLoader",
      "forgetOrUnblockLoader",
      "authorizeLoader",
      "resetLoader",
      "reset2faLoader",
      "dateOfBirthErrorMessage",
      "abmlPassErrorMessage",
      "quickLoader",
      "quickLoginErrorMessage",
      "vendorDetails",
    ]),
    ...mapGetters("authtication", [
      "getUserId",
      "getUserSession",
      "getUserSessionDto",
    ]),
  },
  mounted() {
    var checkStep = JSON.parse(localStorage.getItem("whichStep"));
    !!checkStep && checkStep != "undefined"
      ? this.$store.commit("authtication/setWhichStep", checkStep)
      : "";
    var checkQues = JSON.parse(localStorage.getItem("secQuestion"));
    !!checkQues && checkQues != "undefined"
      ? this.$store.commit("authtication/setSecQuestionRefresh", checkQues)
      : "";
    var checkIsMpin = JSON.parse(localStorage.getItem("isMpin"));
    checkIsMpin != undefined && checkIsMpin != "undefined"
      ? this.$store.commit("authtication/setIsMpin", checkIsMpin)
      : "";
    var checkAuthcode = JSON.parse(localStorage.getItem("authcode"));
    !!checkAuthcode && checkAuthcode != "undefined"
      ? this.$store.commit("authtication/setRedirectUrl", checkAuthcode)
      : "";
    this.selectedArray = [];
  },
  created() {
    var q = this.$route.query;
    if (q.type == "basket" && q.appCode && q.sessionId) {
      localStorage.setItem("basketOrder", true);
      localStorage.setItem("basketSessionId", q.sessionId);
      localStorage.setItem("basketAppCode", q.appCode);
    }
  },
};
</script>