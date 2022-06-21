import service from "../Services/httpservice";
import errorHandling from "../Services/errorHandling";
const apps = {

    namespaced: true,

    state: {
        vendorList: [],
        revokeVendor:[],
        tabList:[],
        authorizeDialog: false,
        appsLoader: false
    },

    mutations : {
        setVendorList(state, payload) {
            state.vendorList = payload;
        },

        setTabList(state){
            state.tabList = []
            var Items = ["Apps", "API Key"]
            for (let item of Items){
                var tempData = {
                    name:item,
                    length: state.vendorList.length
                }
                state.tabList.push(tempData)
            }
        },
        setAuthorizeDialog(state, payload){
            state.authorizeDialog = payload
        }
    },

    actions: {

        /****
         * @author Ashwin
         * @since 02/12/21
         * Method to get vendor list
         *****/

         async getVendorList({state ,commit , rootGetters}) {
            state.appsLoader = true
            let json = {
                userId: rootGetters['authtication/getUserId'],
                userSessionID: rootGetters['authtication/getUserSession'],
                userSettingDto: rootGetters['authtication/getUserSessionDto'],
            };
            await service.getVendor(json).then(
                response => {
                    if (response.status == 200 && response.data.stat != "Not_Ok") {
                        commit("setVendorList", response.data.result);
                    } else if (response.data.stat == "Not_Ok") {
                        commit("setVendorList", []);
                    }

                    commit('setTabList')
                },
                (err) =>{
                    errorHandling.errLog(err)
                }).finally(() => { state.appsLoader = false; })
        },

        /****
         * @author Ashwin
         * @since 02/12/21
         * Method to revoke vendor
         *****/

         async getRevokeVendor({state,dispatch}, payload) {
            state.appsLoader = true
            await service.revokeVendor(payload).then(
                response => {
                    
                    if (response.status == 200 && response.data != "Not_Ok") {
                        dispatch('getVendorList')
                    } else if (response.data["emsg"] == "Session Expired") {
                        errorHandling.sessionExpire()
                    }

                },
                (err) =>{
                    errorHandling.errLog(err)
                }).finally(() => { state.appsLoader = false; })
        },

        async setAuthorize({state,commit , dispatch , rootGetters}, payload){
            state.appsLoader = true
            await service.authAccessVendor(payload).then(resp =>{
                if(resp.status === 200 && resp.data.stat == 'Ok'){
                    if(payload.vendorId == 1001){
                        window.open("http://api.amoga.tech/","_blank");
                    }
                
                    dispatch('getVendorList')
                    commit('setAuthorizeDialog', false)
                    errorHandling.toaster('','success' , resp.data["emsg"] , 3000)
                }
                else if (resp.status === 200 && resp.data["emsg"] == "Session Expired") {
                    errorHandling.sessionExpire()
                  }
            },
            (err) =>{
                errorHandling.errLog(err)
            }).finally(() => { state.appsLoader = false; })
        }
    }
};
export default apps;