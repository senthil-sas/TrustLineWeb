import service from '../Services/httpservice'
import router from '@/router'

const basket = {
    namespaced: true,
    state: {
        appName: '',
        basketItems: [],
        vendorDetails: [],
    },
    mutations: {
        SET_VENDOR_DETAILS (state, payload) {
            state.vendorDetails = payload;
            state.appName = payload[0].appName;
            state.basketItems = JSON.parse(payload[0].content);
            // this.commit('SET_BASKET_ITEMS', JSON.parse(payload[0].content));
        },
        SET_BASKET_ITEMS (state, payload) {
            if (payload.type == 'delete') {
                if (payload.index > -1) {
                    state.basketItems.splice(payload.index, 1);
                }
            } else {
                state.basketItems = payload;
            }
        },
    },

    actions: {
        getBasket ({ commit }, payload) {
            commit('setLoader', true, { root: true })
            service.getBasketData(payload).then(response => {
                if (response.data.message == 'SUCCESS' && response.data.result.length > 0) {
                    commit('SET_VENDOR_DETAILS', response.data.result)
                } else {
                    commit('SET_VENDOR_DETAILS', [])
                }
            }).finally(() => { commit('setLoader', false, { root: true }) })
        }
    },

    getters: {
        getBasketItems: state => state.basketItems,
        getVendorDetails: state => state.vendorDetails,
        getAppName: state => state.appName,
    }
}

export default basket;