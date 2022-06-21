import Vue from "vue";
import service from '../Services/httpservice'
import router from "../../router";
import Cryptojs from "vue-cryptojs";
import errorHandling from '../Services/errorHandling'
import tradingViewchart from '../../mixins/chartTicker'
Vue.use(Cryptojs);
import sha256 from "crypto-js/sha256";
const url = "wss://ws1.aliceblueonline.com/NorenWS/"

let socket;
const wsConnection = {
    namespaced: true,

    state: {
        connectionStatus: false,
        previousSubsription: '',
        preDepthSubsription: '',
        preDepthPayload: '',
        isReconnect: false,
        isLogout: false,
        isValidSession: false,
        isConnect: false
    },

    mutations: {
        setPreviousSubsription(state, payload) {
            state.previousSubsription = payload;
        },
        setConnectionStatus(state, payload) {
            state.connectionStatus = payload
        },
        setPreDepthSubsription(state, payload) {
            state.preDepthSubsription = payload
        },
        setPreDepthPayload(state, payload) {
            state.preDepthPayload = payload
        },
        setReconnect(state, payload) {
            state.isReconnect = payload
        },
        SetIsLogout(state, payload) {
            state.isLogout = payload
        },
        setIsValidSession(state, payload){
            state.isValidSession = payload;
         localStorage.setItem('isValidSession' , JSON.stringify(payload));
        },
        setIsConnect(state, payload){
            state.isConnect = payload
        localStorage.setItem('isConnect' , JSON.stringify(payload))
        }
    },

    actions: {
       
        async inValidateSession({ rootGetters, dispatch }, payload) {
            let jsonObj = {
                loginType: "WEB"
            }
            await service.inValidateSession(jsonObj).then(response => {
                if (response.status === 200 && response.data.Status == 'OK') {
                    payload == 'initial' ? dispatch('createSession') : ''
                }
            }, (err) => {
                 errorHandling.errLog(err) 
            })
        },
        async createSession({state,rootGetters, dispatch, commit }, payload) {
            let jsonObj = {
                loginType: "WEB"
            }
            await service.createWsSession(jsonObj).then(response => {
                if (response.status === 200 && response.data.Status == 'OK') {
                    commit('setIsValidSession' , true)
                    !state.isConnect ? dispatch('connect', 'createSession') : ''
                }
            }, (err) => {
                 errorHandling.errLog(err) 
            })
        },
        async connect({ state, commit, dispatch, rootGetters }, payload) {
            commit('setIsConnect' , true);
            socket = new WebSocket(url);
            socket.onopen = function () {

                dispatch("connectionRequest");
            };

            socket.onmessage = function (msg) {
                
                var responseFeed = JSON.parse(msg.data);

                if (!!responseFeed.t && responseFeed.t == 'ck' && responseFeed.s == 'OK') {
                    commit('setConnectionStatus', true)
                    !state.isReconnect ? commit('setPreviousSubsription' , '') : ''
                    if (state.isReconnect || state.previousSubsription == '') {
                        dispatch('reconnect')
                    commit('setReconnect' , false)
                    }
                } else if (!!responseFeed.t && responseFeed.t == 'ck' && responseFeed.s == 'NOT_OK') {
                    
                    errorHandling.sessionExpire()
                }
                if (!!responseFeed.tk) {
                    router.currentRoute.path == '/chart' ? tradingViewchart.methods.webSocketData(responseFeed) : ''
                    router.currentRoute.path == '/holdings' || router.currentRoute.path == '/home' ? dispatch('holdings/setSocketValues', responseFeed, { root: true }) : ''
                    dispatch('header/setIndexSocketValues', responseFeed, { root: true })
                    router.currentRoute.path == '/positions' ? dispatch('position/setSocketValues', responseFeed, { root: true }) : ''

                    if (rootGetters['orderWindow/getCurrentToken'] == responseFeed.tk) {
                        var ltp = responseFeed.lp ? responseFeed.lp : rootGetters['orderWindow/getCurrentLtp']
                        dispatch('orderWindow/setCurrentLtp', ltp, { root: true })
                    }

                    rootGetters['marketWatch/getMwList'].forEach(element => {
                        if (element.token == responseFeed.tk) {
                            element.ltp = !!responseFeed.lp ? responseFeed.lp : element.ltp;
                            element.volume = !!responseFeed.v ? responseFeed.v : element.volume;
                            element.PerChange = !!responseFeed.pc ? responseFeed.pc : element.PerChange;
                            element.preClose = !!responseFeed.c ? responseFeed.c : element.preClose
                            element.Change = !!responseFeed.lp ? responseFeed.lp - element.preClose : element.Change

                            if (element.ex + '|' + element.token === state.preDepthSubsription) {
                                rootGetters['marketWatch/getDepthList'].openrate = !!responseFeed.o ? responseFeed.o : rootGetters['marketWatch/getDepthList'].openrate
                                rootGetters['marketWatch/getDepthList'].highrate = !!responseFeed.h ? responseFeed.h : rootGetters['marketWatch/getDepthList'].highrate
                                rootGetters['marketWatch/getDepthList'].lowrate = !!responseFeed.l ? responseFeed.l : rootGetters['marketWatch/getDepthList'].lowrate
                                rootGetters['marketWatch/getDepthList'].previouscloserate = !!responseFeed.c ? responseFeed.c : rootGetters['marketWatch/getDepthList'].previouscloserate

                                rootGetters['marketWatch/getDepthList'].BPrice1 = !!responseFeed.bp1 ? responseFeed.bp1 : rootGetters['marketWatch/getDepthList'].BPrice1
                                rootGetters['marketWatch/getDepthList'].BOrders1 = !!responseFeed.bo1 ? responseFeed.bo1 : rootGetters['marketWatch/getDepthList'].BOrders1
                                rootGetters['marketWatch/getDepthList'].BQty1 = !!responseFeed.bq1 ? responseFeed.bq1 : rootGetters['marketWatch/getDepthList'].BQty1

                                rootGetters['marketWatch/getDepthList'].BPrice2 = !!responseFeed.bp2 ? responseFeed.bp2 : rootGetters['marketWatch/getDepthList'].BPrice2
                                rootGetters['marketWatch/getDepthList'].BOrders2 = !!responseFeed.bo2 ? responseFeed.bo2 : rootGetters['marketWatch/getDepthList'].BOrders2
                                rootGetters['marketWatch/getDepthList'].BQty2 = !!responseFeed.bq2 ? responseFeed.bq2 : rootGetters['marketWatch/getDepthList'].BQty2

                                rootGetters['marketWatch/getDepthList'].BPrice3 = !!responseFeed.bp3 ? responseFeed.bp3 : rootGetters['marketWatch/getDepthList'].BPrice3
                                rootGetters['marketWatch/getDepthList'].BOrders3 = !!responseFeed.bo3 ? responseFeed.bo3 : rootGetters['marketWatch/getDepthList'].BOrders3
                                rootGetters['marketWatch/getDepthList'].BQty3 = !!responseFeed.bq3 ? responseFeed.bq3 : rootGetters['marketWatch/getDepthList'].BQty3

                                rootGetters['marketWatch/getDepthList'].BPrice4 = !!responseFeed.bp4 ? responseFeed.bp4 : rootGetters['marketWatch/getDepthList'].BPrice4
                                rootGetters['marketWatch/getDepthList'].BOrders4 = !!responseFeed.bo4 ? responseFeed.bo4 : rootGetters['marketWatch/getDepthList'].BOrders4
                                rootGetters['marketWatch/getDepthList'].BQty4 = !!responseFeed.bq4 ? responseFeed.bq4 : rootGetters['marketWatch/getDepthList'].BQty4

                                rootGetters['marketWatch/getDepthList'].BPrice5 = !!responseFeed.bp5 ? responseFeed.bp5 : rootGetters['marketWatch/getDepthList'].BPrice5
                                rootGetters['marketWatch/getDepthList'].BOrders5 = !!responseFeed.bo5 ? responseFeed.bo5 : rootGetters['marketWatch/getDepthList'].BOrders5
                                rootGetters['marketWatch/getDepthList'].BQty5 = !!responseFeed.bq5 ? responseFeed.bq5 : rootGetters['marketWatch/getDepthList'].BQty5

                                rootGetters['marketWatch/getDepthList'].totalbuyqty = !!responseFeed.tbq ? responseFeed.tbq : rootGetters['marketWatch/getDepthList'].totalbuyqty

                                rootGetters['marketWatch/getDepthList'].SPrice1 = !!responseFeed.sp1 ? responseFeed.sp1 : rootGetters['marketWatch/getDepthList'].SPrice1
                                rootGetters['marketWatch/getDepthList'].SOrders1 = !!responseFeed.so1 ? responseFeed.so1 : rootGetters['marketWatch/getDepthList'].SOrders1
                                rootGetters['marketWatch/getDepthList'].SQty1 = !!responseFeed.sq1 ? responseFeed.sq1 : rootGetters['marketWatch/getDepthList'].SQty1

                                rootGetters['marketWatch/getDepthList'].SPrice2 = !!responseFeed.sp2 ? responseFeed.sp2 : rootGetters['marketWatch/getDepthList'].SPrice2
                                rootGetters['marketWatch/getDepthList'].SOrders2 = !!responseFeed.so2 ? responseFeed.so2 : rootGetters['marketWatch/getDepthList'].SOrders2
                                rootGetters['marketWatch/getDepthList'].SQty2 = !!responseFeed.sq2 ? responseFeed.sq2 : rootGetters['marketWatch/getDepthList'].SQty2

                                rootGetters['marketWatch/getDepthList'].SPrice3 = !!responseFeed.sp3 ? responseFeed.sp3 : rootGetters['marketWatch/getDepthList'].SPrice3
                                rootGetters['marketWatch/getDepthList'].SOrders3 = !!responseFeed.so3 ? responseFeed.so3 : rootGetters['marketWatch/getDepthList'].SOrders3
                                rootGetters['marketWatch/getDepthList'].SQty3 = !!responseFeed.sq3 ? responseFeed.sq3 : rootGetters['marketWatch/getDepthList'].SQty3

                                rootGetters['marketWatch/getDepthList'].SPrice4 = !!responseFeed.sp4 ? responseFeed.sp4 : rootGetters['marketWatch/getDepthList'].SPrice4
                                rootGetters['marketWatch/getDepthList'].SOrders4 = !!responseFeed.so4 ? responseFeed.so4 : rootGetters['marketWatch/getDepthList'].SOrders4
                                rootGetters['marketWatch/getDepthList'].SQty4 = !!responseFeed.sq4 ? responseFeed.sq4 : rootGetters['marketWatch/getDepthList'].SQty4

                                rootGetters['marketWatch/getDepthList'].SPrice5 = !!responseFeed.sp5 ? responseFeed.sp5 : rootGetters['marketWatch/getDepthList'].SPrice5
                                rootGetters['marketWatch/getDepthList'].SOrders5 = !!responseFeed.so5 ? responseFeed.so5 : rootGetters['marketWatch/getDepthList'].SOrders5
                                rootGetters['marketWatch/getDepthList'].SQty5 = !!responseFeed.sq5 ? responseFeed.sq5 : rootGetters['marketWatch/getDepthList'].SQty5

                                rootGetters['marketWatch/getDepthList'].totalsellqty = !!responseFeed.tsq ? responseFeed.tsq : rootGetters['marketWatch/getDepthList'].totalsellqty

                                rootGetters['marketWatch/getDepthList'].volume = !!responseFeed.v ? responseFeed.v : rootGetters['marketWatch/getDepthList'].volume;
                                rootGetters['marketWatch/getDepthList'].lasttradedqty = !!responseFeed.ltq ? responseFeed.ltq : rootGetters['marketWatch/getDepthList'].lasttradedqty
                                rootGetters['marketWatch/getDepthList'].lowercircuitlimit = !!responseFeed.lc ? responseFeed.lc : rootGetters['marketWatch/getDepthList'].lowercircuitlimit
                                rootGetters['marketWatch/getDepthList'].lasttradedtime = !!responseFeed.ltt ? responseFeed.ltt : rootGetters['marketWatch/getDepthList'].lasttradedtime
                                rootGetters['marketWatch/getDepthList'].yearlyhighprice = !!responseFeed['52h'] ? responseFeed['52h'] : rootGetters['marketWatch/getDepthList'].yearlyhighprice
                                rootGetters['marketWatch/getDepthList'].weightedavg = !!responseFeed.ap ? responseFeed.ap : rootGetters['marketWatch/getDepthList'].weightedavg
                                rootGetters['marketWatch/getDepthList'].openinterest = !!responseFeed.oi ? responseFeed.oi   : rootGetters['marketWatch/getDepthList'].openinterest
                                rootGetters['marketWatch/getDepthList'].highercircuitlimit = !!responseFeed.uc ? responseFeed.uc : rootGetters['marketWatch/getDepthList'].highercircuitlimit
                                rootGetters['marketWatch/getDepthList'].yearlylowprice = !!responseFeed['52l'] ? responseFeed['52l'] : rootGetters['marketWatch/getDepthList'].yearlylowprice

                            }
                        }
                    })

                    router.currentRoute.path == '/orders' ? rootGetters['order/getPendingOrderList'].forEach(element => {
                        if (element.token == responseFeed.tk) {
                            element.ltp = !!responseFeed.lp ? responseFeed.lp : element.ltp;
                        }
                    }) : ''
                }
            };

            socket.onerror = function (err) {
                socket.onclose()
            };

            socket.onclose = function (err) {
                socket.close()
                commit('setIsConnect' , false);
                if (!state.isLogout && state.connectionStatus) {
                    commit('setConnectionStatus', false)
                    commit('setReconnect', true)
                    dispatch('connect')
                }
            };
            // if((socket.readyState == 2 || socket.readyState == 3)  && !state.isLogout && state.connectionStatus){
            //     commit('setIsConnect' , false);
            //     if (!state.isLogout && state.connectionStatus) {
            //         commit('setConnectionStatus', false)
            //         commit('setReconnect', true)
            //         dispatch('connect')
            //     }
            // }
            // console.log(socket.readyState, state.isLogout  , 'socket.readyState')
            // // socket.close = function (err) {
            // //     console.log(err , 'socket.close');
            // //     commit('setIsConnect' , false);
            // //     if (!state.isLogout && state.connectionStatus) {
            // //         commit('setConnectionStatus', false)
            // //         commit('setReconnect', true)
            // //         dispatch('connect')
            // //     }
            // // };
        },

        async send({ state, commit, dispatch }, msg) {
            if (!!socket.readyState && socket.readyState == 1) {
                try {
                    socket.send(msg);
                } catch (err) {
                    console.error(err);
                }
            } else if (!!socket.readyState && socket.readyState == 0) {
                setTimeout(() => { socket.send(msg); }, 900);

            } else {
            }
        },

        async connectionRequest({ dispatch, rootGetters }) {
            var token = await rootGetters['authtication/getUserSession'];
            var userId = await rootGetters['authtication/getUserId'];
            var encrcptToken = await sha256(sha256(token).toString()).toString();
            var initCon = {
                susertoken: encrcptToken,
                t: "c",
                actid: userId + "_WEB",
                uid: userId + "_WEB",
                source: "WEB"
            }
            dispatch("send", JSON.stringify(initCon));
        },

        async establishConnection({ state, dispatch }, payload) {
            if (state.connectionStatus == false) {
                await dispatch("connectionRequest");
            }
            await dispatch("send", JSON.stringify(payload));
        },

        async websocketSubscription({ state, commit, dispatch, rootGetters, rootState }, payload) {
            if(state.connectionStatus){
            var channel = 'BSE|1#NSE|26017#NSE|26040#NSE|26009#NSE|26000#';

            var token = payload.where == "mkWatch" ? 'token' : payload.where == "postion" ? 'Token' : payload.where == "order" ? 'token' : '';
            var exchange = payload.where == "mkWatch" ? 'ex' : payload.where == "postion" ? 'Exchange' : payload.where == "order" ? 'Exchange' : '';
            if (state.previousSubsription != '') {
                let json = {
                    k: state.previousSubsription,
                    t: 'u'
                };
                await dispatch('establishConnection', json)
            }
            if ((router.currentRoute.path == '/orders' || router.currentRoute.path == '/positions' || router.currentRoute.path == '/holdings' || router.currentRoute.path == '/home' || router.currentRoute.path == '/chart') && payload.where !== 'orderwindow') {
                var preToken = (router.currentRoute.path == '/orders' || router.currentRoute.path == '/positions' || router.currentRoute.path == '/holdings' || router.currentRoute.path == '/home') && (payload.where == "postion" || payload.where == "order" || payload.where == "holdings") ? 'token' : router.currentRoute.path == '/positions' && payload.where == "mkWatch" ? 'Token' : router.currentRoute.path == '/orders' && payload.where == "mkWatch" ? 'token' : payload.where == 'chart' && router.currentRoute.path == '/chart' ? 'token' : '';
                var preExchange = (router.currentRoute.path == '/orders' || router.currentRoute.path == '/positions' || router.currentRoute.path == '/holdings' || router.currentRoute.path == '/home') && (payload.where == "postion" || payload.where == "order" || payload.where == "holdings")  ? 'ex' : router.currentRoute.path == '/positions' && payload.where == "mkWatch" ? 'Exchange' : router.currentRoute.path == '/orders' && payload.where == "mkWatch" ? 'Exchange' : payload.where == 'chart' && router.currentRoute.path == '/chart' ? 'ex' : '';
                var preViousList = (router.currentRoute.path == '/orders' || router.currentRoute.path == '/positions' || router.currentRoute.path == '/holdings' || router.currentRoute.path == '/home') && (payload.where == "postion" || payload.where == "order" || payload.where == "holdings") ? rootGetters['marketWatch/getMwList'] : router.currentRoute.path == '/positions' && payload.where == "mkWatch" ? rootGetters['position/getPositionList'] : router.currentRoute.path == '/orders' && payload.where == "mkWatch" ? rootGetters['order/getPendingOrderList'] : router.currentRoute.path == '/holdings' && payload.where == "mkWatch" || router.currentRoute.path == '/home' ? rootGetters['holdings/getHoldingList'] : payload.where == 'chart' && router.currentRoute.path == '/chart' ? rootGetters['marketWatch/getMwList'] : '';
                !!preViousList ? preViousList.forEach(element => {
                    
                    if ((router.currentRoute.path == '/holdings' || router.currentRoute.path == '/home') && payload.where == "mkWatch") {
                        var exchHold = element['ExchSeg1'] && element.Nsetsym != "0" ?  element['ExchSeg1'] :  element['ExchSeg2']
                        channel += `${exchHold}|${exchHold == "NSE" ? element['Token1'] : element['Token2']}#`
                    } else {
                      channel += `${element[preExchange]}|${element[preToken]}#` 
                    }
                }) : ''
            }
            payload.data.forEach(element => {
                
                if (payload.where == "holdings") {
                    var exchHold = element['ExchSeg1'] && element.Nsetsym != "0" ?  element['ExchSeg1'] :  element['ExchSeg2'] 
                    channel += `${exchHold}|${exchHold == "NSE" ? element['Token1'] : element['Token2']}#`
                } else {
                      channel += `${element[exchange]}|${element[token]}#` 
                }

            });
            if (payload.where == 'orderwindow' || payload.where == 'chart'){
                var previous = state.previousSubsription + '#' + payload.subscribe;
                channel += previous
            }
            if (channel != '' && !!channel) {
                var tempChannel = channel.substring(0, channel.length - 1)
                var tempUniqueArray = tempChannel.split('#')
                var uniqueChannel = ''
                const uniqueArray = new Set(tempUniqueArray);
                uniqueArray.forEach(element => {
                    uniqueChannel += element + '#'
                })
                commit('setPreviousSubsription', uniqueChannel.substring(0, uniqueChannel.length - 1))

                let json = {
                    k: uniqueChannel.substring(0, uniqueChannel.length - 1),
                    t: 't'
                };
                await dispatch('establishConnection', json)
            }
        }
        },

        async depthSubscription({ state, commit, dispatch, rootGetters }, payload) {
            if(state.connectionStatus){
            commit('setPreDepthPayload', payload)
            if (state.preDepthSubsription != '') {
                let json = {
                    k: state.preDepthSubsription,
                    t: 'ud'
                };
                await dispatch('establishConnection', json)
            }

            if (payload != '') {
                commit('setPreDepthSubsription', payload)
                let json = {
                    k: payload,
                    t: 'd'
                };
                await dispatch('establishConnection', json)
            }
        }
        },

        async reconnect({ state, commit, dispatch, rootGetters }, payload) {
            dispatch('marketWatch/checkSocketStatus', '' , {root: true})
                        router.currentRoute.path == '/holdings' || router.currentRoute.path == '/home' ? dispatch('holdings/checkWebsocketStatus', '' , {root: true}) : ''
                        router.currentRoute.path == '/positions' ? dispatch('position/checkWebsocketStatus', '' , {root: true}) : ''
                        router.currentRoute.path == '/orders' ? dispatch('order/checkWebsocketStatus', '' , {root: true}) : ''
            if (state.preDepthSubsription) {
                await dispatch('depthSubscription', state.preDepthPayload)
            }
        },

        websocketClose({ state, commit, dispatch, rootGetters }, payload) {
            socket ? socket.close() : ''
        }
    },
    getters: {
        getConnectionStatue: state =>{
            return state.connectionStatus
        }
    }
};

export default wsConnection;
