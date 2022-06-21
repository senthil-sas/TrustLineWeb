import service from "../Services/httpservice";
import router from '@/router'
import errorHandling from "../Services/errorHandling";
const settings = {
  namespaced: true,

  state: {
    userDetails: [],
    resetMpin: [],
    resetSQues: [],
    resetPass: [],
    marketStatus: [],
    nseStatus: '',
    bseStatus: '',
    mcxStatus: '',
    nseMessages: [],
    bseMessages: [],
    mcxMessages: [],
    generateApiKey: [],
    apiKeyDetails: [],
    apiAvailble: [],
    apikeys: [],
    expriedapi: [],
    regenerateApiKey: [],
    generateApiDialog: false,
    settingsLoader: false,
    apiLoader: false
  },
  mutations: {
    setCustomerDetails (state, payload) {
      payload['product'] ? payload.convertProducts = payload['product'].toString() : ''
      var arr = [];
        
      if(payload["accountName"].includes(" ")){
        arr = payload["accountName"].split(" ");
  
        var sliceName = ''
        for (let item of arr) {
          item ? sliceName += item[0].slice(0, 1).toUpperCase() + " " : ''
        }
      }else{
        sliceName =  payload["accountName"][0]
      }
      payload.shortName = sliceName
      state.userDetails = payload;
    },
    setResetMpin (state, payload) {
      state.resetMpin = payload;
    },
    setResetSques (state, payload) {
      state.resetSQues = payload;
    },
    setResetPass (state, payload) {
      state.resetPass = payload;
    },
    setMarketStatus (state, payload) {
      state.marketStatus = payload;
      var bscarray = payload["bse"];
      var nscarray = payload["nse"];
      var mcxarray = payload["mcx"];
      for (var i = 0; i < nscarray.length; i++) {
        if (nscarray[i].MarketMode == "Normal Market") {
          state.nseStatus = nscarray[i].MktStatus;
        }
      }
      for (var i = 0; i < bscarray.length; i++) {
        if (bscarray[i].MarketMode == "Normal Market") {
          state.bseStatus = bscarray[i].MktStatus;
        }
      }
      for (var i = 0; i < mcxarray.length; i++) {
        if (mcxarray[i].MarketMode == "Normal market" || mcxarray[i].MarketMode == "Normal Market") {
          state.mcxStatus = mcxarray[i].MktStatus;
        }
      }
    },
    setNseMessages (state, payload) {
      state.nseMessages = payload.split("/n")
    },
    setBseMessages (state, payload) {
      state.bseMessages = payload.split("/n")
    },
    setMcxMessages (state, payload) {
      state.mcxMessages = payload.split("/n")
    },
    setApiKeyDetails (state, payload) {
      state.apiKeyDetails = payload;
    },
    setGenerateApiDialog (state, payload) {
      state.generateApiDialog = payload
    }

  },
  actions: {

    /****
     * @author Ashwin
     * @since 01/12/21
     * Method for get customer details
     *****/

    async getCustomerDetails ({
      commit,
      rootGetters,
      state
    }) {
      state.settingsLoader = true
      let json = {
        userId: rootGetters['authtication/getUserId'],
      };
      await service.getAccountDetails(json).then(
        response => {
          
          if (response.status == 200 && response.data != "Not_Ok" && response.data.stat == "Ok") {

            commit("setCustomerDetails", response.data);
          } else if (response.data.stat == "Not_Ok" && response.data.emsg == "Session Expired") {
            errorHandling.sessionExpire()
          }
        },
        (err) => {
          errorHandling.errLog(err)
        }).finally(() => { state.settingsLoader = false });

    },

    /****
     * @author Ashwin
     * @since 01/12/21
     * Method for reset mpin
     *****/
    async getResetMpin ({
      commit,
      rootGetters
    }, payload) {
      let json = {
        userId: rootGetters['authtication/getUserId'],
        mpin: payload
      };
      await service.resetMpin(json).then(
        response => {
          if (response.status == 200 && response.data != "Not_Ok") {
            errorHandling.toaster("", "success", "MPIN Modified successfully", 3000)
          } else if (response.data.Emsg == "Session Expired" || response.data.emsg == "Session Expired") {
            errorHandling.sessionExpire()
          }
        },
        (err) => {
          errorHandling.errLog(err)
        }
      );
    },

    /****
     * @author Ashwin
     * @since 01/12/21
     * Method for reset security questions
     *****/
     async getResetSques ({commit,rootGetters}, payload) {
      let json = {
        userId: rootGetters['authtication/getUserId'],
        email: payload
      };
      await service.resetTwoFa(json).then(
        response => {
          if (response.status == 200 && response.data.stat != "Not_Ok") {
            errorHandling.toaster( " ","success","2FA reset has been successful.", 3000)
          } else if (response.data.Emsg == "Session Expired" || response.data.emsg == "Session Expired") {
            errorHandling.sessionExpire()
          }else{
            errorHandling.toaster(" ","danger", "2FA reset has been successful.", 3000)
          }
        },
        (err) => {
          errorHandling.errLog(err)
        }
      );
    },

    /****
     * @author Ashwin
     * @since 04/12/21
     * Method for market messages
     *****/
    async marketStatus ({
      state,
      commit,
      rootGetters
    }) {
      state.settingsLoader = true
      let json = {
        userId: rootGetters['authtication/getUserId'],
        userSessionID: rootGetters['authtication/getUserSession']
      };
      await service.getMarketstatus(json).then(
        response => {
          if (response.status == 200 && response.data != "Not_Ok") {
            commit("setMarketStatus", response.data);
          } else if (response.data.stat == "Not_Ok" && response.data.emsg == "Session Expired") {
            errorHandling.sessionExpire()
          }
        },
        (err) => {
          errorHandling.errLog(err)
        }
      ).finally(() => { state.settingsLoader = false });
    },

    async getMarketMessages ({
      state,
      commit,
      rootGetters
    }, payload) {
      state.settingsLoader = true
      let userFetch = {
        exch: payload,
        userId: rootGetters['authtication/getUserId'],
        userSessionID: rootGetters['authtication/getUserSession']
      };
      service.getMarketMessages(userFetch).then(resp => {
        if (resp.status === 200 && resp.data.stat == 'Ok' && resp.data.Exchmsg != 'No Data') {

          if (payload == 'NSE') {
            commit('setNseMessages', resp.data.Exchmsg)
          }
          if (payload == 'BSE') {
            commit('setBseMessages', resp.data.Exchmsg)
          }
          if (payload == 'MCX') {
            commit('setMcxMessages', resp.data.Exchmsg)
          }
        } else if (resp.data.stat == "Not_Ok" && resp.data.emsg == "Session Expired") {
          errorHandling.sessionExpire()
        }
      },
        (err) => {
          errorHandling.errLog(err)
        }
       ).finally(() => { state.settingsLoader = false });
    },

    /****
     * @author Ashwin
     * @since 07/12/21
     * Method for get API Key
     *****/
    async getApiKey ({ commit }) {
      await service.getAPIKeyService().then(response => {
        if (response.status == 200 && response.data["status"] == "Not_Ok" && response.data["available"] == false) {
          commit("setApiKeyDetails", response.data);
        } else if (response.data["status"] == "Ok") {
          commit("setApiKeyDetails", response.data);
        } else if (response.data.emsg == "Session Expired") {
          errorHandling.sessionExpire()
        }
      },
        (err) => {
          errorHandling.errLog(err)
        });
    },

    /****
     * @author Ashwin
     * @since 08/12/21
     * Method for generate API Key
     *****/
    async generateApiKey ({ state, commit, dispatch }) {
      state.apiLoader = true
      await service.generateAPIKey().then(response => {
        state.apiLoader = false
        if (response.status == 200) {
          dispatch('getApiKey')
          commit('setGenerateApiDialog', false)
        } else if (response.data.emsg == "Session Expired") {
          errorHandling.sessionExpire()
        }
      },
        (err) => {
          errorHandling.errLog(err)
        });
    },

    /****
     * @author Ashwin
     * @since 08/12/21
     * Method for Regenerate API Key
     *****/
    async getReGenerateAPIKeys ({
      state, commit, dispatch
    }) {
      state.apiLoader = true
      await service.regenerateAPIKeyService().then(response => {
        state.apiLoader = false
        if (response.status == 200) {
          dispatch('getApiKey')
          commit('setGenerateApiDialog', false)
        } else if (response.data.emsg == "Session Expired") {
          errorHandling.sessionExpire()
        }
      },
        (err) => {
          errorHandling.errLog(err)
        });
    }

  },

  getters: {
    getgenerateApiDialog (state) {
      return state.generateApiDialog
    }
  }

};
export default settings;