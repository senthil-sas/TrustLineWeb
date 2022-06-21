import service from "../Services/httpservice";
import errorHandling from "../Services/errorHandling";
const order = {
    namespaced: true,

    state: {
        allOrderList: [],
        pendingOrderList: [],
        completedOrderList: [],
        tradeBookList: [],
        tabList: [],
        orderHistory: [],
        orderLoader: false,
        infoType: 'Pending',
        showOrderlist: [],
        cancelOrder: [],
        singleCancelDialog: false,
        multipleCancelDialog: false,
        singleCancelLoader: false,
        cancelMultiple: 0
    },
    mutations: {

        setTabList(state) {
            state.tabList = []
            var Items = [`Pending`, `Executed`, `Trade Book`]
            for (let item of Items) {
                var tempData = {
                    name: item,
                    length: item == 'Pending' ? state.pendingOrderList.length : item == 'Executed' ? state.completedOrderList.length : item == 'Trade Book' ? state.tradeBookList.length : '',
                    toolTip: item == 'Pending' ? 'Open Orders' : item == 'Executed' ? 'Completed , Rejected and Cancelled Orders' : item == 'Trade Book' ? 'Completed Orders' : ''
                }
                state.tabList.push(tempData)
            }
        },

        setOrderHistory(state, payload) {
            state.orderHistory = payload[0];
        },

        setTabActive(state, payload) {
            state.infoType = payload
            payload == "Pending" ?
                (state.showOrderlist = state.pendingOrderList) :
                payload == "Executed" ?
                    (state.showOrderlist = state.completedOrderList) :
                    payload == "Trade Book" ?
                        (state.showOrderlist = state.tradeBookList) :
                        "";
        },

        setCancelOrder(state, payload) {
            state.cancelOrder = payload;
        },

        setSingleCancelDialog(state, payload) {
            state.singleCancelDialog = payload
        },

        setMultipleCancelDialog(state, payload) {
            state.multipleCancelDialog = payload
        },

        setMultiple(state, payload) {
            state.cancelMultiple = payload;
        },

        setTradeBookList(state, payload) {
            state.tradeBookList = payload;
            this.commit('order/setTabActive', state.infoType)
        }
    },
    actions: {
        async getOrderList({ state, commit, dispatch, rootGetters }) {
            state.orderLoader = true
            dispatch('setOrderList', [])
            commit('setMultiple', 0)
            let userorderBook = {
                userSessionID: rootGetters['authtication/getUserSession'],
                userId: rootGetters['authtication/getUserId'],
                userSettingDto: rootGetters['authtication/getUserSessionDto'],
            };
            await service.fetchOrder(userorderBook).then(resp => {
                if (resp.status === 200 && resp.data.stat != 'Not_Ok') {
                    var tempData = {
                        data: resp.data,
                        where: 'order'
                    }
                    dispatch('common/formatScrip', tempData, { root: true })
                } else if (resp.status === 200 && resp.data.stat == 'Not_Ok' && resp.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.orderLoader = false; dispatch('fetchTradeList') })
        },

        async fetchTradeList({ state, dispatch, commit, rootGetters }, payload) {
            state.orderLoader = true;
            let json = {
                userId: rootGetters['authtication/getUserId'],
                userSettingDto: rootGetters['authtication/getUserSessionDto'],
            }
            await service.fetchTradeBook(json).then(resp => {
                if (resp.status === 200 && resp.data.stat != 'Not_Ok') {
                    var tempData = {
                        data: resp.data,
                        where: 'trade'
                    }
                    dispatch('common/formatScrip', tempData, { root: true })
                }
                if (resp.status === 200 && resp.data.stat == 'Not_Ok' && resp.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                }
                commit('setTabList')
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.orderLoader = false; })
        },

        setOrderList({ state, commit, dispatch }, payload) {
            state.pendingOrderList = []
            state.completedOrderList = []
            state.tradeBookList = []
            state.allOrderList = payload.forEach(el => {
                el.showdropdown = false;
                el.ltp = ''
                if (el["Status"] == "trigger pending" || el["Status"] == "open" ||
                    el["Status"] == "after market order req received" ||
                    el["Status"] == "modify after market order req received") {
                    state.pendingOrderList.push(el)
                }
                if (el["Status"] == "cancelled" ||
                    el["Status"] == "rejected" ||
                    el["Status"] == "cancelled after market order" || el["Status"] == "complete") {
                    state.completedOrderList.push(el)
                }
            });
            commit('setTabActive', state.infoType)
            dispatch("checkWebsocketStatus")
        },
        /****
         * @author Ashwin
         * @since 06/12/21
         * Method for getting order info
         *****/
        async getOrderHistory({ commit, rootGetters }, payload) {
            let json = {
                userId: rootGetters['authtication/getUserId'],
                nestOrderNumber: payload.Nstordno,
                userSessionID: rootGetters['authtication/getUserSession'],
                userSettingDto: rootGetters['authtication/getUserSessionDto'],
            }
            await service.getOrderInfo(json).then(response => {
                if (response.status == 200) {
                    commit('setOrderHistory', response.data)
                } else if (response.data["Emsg"] == "Session Expired" || response.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                }
            }, (err) => {
                errorHandling.errLog(err)
            })
        },

        /****
         * @author Ashwin
         * @since 06/12/21
         * Method for cancel order
         *****/

        async cancelOrder({ state, commit, rootGetters }, payload) {
            state.singleCancelLoader = true
            let json = {
                userId: rootGetters['authtication/getUserId'],
                nestOrderNumber: payload.Nstordno,
                trading_symbol: payload.Trsym,
                exch: payload.Exchange,
                userSessionID: rootGetters['authtication/getUserSession'],
                userSettingDto: rootGetters['authtication/getUserSessionDto'],
            }
            await service.orderCancel(json).then(response => {
                if (response.status == 200 && response.data.stat != "Not_Ok") {
                    errorHandling.toaster('Order Cancelled successfully', 'success', response.data.Result, 3000)
                } else if (response.data["Emsg"] == "Session Expired" || response.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                }
                commit('setSingleCancelDialog', false)
                commit('setMultipleCancelDialog', false)
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.singleCancelLoader = false; })
        },

        checkWebsocketStatus({ state, dispatch, rootGetters }, payload) {
            if (rootGetters['wsConnection/getConnectionStatue']) {
                var tempData = {
                    data: state.pendingOrderList,
                    where: 'order'
                }

                dispatch("wsConnection/websocketSubscription", tempData, { root: true })
            }
        },

        async cancelCoverOrder({ state, commit, rootGetters }, payload) {
            let jsonObj = {
                userId: rootGetters['authtication/getUserId'],
                userSessionID: rootGetters['authtication/getUserSession'],
                nestOrderNumber: payload["Nstordno"],
                s_prdt_ali: rootGetters['authtication/getUserSessionDto']['s_prdt_ali'],
            };
            await service.cancelCoverOrder(jsonObj).then(response => {
                if (response.status == 200 && response.data.stat != "Not_Ok") {
                    errorHandling.toaster('Order Cancelled successfully', 'success', "#" + payload["Nstordno"], 3000)
                } else if (response.data["Emsg"] == "Session Expired" || response.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                }
                commit('setSingleCancelDialog', false)
                commit('setMultipleCancelDialog', false)
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.singleCancelLoader = false; })
        },

        async cancelBraketOrder({ state, commit, rootGetters }, payload) {
            let jsonObj = {
                userId: rootGetters['authtication/getUserId'],
                userSessionID: rootGetters['authtication/getUserSession'],
                status: payload.Status,
                symbolOrderId: payload.SyomOrderId,
                nestOrderNumber: payload.Nstordno,
            };
            await service.exitBoOrder(jsonObj).then(response => {
                if (response.status == 200 && response.data.stat != "Not_Ok") {
                    errorHandling.toaster('Order Cancelled successfully', 'success', "#" + payload.Nstordno, 3000)
                } else if (response.data["Emsg"] == "Session Expired" || response.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                }
                commit('setSingleCancelDialog', false)
                commit('setMultipleCancelDialog', false)
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.singleCancelLoader = false; })
        },
    },
    getters: {
        getTradeList: state => {
            return state.tradeBookList
        },
        getInfoType: state => {
            return state.infoType
        },
        getSingleCancelDialog: state => {
            return state.singleCancelDialog
        },
        getMultipleCancelDialog: state => {
            return state.multipleCancelDialog
        },
        getPendingOrderList: state => {
            return state.pendingOrderList
        },
        getCancelOrderLength: state => {
            return state.cancelMultiple
        }
    },
}
export default order;