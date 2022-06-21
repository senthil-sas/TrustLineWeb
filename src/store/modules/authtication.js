import service from '../Services/httpservice'
import VueCryptojs from "vue-cryptojs";
import router from '@/router'
import Vue from 'vue'
import errorHandling from '../Services/errorHandling'
Vue.use(VueCryptojs);
const authtication = {
    namespaced: true,

    state: {
        whichStep: 'userId',
        userId: '',
        userSessionId: '',
        userSessionDto: '',
        websocketId: '',
        userQuestions: [],
        passwordAndMpinErrorMessage: '',
        forgetUserErrorMessage:'',
        securityAndCreateMpinErrorMessage1:'',
        securityAndCreateMpinErrorMessage2:'',
        panErrorMessage: '',
        questsErrorMessage:'',
        unblockErrorMessage:'',

        // loader
        userIdLoader: false,
        passOrMpinLoader: false,
        createOr2faLoader: false,
        forgetOrUnblockLoader: false,
        authorizeLoader: false,
        resetLoader: false,
        reset2faLoader: false,
        authorizeItem: [],

        abmlPassErrorMessage: '',
        dateOfBirthErrorMessage: '',
        quickLoader: false,
        quickLoginErrorMessage: '',
        isMpin: true,
        redirectUrl: '',
        vendorDetails: []
    },
    mutations: {
        setUserId(state, payload) {
            state.userId = payload;
        },
        setWhichStep(state, payload) {
            state.whichStep = payload
            localStorage.setItem('whichStep', JSON.stringify(payload))
        },
        setUserSessionId(state, payload) {
            state.userSessionId = payload
            localStorage.setItem('userSession', JSON.stringify(payload))
        },
        setUserDto(state, payload) {
            state.userSessionDto = payload
            localStorage.setItem('userSessionDto', JSON.stringify(payload))
        },
        setUserQuestions(state, payload) {
            // var tempQues = payload.sQuestions.split('|')
            // var tempIndex = payload.sIndex.split('|')
            var tempData = {
                Ques: payload.sQuestions,
                index: payload.sIndex
            }
            state.userQuestions.push(tempData)
            // if (payload.sCount == 2) {
            //     for (var i = 0; i < tempQues.length; i++) {
                   
            //     }
            // }
            // if (payload.sCount == 20) {
            //     for (var i = 0; i < tempQues.length; i++) {
            //         var tempData = {
            //             sindex: tempIndex[i],
            //             checked: false,
            //             value: "",
            //             ques: tempQues[i],
            //             fieldTextType: false,
            //             passwordFieldType: "password",
            //         }
            //         state.userQuestions.push(tempData)
            //     }
            // }
            localStorage.setItem('secQuestion', JSON.stringify(state.userQuestions))
        },
        setSecQuestionRefresh(state, payload) {
            state.userQuestions = payload
        },
        setPasswordAndMpinErrorMessage(state, payload) {
            state.passwordAndMpinErrorMessage = payload
        },
        setForgetUserErrorMessage(state , payload){
            state.forgetUserErrorMessage = payload
        },
        setQuesAndMpinErrorMessageOne(state , payload){
            state.securityAndCreateMpinErrorMessage1 = payload
        },
        setQuesAndMpinErrorMessageTwo(state, payload) {
            state.securityAndCreateMpinErrorMessage2 = payload
        },
        setPanErrorMessage(state, payload){
            state.panErrorMessage = payload
        },
        setQuestionsErrorMessage(state, payload){
            state.questsErrorMessage = payload
        },
        setUnblockErrorMessage(state, payload){
            state.unblockErrorMessage = payload
        },
        setWebsocketId(state ,payload){
            state.websocketId = payload
            localStorage.setItem('websocketId' , JSON.stringify(payload))
        },
        setAuthorizeItem(state, payload){
            state.authorizeItem = payload
        },
        setAbmlPassErrorMessage(state, payload){
            state.abmlPassErrorMessage = payload
        },
        setDateOfBirthErrorMessage(state, payload){
            state.dateOfBirthErrorMessage = payload
        },
        setQuickLoginErrorMessage(state, payload){
            state.quickLoginErrorMessage = payload
        },
        setIsMpin(state, payload){
            state.isMpin = payload
        },
        setRedirectUrl(state, payload){
            state.redirectUrl = payload
        },
        setVendorDetails(state, payload){
            state.vendorDetails = payload
        }
    },
    actions: {
        getUserId({state,commit }, payload) {
            state.userIdLoader = true
            service.userLogin(payload).then(response => {
                localStorage.setItem('currentUser', JSON.stringify(state.userId))
                commit('setIsMpin', response.data.available)
                localStorage.setItem('isMpin', JSON.stringify(response.data.available))
                if (response.status === 200 && (response.data.stat == "Ok" || response.data.stat == "Not_Ok") && response.data.available == true && response.data.login == true) {
                    commit('setWhichStep', 'M-Pin')
                } else if (response.status === 200 && (response.data.stat == "Ok" || response.data.stat == "Not_Ok") && (response.data.available == true || response.data.available == false) && response.data.login == false) {
                    commit('setWhichStep', 'Password')
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.userIdLoader = false; })
        },
        
        encryptPassword({ dispatch, state }, payload) {
            state.passOrMpinLoader = true
            let userfetch = {
                userId: payload.userId,
            }
            service.userPassword(userfetch).then(resp => {
             
                if (resp.status == 200 && !!resp.data) {
                    var AES = require("crypto-js/aes");
                    const encryptedText = AES.encrypt(
                        payload.password,
                        resp.data["encKey"]
                    ).toString();
                    let fetch = {
                        userId: payload.userId,
                        userData: encryptedText,
                    }
                    dispatch('zebuaccess', fetch)
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.passOrMpinLoader = false; })
        },
        zebuaccess({state,commit }, payload) {
            state.passOrMpinLoader = true
            commit('setSecQuestionRefresh', [])
            service.passwordencrypted(payload).then(resp => {
              
                if (resp.status == 200 && resp.data.stat == 'Ok') {
                    commit('setUserQuestions', resp.data)
                    resp.data.sCount == 1 ? commit('setWhichStep', '2FA') : ''
                    resp.data.sCount == 20 ? commit('setWhichStep', 'Reset 2FA') : ''
                } else if (resp.status == 200 && resp.data.stat == 'Not_Ok') {
                    commit('setPasswordAndMpinErrorMessage', resp.data.emsg)
                    errorHandling.toaster('', "danger", resp.data.emsg , 3000)
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.passOrMpinLoader = false; })
        },
        vailDateSecQues ({ state, commit, dispatch , rootGetters }, payload) {
            state.passOrMpinLoader = true
            commit('setCounterIncrease', 0, { root: true })
            commit('setSessionCounter', 0, { root: true })
            service.securityQuestion(payload).then(resp => {
               if(rootGetters['getSsoType'] == ''){
                if (resp.status === 200 && resp.data.stat == 'Ok') {
                    commit('setUserSessionId', resp.data.userSessionID)
                    commit('setUserDto', resp.data.userSettingDto)
                    commit('setWebsocketId' , resp.data.webSocketID) 
                    
                    resp.data["sPasswordReset"] == "Y" ? commit('setWhichStep', 'reset') : state.isMpin ? dispatch('marketWatch/newMarketWatch', {"userId": state.userId}, { root:true })  : commit('setWhichStep', 'createMpin')
                }else if(resp.status === 200 && resp.data.stat == null){
                    commit('setPasswordAndMpinErrorMessage', resp.data.tdata)
                    errorHandling.toaster('', "danger", resp.data.tdata , 3000)
                } else if (resp.status === 200 && resp.data.stat == "Not_Ok") {
                    commit('setPasswordAndMpinErrorMessage', resp.data.emsg)
                    errorHandling.toaster('', "danger", resp.data.emsg , 3000)
                }
            }else{
                if (
                    resp.status == 200 &&
                    resp.data["stat"] == "Ok") {
                    commit('setUserSessionId', resp.data.loginResponse.userSessionID)
                    commit('setUserDto', resp.data.loginResponse.userSettingDto)
                    commit('setWebsocketId' , resp.data.loginResponse.webSocketID)
                    if(state.isMpin){
                        resp.data["isAuthorized"] == true ? window.open(resp.data.redirectUrl, "_self") : commit('setWhichStep', 'authorize')
                    }else{
                        localStorage.setItem('authcode' , JSON.stringify(resp.data.redirectUrl))
                        commit('setRedirectUrl', resp.data.redirectUrl)
                        commit('setWhichStep', 'authorize')
                    }
                      }else if(resp.status === 200 && resp.data.stat == null){
                        commit('setQuickLoginErrorMessage', resp.data.tdata)
                        errorHandling.toaster('', "danger", resp.data.tdata , 3000)
                    } else if (resp.status === 200 && resp.data.stat == "Not_Ok") {
                        commit('setQuickLoginErrorMessage', resp.data.emsg)
                        errorHandling.toaster('', "danger", resp.data.emsg , 3000)
                    }
            }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.passOrMpinLoader = false; })
        },
        abmlLoginservice({state, commit, dispatch, rootGetters}, payload){
            state.quickLoader = true
            commit('setCounterIncrease', 0, { root: true })
            commit('setSessionCounter', 0, { root: true })
            service.quickLogin(payload).then(resp => {
               if(rootGetters['getSsoType'] == ''){
                if (resp.status === 200 && resp.data.stat == 'Ok') {
                    commit('setUserSessionId', resp.data.userSessionID)
                    commit('setUserDto', resp.data.userSettingDto)
                    commit('setWebsocketId' , resp.data.webSocketID)
                    resp.data["sPasswordReset"] == "Y" ? commit('setWhichStep', 'reset') : state.isMpin ? dispatch('marketWatch/newMarketWatch', {"userId": state.userId}, { root:true })  : commit('setWhichStep', 'createMpin')
                }else if(resp.status === 200 && resp.data.stat == null){
                    commit('setQuickLoginErrorMessage', resp.data.tdata)
                    errorHandling.toaster('', "danger", resp.data.tdata , 3000)
                } else if (resp.status === 200 && resp.data.stat == "Not_Ok") {
                    commit('setQuickLoginErrorMessage', resp.data.emsg)
                    errorHandling.toaster('', "danger", resp.data.emsg , 3000)
                }
            }else{
                if (
                    resp.status == 200 &&
                    resp.data["stat"] == "Ok") {
                    commit('setUserSessionId', resp.data.loginResponse.userSessionID)
                    commit('setUserDto', resp.data.loginResponse.userSettingDto)
                    commit('setWebsocketId' , resp.data.loginResponse.webSocketID)
                    
                    if(state.isMpin){
                    resp.data["isAuthorized"] == true ? window.open(resp.data.redirectUrl, "_self") : commit('setWhichStep', 'authorize')
                }else{
                    localStorage.setItem('authcode' , JSON.stringify(resp.data.redirectUrl))
                    commit('setRedirectUrl', resp.data.redirectUrl)
                    commit('setWhichStep', 'authorize')
                }
                  }else if(resp.status === 200 && resp.data.stat == null){
                    commit('setQuickLoginErrorMessage', resp.data.tdata)
                    errorHandling.toaster('', "danger", resp.data.tdata , 3000)
                } else if (resp.status === 200 && resp.data.stat == "Not_Ok") {
                    commit('setQuickLoginErrorMessage', resp.data.emsg)
                    errorHandling.toaster('', "danger", resp.data.emsg , 3000)
                }
            }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.quickLoader = false; })
        },
        callMpin({state,commit,dispatch, rootGetters }, payload) {
            state.passOrMpinLoader = true
            commit('setCounterIncrease', 0, { root: true })
            commit('setSessionCounter', 0, { root: true })
            service.userMpin(payload).then(resp => {
               if(rootGetters['getSsoType'] == ''){
                if (resp.status === 200 && resp.data.stat == 'Ok' && resp.data.userSessionID && resp.data.userSettingDto && resp.data.webSocketID) {
                    commit('setUserSessionId', resp.data.userSessionID)
                    commit('setUserDto', resp.data.userSettingDto)
                    commit('setWebsocketId', resp.data.webSocketID)
                    dispatch('marketWatch/newMarketWatch', {"userId": state.userId}, { root:true }) 
                }else if(resp.status === 200 && resp.data.stat == "Not_Ok"){
                    commit('setPasswordAndMpinErrorMessage', resp.data.emsg)
                    errorHandling.toaster('', "danger", resp.data.emsg , 3000)
                }else{
                    commit('setWhichStep', 'Password')
                    errorHandling.toaster('', "danger", 'Session Expired' , 3000)
                }
            }else{
                if (
                    resp.status == 200 &&
                    resp.data["stat"] == "Ok") {
                    commit('setUserSessionId', resp.data.loginResponse.userSessionID)
                    commit('setUserDto', resp.data.loginResponse.userSettingDto)
                    commit('setWebsocketId', resp.data.loginResponse.webSocketID)
                     resp.data["isAuthorized"] == false ? commit('setWhichStep', 'authorize') : ''
                     resp.data["isAuthorized"] == true ?  window.open(resp.data.redirectUrl, "_self") : ''
                  }else if(resp.status === 200 && resp.data.stat == "Not_Ok"){
                    commit('setPasswordAndMpinErrorMessage', resp.data.emsg)
                    errorHandling.toaster('', "danger", resp.data.emsg , 3000)
                }else{
                    commit('setWhichStep', 'Password')
                    errorHandling.toaster('', "danger", 'Session Expired' , 3000)
                  }
            }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.passOrMpinLoader = false; })
        },
        forgetPassword({state,commit }, payload) {
            state.forgetOrUnblockLoader = true
            service.forgotPass(payload).then(resp => {
               
                if (resp.status == 200 && resp.data.stat == "Ok") {
                    errorHandling.toaster("Password reset has been successful.", "success", "Please check your mail.", 3000)
                    errorHandling.localClear()
                } else if (resp.status == 200 && resp.data.stat == "Not_Ok" && resp.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                } else {
                    commit('setUnblockErrorMessage' , 'Invalid details')
                    errorHandling.toaster('', "danger", "Invalid details", 3000)
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.forgetOrUnblockLoader = false; })
        },
        unblockAccount({state,commit }, payload) {
            state.forgetOrUnblockLoader = true
            service.unblock(payload).then(resp => {
              
                if (resp.status == 200 && resp.data.stat == "Ok") {
                    errorHandling.toaster("Request for Unblock has been sent successfully.", "success", resp.data["Result"], 3000)
                    errorHandling.localClear()
                } else if (resp.status == 200 && resp.data.stat == "Not_Ok" && resp.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                } else {
                    commit('setUnblockErrorMessage', 'Invalid details')
                    errorHandling.toaster('', "danger", "Invalid details", 3000)
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.forgetOrUnblockLoader = false; })
        },
        authorizeVenfor({ state, commit }, payload) {
            state.authorizeLoader = true;
            service.userAuthorize(payload).then(resp => {
                if (resp.status == 200 && resp.data.stat == "Ok") {
                    
                    if(router.currentRoute.path !== '/'){
                        commit('marketWatch/setAuthDialog', false , {root : true})
                        var url = resp.data.redirectUrl + '&redirectURL=option/optionchain/0' + '&brokerName=' + state.authorizeItem.broker + '&symbol=' + state.authorizeItem.symbol;
                        window.open(url ,  "_blank");
                    }else{
                        state.isMpin ? window.open(resp.data.redirectUrl,  "_self") : localStorage.setItem('authcode' , JSON.stringify(resp.data.redirectUrl))
                        state.isMpin ? '' : commit('setRedirectUrl',resp.data.redirectUrl)
                        state.isMpin ? '' : commit('setWhichStep','createMpin')
                    }
                } else if (resp.status == 200 && resp.data.stat == "Not_Ok" && resp.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.authorizeLoader = false; })
        },
        createMpin({state, rootGetters, dispatch}, payload) {
            state.createOr2faLoader = true
            service.userCreateMpin(payload).then(response => {
                if (
                    response.status == 200 &&
                    response.data.stat == "Ok" &&
                    response.data.emsg == "SUCCESS"
                ) {
                    rootGetters['getSsoType'] == '' ?  dispatch('marketWatch/newMarketWatch', {"userId": state.userId}, { root:true })  : window.open(state.redirectUrl, "_self")
                    localStorage.removeItem('authcode')
                } else {
                    errorHandling.toaster('', "danger", response.data.emsg, 3000)
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.createOr2faLoader = false; })
        },
        resetPassword({state,commit }, payload) {
            state.resetLoader = true
            service.userPasswordReset(payload).then(response => {
               
                if (response.status == 200 && response.data.stat == "Ok") {
                    errorHandling.toaster('Password Reset Successfully', "success", "Password will expire every 14 days and will need to be reset by you", 3000)
                    localStorage.clear()
                    router.currentRoute.path == '/' ? commit('setUserId' , payload.userId) : ''
                    router.currentRoute.path == '/' ? commit('setWhichStep' , 'Password') : ''
                    router.currentRoute.path == '/' ? localStorage.setItem('currentUser', JSON.stringify(payload.userId)) : ''
                } else if (response.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                } else {
                    errorHandling.toaster('', "danger", response.data["emsg"], 3000)
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.resetLoader = false; })
        },
        saveSecQues({state,commit} , payload){
            state.reset2faLoader = true
            service.saveTwoFa(payload).then(response =>{
               
                if (response.status == 200 && response.data.stat == "Ok") {
                    commit('setWhichStep', 'userId');
                    commit("setUserId", '')
                    errorHandling.toaster('', "success", 'Answers Saved Sucessfully', 3000)
                }else if (response.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                }else {
                    errorHandling.toaster('', "danger", response.data["emsg"], 3000)
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.reset2faLoader = false; })
        },

        generateAuthCode({state, commit, rootGetters} , payload){
            let json = {
                userId: rootGetters['getUserId'],
                callBackUrl: rootGetters['getSsoType'].redirectUrl,
                vendor: rootGetters['getSsoType'].vendor,
            }
         service.getAuthCode(json).then(resp =>{
            if(resp.status == 200 && resp.data.stat == 'Ok'){
                    resp.data["isAuthorized"] == false ? commit('setWhichStep', 'authorize') : ''
                    resp.data["isAuthorized"] == true ? window.open(resp.data.redirectUrl, "_self") : ''
                }else if(resp.status === 200 && resp.data.stat == 'Not_Ok' && resp.data.emsg == 'Session Expired'){
                    errorHandling.localClear()
                  }
         }, (err) => {
            err.response.status == 401 ? errorHandling.localClear() : ''
        })
        },
        validateVendor({state, commit, dispatch, rootGetters}, payload){
            let json = {
                vendor: rootGetters['getSsoType'].appcode
            }
            service.checkVendor(json).then(resp =>{
                
                if(resp.status === 200 && resp.data.stat == 'Ok'){
                    commit('setVendorDetails', resp.data)
                }else if(resp.status === 200 && resp.data.stat == "Not_Ok"){
                    router.push('/').catch(() => { })
                }
                
             } , (err) => {
                    errorHandling.errLog(err)
                })
        }
        
    },
    getters: {
        getUserId(state){
           return state.userId
        },
        getUserSession: state => {
           return state.userSessionId
        },
        getUserSessionDto: state => {
            return state.userSessionDto
         },
         getWebsocketId: state => {
             return state.websocketId 
         },
        getAuthorizeItem: state =>{
            return state.authorizeItem
        },
        getAuthorizatonLoader: state =>{
            return state.authorizeLoader
        }
    },
};

export default authtication;