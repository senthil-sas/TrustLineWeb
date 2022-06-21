


import service from "../Services/httpservice"
import errorHandling from '../Services/errorHandling'
import formula from '../Services/formula'
const holdings = {
    namespaced: true,

    state: {
        holdingList: [],
        fnoList: [],
        mcxList: [],
        currentTableData: [],
        tabList: [],
        totalInvestment: 0,
        totalcurrentValue: 0,
        daysPnl: 0,
        daysPnlChange: 0,
        totalPnl: 0,
        totalPnlChange: 0,
        pludgeTransId: '' ,
        pludgeDpId: '',
        pludgeReqId: '',
        pludgeVersion: '',
        pludgeUrl: '',
        cdslDialog: false,
        cdslLoader: false
    },

    mutations: {
        /****
         * @author Senthil
         * date 14-12-2021
         */
         setHoldingList (state, data) {
           
            state.totalInvestment = 0
            state.totalcurrentValue = 0
            state.totalPnl = 0
            state.totalPnlChange = 0
            var holdingsExchange = []
            data.forEach((el, i) => {
                el.showdropdown = false;
                el.holdingList = false
                var ScripName = el['ExchSeg1'] && el.Nsetsym != "0" && el.Nsetsym.includes('-') ? el.Nsetsym.split('-')[0] : el.Bsetsym
                var exchHold = el['ExchSeg1'] && el.Nsetsym != "0" ?  el['ExchSeg1'] :  el['ExchSeg2'] 
                var token = exchHold == 'NSE' ? el["Token1"]  : el["Token2"]
                el.chartExchange = exchHold
                el.chartToken = token
                el.websocketSub = exchHold + '|' + token + '#'
                el.chartSymbol = ScripName  + '::' + exchHold
                el.chartLtp =  el.ltp = exchHold == "NSE" ? el.LTnse : el.LTbse
                
                var data = {
                    token:
                        el["ExchSeg1"] == null ||
                            el["ExchSeg1"] == ""
                            ? el["Token2"]
                            : el["Token1"],
                    exch:
                        el["ExchSeg1"] == null ||
                            el["ExchSeg1"] == ""
                            ? el["ExchSeg2"]
                            : el["ExchSeg1"],
                };
                holdingsExchange.push(data);
               
            })
            if (holdingsExchange != [] && holdingsExchange.length != 0) {
                this.dispatch('holdings/getPreviousDayClose', holdingsExchange)
            }
            state.currentTableData = state.holdingList  = data;
            this.dispatch('holdings/checkWebsocketStatus')
            formula.holdingsProfitLoss()
        },

        setTabList (state) {
            state.tabList = []
            var Items = ["Stocks"]
            for (let item of Items) {
                var tempData = {
                    name: item,
                    length: state.currentTableData.length
                }
                state.tabList.push(tempData)
            }
        },
        setCdslLoader(state, payload){
            state.cdslLoader = payload
        },
        setCdslDialog(state , payload){
            state.cdslDialog = payload
        },
        setPludgeDataArray(state, payload){
            state.pludgeTransId = payload == '' ? '' : payload.transDtls
              state.pludgeDpId  = payload == '' ? '' : payload.dpId
             state.pludgeReqId =  payload == '' ? '' : payload.reqId
             state.pludgeVersion = payload == '' ? '' : payload.version
            state.pludgeUrl = payload == '' ? '' : payload.url

            this.commit('holdings/setCdslDialog', true)
        }
    },

    actions: {
        setSocketValues ({state}, data) {
            state.holdingList.forEach( element => {
                var exchHold = element['ExchSeg1'] && element.Nsetsym != "0" ?  element['ExchSeg1'] :  element['ExchSeg2'] 
                if (exchHold == "NSE" && element.Token1 == data.tk) {
                    element.LTnse = !!data.lp ? data.lp : element.LTnse
                } else if (exchHold == "BSE" && element.Token2 == data.tk) {
                    element.LTbse = !!data.lp ? data.lp : element.LTbse
                }
            })

            formula.holdingsProfitLoss()
        },
        /****
         * @author Senthil
         * date 3-12-2021
         */
        async getHoldings ({ commit, rootGetters, dispatch }) {
            commit('setLoader', true, { root: true })
            let userorderBook = {
                userSessionID: rootGetters['authtication/getUserSession'],
                userId: rootGetters['authtication/getUserId'],
                userSettingDto: rootGetters['authtication/getUserSessionDto'],
            };
            await service.getHoldingData(userorderBook).then(response => {
                if (response.status == 200 && response.data.stat === 'Ok') {
                    commit('setHoldingList', response.data.HoldingVal)
                } else if (response.data.emsg == "Session Expired" || response.data.Emsg == "Session Expired") {
                    errorHandling.sessionExpire();
                }else{
                    commit('setHoldingList', [])
                }
                commit('setTabList')
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { commit('setLoader', false, { root: true }) })
        },

        /****
         * @author Senthil
         * date 15-12-2021
         */
        async getPreviousDayClose ({ commit, state }, payload) {
            let json = {
                tokenList: payload,
            };
            service.getPreviousDayClose(json).then((response) => {
                if (response.status == 200 && response.data.stat == "Ok") {
                    var previousDayClose = response.data.result;
                    state.holdingList.forEach((el, i) => {
                        el.previousDayClose = previousDayClose[i].previousClose;
                    })
                    formula.holdingsProfitLoss()
                    
                }  else if (response.data.emsg == "Session Expired" || response.data.Emsg == "Session Expired") {
                    errorHandling.sessionExpire();
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { commit('setLoader', false, { root: true }) });
        },
        checkWebsocketStatus({state, dispatch, rootGetters} , payload){
            if(rootGetters['wsConnection/getConnectionStatue']){
                var tempData = {
                    data: state.holdingList,
                    where: 'holdings'
                }

                dispatch("wsConnection/websocketSubscription", tempData, { root: true }) 
            }
        },
     async callCdsl({state, commit, dispatch , rootState}, payload){
         commit('setCdslLoader', true)
           await dispatch('settings/getCustomerDetails', '' , {root: true})  
            
            var d = new Date();
            var month = d.getMonth() + 1 
      var dformat =
      
        [d.getDate() < 10 ? '0' + d.getDate() : d.getDate(), month < 10 ? '0' + month : month, d.getFullYear()].join('');
        var tempRecordDtls = []
        for(let item of payload){
            var tempData = {
                isIn: item.isin,
                quantity: item.SellableQty
             }
             tempRecordDtls.push(tempData)
        }
            var transDtls ={
                reqType:'D',
                reqIdentifier:'S',
                boId: '12085300' + rootState.settings.userDetails["dpAccountNumber"],
                exId:'12',
                numberOfDays:'1',
                execDate: dformat.trim().toString(),
                recordDtls: tempRecordDtls
             }
        let jsonObject = {
            dpId : "85300",
            transDtls: transDtls
        }
            service.pludgeData(jsonObject).then(resp =>{
                if(resp.status === 200 && resp.data.result['transDtls']){
                    commit('setPludgeDataArray' , resp.data.result)
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { commit('setCdslLoader', false) })
        }
    },
    getters: {
        getHoldingList: state => {
            return state.holdingList
        },
    }
};
export default holdings;