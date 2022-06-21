<template>
  <div>
    <div class="px-4 py-2 d-flex align-center">
      <div class="font-weight-bold primaryColor">Funds</div>
      <v-progress-circular
        class="ml-2"
        indeterminate
        size="18"
        v-if="fundsOrHoldingsLoader"
        :width="2"
        color="blue"
      ></v-progress-circular>
    </div>
    <v-row class="ma-0 px-4">
      <v-slide-group v-model="infoType" class="pa-0" mandatory hide-arrows>
        <v-slide-item
          v-for="(item, i) in Items"
          :key="i"
          v-slot="{ active, toggle }"
        >
          <v-btn
            depressed
            :color="
              active ? 'activeColor white--text' : 'unActiveColor black--text'
            "
            height="26"
            min-width="50"
            class="fsize12 rounded-sm text-center text-capitalize"
            :value="isFunds ? isFunds : item"
            @click="toggle"
          >
            {{ isFunds ? isFunds : item }}
          </v-btn>
        </v-slide-item>
      </v-slide-group>
    </v-row>

    <v-divider class="mx-4 my-2"></v-divider>

    <div class="px-4 pb-4" v-if="!this.fundsOrHoldingsLoader">
      <v-card>
        <v-layout
          row
          wrap
          align-center
          justify-center
          class="mx-4 mt-4"
          v-if="!isFunds"
        >
          <v-flex
            xs12
            sm12
            md6
            lg6
            xl6
            align-center
            justify-center
            text-center
            class="my-2"
          >
            <div class="text-center">
              <label class="fsize12 secondColor">Available Margin</label>
              <div>
                <label class="fsize20 primaryColor font-weight-bold"
                  >&#8377;</label
                >&nbsp;<span class="fsize20 primaryColor font-weight-bold"
                  >{{
                    this.fundsLimit.net
                      ? ruppesFormat(formatNum(this.fundsLimit.net))
                      : "NA"
                  }}
                </span>
              </div>
            </div>

            <div class="row ma-0 pt-8">
              <div class="col-6 pa-0 text-center">
                <label class="fsize12 secondColor">Opening Balance</label>
                <div>
                  <label class="fsize20 primaryColor">&#8377;</label>&nbsp;<span
                    class="fsize20 primaryColor"
                    >{{
                      this.fundsLimit.cashmarginavailable
                        ? ruppesFormat(
                            formatNum(this.fundsLimit.cashmarginavailable)
                          )
                        : "NA"
                    }}</span
                  >
                </div>
              </div>

              <div class="col-6 pa-0 text-center">
                <label class="fsize12 secondColor text-capitalize"
                  >Margin Used</label
                >
                <div>
                  <label class="fsize20 primaryColor">&#8377;</label>&nbsp;<span
                    class="fsize20 primaryColor"
                    >{{
                      this.fundsLimit.subtotal
                        ? ruppesFormat(formatNum(this.fundsLimit.subtotal))
                        : "NA"
                    }}</span
                  >
                </div>
              </div>
            </div>

            <div class="row ma-0 pt-8 d-flex justify-center">
              <v-btn
                depressed
                color="#4184f3"
                @click="resetDepositField();$store.dispatch('funds/getBankDetails', '');"
                :disabled="payInLoader"
                :loading="payInLoader"
                class="rounded mr-3 mt-3 text-capitalize white--text"
                width="120"
                height="40"
                >Deposit</v-btn
              >
              <v-btn
                depressed
                color="#26a69a"
                class="white--text rounded ma-0 mr-3 mt-3 text-capitalize"
                width="120"
                height="40"
                :disabled="payoutLoader"
                :loading ="payoutLoader"
                @click="resetWithDrawField();$store.dispatch('funds/checkBalence');"
                >Withdraw</v-btn
              >
            </div>
          </v-flex>
          <v-divider
            v-if="$store.state.windowWidth > 1263"
            vertical
            class="my-4"
          ></v-divider>
          <v-flex
            xs12
            sm12
            md12
            lg6
            xl6
            align-center
            justify-center
            class="mt-2 mb-4"
          >
            <div class="px-4 py-2 fsize14 l-height-24">
              <span class="secondaryColor">Payin</span>
              <span class="float-right primaryColor">{{
                this.fundsLimit.rmsPayInAmnt
                  ? parseFloat(this.fundsLimit.rmsPayInAmnt).toFixed(2)
                  : "NA"
              }}</span>
            </div>
            <div class="px-4 py-2 fsize14 l-height-24">
              <span class="secondaryColor">Payout</span>
              <span class="float-right primaryColor">{{
                this.fundsLimit.payoutamount
                  ? parseFloat(this.fundsLimit.payoutamount).toFixed(2)
                  : "NA"
              }}</span>
            </div>
            <div class="px-4 py-2 fsize14 l-height-24">
              <span class="secondaryColor">Var Margin</span>
              <span class="float-right primaryColor">{{
                this.fundsLimit.varmargin
                  ? parseFloat(this.fundsLimit.varmargin).toFixed(2)
                  : "NA"
              }}</span>
            </div>
            <div class="px-4 py-2 fsize14 l-height-24">
              <span class="secondaryColor">ELM</span>
              <span class="float-right primaryColor">{{
                this.fundsLimit.elm
                  ? parseFloat(this.fundsLimit.elm).toFixed(2)
                  : "NA"
              }}</span>
            </div>
            <div class="px-4 py-2 fsize14 l-height-24">
              <span class="secondaryColor">SPAN</span>
              <span class="float-right primaryColor">{{
                this.fundsLimit.spanmargin
                  ? parseFloat(this.fundsLimit.spanmargin).toFixed(2)
                  : "NA"
              }}</span>
            </div>
            <div class="px-4 py-2 fsize14 l-height-24">
              <span class="secondaryColor">Exposure</span>
              <span class="float-right primaryColor">{{
                this.fundsLimit.exposuremargin
                  ? parseFloat(this.fundsLimit.exposuremargin).toFixed(2)
                  : "NA"
              }}</span>
            </div>
            <div class="px-4 py-2 fsize14 l-height-24">
              <span class="secondaryColor">Options premium</span>
              <span class="float-right primaryColor">{{
                this.fundsLimit.premiumPrsnt
                  ? parseFloat(this.fundsLimit.premiumPrsnt).toFixed(2)
                  : "NA"
              }}</span>
            </div>
            <div class="px-4 py-2 fsize14 l-height-24">
              <span class="secondaryColor">Collateral</span>
              <span class="float-right primaryColor">{{
                this.fundsLimit.collateralvalue
                  ? parseFloat(
                      this.fundsLimit.collateralvalue +
                        this.fundsLimit.directcollateralvalue
                    ).toFixed(2)
                  : "NA"
              }}</span>
            </div>
          </v-flex>
        </v-layout>

        <div v-if="isFunds == 'Deposit'" class="pa-4">
          <v-layout row wrap justify-center class="pl-4 pr-4 mt-2">
            <v-flex xs12 sm12 md4 lg4 xl4 align-center justify-center>
              <div class="w-100 fsize12">Choose segment</div>
              <v-autocomplete
                v-model="selectSegment"
                :items="bankDetails.segEna"
                outlined
                dense
                height="40"
                single-line
                label="Choose segment"
                class="funds fsize12"
                @change="segmentErrorMessage = ''"
                item-text="showValue"
                item-value="value"
                :error-messages="segmentErrorMessage"
              ></v-autocomplete>
              <span class="w-100 fsize12">{{
                selectSegment == "NSE_CASH"
                  ? "BSE"
                  : selectSegment == "NSE_FNO"
                  ? "NFO"
                  : selectSegment == "MCX"
                  ? "MCX"
                  : selectSegment == "CD_NSE"
                  ? "CDS"
                  : "Amount (NSE)"
              }}</span>
              <div class="border-input rounded">
                <span class="rupee-symbol">₹</span>
                <input
                  type="text"
                  placeholder="Enter amount (min 50)"
                  v-model.number="amount"
                  class="
                    h-40
                    outline-none
                    pl-9
                    pr-4
                    py-2
                    border-none
                    fsize14
                    primaryColor
                    w-100
                  "
                  @keypress="amountErrorMessage = ''"
                  autocomplete="off"
                />
              </div>
              <div
                class="error-msg ma-0 pl-3"
                style="margin-bottom: 2px !important"
              >
                <span v-if="amountErrorMessage">{{
                  amountErrorMessage
                }}</span>
              </div>

              <span class="w-100 fsize12 mt-1" v-if="payment == 'UPI'"
                >Virtual payment address (UPI ID)</span
              >
              <input
                type="text"
                placeholder="Eg: username@upi"
                v-if="payment == 'UPI'"
                v-model="bankDetails.upiId"
                @keypress="upiErrorMessage = ''"
                class="
                  h-40
                  w-100
                  rounded
                  px-4
                  py-2
                  border-input
                  fsize14
                  mt-0
                  primaryColor
                "
                autocomplete="off"
              />
              <div
                class="error-msg ma-0 pl-3"
                v-if="payment == 'UPI'"
                style="margin-bottom: 2px !important"
              >
                <span v-if="upiErrorMessage">{{ upiErrorMessage }}</span>
              </div>
              <div class="w-100 fsize12 mt-1">Select Account</div>
              <v-autocomplete
                v-model="selectAccount"
                :items="bankDetails.bankDet"
                outlined
                dense
                height="40"
                single-line
                label="Select Account"
                @change="accountErrorMessage = ''"
                class="funds fsize12"
                item-text="showValue"
                item-value="showValue"
                :error-messages="accountErrorMessage"
              ></v-autocomplete>

              <div class="w-100 fsize12 mt-1 mb-2">Payment mode</div>
              <v-radio-group v-model="payment" row class="">
                <v-tooltip top color="toolTipColor toolTipTop">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on" style="display: inherit">
                      <span
                        @click="payment = 'UPI'"
                        class="
                          fsize12
                          black--text
                          d-flex
                          align-center
                          mr-2
                          cursor
                        "
                      >
                        <customIcon
                          style="height: 16px"
                          class="mr-2"
                          :name="
                            payment == 'UPI' ? 'radio-check' : 'radio-blank'
                          "
                          :width="'18'"
                          :height="'18'"
                          :color="'#46C212'"
                        />
                        UPI
                      </span>
                      <span class="upi-offer mr-2 fsize12">FREE</span>
                    </span>
                  </template>
                  <span>Google pay, BHIM , PhonePe & More</span>
                </v-tooltip>

                <v-tooltip top color="toolTipColor toolTipTop">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on" style="display: inherit">
                      <span
                        @click="payment = 'Net'"
                        class="fsize12 black--text d-flex align-center cursor"
                      >
                        <customIcon
                          style="height: 16px"
                          class="mr-2"
                          :name="
                            payment == 'Net' ? 'radio-check' : 'radio-blank'
                          "
                          :width="'18'"
                          :height="'18'"
                          :color="'#46C212'"
                        />Net Banking
                      </span>
                    </span>
                  </template>
                  <span>Charge ₹10 + GST per Transaction</span>
                </v-tooltip>
              </v-radio-group>
              <div class="float-right px-0 mb-6">
                <v-btn
                  :color="$store.state.buttonThemeColor"
                  depressed
                  class="fsize14 text-capitalize white--text mr-2 mt-2"
                  width="120px"
                  height="40px"
                  :loading="depositLoader"
                  :disabled="depositLoader"
                  @click="createPayment()"
                  >Continue</v-btn
                >
                <v-btn
                  depressed
                  outlined
                  class="fb-btn black--text text-capitalize mt-2"
                  @click="isFunds = null"
                  width="120px"
                  height="40px"
                  >Cancel</v-btn
                >
              </div>
            </v-flex>
            <v-flex xs12 sm12 md2 lg2 xl2 class="pa-0 ma-0"></v-flex>
            <v-flex xs12 sm12 md6 lg6 xl6 class="py-0 pr-4 pl-4 pb-4">
              <label class="fsize13 l-height-24 font-weight-bold primaryColor">
                Payment Policy</label
              >
              <br />
              <label class="fsize12 l-height-24 primaryColor"
                >All payments made between 12.00 PM and 07.00 will reflect after
                07.30 AM. </label
              ><br />
              <label
                class="fsize13 l-height-24 font-weight-boldPar primaryColor"
                >Net Banking: Charge of ₹10 + GST will be levied on the net
                banking transaction.</label
              ><br />
              <label
                class="fsize13 l-height-24 font-weight-boldPar primaryColor"
              >
                UPI Payments: UPI Payments include all mode of UPI transactions
                such as Google Pay, PhonePe, PayTM, and more.</label
              ><br />
              <label
                class="fsize13 l-height-24 font-weight-boldPar primaryColor"
              >
                Funds added into trading account will reflect within 5 mins.
              </label>
            </v-flex>
          </v-layout>
        </div>
         <div v-if="isFunds == 'Withdraw'" class="pa-4">
          <v-layout row wrap justify-center class="pl-4 mt-2 pr-4">
            <v-flex xs12 sm12 md4 lg4 xl4 align-center justify-center>
              <div class="w-100 fsize14 d-flex justify-space-between mb-2">
                <div>Available to withdraw</div> <div>{{availableWithdrawAmt ? availableWithdrawAmt :'0.00'}}</div>
              </div>
              <div class="w-100 fsize14 d-flex justify-space-between mb-2">
                 <div>Total Balance</div> <div>{{dueAmount ? dueAmount : '0.00'}}</div>
              </div>

              <div class="w-100 fsize12 mt-2">Choose segment</div>
              <v-autocomplete
                v-model="withDrawSelectSegment"
                :items="bankDetails.segEna"
                outlined
                dense
                height="40"
                single-line
                label="Choose segment"
                class="funds fsize12"
                @change="withDarwSegmentErrorMessage = ''"
                item-text="showValue"
                item-value="value"
                :error-messages="withDarwSegmentErrorMessage"
              ></v-autocomplete>
              <span class="w-100 fsize12">Amount</span>
              <div class="border-input rounded">
                <span class="rupee-symbol">₹</span>
                <input
                  type="text"
                  placeholder="Enter amount (min 100)"
                  v-model.number="withDrawAmount"
                  class="
                    h-40
                    outline-none
                    pl-9
                    pr-4
                    py-2
                    border-none
                    fsize14
                    primaryColor
                    w-100
                  "
                  @keypress="withDrawAmountErrorMessage = ''"
                  autocomplete="off"
                />
              </div>
              <div
                class="error-msg mx-0 mb-2 mt-0 pl-3" >
                <span v-if="withDrawAmountErrorMessage">{{
                  withDrawAmountErrorMessage
                }}</span>
              </div>
              <div class="w-100 fsize12 mt-1">Select Account</div>
              <v-autocomplete
                v-model="withDrawSelectAccount"
                :items="bankDetails.bankDet"
                outlined
                dense
                height="40"
                single-line
                label="Select Account"
                @change="withDarwAccountErrorMessage = ''"
                class="funds fsize12"
                item-text="showValue"
                item-value="showValue"
                :error-messages="withDarwAccountErrorMessage"
              ></v-autocomplete>

              <div class="float-right px-0 mb-6 ">
                <v-btn
                color="#26a69a"
                  depressed
                  class="fsize14 text-capitalize white--text mr-2 mt-2"
                   width="120px"
                  height="40px"
                  :loading="withDrawLoader"
                  :disabled="withDrawLoader"
                  @click="valiDateWithDraw()"
                  >Withdraw Now</v-btn
                >
                <v-btn
                  depressed
                  outlined
                  class="fb-btn black--text text-capitalize mt-2"
                  @click="isFunds = null"
                   width="120px"
                  height="40px"
                  >Cancel</v-btn
                >
              </div>
            </v-flex>
            <v-flex xs12 sm12 md2 lg2 xl2 class="pa-0 ma-0"></v-flex>
            <v-flex xs12 sm12 md6 lg6 xl6 class="py-0 pr-4 pl-4 pb-4">
              <label class="fsize13 l-height-24 font-weight-bold primaryColor">
                PAYOUT TIMINGS</label
              >
              <br />
              <label class="fsize12 l-height-24 primaryColor"
                >1. NSE and MCX For requests initiated before 8 AM, amount will be reaching your bank a/c on the same working day.</label
              ><br />
              <label
                class="fsize13 l-height-24 font-weight-boldPar primaryColor"
                >2. Non working days All Saturdays and Sundays, Govt holidays, Exchange settlement holidays.</label
              ><br />
              <label
                class="fsize13 l-height-24 font-weight-boldPar primaryColor"
              >
               3. Intraday equity profits & stocks sold from holding, credit will be available for withdrawal after T+2 Days.(As per the settlement policy) Intraday F&O profits / credit will be available for withdrawal after T+1 Days</label
              >
             
            </v-flex>
          </v-layout>
        </div>
      </v-card>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import commonFunc from "../mixins/commonFunctions";
