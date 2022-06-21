<template>
  <v-bottom-sheet v-model="bottomSheet" >
      <v-card
      min-height="50vh">
        <ul v-if="page" class="bottomSheetUl">
            <!-- market Watch  -->
            <li class="bottomSheetList" v-if="page == 'MkWatch'" @click="sendToParent('buy')"> Buy</li>
            <li class="bottomSheetList" v-if="page == 'MkWatch'" @click="sendToParent('sell')"> Sell</li>
            <li class="bottomSheetList" v-if="page == 'MkWatch'" @click="sendToParent('chart')">Chart</li>
            <li class="bottomSheetList" v-if="page == 'MkWatch'" @click="sendToParent('depth')">Market Depth</li>
            <li class="bottomSheetList" v-if="page == 'MkWatch'" @click="sendToParent('del')">Delete</li>
            <li class="bottomSheetList" v-if="page == 'MkWatch'" @click="sendToParent('Alert')">Alert</li>

            <!-- Orders  -->
            <li class="bottomSheetList" v-if="page == 'Order' && this.currentData[0]['tab'] == 'Pending' " @click="sendToParent('modify')"> Modify</li>
            <li class="bottomSheetList" v-if="page == 'Order' && this.currentData[0]['tab'] !== 'Pending' " @click="sendToParent('buy')"> Buy</li>
            <li class="bottomSheetList" v-if="page == 'Order' && this.currentData[0]['tab'] !== 'Pending'" @click="sendToParent('sell')"> Sell</li>
            <li class="bottomSheetList" v-if="page == 'Order' && this.currentData[0]['tab'] == 'Pending'" @click="sendToParent('cancel')">Cancel</li>
            <li class="bottomSheetList" v-if="page == 'Order'" @click="sendToParent('chart')">Chart</li>
            <!-- Positions  -->
            <li class="bottomSheetList" v-if="page == 'Position' && this.currentData[0]['item']['Netqty'] != '0'" @click="sendToParent('Add')"> Add</li>
            <li class="bottomSheetList" v-if="page == 'Position' && this.currentData[0]['item']['Netqty'] != '0'" @click="sendToParent('Exit')"> Exit</li>
            <li class="bottomSheetList" v-if="page == 'Position' && this.currentData[0]['item']['Netqty'] == '0'" @click="sendToParent('buy')"> Buy</li>
            <li class="bottomSheetList" v-if="page == 'Position' && this.currentData[0]['item']['Netqty'] == '0'" @click="sendToParent('sell')"> Sell</li>
            <li class="bottomSheetList" v-if="page == 'Position' && this.currentData[0]['item']['Netqty'] != '0' && this.currentData[0]['item']['Pcode'] != 'CO' && this.currentData[0]['item']['Pcode'] != 'BO'" @click="sendToParent('Convert')">Convert</li>
            <li class="bottomSheetList" v-if="page == 'Position' && this.currentData[0]['item']['Netqty'] != '0' && this.currentData[0]['item']['Pcode'] != 'CO' && this.currentData[0]['item']['Pcode'] != 'BO'" @click="sendToParent('squareOff')">Exit Position</li>
            <li class="bottomSheetList" v-if="page == 'Position'" @click="sendToParent('chart')"> Chart</li>
            <!-- Holdings  -->
             <li class="bottomSheetList" v-if="page == 'Holdings'" @click="sendToParent('Add')"> Add</li>
            <li class="bottomSheetList" v-if="page == 'Holdings' " @click="sendToParent('Exit')"> Exit</li>
            <li class="bottomSheetList" v-if="page == 'Holdings'" @click="sendToParent('chart')"> Chart</li>

        </ul>
      </v-card>
    </v-bottom-sheet>
</template>

<script>
export default {

    data(){
        return{
            bottomSheet: false,
            page:''
        }
    },
      props:{
    currentData: Array
  },
    methods:{
        sendToParent(action){
            this.bottomSheet = false
            var temp = {
                action: action,
                page: this.page,
                item: this.currentData[0]['item']
            }
        this.$emit('from-child', temp)
        }
    },
    mounted(){

    },
    watch:{
        currentData: function(val){
            this.bottomSheet = val[0].isOpen
            this.page = val[0]['where']
        }
    }
}
</script>

<style>
.bottomSheetUl {
    list-style: none !important;
    padding: 0px !important;
}
.bottomSheetList {
    height: 60px; 
    border-bottom: solid 1px #ededed;
    padding: 16px;
    display: flex;
    align-items: center;
}
</style>