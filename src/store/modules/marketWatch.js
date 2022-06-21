import service from "../Services/httpservice"
import errorHandling from '../Services/errorHandling';
import router from '../../router'

const mkWatch = {
    namespaced: true,

    state: {
        mwGroupNames: [],
        mwList: [],
        nodata: false,
        searchList: [],
        securityInfoData: [],
        priceRageData: [],
        alertDialog:false,
        loading: false,
        alertLoader: false,
        depthLoader:false,
        authDialog: false,
    },

    mutations: {
        setMwGroupNames(state, data) {
            state.mwGroupNames = data;
            localStorage.setItem('mwList', JSON.stringify(data))
        },
        setMwlist(state ,data) {
            state.mwList = []
            state.mwList = data
            state.mwList.forEach(el =>{
                
                el.Change = '0.00'
                el.PerChange = '0.00'
                el.chart = 'mw'
                el.InstName = el.insType
                el.chartExchange = el.ex
                el.chartToken = el.token
                if(el.ltp > 0 && el.pdc){
                    el.Change = parseFloat(el.pdc) - parseFloat(el.ltp)
                    el.PerChange = el.Change / 100
                }
                el.PerChange = parseFloat(el.PerChange).toFixed(2)

                if(el.insType.toLowerCase() == 'index'){
                    el.chartSymbol = el.symbol + '::' + el.ex.toLocaleUpperCase() + '::INDEX' 
                }else{
                    var arr = el.scripName.split(' ')
                    var tempScrip = ''
                    arr.forEach(el =>{
                        tempScrip +=el
                    })
                    var tempSymbol = el.ex == "MCX" || el.ex == "BSE" || el.ex == "CDS" || el.ex == "BCD" ? el.symbol : el.ex == "NSE"  ? el.symbol.split('-')[0] : tempScrip
                    el.chartSymbol = tempSymbol + '::' + el.ex.toLocaleUpperCase() + ':::' + el.ex + ':::' + el.token;  
                }
            })
        
            

            this.dispatch('marketWatch/checkSocketStatus')
        },
        setNodata(state, data) {
            state.nodata = data;
        },
        setSearchList(state, data) {
            state.searchList = data;
        },
        setSecurityInfo(state, data) {
            state.securityInfoData = data;
        },
        setPriceRange(state, data) {
            state.priceRageData = [];
            state.priceRageData = data;
        },
        setAlertDialog(state, data){
            state.alertDialog = data;
        },
        setDepthLoader(state, data) {
            state.depthLoader = data;
        },
        setAuthDialog(state, payload){
            state.authDialog = payload
        }
    },

    actions: {
        // get marketwatch names
        async getMwlistNames({ commit, state, rootGetters, dispatch }) {
            state.loading = true;
            let json = {
                userId: rootGetters['authtication/getUserId']
            };
            await service.fetchMWList(json).then(response => {
                if (response.data.emsg == "Session Expired") {
                    router.currentRoute.path == '/' ? errorHandling.localClear() : errorHandling.sessionExpire();
                }else if (response.status == 200 && response.data.stat == "Ok") {
                    if(rootGetters['getSsoType'] == ''){

                        dispatch('newMarketWatch', {"userId": rootGetters['authtication/getUserId']})
                
                    // if (response.data.values.length == 5) {
                    //     commit("setMwGroupNames", response.data.values);
                    //     router.currentRoute.path == '/' ? router.push('/home').catch(()=> {}) : ''
                    // } else {
                    //     dispatch("autoGenerateMW", response.data.values);
                    // }
                }else{
                    dispatch('authtication/generateAuthCode', { url: "orders" }, {root: true}) 
                }
                }
            }, (err) => {
                router.currentRoute.path == '/' ? errorHandling.localClear() : errorHandling.errLog(err);
                
            }).finally(() => { state.loading = false; })
        },

        // fetch current marketwatch list
        async fetchMwLists({ commit, state, dispatch }, payload) {
            state.loading = true;
            await service.fetchMWScripList(payload).then(response => {
                if (response.data.emsg == "Session Expired") {
                    errorHandling.sessionExpire();
                }else if (response.status == 200 && response.data.stat == "Ok" && response.data.values[0] !== "No Market Watch") {
                    commit('setNodata', false)
                    
                    // check unwanted scrips 
                    var mwData = []
                    response.data.values.forEach(el => {
                        el.volume = '',
                        el.chart = 'mw'
                        if (el.Exchange != 'X' && el.token != '100' ) {
                            mwData.push(el)
                        }
                    })
                    if(mwData.length == 0) { 
                      commit('setNodata', true)
                      commit('setMwlist', [])
                    }
                    var tempData = {
                        data: mwData,
                        where: 'mkWatch'
                    }
                    // ----------------------------------------------
                    dispatch('common/formatScrip' , tempData , { root: true })
                } else if (response.data.emsg == 'Not able to Retrieve MarketWatch ' || response.data.emsg == 'Not able to Retrieve MarketWatch'
                           || response.data.values[0] == "No Market Watch") {
                    commit('setNodata', true)
                    commit('setMwlist', [])
                }
                else {
                    commit('setNodata', true)
                    commit('setMwlist', [])
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { 
                state.loading = false 
            })
        },

        // autogenerate marketwatch names
        async autoGenerateMW({ commit }, payload) {
            var mwName = "mwGrp";
            var tempMwName = payload
            while (payload.length != 5 && payload.length <= 5) {
                var randomNumber = Math.floor(Math.random() * 25);
                var alpha = [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "v",
                    "w",
                    "x",
                    "y",
                    "z"
                ];
                var temp = mwName + alpha[randomNumber];
                mwName += alpha[randomNumber];
                payload.forEach(element => {
                    if (element != temp) {
                        mwName = temp;
                    }
                });
                tempMwName.push(mwName)
            }
            commit("setMwGroupNames", await tempMwName);
            router.currentRoute.path == '/' ? router.push('/home').catch(()=> {}) : ''
        },

        // search scrip list
        async getSearchScripts({ state, commit }, payload) {
            state.loading = true;
            let json = {
                exchange: ["All", "CDS", "MCX", "NFO", "NSE", "BSE"],
                symbol: payload ? payload.toString().toUpperCase() : ''
            };
            await service.getSearchScrip(json).then(response => {
                if (response.status == 200) {
                    response.data.forEach((searchData) => {
                        state.mwList.forEach((mwListData) => {
                            if (mwListData["token"] == searchData["token"] &&  mwListData["Exchange"] != "X") {
                                return searchData["checked"] = true;
                            } 
                        })
                    })
                    commit("setSearchList", response.data);
                } else if (response.data.stat == "Not_Ok" && response.data.emsg == "Session Expired") {
                    errorHandling.sessionExpire();
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { 
                state.loading = false;
             })
        },

        // addScrip in mkWatch
        async addScripList({ state,dispatch }, payload) {
            state.loading = true;
            if (state.mwList.length > 24) {
                errorHandling.toaster('', 'info', "Can't add more than 25 scrips.Use another tab", 3000)
                state.loading = false;
                return;
            }else{
                await service.addNewMwScrip(payload.addDel).then(response => {
                    if (response.status == 200 && response.data.stat == "Ok") {
                        payload.data["checked"] = true;
                        dispatch('getNewMwScripList', payload.fetchMw)
                        errorHandling.toaster('', 'success', 'Scrip added successfully', 500);
                    } else if (response.data.message.includes('Symbol already exixts')) {
                        errorHandling.toaster('', 'info', 'Scrip is already present in currentTab', 3000);
                    } else if (response.data.emsg == "Session Expired") {
                        errorHandling.sessionExpire();
                    }else if(response.data.stat == "not_Ok" && response.data.message){
                        errorHandling.toaster('', 'danger', response.data.message, 5000)
                    }
                }, (err) => {
                    errorHandling.errLog(err)
                }).finally(() => { 
                    state.loading = false;
                })
            }
        }, 

        // deleteScrip in mkWatch
        async deleteScripFromList({ state, dispatch }, payload) {
            state.loading = true;
            await service.deleteMwScrip(payload.addDel).then(response => {
                if (response.status == 200 && response.data.stat == "Ok") {
                    payload.data["checked"] = false;
                    dispatch('getNewMwScripList', payload.fetchMw)
                    errorHandling.toaster('', 'info', 'Scrip deleted successfully', 500);
                }else if (response.data.emsg == 'Not able to Retrieve MarketWatch ' || response.data.emsg == 'Not able to Retrieve MarketWatch'
                || response.data.values[0] == "No Market Watch") {
                    errorHandling.toaster('', 'danger', response.data.emsg, 500);
                }
                 else if (response.data.emsg == "Session Expired") {
                    errorHandling.sessionExpire();
                }else if(response.data.stat == "not_Ok" && response.data.message){
                    errorHandling.toaster('', 'danger', response.data.message, 5000)
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { 
                state.loading = false;
            })
        },

        //securityInfo
        async getSecurityInfo({ commit, rootGetters, state }, payload) {
            state.loading = true;
            let json = {
                "exch": payload.ex,
                "symbol": payload.token,
                "userId": rootGetters['authtication/getUserId'],
                "userSessionID": rootGetters['authtication/getUserSession']
            }
            await service.getSecurityInfoDepthInfo(json).then(
                response => {
                    if (response.status == 200 && response.data != "Not_Ok") {
                        commit("setSecurityInfo", response.data);
                    } else if (response.data.stat == "Not_Ok" && response.data.emsg == "Session Expired") {
                        errorHandling.sessionExpire();
                    }
                },
                err => {
                    errorHandling.errLog(err)
                }
            ).finally(() => { state.loading = false; })
        },

        // get getNewPriceRange
        async getNewPriceRange({ commit, rootGetters, state }, payload) {
            let json = {
                "exch": payload.ex.toUpperCase(),
                "symbol": payload.token,
                "userId": rootGetters['authtication/getUserId'],
                "userSessionID": rootGetters['authtication/getUserSession']
            }
            await service.getPriceRange(json).then(
                response => {
                    if (response.data.emsg == "Session Expired") {
                      errorHandling.sessionExpire();
                    }else if (response.status == 200 && response.data != "Not_Ok") {
                        commit("setPriceRange", response.data);
                    }
                },
                err => {
                    errorHandling.errLog(err)
                }).finally(() => { commit("setDepthLoader", false)});
        },

        /**
         * @author Senthil
         * @date 02-12-2021 
         * @method Sorting MkWatch list
         */
        async sortList({ state, rootGetters }) {
            var sortArray = [];
            var tabIndex = parseInt(localStorage.getItem("tabIndex"));
            var mwname = state.mwGroupNames[tabIndex]['maketWatchId']
            for (let i of state.mwList) {
                let temp =  {
                    exch : i.ex,
                    token : i.token,
                    sortingOrder : state.mwList.indexOf(i)
                }
                sortArray.push(temp);
            }
            var getSortObj = {
                mwId: mwname,
                userId: rootGetters['authtication/getUserId'],
                scripData :sortArray
            };
            await service.newSortScrip(getSortObj).then(response => {
                if (response.data["stat"] == "Not_Ok" && response.data["emsg"] == "Session Expired" ) {
                    errorHandling.sessionExpire();
                } 
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { })
        },

        /**
         * @author Ashwin
         * @date 09-12-2021 
         * @method Alert dialog Box
         */
        async alertDialog({state,commit }, payload) {
            state.alertLoader = true
            let json = {
                exch: payload.data.ex,
                value: payload.data.token,
                direction: payload.alertPrice <= payload.data.ltp ? "l" : "g",
                symbol: payload.data.token,
            }
            await service.secrityAlertTrade(json).then(
                response => {
                    state.alertLoader = false
                    if (response.status == 200 && response.data != "Not_Ok" && response.data.stat == "Ok") {
                        commit('setAlertDialog',false)
                        errorHandling.toaster("Subscribe Successfully", "success", response.data.Result, 4000)
                    } else if (response.data.stat == "Not_Ok" && response.data.emsg == "Session Expired") {
                        errorHandling.sessionExpire();
                    }
                },
                err => {
                    errorHandling.errLog(err)
                }
            ).finally(() => { state.loading = false; })
        },

        checkSocketStatus({state , rootGetters , dispatch}, payload){
            if(rootGetters['wsConnection/getConnectionStatue']){
                var tempData = {
                    data: state.mwList,
                    where: 'mkWatch'
                }

                dispatch("wsConnection/websocketSubscription", tempData, { root: true }) 
            }
        },

        newMarketWatch({state, rootGetters, dispatch, commit}, payload){
            service.newMwList(payload).then(resp =>{
                if(resp.status == 200 && resp.data.stat == 'not_Ok'){
                    dispatch('generateMwName' , payload)
                }else if(resp.status == 200 && resp.data.stat == 'Ok' && resp.data.result  && resp.data.message == 'Success'){
                    dispatch('wsConnection/inValidateSession', 'initial' , { root:true })
                    let json = {
                        userId:payload.userId,
                        mwId: resp.data.result[0]['maketWatchId']
                    }
                    commit('setMwGroupNames',resp.data.result)
                    dispatch('getNewMwScripList' , json)
                    router.push('/home').catch(()=> {})
                }
            })
        },

        generateMwName({state, rootGetters, dispatch, commit}, payload){
            service.newGenMwName(payload).then(response =>{
                if(response.status == 200 && response.data.stat == 'Ok' && response.data.message == 'Market Watch Created Successfully'){
                    dispatch('newMarketWatch', payload)
                }
            })
        },

        getNewMwScripList({state, rootGetters, dispatch, commit}, payload){
            service.getNewMwScrips(payload).then(resp =>{
                if(resp.status == 200 && resp.data.stat == 'not_Ok' && resp.data.message == 'No Data'){
                    commit('setNodata', true)
                    commit('setMwlist' , [])
                }else if(resp.status == 200 && resp.data.stat == 'Ok' && resp.data.message == 'Success'){
                    commit('setNodata', false)
                    commit('setMwlist' , resp.data.result)
                }
            })
        }
        
    },
    getters:{
        getAlertDialog: state => {
            return state.alertDialog
        },
        getMwList: state => {
            return state.mwList
        },
        getDepthList: state => {
            return state.priceRageData
        },
    }
};
export default mkWatch;