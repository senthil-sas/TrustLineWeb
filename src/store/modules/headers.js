import service from '../Services/httpservice'
import router from '@/router'
import errorHandling from '../Services/errorHandling'
const header = {
    namespaced: true,

    state: {
       niftyFiftyArray:[],
       niftyFinServiceArray:[],
       niftyBankArray:[],
       indiaVixArray:[],
       senSexArray:[],
       logoutLoader: false,
       menuList: [],
       tabSelection:0,
    },
    mutations: {
        setNseIndex(state , payload){
          for(let item of payload){
            var tempChange = (item.IndexChange/
              (item.IndexValue + item.IndexChange)) * 100

            var tempData = {
              name: item.IndexName,
              value: item.IndexValue , 
              change: tempChange.toString() == 'NaN' ? '0.00' : tempChange,
              token: item.IndexName == "Nifty 100" ? '26040' : item.IndexName == "Nifty Bank" ? '26009' : item.IndexName == "Nifty 50" ? '26000' : item.IndexName == "India VIX" ? '26017' : '',
              chart: '::index',
              exch: 'NSE'
            }
            tempData.chartExchange = tempData.exch
            tempData.chartToken = tempData.token
            tempData.chartSymbol = tempData.name + '::' + tempData.exch.toLocaleLowerCase() + '::INDEX'
            if(item.IndexName == "Nifty Bank"){
              state.niftyBankArray = tempData
            }
            if(item.IndexName == "Nifty 50"){
              state.niftyFiftyArray = tempData
            }
            if(item.IndexName == "Nifty 100"){
              state.niftyFinServiceArray = tempData
            }
            if(item.IndexName == "India VIX"){
              state.indiaVixArray = tempData
            }
          }
        },
        setBseIndex(state , payload){
          for(let item of payload){
            var tempChange = (item.IndexChange/
              (item.IndexValue + item.IndexChange)) * 100
            var tempData = {
              name: item.IndexName,
              value: item.IndexValue , 
              change: tempChange.toString() == 'NaN' ? '0.00' : tempChange,
              token: item.IndexName == "SENSEX" ? '1' : '',
              chart: '::index',
              exch: 'BSE'
            }
            tempData.chartExchange = tempData.exch
            tempData.chartToken = tempData.token
            tempData.chartSymbol = tempData.name + '::' + tempData.exch.toLocaleLowerCase() + '::INDEX'
            if(item.IndexName == "SENSEX"){
              state.senSexArray = tempData
            }
        
          }
        },
        setMenuList(state, payload){
          var lapViewData = [
              { text: "home", svg: "home" },
              { text: "orders", svg: "Orders" },
              { text: "positions", svg: "Positions" },
              { text: "holdings", svg: "Holdings" },
              { text: "funds", svg: "Funds" },
              { text: "apps", svg: "AppsIcon" },
              { text: "settings", svg: "Settings" },
          ]
          var mobileView =  [
            { text: "home", svg: "home" },
            { text: "marketwatch", svg: "marketwatch" },
            { text: "orders", svg: "Orders" },
            { text: "positions", svg: "Positions" },
            { text: "holdings", svg: "Holdings" },
            { text: "funds", svg: "Funds" },
            { text: "apps", svg: "AppsIcon" },
            { text: "settings", svg: "Settings" },
        ]
        payload ? state.menuList = mobileView : state.menuList = lapViewData 
        },
        setTabSelection(state , payload) {
          state.tabSelection  =  payload
        }
    },
    actions: {
        logout({state, dispatch}) {
          state.logoutLoader = true
            service.logout("").then(
              (response) => {
                if (response.status == 200) {
                  errorHandling.localClear();
                  errorHandling.toaster("Logged Out", "success", "Successfully", 3000)
                } else if (response.data["emsg"] == "Session Expired") {
                 errorHandling.sessionExpire()
                }
              },
              (err) => {
               errorHandling.errLog(err);
              }).finally(() => { state.logoutLoader = false; })
          },
     async getIndex({commit , rootGetters}, payload){
        let jsonObj ={
          userId: rootGetters['authtication/getUserId'],
          exch: payload,
        }
       await service.getIndexDetails(jsonObj).then(resp =>{

          if(resp.status === 200 && resp.data.stat == 'Ok'){
            if(payload == 'NSE'){
              commit('setNseIndex' , resp.data.IndexDetail)
            }
            if(payload == 'BSE'){
              commit('setBseIndex' , resp.data.IndexDetail)
            }
          }else if (resp.data["emsg"] == "Session Expired") {
            errorHandling.sessionExpire()
          }
        },
        (err) => {
         errorHandling.errLog(err);
        }
      );
      },
      setIndexSocketValues({state, commit} , payload){
        if(payload.tk == '1'){
          state.senSexArray['value'] = !!payload.lp ? payload.lp : state.senSexArray['value']
          state.senSexArray['change'] = !!payload.pc ? payload.pc : state.senSexArray['change']
        }
        if(payload.tk == '26017'){
          state.indiaVixArray['value'] = !!payload.lp ? payload.lp : state.indiaVixArray['value']
          state.indiaVixArray['change'] = !!payload.pc ? payload.pc : state.indiaVixArray['change']
        }
        if(payload.tk == '26009'){
          state.niftyBankArray['value'] = !!payload.lp ? payload.lp : state.niftyBankArray['value']
          state.niftyBankArray['change'] = !!payload.pc ? payload.pc : state.niftyBankArray['change']
        }
        if(payload.tk == '26000'){
          state.niftyFiftyArray['value'] = !!payload.lp ? payload.lp : state.niftyFiftyArray['value']
          state.niftyFiftyArray['change'] = !!payload.pc ? payload.pc : state.niftyFiftyArray['change']
        }
        if(payload.tk == '26040'){
          state.niftyFinServiceArray['value'] = !!payload.lp ? payload.lp : state.niftyFinServiceArray['value']
          state.niftyFinServiceArray['change'] = !!payload.pc ? payload.pc : state.niftyFinServiceArray['change']
        }
      },
    },
    getters: {
      getIndex: state =>{
       var index = state.menuList.findIndex(
          (std) => std.text === router.currentRoute.path.replace("/", "")
        );
        return index
      }
    },
};

export default header;