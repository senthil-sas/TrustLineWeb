import * as pako from '../../assets/pako'
import router from "../../router";

const url =  'wss://rest.aliceblueonline.com/NestHtml5MobileTech/socket/stream'


let socketTr;

const wsConnectionTr = {
    namespaced: true,

    state: {
        wsData: [],
        connectionStatus: false,
        previousSubsription: '',
        preDepthSubsription: '',
        preScripPayload: '',
        preDepthPayload: '',
        isReconnect: false,
        isLogout: false,
        counter: 0
    },

    mutations: {
        setPreviousSubsription (state, payload) {
            state.previousSubsription = payload;
        },
        setConnectionStatus (state, payload) {
            state.connectionStatus = payload
        },
        setPreDepthSubsription (state, payload) {
            state.preDepthSubsription = payload
        },
        setPrePayload (state, payload) {
            state.preScripPayload = payload
        },
        setPreDepthPayload (state, payload) {
            state.preDepthPayload = payload
        },
        setReconnect (state, payload) {
            state.isReconnect = payload
        },
        SetIsLogout (state, payload) {
            state.isLogout = payload
        },
        setCounter(state, payload){
            state.counter = payload
        }
    },

    actions: {
        connect ({ state, commit, dispatch, rootGetters, rootState }) {
            socketTr = new WebSocket(url)
            socketTr.onopen = function () {
                dispatch("connectionRequest");
            }
            socketTr.onmessage = function (msg) {
                var decoded = window.atob(msg.data);
                var data = pako ? pako.inflate(decoded) : [];
                var newarray = ([] = String.fromCharCode.apply(String, data));
                var wsChange = JSON.parse(newarray);
                var isHaveCnc = false
                for (var j = 0; j <= wsChange.length - 1; j++) {
                    var jsonResponse = wsChange[j];
                    var nextResponse = wsChange.length - 1 == j ? wsChange[j] : wsChange[j+1];
                    if (jsonResponse["msg"] == "connected") { 
                        commit('setConnectionStatus', true)
                        dispatch('sendHeartBeat', "os")
                    }
                    
                    // if(rootState.order.cancelMultiple > 0){
                    // if((jsonResponse["name"] == "osf" && !jsonResponse['os'] && !jsonResponse['non']) || (jsonResponse["name"] == "osf" && jsonResponse['os'] && nextResponse['non'] != jsonResponse['non'])){
                    //     commit('setCounter' , state.counter + 1)
                    // }
                // }
                if(router.currentRoute.path == '/holdings'){
                jsonResponse["name"] == "osf" && jsonResponse["tt"].toUpperCase() == 'S' && jsonResponse["prod"].toUpperCase() == 'CNC' && !isHaveCnc ? isHaveCnc = true : ''
                }
                    
                }
                var orderStatus = wsChange[wsChange.length - 1]
                if (orderStatus["name"] == "osf") {
                    if(router.currentRoute.path == '/orders'){
                        dispatch('order/getOrderList' , '' , { root: true })
                    }
                    // if(router.currentRoute.path == '/orders' && (state.counter == rootState.order.cancelMultiple || rootState.order.cancelMultiple == 0 )){
                        // commit('setCounter' , 0)
                    //     dispatch('order/getOrderList' , '' , { root: true })
                    // }
                    if(router.currentRoute.path == '/positions'){
                        dispatch('position/getPositions' , '' , { root: true })
                    }
                    
                    if(router.currentRoute.path == '/holdings' && isHaveCnc){
                        dispatch('holdings/getHoldings' , '' , { root: true })
                    }
                }
            }

            socketTr.onerror = function (err) {
                socketTr.onclose()
            }

            socketTr.onclose = function (err) {
                socketTr.close()
                if (!state.isLogout && state.connectionStatus) {
                    commit('setConnectionStatus', false)
                    dispatch('connect')
                }
            }

        },

        async connectionRequest ({ dispatch, rootGetters }) {
            
            var token = JSON.parse(localStorage.getItem("websocketId"));
            var userId = await rootGetters['authtication/getUserId'];
            var initCon = {
                channel: "",
                task: "cn",
                acctid: userId,
                user: userId,
                token: token,
            };
            dispatch("send", JSON.stringify(initCon));
        },

        async send ({ state, dispatch}, msg) {
            if (!!socketTr.readyState && socketTr.readyState == 1) {
                try {
                    socketTr.send(msg);
                } catch (err) {
                    console.error(err);
                }
            } else if (!!socketTr.readyState && socketTr.readyState == 0) {
                setTimeout(() => { socketTr.send(msg); }, 900);
            }
        },

        sendHeartBeat ({ dispatch, rootGetters}, payload) {
            var token = rootGetters['authtication/getWebsocketId']
            var userId = rootGetters['authtication/getUserId'];
            // var wsState = JSON.parse(localStorage.getItem("wsConnectionState"));
            if (!!userId) {
                // if (!!wsState) {
                    var heartBeat;
                    var hb = {
                        channel: "",
                        task: payload,
                        acctid: userId,
                        user: userId,
                        token: token,
                    };
                heartBeat = JSON.stringify(hb);
                dispatch('send', heartBeat);
                // }
            }
        },
        

        websocketClose ({ state, commit, dispatch, rootGetters }, payload) {
            socketTr ?  socketTr.close() : ''
        }

    }

};

export default wsConnectionTr;
