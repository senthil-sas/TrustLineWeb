import router from '@/router'
import store from '@/store'
import Vue  from 'vue';
const errorHandling = new Vue({
    data(){
        return{
            nState: null,
        };
    },
    methods:{
        openNotification(options) {
            this.$notification.open(options);
            this.nState = JSON.stringify(options, null, 2);
          },
          errLog(msg) {
            if (msg.response.status >= 400 && msg.response.status < 500 && store.state.counter == 0) {
                 this.toaster('' , "danger" , msg.response.data, 3000) 
                 store.commit('setCounterIncrease',1) 
                this.localClear()
            } else if (msg.response.status >= 500) {
                this.toaster('' , "danger" , 'Something went wrong. Please try after sometime... ', 3000)
            }

        },
        localClear() {
                  
            store.commit('orderWindow/setOrderWindow', false);
            store.commit('order/setMultipleCancelDialog',false);
            store.commit('order/setSingleCancelDialog',false);
            store.commit('marketWatch/setAlertDialog',false);
            store.commit('position/setPositionExitDialog',false)

            // for reset Dialog connect with Service 
            store.commit('wsConnection/SetIsLogout' , true)
            store.commit('wsConnectionTr/SetIsLogout' , true)
            store.dispatch('wsConnection/websocketClose') 
            store.dispatch('wsConnectionTr/websocketClose')
            store.commit('wsConnection/setIsConnect', false)
            store.commit('wsConnection/setIsValidSession', false)
            store.commit('wsConnection/setPreviousSubsription', '')
            store.commit('wsConnection/setPreDepthSubsription', '')


             // for Orderwindow 
             store.commit('orderWindow/setOrderTab' , 0)
             store.commit('orderWindow/setProdType', 'MIS')
             store.commit('orderWindow/setPriceType', 'L')
             store.commit('orderWindow/setValidityType', 'DAY')

             var userId = JSON.parse(localStorage.getItem("currentUser"));
            localStorage.clear();
            localStorage.setItem('currentUser', JSON.stringify(userId))
            let userfetch = {
                userId: userId,
              }

            store.commit('authtication/setWhichStep' , 'userId')
           !!userId ? store.dispatch('authtication/getUserId',userfetch) : ''
            store.state.ssoQuery == '' ?  router.push('/').catch(() => { }) : ''
        },
        sessionExpire(){
            if(store.state.sessionCounter == 0){
             store.commit('setSessionCounter',1) 
           this.toaster('' , "danger" , 'Session Expired...', 3000)
            this.localClear();
        }
        },
        toaster(title, type, values,duration){
            if(title == ""){
                this.openNotification({
                    type: type,
                    message: values,
                    duration: duration,
                });
            }else{
                this.openNotification({
                    title: title,
                    type: type,
                    message: values,
                    duration: duration,
                });
            }
            
        },
        passData(amount, recipt_Id, resp){
            let json = {
                amount: amount,
                currency: "INR",
                receipt: recipt_Id,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              }
        store.dispatch('funds/checkVerifyPayment', json)
        }
    }
});

export default errorHandling