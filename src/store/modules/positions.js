import service from "../Services/httpservice"
import errorHandling from "../Services/errorHandling";
import mtom from '../Services/formula'
const position = {
  namespaced: true,

  state: {
    positionList: [],
    fnoList: [],
    mcxList: [],
    currentTableData: [],
    totalPnl: 0,
    nfoTotalPnl: 0,
    mcxTotalPnl: 0,
    currentTotalPnl: 0,
    tabList: [],
    postionLoader: false,
    positionConvertData: [],
    positionExitDialog: false,
    positionConvertDialog: false,
    exitLoader: false,
    convertionLoader: false,
    infoType: 0,
  },

  mutations: {
    setPositionList (state, data) {
      state.fnoList = []
      state.mcxList = []
      data.forEach(el => {

        el.showdropdown = false
        el.ltp = el.LTP
        if (el.Exchange == 'NFO') {
          state.fnoList.push(el)
        }
        if (el.Exchange == 'MCX') {
          state.mcxList.push(el)
        }
        el.MtoM = mtom.realisedProfitLoss(el) + mtom.unRealisedProfitLoss(el)
      })

      state.positionList = data;
      this.commit('position/setCurrentTableData', state.infoType)
      this.dispatch('position/checkWebsocketStatus')
    },
    setCurrentTableData (state, type) {
     
      type == 'F&O' ? state.currentTableData = state.fnoList : type == 'MCX'
        ? state.currentTableData = state.mcxList : state.currentTableData = state.positionList
    },

    setTabList (state) {
      state.tabList = []
      var Items = ["All", "F&O", "MCX"]
      for (let item of Items) {
        var tempData = {
          name: item,
          length: item == 'All' ? state.positionList.length : item == 'F&O' ? state.fnoList.length : item == 'MCX' ? state.mcxList.length : '',
          toolTip: item == 'All' ? 'All Positions' : item == 'F&O' ? 'Futures and Options' : item == 'MCX' ? 'Commodity' : ''
        }
        state.tabList.push(tempData)
      }
    },
    setPositionConvertData (state, payload) {
      state.positionConvertData = payload;
    },
    setPositionExitDialog (state, payload) {
      state.positionExitDialog = payload
    },
    setPositionConvertDialog (state, payload) {
      state.positionConvertDialog = payload
    },
    setCurrentTab (state, payload) {
      state.infoType = payload
    }
  },

  actions: {
    /****
     * @author Senthil
     * date 3-12-2021
     */
    async getPositions ({ state, commit, rootGetters, dispatch }) {
      state.postionLoader = true
      commit("setPositionList", []);
      let json = {
        ret: "NET",
        userId: rootGetters['authtication/getUserId'],
        userSettingDto: rootGetters['authtication/getUserSessionDto'],
      };
      await service.getPositionData(json).then(response => {

        if (response.status == 200 && response.data.stat !== "Not_Ok") {
          var zeroQty = []
          var tempPostionsList = []
          for (let item of response.data) {
            item.NetBuyavgprc = mtom.convertToNumber(item.NetBuyavgprc)
            item.NetSellavgprc = mtom.convertToNumber(item.NetSellavgprc) 
            item.LTP = mtom.convertToNumber(item.LTP) 
            item.netbuyqty = mtom.convertToNumber(item.netbuyqty) 
            item.netsellqty = mtom.convertToNumber(item.netsellqty) 
            item.BLQty =  mtom.convertToNumber(item.BLQty) 
            item.Netqty  =  mtom.convertToNumber(item.Netqty) 
            if (item.Netqty == 0) {
              zeroQty.push(item);
            } else {
              tempPostionsList.push(item)
            }
          }
          var tempData = {
            data: zeroQty.length == 0 ? tempPostionsList : tempPostionsList.concat(zeroQty),
            where: 'postion'
          }
          dispatch('common/formatScrip', tempData, { root: true })

        } else if (response.status == 200 && response.data.stat == "Not_Ok" && response.data.emsg == "Session Expired") {

          errorHandling.sessionExpire()
        }
        commit("setTabList");
      }, (err) => {
        errorHandling.errLog(err)
      }).finally(() => { state.postionLoader = false; })
    },

    /****
     * @author Ashwin
     * @since 06/12/21
     * Method for convert Positions
     *****/
    async positionConversion ({ state, commit, rootGetters, dispatch }, payload) {
      state.convertionLoader = true
      let json = {
        userId: rootGetters['authtication/getUserId'],
        userSessionID: rootGetters['authtication/getUserSession'],
        branchId: rootGetters['authtication/getUserSessionDto'].branch_id,
        brokerName: rootGetters['authtication/getUserSessionDto'].broker_name,
        account_id: rootGetters['authtication/getUserSessionDto'].account_id,
        s_prdt_ali: rootGetters['authtication/getUserSessionDto'].s_prdt_ali,
        pCode: payload.data["Pcode"],
        productToCode: payload.data["Exchange"] == "NSE" ||
          payload.data["Exchange"] == "BSE"
          ? payload.data["Pcode"] == "CNC"
            ? "MIS"
            : "CNC"
          : payload.data["Pcode"] == "NRML"
            ? "MIS"
            : "NRML",
        exch: payload.data["Exchange"],
        qty: payload.qty.toString(),
        tsym: payload.data["Tsym"],
        transtype:
          payload.data["Netqty"] > 0 ? "B" : "S",
        tockenNo: payload.data["Token"],
        type:
          payload.data["Type"] == "NET1"
            ? "C"
            : "D",
      }
      await service.convertPosition(json).then(response => {
        if (response.status == 200 && response.data.stat == "Ok") {
          errorHandling.toaster('', 'success', response.data.Result, 3000)
        } else if (response.data.emsg == "Session Expired") {
          errorHandling.sessionExpire()
        }else if(response.data.stat == "Not_Ok"){
          errorHandling.toaster('', 'danger', response.data.emsg, 3000)
        }
        commit('setPositionConvertDialog', false)
        dispatch('getPositions')
      },
        (err) => {
          errorHandling.errLog(err)
        }).finally(() => { state.convertionLoader = false; });
    },

    /****
   * @author Ashwin
   * @since 10/12/21
   * Method for getting order info
   *****/
    async exitPosition ({ state, commit, rootGetters }, payload) {
      state.exitLoader = true
      var Array = []
      for (let item of payload) {
        let json = {
          userId: rootGetters['authtication/getUserId'],
          pCode: item.Pcode,
          netQty: item.Netqty,
          exchSeg: item.Exchangeseg,
          tockenNo: item.Token,
          symbol: item.Tsym
        }
        Array.push(json)
      }

      await service.getPositionSquareOff(Array).then(response => {

        if (response.status == 200) {
          commit('setPositionExitDialog', false)
          errorHandling.toaster('', 'success', Array.length == 1 ? 'Position Exited Successfully' : 'Positions Exited Successfully', 3000)
        } else if (response.data["Emsg"] == "Session Expired" || response.data["emsg"] == "Session Expired") {
          errorHandling.sessionExpire()
        }
      }, (err) => {
        errorHandling.errLog(err)
      }).finally(() => { state.exitLoader = false; })
    },

    setSocketValues ({ state }, payload) {


      state.currentTableData.forEach(el => {
        if (payload.tk == el.Token) {
          el.LTP = !!payload.lp ? payload.lp : el.LTP
          el.MtoM = mtom.realisedProfitLoss(el) + mtom.unRealisedProfitLoss(el)

        }
      })

    },
    checkWebsocketStatus ({ state, dispatch, rootGetters }, payload) {
      if (rootGetters['wsConnection/getConnectionStatue']) {
        var tempData = {
          data: state.positionList,
          where: 'postion'
        }

        dispatch("wsConnection/websocketSubscription", tempData, { root: true })
      }
    }
  },

  getters: {
    getPositionExitDialog: state => {
      return state.positionExitDialog
    },
    getPositionConvertDialog: state => {
      return state.positionConvertDialog
    },
    getPositionList: state => {
      return state.positionList
    },
    getCurrentTableData: state => {
      return state.currentTableData
    }
  }
};
export default position;