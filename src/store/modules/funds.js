import service from '../Services/httpservice'
import errorHandling from "../Services/errorHandling";
import {name} from '../../../package.json'
const funds = {
    namespaced: true,

    state: {
        fundsLimit: [],
        payInUrl: name == "B.N.Rathi" ? "https://trading.bnrsecurities.com/PaymentGateway/Main/Hold_Funds" : "https://input.zebuetrade.com/PaymentGateway/Main/Hold_Funds",
        payout : name == "B.N.Rathi" ? "https://trading.bnrsecurities.com/PaymentGateway/Main/PayOut"  :  "https://bo.zebull.in/webclient/index.cfm?ClientCode=",
       bankDetails:[],
       bankShotName: [
        { "bankid": 1003, "rzpbankid": "UTIB", "name": "AXIS BANK INDIA" },
        { "bankid": 1003, "rzpbankid": "UTIB", "name": "AXIS BANK LTD" },
        { "bankid": 1003, "rzpbankid": "UTIB", "name": "AXIS BANK" },
        { "bankid": 1012, "rzpbankid": "BKID", "name": "BANK OF INDIA" },
        { "bankid": 1012, "rzpbankid": "BKID_C", "name": "Bank of India - Corporate Banking" },
        { "bankid": 1033, "rzpbankid": "MAHB", "name": "BANK OF MAHARASHTRA" },
        { "bankid": 1034, "rzpbankid": "CNRB", "name": "CANARA BANK DEBITCARD" },
        { "bankid": 1030, "rzpbankid": "CNRB", "name": "CANARA BANK" },
        { "bankid": 1031, "rzpbankid": "CSBK", "name": "CATHOLIC SYRIAN BANK" },
        { "bankid": 1028, "rzpbankid": "CBIN", "name": "CENTRAL BANK OF INDIA" },
        { "bankid": 1010, "rzpbankid": false, "name": "CITIBANK" },
        { "bankid": 1020, "rzpbankid": "CIUB", "name": "CITY UNION BANK" },
        { "bankid": 1020, "rzpbankid": "CIUB", "name": "CITY UNION BANK LTD" },
        { "bankid": 1004, "rzpbankid": "CORP", "name": "CORPORATION BANK" },
        { "bankid": 1027, "rzpbankid": "DCBL", "name": "DCB BANK" },
        { "bankid": 1024, "rzpbankid": "DEUT", "name": "DEUTSCHE BANK" },
        { "bankid": 1038, "rzpbankid": "DLXB", "name": "DHANLAXMI BANK" },
        { "bankid": 1019, "rzpbankid": "FDRL", "name": "FEDERAL BANK" },
        { "bankid": 1006, "rzpbankid": "HDFC", "name": "HDFC" },
        { "bankid": 1006, "rzpbankid": "HDFC", "name": "HDFC BANK" },
        { "bankid": 1006, "rzpbankid": "HDFC", "name": "HDFC BANK PVT LTD" },
        { "bankid": 1006, "rzpbankid": "HDFC", "name": "HDFC BANK LTD." },
        { "bankid": 1006, "rzpbankid": "HDFC", "name": "HDFC BANK LTD" },
        { "bankid": 1002, "rzpbankid": "ICIC", "name": "ICICI BANK" },
        { "bankid": 1002, "rzpbankid": "ICIC", "name": "ICICI BANK LTD" },
        { "bankid": 1002, "rzpbankid": "ICIC", "name": "ICICI" },
        { "bankid": 1002, "rzpbankid": "ICIC", "name": "ICICI BANK LTD." },
        { "bankid": 1007, "rzpbankid": "IBKL", "name": "IDBI BANK" },
        { "bankid": 1007, "rzpbankid": "IBKL", "name": "IDBI BANK LTD" },
        { "bankid": 1026, "rzpbankid": "IDIB", "name": "INDIAN BANK" },
        { "bankid": 1029, "rzpbankid": "IOBA", "name": "INDIAN OVERSEAS BANK" },
        { "bankid": 1015, "rzpbankid": "INDB", "name": "INDUSIND BANK" },
        { "bankid": 1015, "rzpbankid": "INDB", "name": "INDUSIND BANK LTD" },
        { "bankid": 1001, "rzpbankid": "JAKA", "name": "JAMMU AND KASHMIR BANK" },
        { "bankid": 1008, "rzpbankid": "KARB", "name": "KARNATAKA BANK" },
        { "bankid": 1018, "rzpbankid": "KVBL", "name": "KARUR VYSYA BANK" },
        { "bankid": 1013, "rzpbankid": "KKBK", "name": "KOTAK MAHINDRA BANK" },
        { "bankid": 1013, "rzpbankid": "KKBK", "name": "KOTAK MAHINDRA BANK LTD" },
        { "bankid": 1009, "rzpbankid": "LAVB_B", "name": "LAKSHMI VILAS BANK NETBANKING" },
        { "bankid": 1009, "rzpbankid": "LAVB_B", "name": "LAKSHMI VILAS BANK" },
        { "bankid": 1009, "rzpbankid": "LAVB_B", "name": "LAKSHMI VILAS BANK Retail" },
        { "bankid": 1009, "rzpbankid": "LAVB_B", "name": "LAKSHMI VILAS BANK Retail Banking" },
        { "bankid": 1022, "rzpbankid": "SIBL", "name": "SOUTH INDIAN BANK" },
        { "bankid": 1023, "rzpbankid": "SBBJ", "name": "STATE BANK OF BIKANER AND JAIPUR" },
        { "bankid": 1017, "rzpbankid": "SBHY", "name": "STATE BANK OF HYDERABAD" },
        { "bankid": 1014, "rzpbankid": "SBIN", "name": "STATE BANK OF INDIA" },
        { "bankid": 1021, "rzpbankid": "SBMY", "name": "STATE BANK OF MYSORE" },
        { "bankid": 1036, "rzpbankid": "STBP", "name": "STATE BANK OF PATIALA" },
        { "bankid": 1025, "rzpbankid": "SBTR", "name": "STATE BANK OF TRAVANCORE" },
        { "bankid": 1016, "rzpbankid": "UBIN", "name": "UNION BANK" },
        { "bankid": 1039, "rzpbankid": false, "name": "VIJAYA BANK" },
        { "bankid": 1005, "rzpbankid": "YESB", "name": "YES BANK" },
        { "bankid": 1005, "rzpbankid": "YESB", "name": "YES BANK LTD" },
        { "bankid": 1006, "rzpbankid": "HDFC", "name": "HDFC BANK PVT LTD." },
        { "bankid": 1044, "rzpbankid": "TMBL", "name": "TAMILNADU MERCANTILE BANK" },
        { "bankid": 1044, "rzpbankid": "TMBL", "name": "Tamilnad Mercantile Bank" },
        { "bankid": 1075, "rzpbankid": "BARB_R", "name": "Bank of Baroda Net Banking Corporate" },
        { "bankid": 1076, "rzpbankid": "BARB_R", "name": "Bank of Baroda Net Banking Retail" },
        { "bankid": 1076, "rzpbankid": "BARB_R", "name": "Bank of Baroda" },
        { "bankid": 1031, "rzpbankid": "CSBK", "name": "CSB Bank" },
        { "bankid": 1073, "rzpbankid": "IDFB", "name": "IDFC FIRST Bank Limited" },
        { "bankid": 1073, "rzpbankid": "IDFB", "name": "IDFC FIRST Bank" },
        { "bankid": 1073, "rzpbankid": "IDFB", "name": "IDFC Bank" },
        { "bankid": 1041, "rzpbankid": "PUNB_R", "name": "PNB (Erstwhile- United Bank of India)" },
        { "bankid": 1077, "rzpbankid": "PUNB_R", "name": "Punjab National Bank - Corporate" },
        { "bankid": 1049, "rzpbankid": "PUNB_R", "name": "Punjab National Bank [Retail]" },
        { "bankid": 1049, "rzpbankid": "PUNB_R", "name": "Punjab National Bank" },
        { "bankid": 1049, "rzpbankid": "PUNB_R", "name": "PNB" },
        { "bankid": 1053, "rzpbankid": "SRCB", "name": "SaraSwat Bank" },
        { "bankid": 1053, "rzpbankid": "SRCB", "name": "Saraswat Co-operative Bank" },
        { "bankid": false, "rzpbankid": "AUBL", "name": "AU Small Finance Bank" },
        { "bankid": false, "rzpbankid": "ANDB", "name": "Andhra Bank" },
        { "bankid": false, "rzpbankid": "ESFB", "name": "Equitas Small Finance Bank" },
        { "bankid": false, "rzpbankid": "ALLA", "name": "Indian Bank (Erstwhile Allahabad Bank)" },
        { "bankid": false, "rzpbankid": "ALLA", "name": "Erstwhile Allahabad Bank" },
      ],
      depositLoader: false,
      isFunds: null,
      availableWithdrawAmt: '',
      dueAmount: '',
      withDrawLoader: false,
      payInLoader: false,
      payoutLoader: false
    },

    mutations: {
        setFundsLimits(state, payload) {
          state.fundsLimit = []
            payload.forEach(item => {
                if (
                    item.segment == "ALL" &&
                    item.product == "ALL" &&
                    item.exchange == "ALL" &&
                    item.symbol == "ALL"
                ) {
                    state.fundsLimit = item;
                }
            })
        },
        setBankDetails(state, payload){
           
           var temBank = JSON.parse(payload.bankDet)
           var backDetails = []
           
           if(temBank[0].DATA.length > 0){
            for(var i = 0; i < temBank[0]['DATA'].length; i++){
              var json = {
                  ifscCode : temBank[0]['DATA'][i][3],
                  showValue: temBank[0]['DATA'][i][11] + ' - ' + temBank[0]['DATA'][i][8],
                  bankName: temBank[0]['DATA'][i][11],
                  accNo : temBank[0]['DATA'][i][8],
                  holderName: temBank[0]['DATA'][i][7],
                  bankShotName : state.bankShotName.filter((el) =>{
                   return el.name === temBank[0]['DATA'][i][11] 
                  })
              }
           backDetails.push(json)
          
       }
       payload.bankDet = backDetails
          payload.segEna = payload.segEna.split('|')
          var enableSegament = payload.segEna.filter(function (e) {return e != "";});
          var tempArray = []
          
          for(let item of enableSegament){
             var temp 
             item == 'nse_cm' || item == 'bse_cm' ? temp = {
              value:  'NSE_CASH',
              showValue : 'CASH'
             } : item == "nse_fo" || item == "bse_fo" ? temp = {
              value:  'NSE_FNO',
              showValue : 'DERIVATIVES'
             } : item == "mcx_fo" ? temp = {
              value:  'MCX',
              showValue : 'COMMODITY'
             } : item == 'cde_fo' || item == "bcs_fo" ? temp = {
               value:  'CD_NSE',
               showValue : 'CURRENCY'
             } : ''
             tempArray.push(temp)
          }
          const result = tempArray.filter((thing, index, self) =>
 index === self.findIndex((t) => (
   t.value === thing.value && t.showValue === thing.showValue
 ))
)

          payload.segEna = result
          payload.prevupiid = payload.upiId
          state.bankDetails = payload
           }
        },
        setDepositLoader(state, payload){
            state.depositLoader = payload
        },
        setIsFunds(state, payload){
            state.isFunds = payload
        },
        setWithDrawAmount(state, payload){
          if(payload[0]['DATA'].length > 0){
          state.availableWithdrawAmt = payload[0]['DATA'][0][7];
          state.dueAmount = payload[0]['DATA'][0][8];
          }
        },
        setWithDrawLoader(state, payload){
          state.withDrawLoader = payload
        },
        setPayInLoader(state, payload){
          state.payInLoader = payload
        },
        setPaoutLoader(state, payload){
          state.payoutLoader = payload
        }
    },

    actions: {

        /****
         * @author Ashwin
         * @since 01/12/21
         * Method for get funds limit
         *****/

        async getFundsLimits({ commit ,rootGetters}) {
            commit('setLoader' , true,  { root: true })
            let json = {
                userId: rootGetters['authtication/getUserId'],
                userSessionID: rootGetters['authtication/getUserSession'],
                userSettingDto: rootGetters['authtication/getUserSessionDto']
            };
            await service.getFundsData(json).then(
                response => {
                    
                    if (response.status == 200 && response.data.stat !== "Not_Ok") {
                        commit("setFundsLimits", response.data);
                        
                    } else if (response.data.stat == "Not_Ok") {
                        commit("setFundsLimits", []);
                    } else if (response.data["emsg"] == "Session Expired" || response.data["Emsg"] == "Session Expired") {
                        errorHandling.sessionExpire()
                    }
                    commit("setIsFunds", null)
                   
                },
                (err) =>{
                    errorHandling.errLog(err)
                }).finally(() => { commit('setLoader' , false,  { root: true })})
        },
        async depositMethod({state ,rootGetters}){
            service.payInpayOutConnToken({}).then(resp =>{
                
                if(resp.status === 200 && resp.data.stat == 'Ok'){
                    var pUrl =
                    state.payInUrl +
                    ".jsp?sLoginId=" +
                    rootGetters['authtication/getUserId'] +
                    "&token=" +
                    resp.data["SessionToken"] +
                    "&sAccountId=" +
                    rootGetters['authtication/getUserSessionDto'].account_id;
                  window.open(pUrl, "_blank");
                }else if (resp["stat"] == "Not_Ok") {
                    errorHandling.toaster('' , 'danger' , 'Failed', 3000)
          }
                else if (resp.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                  }
            },
            (err) =>{
                errorHandling.errLog(err)
            }
        );
        },
        async withDrawMethod({state , rootGetters}){
            service.withDraw().then(resp =>{
                var payoutUrl = state.payout + rootGetters['authtication/getUserId'] + "&sessionid=" +
                    rootGetters['authtication/getWebsocketId'] +
                "&reqtype=zebuetrade1"
                if (resp.data["message"] == "Authentication success") {
                    window.open(payoutUrl, "_blank");
                } else {
                  errorHandling.toaster('', 'danger' , resp.data.message, 3000)
                }
            },
            (err) =>{
                errorHandling.errLog(err)
            }
        );
        },
        async bnrWithdrawAndDeposit({state , rootGetters} , payload){
            
         await   service.depositOrWidthdrawl().then(resp =>{
                if (resp.status == 200) {
                    if (payload == "Deposit") {
                        var pUrl =
                          state.payInUrl +
                          ".jsp?sLoginId=" +
                          rootGetters['authtication/getUserId'] +
                          "&token=" +
                          resp.data["SessionToken"] +
                          "&sAccountId=" +
                          rootGetters['authtication/getUserSessionDto'].account_id;
                        window.open(pUrl, "_blank");
                      }
                      if (payload == "Withdraw") {
                        var pUrl =
                          state.payout +
                          ".jsp?sLoginId=" +
                          rootGetters['authtication/getUserId'] +
                          "&token=" +
                          resp.data["SessionToken"] +
                          "&sAccountId=" +
                          rootGetters['authtication/getUserSessionDto'].account_id;
                        window.open(pUrl, "_blank");
                      }
                }
            },
            (err) =>{
                errorHandling.errLog(err)
            }
        );
        },

        getBankDetails({state, commit, rootGetters}, payload){
            commit('setPayInLoader' , true)
           service.getBankDetails(payload).then(resp =>{
              if(resp.status === 200 && resp.data.stat == "Ok"){
               commit('setBankDetails' , resp.data.result)
               commit("setIsFunds", 'Deposit')
              }else{
                errorHandling.toaster(resp.data.message, "danger", "", 4000)
              }
      },
      (err) =>{
          errorHandling.errLog(err)
      }).finally(() => {commit('setPayInLoader' , false)})
        },

        checkVerifyPayment({state, commit, dispatch}, param){
           commit('setDepositLoader', true)
            service
            .verifyPayment(param)
            .then(
              (resp) => {
                if (
                  resp.status === 200 &&
                  resp.data.message == "Table Updated" &&
                  resp.data.stat == "Ok"
                ) {
                  errorHandling.toaster(
                    "Payment successfully",
                    "",
                    "Success",
                    5000
                  );
                 
                } else {
                    errorHandling.toaster(resp.data.message, "danger", "", 3000);
                }
                dispatch('getFundsLimits')
              },
              (err) => {
                errorHandling.errLog(err);
              }
            )
            .finally(() => {
              commit('setDepositLoader', false)
            });
        },
        checkBalence({state, commit, dispatch}, payload){
            commit('setPaoutLoader' , true)
          service.getBalence('').then(resp =>{
            if(resp.status === 200 && resp.data.stat == "Ok" && resp.data.message == "SUCCESS"){
              commit('setWithDrawAmount', resp.data.result)
              commit("setIsFunds",'Withdraw')
            }else{
              errorHandling.toaster(resp.data.message, "danger", "", 4000)
            }
          },
            (err) =>{
             errorHandling.errLog(err)
           }).finally(() => {commit('setPaoutLoader' , false)})
        },
        payOut({state, commit, dispatch}, payload){
          commit('setWithDrawLoader', true)
          service.withDraw(payload).then(resp =>{
            if(resp.status === 200 && resp.data.stat == "Ok"){
              errorHandling.toaster(resp.data.message, "success", '', 4000)
              dispatch('getFundsLimits')
            }else{
              errorHandling.toaster(resp.data.message, "danger", '', 4000)
            }
          },
            (err) =>{
             errorHandling.errLog(err)
           }).finally(()=>{ commit('setWithDrawLoader', false)})
        }
    }
};
export default funds;