import Vue from 'vue';
import store from '@/store'
function checkNullNan (value) {
    return value && !!value && value.toString() != "NA" && value.toString() != "-" && !isNaN(value) ? true : false
}
const formula = new Vue({

    methods: {
        convertToNumber(value){ return value.toString().replaceAll(/,/g, "") },
        
        realisedProfitLoss(data) {
            
            var realise = 0
            var closedQty = ''
            var tempQty = 0

            if (parseFloat(data['netbuyqty']) > 0 && parseFloat(data['netsellqty']) > 0) {
                
                if (parseFloat(data['netbuyqty']) > parseFloat(data['netsellqty'])) {
                    closedQty = parseFloat(data['netsellqty'])
                } else {
                    closedQty = parseFloat(data['netbuyqty'])
                }

                closedQty = checkNullNan(closedQty) ? closedQty : 0
                tempQty = data.Exchange == "NFO" || data.Exchange == "BFO" ? closedQty : closedQty * parseFloat(data['BLQty'])
                realise = tempQty * (parseFloat(data['NetSellavgprc']) - parseFloat(data['NetBuyavgprc']));

                realise = data.Exchange == "CDS" || data.Exchange == "BCD" ? realise * 1000 : realise
                return realise
            } else {
                return realise
            }
        },

        unRealisedProfitLoss(data) {
            
            var unRealise = 0
            if (parseFloat(data.Netqty) != 0) {
               
                var tempAvgPrc = parseFloat(data.Netqty) > 0 ? parseFloat(data["LTP"]) - parseFloat(data["NetBuyavgprc"]) : parseFloat(data["NetSellavgprc"]) - parseFloat(data["LTP"])
                var tempQtyMul = data.Exchange == "NFO" || data.Exchange == "BFO" ? parseFloat(data['Netqty']) : parseFloat(data['Netqty']) * parseFloat(data['BLQty'])
                if(tempQtyMul < 0){
                    tempQtyMul = tempQtyMul * -1;
                }
                unRealise = tempQtyMul * tempAvgPrc

                unRealise = data.Exchange == "CDS" || data.Exchange == "BCD" ? unRealise * 1000 : unRealise
                return unRealise
            } else {
                return unRealise
            }

        },


        // holdings formula 
        /****
         * @author Bharath    
         * @since Apr 04 2022
         * @method Calculate a P&L and Others using API and Websocket
         ****/ 
        holdingsProfitLoss(){

            store.state.holdings.totalInvestment = 0
            store.state.holdings.totalcurrentValue = 0
            store.state.holdings.totalPnl = 0
            store.state.holdings.totalPnlChange = 0
            var totalPreviousDayClose = 0
            store.state.holdings.daysPnl = 0
            store.state.holdings.daysPnlChange = 0
            store.state.holdings.holdingList.forEach((el, i) => {
                el["Btst"] = el["Btst"] ? el["Btst"] : 0
                el["SellableQty"] = el["SellableQty"] ? el["SellableQty"] : 0
                el["Price"] = el["Price"] ? el["Price"] : 0
                var quantity = parseFloat(el["Btst"]) + parseFloat(el["SellableQty"])
                var exchHold = el['ExchSeg1'] && el.Nsetsym != "0" ?  el['ExchSeg1'] :  el['ExchSeg2'] 
                // p&l calculation
                el.pnl = parseFloat(el["Price"]) >= 0 ? ((exchHold == "NSE" ? parseFloat(el["LTnse"]) : parseFloat(el["LTbse"])) - parseFloat(el["Price"])) * quantity : 0
                el.pnl = (el.pnl).toFixed(2)

                // Calculate Buy value
                el.buyValue = parseFloat(parseFloat(el["Price"]) * quantity).toFixed(2)

                var ltpHold = exchHold == "NSE"
                    ? parseFloat(el["LTnse"])
                    : parseFloat(el["LTbse"]);

                var buyAvgHold = parseFloat(el["Price"]);
                if (buyAvgHold !== 0) {
                        el["perChg"] =
                            parseFloat(((ltpHold - buyAvgHold) / buyAvgHold) * 100).toFixed(2);
                   
                } else {
                    el["perChg"] = 0;
                }

                // total investment Calculation
                store.state.holdings.totalInvestment = store.state.holdings.totalInvestment + parseFloat(el.buyValue);

                // total currentValue Calculation
                store.state.holdings.totalcurrentValue += (exchHold == "NSE" ? parseFloat(el.LTnse) :
                    parseFloat(el.LTbse)) * quantity;

                // total p&l calculation
                store.state.holdings.totalPnl = store.state.holdings.totalPnl + parseFloat(el.pnl)

                // total p&l change calculation
                store.state.holdings.totalPnlChange = ((store.state.holdings.totalcurrentValue - store.state.holdings.totalInvestment) / store.state.holdings.totalInvestment) * 100  
                
                 // // find sum of Day's P&L
                 if(!!el["previousDayClose"]){
                    store.state.holdings.daysPnl += ((exchHold == "NSE" ? parseFloat(el["LTnse"]) : parseFloat(el["LTbse"])) -
                        parseFloat(el["previousDayClose"])) * quantity;
                    totalPreviousDayClose = totalPreviousDayClose + (parseFloat(el.previousDayClose) * quantity);
                   // // find Day's P&L Change
                   store.state.holdings.daysPnlChange = ((store.state.holdings.totalcurrentValue - totalPreviousDayClose) / totalPreviousDayClose) * 100 
                }
            })
        }


    }
});

export default formula