import customIcon from "../components/customIcon.vue";
import service from "../store/Services/httpservice";
import errorhanbling from "../store/Services/errorHandling";
export default {
  mixins: [commonFunc],

  data() {
    return {
      Items: ["Single Margin"],
      infoType: "Single Margin",
      payment: "UPI",
      items: ["foo", "bar", "fizz", "buzz"],
      selectSegment: "",
      withDrawSelectSegment: '',
      selectAccount: "",
      withDrawSelectAccount: '',
      amount: "",
      withDrawAmount: "",
      amountErrorMessage: "",
      withDrawAmountErrorMessage: '',
      segmentErrorMessage: "",
      withDarwSegmentErrorMessage:"",
      upiErrorMessage: "",
      accountErrorMessage: "",
      withDarwAccountErrorMessage: '',
      OrderId: "",
      razerPay_Id: "rzp_live_GTKiHFOH2kpmbX",
    };
  },
  components: {
    customIcon,
  },
  computed: {
    ...mapState("funds", ["fundsLimit", "bankDetails", "availableWithdrawAmt", "dueAmount", "withDrawLoader", "payoutLoader", "payInLoader"]),
    ...mapState("settings", ["userDetails"]),
    ...mapState(["fundsOrHoldingsLoader"]),
    depositLoader: {
      get: function(){
        return this.$store.state.funds.depositLoader
      },
      set: function(value){
        this.$store.commit("funds/setDepositLoader", value)
      }
    },
    isFunds: {
      get: function(){
        return this.$store.state.funds.isFunds
      },
      set: function(value){
        this.$store.commit('funds/setIsFunds' , value)
      }
    }
  },
  async created() {
    await this.$store.dispatch("funds/getFundsLimits");
    await this.$store.dispatch("settings/getCustomerDetails");
  },
  methods: {
  async  checkRazerpay(order_id, slectedItem, recipt_Id) {
    
      this.depositLoader = true;

      var razorpay = new Razorpay({
              key: this.razerPay_Id,
            });
            var tempAmount = this.amount
       var data = {
              amount: this.amount * 100,
              currency: "INR",
              email: this.userDetails.emailAddr,
              contact: this.userDetails.cellAddr,
              order_id: order_id,
              method: this.payment == "UPI" ? "upi" : "netbanking",
            };
        if( this.payment == "UPI"){
           data['upi'] = {
            vpa: this.bankDetails.upiId,
              flow: 'collect'
          }
        }else{
          data["bank"] = slectedItem[0]['bankShotName'][0]['rzpbankid']
        }
        razorpay.createPayment(data)

       
razorpay.on('payment.success', function(resp) {
  errorhanbling.passData(tempAmount, recipt_Id, resp)
    }); // will pass payment ID, order ID, and Razorpay signature to success handler.

  razorpay.on('payment.error', function(resp){
    errorhanbling.toaster(resp.error.reason,"danger",resp.error.description, 4000)}); // will pass error object to error handler
      this.depositLoader = false;
    },
  async  createPayment() {
    
      if (
        this.amount && this.amount >= 50 &&
        this.selectSegment &&
        this.selectAccount &&
        this.bankDetails.upiId
      ) {
        this.accountErrorMessage =
          this.segmentErrorMessage =  this.amountErrorMessage 
            "";
    if(this.payment == "UPI"){
        var razorpay = new Razorpay({
              key: this.razerPay_Id,
            });
    await  razorpay.verifyVpa(this.bankDetails.upiId).then(resp =>{
        if(resp.status === 200 && resp.data.status_code === 200 && resp.data.success === true){
          this.upiErrorMessage = ''
        }
      },(err) =>{
this.upiErrorMessage = "Invalid upi id"
return false
      })
      }else{
        this.upiErrorMessage = ""
      }
        
        if((this.upiErrorMessage != "Invalid upi id" && this.payment == "UPI") || (this.payment == "Net" && this.upiErrorMessage == "")){
           if (
          this.payment == "UPI" &&
          this.bankDetails.prevupiid != this.bankDetails.upiId
        ) {
          let json = {
            upiId: this.bankDetails.upiId,
          };
          service.updateOrSetUPI_ID(json).then(
            (resp) => {
              if (resp.status === 200 && resp.data.stat == "Ok") {
              }
            },
            (err) => {
              errorhanbling.errLog(err);
            }
          );
        }
        this.depositLoader = true;
        var slectedItem = [];

        this.bankDetails.bankDet.filter((el) => {
          this.selectAccount === el.showValue ? slectedItem.push(el) : "";
        });
        let jsonObj = {
          accNum: slectedItem[0]["accNo"],
          amt: this.amount,
          bnkName: slectedItem[0]["bankName"],
          exchSeg: this.selectSegment,
          payMethod: this.payment,
          upiId: this.payment == "UPI" ? this.bankDetails.upiId : "",
          device: "WEB",
          accName: slectedItem[0]["holderName"],
          ifscCode: slectedItem[0]["ifscCode"],
        };
   await  service
          .makePayment(jsonObj)
          .then(
            (resp) => {
              if (resp.status === 200 && resp.data.stat == "Ok") {
                this.checkRazerpay(resp.data.result.orderId, slectedItem, resp.data.result.receiptId);
              } else {
                errorhanbling.toaster(resp.data.message, "danger", "", 3000);
              }
            },
            (err) => {
              errorhanbling.errLog(err);
            }
          )
          .finally(() => {
            this.depositLoader = false;
          });
        }
      } else {
        !this.amount
          ? (this.amountErrorMessage = "Please Enter Your Amount")
          : this.amount < 50 ?  (this.amountErrorMessage = "Amount should be above 50 or 50")  : (this.amountErrorMessage = "");
        !this.selectSegment
          ? (this.segmentErrorMessage = "Please Select Your Segment")
          : (this.segmentErrorMessage = "");
        !this.selectAccount
          ? (this.accountErrorMessage = "Please Select Your Account")
          : (this.accountErrorMessage = "");
        !this.bankDetails.upiId
          ? (this.upiErrorMessage = "Please Enter Your Valid UPI ID")
          : (this.upiErrorMessage = "");
      }
    },
    resetDepositField() {
      (this.selectSegment = ""),
        (this.selectAccount = ""),
        (this.amount = ""),
        (this.payment = "UPI");
      (this.amountErrorMessage = ""),
        (this.segmentErrorMessage = ""),
        (this.upiErrorMessage = ""),
        (this.accountErrorMessage = "");
    },
    valiDateWithDraw(){
      
      if(this.withDrawAmount && this.withDrawAmount >= 100 && this.withDrawAmount < this.availableWithdrawAmt && this.withDrawSelectSegment && this.withDrawSelectAccount) {
       var selectItem =  this.bankDetails.bankDet.filter((el) => {
         return this.withDrawSelectAccount === el.showValue 
        });
        let json = {
           accNum: selectItem[0]['accNo'],
           ifscCode: selectItem[0]['ifscCode'],
           exchSeg: this.withDrawSelectSegment,
           amt: this.withDrawAmount
        }
        this.$store.dispatch("funds/payOut", json)
      }else{
        !this.withDrawAmount ? this.withDrawAmountErrorMessage = "Please Enter Your Amount": this.withDrawAmount < 100 ? this.withDrawAmountErrorMessage = 'Amount Should be 100 or above 100': this.withDrawAmountErrorMessage = ''
        this.withDrawAmount > 100 && this.withDrawAmount > this.availableWithdrawAmt ?  this.withDrawAmountErrorMessage= 'Amount Should be below ' + this.availableWithdrawAmt : this.withDrawAmount > 100 && this.withDrawAmount < this.availableWithdrawAmt ? this.withDrawAmountErrorMessage = '' : ''
        !this.withDrawSelectSegment ? this.withDarwSegmentErrorMessage = "Please Select Your Segment" : this.withDarwSegmentErrorMessage = ""
        !this.withDrawSelectAccount ? this.withDarwAccountErrorMessage = "Please Select Your Account" : this.withDarwAccountErrorMessage = ""
      }
    },
    resetWithDrawField(){
      this.withDrawAmount = this.withDrawAmountErrorMessage = this.withDrawSelectSegment = this.withDarwSegmentErrorMessage = this.withDrawSelectAccount = this.withDarwAccountErrorMessage = ''
    }
  },
  watch: {
    amount: function (val) {
      if (val) {
        val < 50
          ? (this.amountErrorMessage = "Amount should be above 50 or 50")
          : (this.amountErrorMessage = "");
      }
    },
    withDrawAmount: function (val){
      if(val){
        val < 100 ? this.withDrawAmountErrorMessage = "Amount Should be 100 or above 100" : this.withDrawAmountErrorMessage = ''
        val > 100 && val > this.availableWithdrawAmt ?  this.withDrawAmountErrorMessage = 'Amount Should be below ' +  this.availableWithdrawAmt : val > 100 && val < this.availableWithdrawAmt ? this.withDrawAmountErrorMessage = '' : ''
      }
    }
  },
};
</script>