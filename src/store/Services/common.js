
const common = {
    namespaced: true,

    state: {
        months: [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
        ],
    },
    mutations: {

    },
    actions: {
        formatScrip({ state, commit, dispatch }, payload) {
            
            var formatData = []
            var instrment = payload.where == 'mkWatch' ? 'Instrument' : payload.where == 'postion' ? 'Instname' : payload.where == 'order' ? 'InstName' : payload.where == 'trade' ? '' : '';
            var symbol = payload.where == 'mkWatch' ? 'symbolname' : payload.where == 'postion' ? 'Symbol' : payload.where == 'order' ? 'Sym' : payload.where == 'trade' ? 'symbolname' : '';
            var strikeprice = payload.where == 'mkWatch' ? 'strikeprice' : payload.where == 'postion' ? 'Stikeprc' : payload.where == 'order' ? 'strikePrice' : payload.where == 'trade' ? 'strikeprice' : '';
            var expiry = payload.where == 'mkWatch' ? 'Expiry' : payload.where == 'postion' ? 'Expdate' : payload.where == 'order' ? 'ExpDate' : payload.where == 'trade' ? 'Expiry' : '';
            var optionType = payload.where == 'mkWatch' ? 'optiontype' : payload.where == 'postion' ? 'Opttype' : payload.where == 'order' ? 'optionType' : payload.where == 'trade' ? 'optiontype' : '';
            var exch = payload.where == 'order' || payload.where == 'trade' || payload.where == 'postion' ? 'Exchange' : ''
            var tradeSym = payload.where == 'order' ? 'Trsym' : payload.where == 'trade' || payload.where == 'postion' ? 'Tsym'  :''
            var token = payload.where == 'order' ? 'token' : payload.where == 'trade' ? 'Symbol': payload.where == 'postion' ? 'Token' : ''
            payload.data.forEach(idex => {
                  
                if ((idex[instrment] == "OPTIDX" || idex[instrment] == "OPTSTK" || idex[instrment] == "OPTFUT" ||
                    idex[instrment] == "OPTCUR" || idex[instrment] == "OPTCOM" || idex[instrment] == "OPTBLN" && idex["Exchange"] != "XX") || payload.where == 'trade') {
                        let strike
                        if(idex[strikeprice]){  strike = (idex[strikeprice].split(".")[1] > 0 ? idex[strikeprice] : idex[strikeprice].split(".")[0]).replaceAll(',','');}
                  if(idex[symbol] && idex[expiry] && idex[expiry] != "NA" && idex[optionType] && idex[optionType] != "XX" && strike) {

                   idex["formatScripName"] = idex[symbol] + " " + new Date(idex[expiry]).getDate() + state.months[new Date(idex[expiry]).getMonth()] +
                        " " + Number(strike).toFixed(2) + " " + idex[optionType];
                        idex["formatScripName"] = idex["formatScripName"].toString().includes(".") == true &&  idex[instrment] != "OPTCUR" ? idex["formatScripName"].toString().split(".")[0] +
                        " " + idex[optionType] : idex["formatScripName"];
                  }
                }
                if (instrment && idex[instrment]?.startsWith("FUT")) {
                    idex["formatScripName"] = idex[symbol] + " " + new Date(idex[expiry]).getDate() + state.months[new Date(idex[expiry]).getMonth()] + " FUT";
                }
                if(idex["formatScripName"] == null || idex["formatScripName"] == undefined) {
                    idex["formatScripName"] = payload.where == 'mkWatch' ? idex.TradSym : payload.where == 'postion' ? idex.Trsym : payload.where == 'order' ? idex.Trsym : payload.where == 'trade' ? idex.Tsym : ''
                }
                idex.chartSymbol = idex[exch] == 'NSE' ? idex[tradeSym].split('-')[0] + '::' + idex[exch] + ':::' + idex[exch] + ':::' + idex[token] : idex[tradeSym] + '::' + idex[exch] + ':::' + idex[exch] + ':::' + idex[token]
                idex.websocketSub = idex[exch] + '|' + idex[token] + '#'
                idex.chartExchange = idex[exch]
                idex.chartToken = idex[token]
                payload.where == 'trade' ? idex.ltp = '' : ''
                formatData.push(idex);
            })
            payload.where == 'mkWatch' ? commit("marketWatch/setMwlist", formatData, { root: true }) :
                payload.where == 'postion' ? commit("position/setPositionList", formatData, { root: true }) : payload.where == 'order' ?
                    dispatch("order/setOrderList", formatData, { root: true }) : payload.where == 'trade' ? commit("order/setTradeBookList", formatData, { root: true }) : '';       
        },



        // set preference based Exchange 
        setOrderTypeCommon({state, commit, dispatch} , payload){
            
            var InstName = payload.page == "mkWatch" ? "insType" : payload.page == "positions" ? "Instname" : payload.page == "orders" ? "InstName" : ''
            var Exchange = payload.page == "mkWatch" ? "ex" : payload.page == "positions" || payload.page == "orders" ? "Exchange" : payload.page == 'holdings' ? payload.data.chartExchange :  ''
            var nse_OrderType = ["Regular", "Bracket", "AMO"]
            var bse_OrderType = ["Regular", "AMO"]
            var mcx_OrderType = ["Regular", "Cover", "Bracket", "AMO"]
            var nfo_Fut_OrderType = ["Regular", "Cover", "Bracket", "AMO"]
            var nfo_Option_OrderType = ["Regular"]
            var cds_Or_bcd_OrderType = ["Regular", "Cover"]
            var nco_Commidity_OrderType = ["Regular", "Bracket"]
            var bco_Commidity_OrderType = ["Regular"]

            if(payload.data[Exchange] == 'NSE'){
                commit('orderWindow/setOrderTypeList' , nse_OrderType, {root: true})
            }
            if(payload.data[Exchange] == 'BSE'){
                commit('orderWindow/setOrderTypeList' , bse_OrderType, {root: true})
            }
            if(payload.data[Exchange] == 'MCX'){
                commit('orderWindow/setOrderTypeList' , mcx_OrderType, {root: true})
            }
            if(payload.data[Exchange] == 'CDS' || payload.data[Exchange] == 'BCD'){
                commit('orderWindow/setOrderTypeList' , cds_Or_bcd_OrderType, {root: true})
            }
            if(payload.data[Exchange] == 'NCO'){
                commit('orderWindow/setOrderTypeList' , nco_Commidity_OrderType, {root: true})
            }
            if(payload.data[Exchange] == 'BCO'){
                commit('orderWindow/setOrderTypeList' , bco_Commidity_OrderType, {root: true})
            }

            if((payload.data[Exchange] == 'NFO' || payload.data[Exchange] == 'BFO') && (payload.data[InstName] == "OPTIDX" || payload.data[InstName] == "OPTSTK")){
                commit('orderWindow/setOrderTypeList' , nfo_Option_OrderType, {root: true})
            }
            if((payload.data[Exchange] == 'NFO' || payload.data[Exchange] == 'BFO') && (payload.data[InstName] == "FUTIDX" || payload.data[InstName] == "FUTSTK")){
                commit('orderWindow/setOrderTypeList' , nfo_Fut_OrderType, {root: true})
            }

            dispatch('orderWindow/setOrderPreference', payload , {root: true})
        },

        // set ProdType preference based Exchange
        setProdTypeCommon({state, commit, dispatch, rootState}, payload){
            var orderData = rootState.orderWindow.orderData
            var InstName = orderData.page == "mkWatch" ? "insType" : orderData.page == "positions" ? "Instname" : orderData.page == "orders" ? "InstName" : ''
            var orderTypeList = rootState.orderWindow.orderTypeList
            var selectedTab =  rootState.orderWindow.orderTab 
            var exchange = rootState.orderWindow.currentExchange
          
            if(orderTypeList[selectedTab] == 'Cover'){
                
            commit('orderWindow/setProductItems' , ["MIS"], {root: true}) 
            commit('orderWindow/setPriceItems' , rootState.orderWindow.coverPriceItems, {root: true}) 
            
            }else if(orderTypeList[selectedTab] == 'Bracket'){
                commit('orderWindow/setProductItems' , ["MIS"], {root: true}) 
                exchange == 'NCO' ? commit('orderWindow/setPriceItems' , ["L", "MKT", "SL"], {root: true})  : commit('orderWindow/setPriceItems' , rootState.orderWindow.bracketPriceItems, {root: true})
            }else if(orderTypeList[selectedTab] == 'AMO'){
                exchange == 'NSE' || exchange == 'BSE' ?  commit('orderWindow/setProductItems' , ["MIS" , "CNC"], {root: true}) : commit('orderWindow/setProductItems' , ["MIS" , "NRML"], {root: true})
                 commit('orderWindow/setPriceItems' , ["L"], {root: true})
            }else if(orderTypeList[selectedTab] == "Regular"){
                exchange == 'NSE' || exchange == 'BSE' ?  commit('orderWindow/setProductItems' , ["MIS" , "CNC"], {root: true}) : commit('orderWindow/setProductItems' , ["MIS" , "NRML"], {root: true})
              exchange == 'MCX' || exchange == 'NSE' || exchange == 'BSE' || ((exchange == 'NFO' || exchange == 'BFO') && (orderData.data[InstName] == "FUTIDX" || orderData.data[InstName] == "FUTSTK")) ? commit('orderWindow/setPriceItems' , ["L", "MKT", "SL", "SL-M"] , {root: true}) : commit('orderWindow/setPriceItems' , ["L", "SL"], {root: true})
            }

            orderTypeList[selectedTab] == "Regular" ? commit("orderWindow/setValidityItems", ['DAY', 'IOC'], {root: true}) : commit("orderWindow/setValidityItems", rootState.orderWindow.coverOrBracketValidityItems, {root: true})
            if(orderData.page == "holdings"){
             !!rootState.orderWindow.priceType ? '' : commit('orderWindow/setPriceType', 'MKT', {root: true})
             !!rootState.orderWindow.prodType ? '' : commit('orderWindow/setProdType', 'CNC', {root: true})
             !!rootState.orderWindow.orderTab ? '' : commit("orderWindow/setOrderTab", 0, {root: true})
            }else {
                orderData.data[InstName] == "OPTIDX" || orderData.data[InstName] == 'OPTSTK' ? commit("orderWindow/setIsNfo", false, {root: true}) : commit("orderWindow/setIsNfo", true, {root: true});
             orderData.page == "mkWatch" && !!rootState.orderWindow.priceType ? '' : orderData.page == "mkWatch" ? commit('orderWindow/setPriceType', 'L', {root: true}) : ''
             orderData.page == "mkWatch" && !!rootState.orderWindow.prodType ? '' : orderData.page == "mkWatch" ? commit('orderWindow/setProdType', 'MIS', {root: true}) : ''
 
             orderData.page == "positions" && !!rootState.orderWindow.priceType ? '' : orderData.page == "positions" ? commit('orderWindow/setPriceType', 'MKT', {root: true}) : ''
             orderData.page == "positions" && !!rootState.orderWindow.prodType ? '' : orderData.page == "positions" ? commit('orderWindow/setProdType', orderData.data.Pcode, {root: true}) : ''
 
             orderData.page == "orders" && !!rootState.orderWindow.priceType ? '' : orderData.page == "orders" && orderData.type ? commit('orderWindow/setPriceType', orderData.data.Prctype, {root: true}) : orderData.page == "orders" && !orderData.type ? commit('orderWindow/setPriceType', 'L', {root: true}) : ''
             orderData.page == "orders" && !!rootState.orderWindow.prodType ? '' : orderData.page == "orders" && orderData.type ? commit('orderWindow/setProdType', orderData.data.Pcode, {root: true}) : orderData.page == "orders" && !orderData.type ? commit('orderWindow/setProdType', 'MIS', {root: true}) : ''
 
             if (orderData.page == "orders" && orderData.type) {
                 commit("orderWindow/setOrderTab", orderData.data.ordergenerationtype.toLowerCase() == 'amo' ? 3 : orderData.data.ordergenerationtype.toString() == '--' && orderData.data.Pcode == 'CO' ? 1 : orderData.data.ordergenerationtype.toString() == '--' && orderData.data.Pcode == 'BO' ? 2  : 0 , {root: true})
             } else {
                 !!rootState.orderWindow.orderTab ? '' : commit("orderWindow/setOrderTab", 0 , {root: true})
             }
             if (rootState.orderWindow.modifyOrder) {
                 commit('orderWindow/setValidityType', orderData.data.Validity, {root: true})
             }
            }
        }
    }
};
export default common;