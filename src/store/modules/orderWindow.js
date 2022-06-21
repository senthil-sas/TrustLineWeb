import Vue from 'vue'
import service from '../Services/httpservice'
import errorHandling from '../Services/errorHandling'
import router from '@/router'

function checkNullNan (value) {
    return value && !!value && value.toString() != "NA" && value.toString() != "-" && !isNaN(value) ? true : false
}

function setQtyFocus () {
    let qtyInputBox = document.querySelector("#qty");
    qtyInputBox != null ? qtyInputBox.focus() : ''
}

const orderWindow = {
    namespaced: true,
    state: {
        // window btns state variables
        orderTypeList: ["Regular", "Cover", "Bracket", "AMO"],
        validityItems: ["DAY", "IOC"],
        bracketPriceItems: ["L", "SL"],
        coverPriceItems: ["L", "MKT"],
        orderTab: null,
        priceType: null,
        prodType: null,
        validityType: 'DAY',

        showOrderWindow: false,
        removeCss: true,
        orderType: 'Buy',
        // orderSwitch
        toggleOrder: false,
        currentOrder: [],
        priceRangeDetails: [],
        scriptQuoteDetails: [],
        currentExchange: '',
        currentInstrument: '',
        currentToken: '',

        // qty & price Values
        minlot: '',
        ltp: '',
        currentLtp: null,
        triggerPrice: '',
        tickPrice: '',
        disclosedQuantity: 0,
        quantity: '',
        price: '',

        // disable inputs boolean
        isPrice: Boolean,
        isTrgPrice: Boolean,
        isDisclosedQty: Boolean,

        // price range data
        nsePriceRangeData: [],
        bsePriceRangeData: [],
        lowerRange: '',
        upperRange: '',
        nseBseType: false,
        modifyOrder: false,

        // currentPage Identify
        currentPage: '',
        currentInstrument: '',
        isNfo: true,

        // loading states
        loading: false,
        windowLoading: false,

        // by Bharath 
        allPriceItems: ["L", "MKT", "SL", "SL-M"],
        postionPriceItems: ["L", "MKT", "SL"],
        showPriceItems: [],
        eqProductItems: ["MIS", "CNC"],
        allProductItems: ["MIS", "NRML"],
        showproductItems: [],

        // for Modify Order Data 
        orderData: [],
        chartScripData: [],

        // nse switch state
        nseSwitchPrice: '0.00',
        bseSwitchPrice: '0.00',
        availableMargin: '0.00',
    },
    mutations: {
        setRemoveCss (state, payload) {
            state.removeCss = payload
        },
        async setOrderWindow (state, payload) {
            state.showOrderWindow = payload
            state.modifyOrder = false
        },

        async setOrderWindowModify (state, payload) {
            state.showOrderWindow = payload
            state.modifyOrder = true
        },

        setOrderType (state, payload) {
            state.orderType = payload
        },

        setToggleOrder (state, payload) {
            state.toggleOrder = payload
        },

        setCurrentOrder (state, payload) {
            state.currentOrder = payload.data
            if (payload.page == "holdings") {
                state.currentExchange = payload.data.ExchSeg1 && payload.data.Nsetsym != "0" ? payload.data.ExchSeg1 : payload.data.ExchSeg2
                state.currentToken = state.currentExchange == "NSE" ? payload.data.Token1 : payload.data.Token2
            } else if (payload.page == "analytics") {
                state.currentExchange = payload.exch
                state.currentToken = payload.data.nseToken ? payload.data.nseToken : payload.data.token
            } else {
                // This block is for POSITIONS and ORDERS
                state.currentExchange = payload.page == 'mkWatch' ? payload.data.ex : payload.data.Exchange
                state.currentToken = payload.data.token ? payload.data.token : payload.data.Token
            }
            if (payload.page == "mkWatch") {
                state.currentInstrument = state.currentOrder.Instrument
            } else if (payload.page == "orders" || payload.page == "positions") {
                state.currentInstrument = state.currentOrder.Instname
            }
            state.currentInstrument == 'OPTIDX' || state.currentInstrument == 'OPTSTK' ? state.isNfo = false : state.isNfo = true

            state.currentPage = payload.page
            if (payload.page == "holdings") {
                state.currentInstrument = state.currentExchange == "NSE" ? state.currentOrder.Nsetsym : state.currentOrder.Bsetsym
            } else {
                state.currentInstrument = payload.data.formatScripName
            }

        },

        async setPriceRangeDetails (state, payload) {
            state.nsePriceRangeData = []
            state.bsePriceRangeData = []
            payload.length == 1 || payload.length == undefined ? state.nseBseType = false : state.nseBseType = true
            // Check undefined, null , empty for both lower and upperRange
            if (payload.length >= 1) {
                payload.forEach(el => {
                    el.Exchg == state.currentExchange ? state.priceRangeDetails = el : ''
                    if (el.Exchg == "NSE") {
                        state.nsePriceRangeData.push(el)
                    } else if (el.Exchg == "BSE") {
                        state.bsePriceRangeData.push(el)
                    }
                })

                state.lowerRange = state.priceRangeDetails.lowercircuitlimit ? checkNullNan(state.priceRangeDetails.lowercircuitlimit.toString().replace(/,/g, "")) ? parseFloat(state.priceRangeDetails.lowercircuitlimit.toString().replace(/,/g, "")) : '0.00' : '0.00' 
                state.upperRange = state.priceRangeDetails.highercircuitlimit ? checkNullNan(state.priceRangeDetails.highercircuitlimit.toString().replace(/,/g, "")) ? parseFloat(state.priceRangeDetails.highercircuitlimit.toString().replace(/,/g, "")) : '0.00' : '0.00' 

                var tempData = {
                    data: [],
                    where: 'orderwindow',
                    subscribe: state.currentExchange + '|' + state.currentToken + '#'
                }
                payload.length == 1 ? this.dispatch('wsConnection/websocketSubscription', tempData, { root: true }) : ''
            } else {
                
                state.priceRangeDetails = payload
                state.lowerRange = checkNullNan(state.priceRangeDetails.lowercircuitlimit.toString().replace(/,/g, "")) ? parseFloat(state.priceRangeDetails.lowercircuitlimit.toString().replace(/,/g, "")) : '0.00'
                state.upperRange = checkNullNan(state.priceRangeDetails.highercircuitlimit.toString().replace(/,/g, "")) ? parseFloat(state.priceRangeDetails.highercircuitlimit.toString().replace(/,/g, "")) : '0.00'
                this.dispatch('orderWindow/setCurrentLtp', checkNullNan(state.priceRangeDetails.Ltp) ? state.priceRangeDetails.Ltp : checkNullNan(state.scriptQuoteDetails.LTP) ? state.scriptQuoteDetails.LTP : '0.00')
            }
            // nse bse radio button call function

            if (state.currentExchange == "NSE" && payload.length > 1) {
                await this.commit('orderWindow/makeActive', 'NSE')
            } else if (state.currentExchange == "BSE" && payload.length > 1) {
                await this.commit('orderWindow/makeActive', 'BSE')
            }
        },

        async setScriptQuoteDetails (state, payload) {
            state.scriptQuoteDetails = payload
            this.dispatch('orderWindow/setDefaultValues', state.scriptQuoteDetails)
            this.dispatch('orderWindow/setCurrentLtp', checkNullNan(state.scriptQuoteDetails.LTP) ? state.scriptQuoteDetails.LTP : '0.00')
        },

        setChartScripData (state, payload) {
            state.chartScripData = payload,
                localStorage.setItem('chartscrip', JSON.stringify(payload))
        },

        setCurrentQty (state, qty) {
            state.quantity = qty
        },

        setCurrentPrice (state, price) {
            state.price = price
        },

        setCurrentTrgPrice (state, trgPrice) {
            state.triggerPrice = trgPrice
        },

        // make active method for nse bse radio switch
        makeActive (state, exchange) {
            if (exchange == "NSE" && !state.modifyOrder) {
                checkNullNan(state.scriptQuoteDetails.LTP)
                state.triggerPrice = state.ltp = state.price = checkNullNan(state.nsePriceRangeData[0].Ltp) ? state.nsePriceRangeData[0].Ltp : checkNullNan(state.scriptQuoteDetails.LTP) ? state.scriptQuoteDetails.LTP : '0.00';
                checkNullNan(state.nsePriceRangeData[0].lowercircuitlimit.toString().replace(/,/g, "")) ? state.lowerRange = parseFloat(state.nsePriceRangeData[0].lowercircuitlimit.toString().replace(/,/g, "")) : '0.00'
                checkNullNan(state.nsePriceRangeData[0].highercircuitlimit.toString().replace(/,/g, "")) ? state.upperRange = parseFloat(state.nsePriceRangeData[0].highercircuitlimit.toString().replace(/,/g, "")) : '0.00'
                state.nsePriceRangeData[0].lotSize ? state.minlot = state.nsePriceRangeData[0].lotSize : state.minlot = 0
                state.scriptQuoteDetails['nseOrBseTickSize'] = state.nsePriceRangeData[0].tickSize
                this.commit('orderWindow/setTickPrice', state.scriptQuoteDetails)
                this.dispatch('orderWindow/setCurrentLtp', checkNullNan(state.nsePriceRangeData[0].Ltp) ? state.nsePriceRangeData[0].Ltp : checkNullNan(state.scriptQuoteDetails.LTP) ? state.scriptQuoteDetails.LTP : '0.00')
                state.currentToken = state.nsePriceRangeData[0]['token']
            } else if (!state.modifyOrder) {
                state.triggerPrice = state.ltp = state.price = checkNullNan(state.bsePriceRangeData[0].Ltp) ? state.bsePriceRangeData[0].Ltp : checkNullNan(state.scriptQuoteDetails.LTP) ? state.scriptQuoteDetails.LTP : '0.00'
                checkNullNan(state.bsePriceRangeData[0].lowercircuitlimit.toString().replace(/,/g, "")) ? state.lowerRange = parseFloat(state.bsePriceRangeData[0].lowercircuitlimit.toString().replace(/,/g, "")) : '0.00'
                checkNullNan(state.bsePriceRangeData[0].highercircuitlimit.toString().replace(/,/g, "")) ? state.upperRange = parseFloat(state.bsePriceRangeData[0].highercircuitlimit.toString().replace(/,/g, "")) : '0.00'
                state.bsePriceRangeData[0].lotSize ? state.minlot = state.bsePriceRangeData[0].lotSize : state.minlot = 0
                state.scriptQuoteDetails['nseOrBseTickSize'] = state.bsePriceRangeData[0].tickSize
                this.commit('orderWindow/setTickPrice', state.scriptQuoteDetails)
                this.dispatch('orderWindow/setCurrentLtp', checkNullNan(state.bsePriceRangeData[0].Ltp) ? state.bsePriceRangeData[0].Ltp : checkNullNan(state.scriptQuoteDetails.LTP) ? state.scriptQuoteDetails.LTP : '0.00')
                state.currentToken = state.bsePriceRangeData[0]['token']
            }
            this.commit("orderWindow/valiDateQty" , "")
            this.commit('orderWindow/setNseSwitchPrice', checkNullNan(state.nsePriceRangeData[0].Ltp) ? state.nsePriceRangeData[0].Ltp : checkNullNan(state.scriptQuoteDetails.LTP) ? state.scriptQuoteDetails.LTP : '0.00')
            this.commit('orderWindow/setBseSwitchPrice', checkNullNan(state.bsePriceRangeData[0].Ltp) ? state.bsePriceRangeData[0].Ltp : checkNullNan(state.scriptQuoteDetails.LTP) ? state.scriptQuoteDetails.LTP : '0.00')
            state.currentExchange = exchange
            var tempData = {
                data: [],
                where: 'orderwindow',
                subscribe: exchange + '|' + state.currentToken + '#'
            }
            this.dispatch('wsConnection/websocketSubscription', tempData, { root: true })
        },

        setPriceType (state, payload) {
            state.priceType = payload
        },

        setProdType (state, payload) {
            state.prodType = payload
        },

        setOrderTab (state, payload) {
            state.orderTab = payload
        },

        setValidityType (state, payload) {
            state.validityType = payload
        },

        setWindowLoading (state, payload) {
            state.windowLoading = payload;
        },

        // by Bharath 
        setPriceItems (state, payload) {
            state.showPriceItems = payload
        },

        setProductItems (state, payload) {
            state.showproductItems = payload
        },

        setIsNfo (state, payload) {
            state.isNfo = payload
        },

        changeOrderType (state, payload) {
            switch (payload) {
                case "regular": //Regular Order // We have taken (regular = amo) except for validity
                case "amo": {
                    if (state.priceType == "L") {
                        state.isPrice = true;
                        state.isTrgPrice = false;
                    } else if (state.priceType == "MKT") {
                        state.isPrice = false;
                        state.isTrgPrice = false;
                    } else if (state.priceType == "SL") {
                        state.isPrice = true;
                        state.isTrgPrice = true;
                    } else if (state.priceType == "SL-M") {
                        state.isPrice = false;
                        state.isTrgPrice = true;
                    }
                    break;
                }
                case "cover": {
                    // Cover Order validation
                    if (state.priceType == "L") {
                        state.isPrice = true;
                        state.isTrgPrice = true;
                    } else if (state.priceType == "MKT") {
                        state.isPrice = false;
                        state.isTrgPrice = true;
                    }
                    break;
                }
                case "bracket": {
                    // bracket Order validation
                    if (state.priceType == "L") {
                        state.isPrice = true;
                        state.isTrgPrice = false;
                    } else if (state.priceType == "SL") {
                        state.isPrice = true;
                        state.isTrgPrice = true;
                    }
                    break;
                }
            }
            if (state.currentExchange == 'NFO' || state.currentExchange == 'BFO') {
                this.commit('orderWindow/setIsDisclosedQty', false);
            } else {
                this.commit('orderWindow/setIsDisclosedQty', true);
            }
        },

        setOrderData (state, payload) {
            state.orderData = payload
        },

        setIsDisclosedQty (state, payload) {
            state.isDisclosedQty = payload
        },

        setTickPrice (state, payload) {
            // tickprice calculation 
            if (payload.nseOrBseTickSize) {
                var tickSize = parseFloat(payload.nseOrBseTickSize)
            } else {
                var tickSize = parseFloat(payload.TickSize)
            }
            var multiplier = payload.Multiplier
            var decimalPrevision = payload.DecimalPrecision
            var tempTickSize = tickSize / (multiplier * Math.pow(10, decimalPrevision));
            checkNullNan(tempTickSize) && tempTickSize != 0 ? state.tickPrice = tempTickSize : 1
        },

        setNseSwitchPrice (state, payload) {
            state.nseSwitchPrice = payload
        },

        setBseSwitchPrice (state, payload) {
            state.bseSwitchPrice = payload
        },

        setValidityItems (state, payload) {
            state.validityItems = payload
        },

        setDisclosedQty (state, payload) {
            state.disclosedQuantity = payload
        },

        setOrderTypeList(state, payload){
            state.orderTypeList = payload
        },

        // set Available margin
        setAvailableMargin (state, payload) {
            state.availableMargin = payload
        },

        // set Quantity with check Page
        valiDateQty(state, parameters){
            if (state.currentPage == 'holdings') {
                state.orderType.toLowerCase() == 'buy' ? this.commit('orderWindow/setCurrentQty', state.minlot) : this.commit('orderWindow/setCurrentQty', state.currentOrder.SellableQty)
            }else if(state.currentPage == 'positions'){
                if(Number(state.currentOrder.Netqty) == 0){
                    this.commit('orderWindow/setCurrentQty', state.minlot)
                }else{
                    if(Number(state.currentOrder.Netqty) > 0 && state.orderType.toLowerCase() == 'buy'){
                        this.commit('orderWindow/setCurrentQty', state.minlot) 
                    }else if(Number(state.currentOrder.Netqty) > 0 && state.orderType.toLowerCase() == 'sell'){
                        this.commit('orderWindow/setCurrentQty', Math.abs(state.currentOrder.Netqty)) 
                    }else if(Number(state.currentOrder.Netqty) < 0 && state.orderType.toLowerCase() == 'buy'){
                        this.commit('orderWindow/setCurrentQty', state.minlot) 
                    }else if(Number(state.currentOrder.Netqty) < 0 && state.orderType.toLowerCase() == 'sell'){
                        this.commit('orderWindow/setCurrentQty', Math.abs(state.currentOrder.Netqty)) 
                    }
                }
            }else {
                this.commit('orderWindow/setCurrentQty', state.orderData.page == 'orders' && state.modifyOrder && state.orderData.type ? state.orderData.data.Qty : state.minlot)
            }
        }

    },
    actions: {
        // place order service
        async placeOrder ({ state, commit, rootGetters }, payload) {
            state.loading = true;
            var symbolName = state.currentPage == 'mkWatch' ? state.currentExchange == 'NSE' ? state.nsePriceRangeData[0].TradingSymbol : state.currentExchange == 'BSE' ? state.bsePriceRangeData[0].TradingSymbol : state.currentOrder.symbol
                : state.currentPage == 'orders' ? state.currentExchange == 'NSE' ? state.nsePriceRangeData[0].TradingSymbol : state.currentExchange == 'BSE' ? state.bsePriceRangeData[0].TradingSymbol : state.scriptQuoteDetails.TSymbl
                    : state.currentPage == 'positions' ? state.currentExchange == 'NSE' ? state.nsePriceRangeData[0].TradingSymbol : state.currentExchange == 'BSE' ? state.bsePriceRangeData[0].TradingSymbol : state.currentOrder.Tsym
                        : (state.currentPage == 'holdings' && state.currentExchange == 'NSE') ? state.currentOrder.Nsetsym
                            : (state.currentPage == 'holdings' && state.currentExchange == 'BSE') ? state.currentOrder.Bsetsym : ''
            let placeOrder = [{
                active_status: null,
                complexty: payload.complexity == 'bracket' ? 'bo' : payload.complexity == 'cover' ? 'co' : payload.complexity,
                created_by: null,
                created_on: null,
                discqty: payload.orderTab == "bracket" ? payload.discQty.toString() : payload.discQty,
                emsg: null,
                exch: state.currentExchange,
                id: null,
                instrument: state.scriptQuoteDetails.UniqueKey,
                link: null,
                master_id: 0,
                pCode: payload.complexity == 'cover' ? "CO" : payload.pcode,
                prctyp: payload.priceType,
                price: payload.price.toString(),
                qty: payload.qty,
                reponse: null,
                ret: payload.validity ? payload.validity.toUpperCase() : "DAY",
                salt: null,
                stat: null,
                stopLoss: parseInt(payload.stopLoss),
                symbol_id: state.currentToken,
                target: payload.stopLoss,
                trading_symbol: symbolName,
                trailing_stop_loss: parseInt(payload.trailStopLoss),
                transtype: state.orderType,
                trigPrice: payload.trgPrice,
                updated_by: null,
                updated_on: null,
                userId: rootGetters['authtication/getUserId'],
                userSessionID: rootGetters['authtication/getUserSession'],
                userSettingDto: rootGetters['authtication/getUserSessionDto'],
            }]
            state.loading = false;
            commit('setOrderWindow', false)
            await service.executeOrder(placeOrder).then(response => {
                if (response.data[0]["emsg"] == 'Input parameters are wrong') {
                    errorHandling.toaster('Order not placed', 'danger', response.data[0]["emsg"], 3000)
                } else if (response.data[0].stat == 'Not_Ok') {
                    var error = response.data[0]['Emsg'] ? response.data[0]['Emsg'] : response.data[0]['emsg']
                    errorHandling.toaster('Order not placed', 'danger', error, 3000)
                } else {
                    errorHandling.toaster(response.data[0]["NOrdNo"] ? response.data[0]["NOrdNo"] : response.data[0]["nestOrderNumber"], 'success', 'Order Placed Successfully', 3000)
                }
                commit('setOrderWindow', false)
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.loading = false })
        },

        // placeBasketOrder service
        async placeBasketOrder ({ state, commit, rootGetters }, payload) {
            state.loading = true;
            let placeOrder = []
            payload.data.forEach(element => {
                placeOrder.push({
                    active_status: null,
                    complexty: element.complexity,
                    created_by: null,
                    created_on: null,
                    discqty: element.disclosedQuantity ? element.disclosedQuantity : 0,
                    emsg: null,
                    exch: element.exchange,
                    id: null,
                    instrument: element.instrument,
                    link: null,
                    master_id: 0,
                    pCode: element.product ? element.product.toLowerCase() : element.product,
                    prctyp: element.orderType,
                    price: element.price ? element.price : 0,
                    qty: element.quantity,
                    reponse: null,
                    ret: element.validity ? element.validity.toUpperCase() : "DAY",
                    salt: null,
                    stat: null,
                    stopLoss: element.stoploss ? parseInt(element.stoploss) : 0,
                    symbol_id: element.token,
                    target: element.stoploss ? parseInt(element.stoploss) : 0,
                    trading_symbol: element.tradingSymbol,
                    trailing_stop_loss: element.trailingStoploss ? parseInt(element.trailingStoploss) : 0,
                    transtype: element.transactionType ? element.transactionType.toLowerCase() : element.transactionType,
                    trigPrice: element.triggerPrice ? element.triggerPrice : 0,
                    updated_by: null,
                    updated_on: null,
                    userId: rootGetters['authtication/getUserId'],
                    userSessionID: rootGetters['authtication/getUserSession'],
                    userSettingDto: rootGetters['authtication/getUserSessionDto'],
                })
            })
            console.log(placeOrder);
            state.loading = false;
            commit('setOrderWindow', false)
            await service.executeOrder(placeOrder).then(response => {
                if (response.data[0]["emsg"] == 'Input parameters are wrong') {
                    response.data.forEach(element => {
                        errorHandling.toaster('Order not placed', 'danger', element["emsg"], 3000)
                    })
                } else if (response.data[0].stat == 'Not_Ok') {
                    response.data.forEach(element => {
                        errorHandling.toaster('Order not placed', 'danger', element['Emsg'], 3000)
                    })
                } else {
                    response.data.forEach(element => {
                        errorHandling.toaster(element["NOrdNo"] ? element["NOrdNo"] : element["nestOrderNumber"], 'success', 'Order Placed Successfully', 3000)
                    })
                    router.push('/orders')
                    localStorage.setItem('basketOrder', false)
                }
                commit('setOrderWindow', false)
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.loading = false })
        },

        // Modify order
        async modifyOrder ({ state, commit, rootGetters }, payload) {
            let placeOrder = {
                account_id: state.currentOrder["accountId"],
                discqty: payload.orderTab == "bracket" ? payload.discQty.toString() : payload.discQty,
                exch: state.currentOrder["Exchange"],
                exchSeg: state.currentOrder["Exseg"],
                filledQuantity: state.currentOrder["Fillshares"],
                mktPro: state.currentOrder["Mktpro"],
                nestOrderNumber: state.currentOrder["Nstordno"],
                pCode: state.currentOrder["Pcode"] == "MIS" ? "mis" : state.currentOrder["Pcode"],
                prctyp: payload.priceType,
                s_prdt_ali: rootGetters['authtication/getUserSessionDto'].s_prdt_ali,
                price: payload.price.toString(),
                qty: payload.qty,
                scripToken: state.currentOrder["token"],
                symbol_id: state.currentOrder["token"],
                trading_symbol: state.currentOrder["Trsym"],
                transtype: state.orderType,
                trigPrice: payload.trgPrice,
                userId: rootGetters['authtication/getUserId'],
                validity: payload.validity ? payload.validity.toUpperCase() : "DAY",
            }
            state.loading = true;
            await service.modifyOrder(placeOrder).then(response => {
                if (response.status == 200 && response.data.stat == "Ok") {
                    errorHandling.toaster('Modified Successfully', 'success', 'check order book for further details.', 3000)
                } else {
                    errorHandling.toaster('Order not modified', 'danger', response.data.Emsg, 3000)
                }
                commit('setOrderWindow', false)
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { state.loading = false; })
        },

        // get New Price range Service
        async getNewPriceRange ({ state, commit, rootGetters }, payload) {
            if (state.currentPage == 'holdings') {
                var exch = state.currentOrder.ExchSeg1 && state.currentOrder.Nsetsym != "0" ? state.currentOrder.ExchSeg1 : state.currentOrder.ExchSeg2
                var token = exch == "NSE" ? state.currentOrder.Token1 : state.currentOrder.Token2
            } else if (state.currentPage == "analytics") {
                var exch = payload.exch
                var token = payload.exch == 'NSE' ? state.currentOrder.nseToken : state.currentOrder.token
            } else if (state.currentPage == "basket") {
                var exch = state.currentOrder.exchange
                var token = state.currentOrder.token
            } else {
                var exch = state.currentPage == 'mkWatch' ? state.currentOrder.ex : state.currentOrder.Exchange
                var token = state.currentPage == 'positions' ? state.currentOrder.Token : state.currentOrder.token
            }
            let json = {
                "exch": exch,
                "symbol": token ? token : state.currentOrder.Symbol,
                'userId': rootGetters['authtication/getUserId'],
                'userSessionID': rootGetters['authtication/getUserSession']
            }
            await service.getNewPriceRange(json).then(response => {
                state.removeCss == false ? commit('setRemoveCss', false) : ''
                if (response.data.emsg == "Session Expired" || response.data == []) {
                    errorHandling.sessionExpire();
                } else if (response.status == 200) {
                    commit('setPriceRangeDetails', response.data)
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { })
        },

        // scrip quote details
        async getScripQuoteDetails ({ state, commit, dispatch, rootGetters }, payload) {
            if(payload.page == "chart"){
                var exch = payload.exch
                var token = payload.token
            }else{
            if (payload.page) {
                var exch = payload.value.ex
                var token = payload.value.token
            } else {
                if (state.currentPage == 'holdings') {
                    var exch = state.currentOrder.ExchSeg1 && state.currentOrder.Nsetsym != "0" ? state.currentOrder.ExchSeg1 : state.currentOrder.ExchSeg2
                    var token = exch == "NSE" ? state.currentOrder.Token1 : state.currentOrder.Token2
                } else if (state.currentPage == "analytics") {
                    var exch = payload.exch
                    var token = payload.exch == 'NSE' ? state.currentOrder.nseToken : state.currentOrder.token
                } else if (state.currentPage == "basket") {
                    var exch = state.currentOrder.exchange
                    var token = state.currentOrder.token
                } else {
                    var exch = state.currentPage == 'mkWatch' ? state.currentOrder.ex : state.currentOrder.Exchange
                    var token = state.currentPage == 'positions' ? state.currentOrder.Token : state.currentOrder.token
                }
            }
        }
            let json = {
                "exch": exch,
                "symbol": token ? token : state.currentOrder.Symbol,
                'userId': rootGetters['authtication/getUserId'],
                'userSessionID': rootGetters['authtication/getUserSession']
            }
            await service.getScripQuoteDetails(json).then(response => {
                if (response.data.emsg == "Session Expired") {
                    errorHandling.sessionExpire();
                } else if (response.status == 200) {

                    if (payload.page == 'chart') {
                        response.data.LTP =  payload.from == 'mkWatch' ? rootGetters['getChartData']['data']['ltp'] : payload.from == 'position' ? rootGetters['getChartData']['data']['LTP'] : payload.from == 'holdings' ? rootGetters['getChartData']['data']['chartLtp'] : payload.from == 'holdings' && rootGetters['getChartData']['data']['ltp'] ? rootGetters['getChartData']['data']['ltp'] : response.data.LTP
                        commit('setChartScripData', response.data)
                       
                    } else {
                        commit('setScriptQuoteDetails', response.data)
                        var tempData = {
                            data: [],
                            where: 'orderwindow',
                            subscribe: json.exch + '|' + json.symbol + '#'
                        }
                        json.exch != "NSE" && json.exch != "BSE" ? dispatch('wsConnection/websocketSubscription', tempData, { root: true }) : ''
                    }
                } else if (response.data.emsg == "Session Expired") {
                    errorHandling.sessionExpire();
                }
            }, (err) => {
                errorHandling.errLog(err)
            }).finally(() => { })
        },

        async setDefaultValues ({ state, commit }, scripData) {
        
            // minlot for quantity
            if ((state.currentOrder["Instname"] == "FUTCOM" || state.currentOrder["InstName"] == "FUTCOM" || state.currentOrder["InstName"] == "OPTFUT" || state.currentOrder["Instrument"] == "FUTCOM" || state.currentOrder["Instname"] == "OPTFUT" || state.currentOrder["Instrument"] == "OPTFUT") || ((state.currentOrder["Instrument"] == "FUTIDX" || state.currentOrder["Instname"] == "FUTIDX" || state.currentOrder["InstName"] == "FUTIDX") && state.currentExchange == "MCX")) {
                scripData.BodLotQty ? state.minlot = parseFloat(scripData.BodLotQty) / parseFloat(scripData.BodLotQty) : state.minlot = 0
            } else {
                scripData.BodLotQty ? state.minlot = parseFloat(scripData.BodLotQty) : state.minlot = 0
            }

            // ltp for Price
            checkNullNan(scripData.LTP) ? state.ltp = scripData.LTP : state.ltp = '0.00'
            state.currentExchange == "CDS" ? parseFloat(state.ltp).toFixed(4) : parseFloat(state.ltp).toFixed(2)

            scripData ? commit('setTickPrice', scripData) : ''
            commit('setCurrentPrice', state.ltp)
            commit('setCurrentTrgPrice', state.ltp)
            commit("setWindowLoading", false)
            commit("valiDateQty" , "")
            if (state.modifyOrder) {
                commit('setCurrentPrice', state.currentOrder.Prc == 0 ? state.ltp : checkNullNan(state.currentOrder.Prc) ? state.currentOrder.Prc : '0.00')
                commit('setCurrentTrgPrice', checkNullNan(state.currentOrder.Trgprc) ? parseFloat(state.currentOrder.Trgprc) != 0 ? state.currentOrder.Trgprc : state.ltp : '0.00')
                commit('setDisclosedQty', checkNullNan(state.currentOrder.Dscqty) ? state.currentOrder.Dscqty : 0)
            }
            setQtyFocus()
        },

        setInitialValues ({ state, commit, dispatch }, payload) {

            commit('setOrderData', payload)
            dispatch('common/setOrderTypeCommon' , payload, {root: true})
            
            dispatch('common/setProdTypeCommon' , payload, {root: true})
            
        },

        setOrderPreference ({ state, commit }, payload) {
            
            // market watch orderWindow preference set via localStoraged
            if (localStorage.getItem("orderPreference") && (payload.page == "mkWatch" || payload.page == "orders" && !state.modifyOrder)) {
                var preference = JSON.parse(localStorage.getItem("orderPreference"));
                var prodType = (state.currentExchange != "BSE" || state.currentExchange != "NSE") && preference["product"] == 'NRML' ? 'NRML' : preference["product"];

                // var orderTab = preference["variety"] == 'regular' ? 0 : preference["variety"] == 'cover' ? 1 : preference["variety"] == 'bracket' ? 2 : preference["variety"] == 'amo' ? 3 : ''
                preference["variety"] == 'regular' ? preference["variety"] = 'Regular' : preference["variety"] == 'cover' ? preference['variety'] = 'Cover' : preference["variety"] == 'bracket' ? preference["variety"] = 'Bracket' : preference["variety"] == 'amo' ? preference["variety"] = 'AMO' : ''
                var orderTab = state.orderTypeList.indexOf(preference["variety"])
                var priceType = preference["orderType"];
                var validity = preference["validity"];
                commit("setOrderTab", orderTab)
                commit('setProdType', prodType)
                commit('setPriceType', priceType)
                commit('setValidityType', validity)
            } else if (payload.page == "holdings") {
                commit("setOrderTab", 0)
                commit('setProdType', 'CNC')
                commit('setPriceType', 'MKT')
                commit('setValidityType', 'DAY')
            } else if (payload.page == "positions") {
                commit("setOrderTab", 0)
                commit('setProdType', payload.data.Pcode)
                commit('setPriceType', 'MKT')
                commit('setValidityType', 'DAY')
            }
        },

        setCurrentLtp ({ state }, payload) {
            state.currentLtp = state.currentExchange == 'CDS' || state.currentExchange == 'BCD' ? parseFloat(payload).toFixed(4) : parseFloat(payload).toFixed(2)
        },

        // check margin availble 
        async getMarginAvailable ({ state, commit }, payload) {
            commit("setAvailableMargin", '0.00')
            await service.checkMargin(payload).then(response => {
                if (response.status == "200" && response.data.stat == 'Ok') {
                    commit("setAvailableMargin", response.data['Order Margin'])
                }
            }).catch(error => { })
        }
    },

    getters: {
        getPriceType (state) {
            return state.priceType
        },
        getProdType (state) {
            return state.prodType
        },
        getOrderTab (state) {
            return state.orderTab
        },
        getValidityType (state) {
            return state.validityType
        },
        getTriggerPrice (state) {
            return state.triggerPrice
        },
        getCurrentLtp: state => {
            return state.currentLtp
        },
        getCurrentToken: state => {
            return state.currentToken
        },
        getAvailableMargin: state => {
            return state.availableMargin
        }
    }
}

export default orderWindow