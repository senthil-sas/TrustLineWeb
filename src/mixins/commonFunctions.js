import { mapActions, mapState, mapGetters } from "vuex";
export default {
    data () { return {} },
    computed: {
        ...mapState("orderWindow", ['allPriceItems', 'postionPriceItems', 'eqProductItems','allProductItems'])
    },
    methods: {
        /***
         * @author senthil
         * @function method to change number as rupess format
         * @date 02-12-2021
         */
        ruppesFormat (num) {
            var n1, n2;
            num = num + "" || "";
            // works for integer and floating as well
            n1 = num.split(".");
            n2 = n1[1] || null;
            n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            num = n2 ? n1 + "." + n2 : n1;
            return num;
        },

        formatNum (value) {
            return !!value && value != 'NA' ? value.replace(/,/g, "") : value
        },
        /***
         * @author senthil
         * @function method to download table in csv format
         * @date 21-12-2021
         */
        downloadCsv (page,data) {
            if (data.length != 0) {
                var html = document.getElementById("tableData").outerHTML;
                this.expoertToCsv(html, `${page}.csv`);
            }
        },
        /***
         * @author senthil
         * @function method to download table in csv format
         * @date 21-12-2021
         */
        expoertToCsv (html, filename) {
            var csv = [];
            var rows = document.querySelectorAll(".tableRow");
            for (var i = 0; i < rows.length; i++) {
                var row = [],
                cols = rows[i].querySelectorAll(".tableContent, .tableHeader");
                for (var j = 0; j < cols.length; j++) row.push("\"" + cols[j].innerText + "\"");
                csv.push(row.join(","));
            }
            // Download CSV
            this.download_csv(csv.join("\n"), filename);
        },
        /***
         * @author senthil
         * @function method to download table in csv format
         * @date 21-12-2021
         */
        download_csv (csv, filename) {
            var csvFile;
            var downloadLink;
            // CSV FILE
            csvFile = new Blob([csv], { type: "text/csv" });
            // Download link
            downloadLink = document.createElement("a");
            // File name
            downloadLink.download = filename;
            // We have to create a link to the file
            downloadLink.href = window.URL.createObjectURL(csvFile);
            // Make sure that the link is not displayed
            downloadLink.style.display = "none";
            // Add the link to your DOM
            document.body.appendChild(downloadLink);
            // Lanzamos
            downloadLink.click();
        },

        convertLacs(volume , AvgPrice){
            if(volume && AvgPrice && volume != "NA" && AvgPrice != "NA"){
                var multipl = (volume).toString().replaceAll(",", "") * (AvgPrice).toString().replaceAll(",", "")
                var val = Math.abs(multipl)
                if (val >= 10000000) {
                  val = (val / 10000000).toFixed(2) + ' Cr';
                } else if (val >= 100000) {
                  val = (val / 100000).toFixed(2) + ' Lac';
                }
                
                return this.ruppesFormat(val)
            }else{
                return 'NA'
            }
        },

           /***
         * @author Bharath
         * @method Export Table to CSV File Using Json Array
         * @since 22/04/22
        **/ 
            checkDownload(fileName, page, value) {
                const modifyData = []
                if (page == 'orders') {
                    var tableHead;
                    fileName == 'Executed' ?   tableHead = {
                        Time: '',
                        Type: '',
                        Instrument: '',
                        Product: '',
                        Qty : '',
                        Price: '',
                        Status : ''
                    }  : fileName == 'Trade Book' ? tableHead = {
                        Time: '',
                        Type: '',
                        Instrument: '',
                        Product: '',
                        Qty : '',
                        Price: '',
                    } : tableHead = {
                        Time: '',
                        Type: '',
                        Instrument: '',
                        Product: '',
                        Qty : '',
                        LTP : '',
                        Price: '',
                        Status : ''
                    }
    
                    for (let item of value) {
           
                        var price
                        if(fileName !== 'Trade Book') {
                            var tempPrice = item.Exchange == "CDS" || item.Exchange == "BCD" ? parseFloat(item.Prc).toFixed(4) : parseFloat(item.Prc).toFixed(2)
                            var TriggerPrice = item.Exchange == "CDS" || item.Exchange == "BCD" ? parseFloat(item.Trgprc).toFixed(4) : parseFloat(item.Trgprc).toFixed(2)
                            price = TriggerPrice > 0 ? tempPrice + " / " + TriggerPrice + ' trg' : tempPrice
                        }
                        fileName == 'Executed' ?   tableHead = {
                            Time: item.OrderedTime.split(" ")[1],
                            Type: item.Trantype == "B" ? "BUY" : "SELL",
                            Instrument: item.formatScripName == null ? item.Trsym : item.formatScripName + " " + item.Exchange,
                            Product: item.Pcode,
                            Qty : item["Fillshares"] + " / " + item["Qty"],
                            Price: price,
                            Status : item.Status
                        }  : fileName == 'Trade Book' ? tableHead = {
                            Time: item.Time.split(" ")[1],
                            Type: item.Trantype == "B" ? "BUY" : "SELL",
                            Instrument: item.formatScripName == null ? item.Trsym : item.formatScripName  + " " + item.Exchange,
                            Product: item.Pcode,
                            Qty : item["Qty"],
                            Price: item.Exchange == "CDS" || item.Exchange == "BCD" ? parseFloat(item.Price).toFixed(4)  : parseFloat(item.Price).toFixed(2),
                        } : tableHead = {
                            Time: item.OrderedTime.split(" ")[1],
                            Type: item.Trantype == "B" ? "BUY" : "SELL",
                            Instrument: item.formatScripName == null ? item.Trsym : item.formatScripName  + " " + item.Exchange,
                            Product: item.Pcode,
                            Qty : item["Fillshares"] + " / " + item["Qty"],
                            LTP : !isNaN(item.ltp) ? ' ' :  item.Exchange == "CDS" || item.Exchange == "BCD" ? parseFloat(item.ltp).toFixed(4) : parseFloat(item.ltp).toFixed(2) ,
                            Price:  price,
                            Status : item.Status
                        }
                        modifyData.push(tableHead)
                    }
                }
        
                // get keys as array
                const keys = Object.keys(modifyData[0]);
                
                const commaSeparatedString = [keys.join(",") , modifyData.map(row => keys.map(key => row[key]).join(",")).join("\n")].join("\n")
            
                const csvBlob = new Blob([commaSeparatedString])
            
                const a2 = document.getElementById("a2")
    
                var tempFileName = fileName != 'Trade Book' ? fileName + '-orders.csv' : fileName + '.csv'
                a2.download = tempFileName
                a2.href = URL.createObjectURL(csvBlob)
    
            },
        

            callTrandingViewChart(item, where) {
                let temp ={
                    data: item,
                    where: where
                }
                this.$store.commit("setChartData", temp);
                this.$router.currentRoute.path == "/chart" ? this.$root.$refs.TVChartContainer.refresh(temp): this.$router.push("/chart").catch(() => {});
              },
    },
};