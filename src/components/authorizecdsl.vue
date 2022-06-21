<template>
<div class="row  align-center justify-center">
     <div class="d-flex rounded px-4 py-2 ma-6" style="background-color: #e8f4fd;">
            <div>
             <customIcon  :name="'info'" class="mx-1 cursor d-flex" :width="'21'" :height="'21'" :color="$store.state.amogaColor"  />
            </div>
            <div>
              Disclaimer: This is electronic trade slip, which allows us to debit your Demat Holding with stocks approved by you. Through this authorization, you will be able to sell the stocks for delivery. The authorization is valid for one day only. At any point of time you can generate or reset your TPIN using the CDSL link 
              <div>
               <a href=" https://edis.cdslindia.com/home/generatepin" target="_blank" class="text-decoration-none"> https://edis.cdslindia.com/home/generatepin</a> where it will ask for your BOID and PAN. The user can always regenerate the TPIN using the above CDSL link. To change TPIN use the link 
              </div>
              <div>
                <a href="https://edis.cdslindia.com/home/changepin" target="_blank" class="text-decoration-none">https://edis.cdslindia.com/home/changepin</a>
              </div>

            </div>

          </div>
  <div class=" d-flex align-center justify-center" v-if="pludgeDpId">
        <form :action="pludgeUrl" name="frmDIS" id="contact-form" method="post" class="d-flex align-center justify-center">
    <input type="hidden" id="DPId" name="DPId" :value="pludgeDpId" />
    <input type="hidden" id="ReqId" name="ReqId" :value="pludgeReqId" />
    <input type="hidden" id="Version" name="Version" :value="pludgeVersion" />
    <input type="hidden" id="TransDtls" name="TransDtls" :value="pludgeTransId" />
    <input type="submit" value="Continue to CDSL" class="mr-2  white--text fsize14 rounded" style="padding: 6px 8px;background-color: #2196f3;font-size: 14px; color: white;border-radius: 4px; border: solid">
  </form>
  </div>
</div>
</template>
<script>
import customIcon from '../components/customIcon.vue'
export default {
    data(){
        return {
            pludgeUrl: '',
            pludgeDpId: '',
            pludgeVersion: '',
            pludgeTransId: '',
            pludgeReqId: ''
        }
    },
    components:{
        customIcon
    },
    mounted(){
        var checkData = JSON.parse(localStorage.getItem('pludgeData'))
        if(checkData){
        this.pludgeDpId = checkData.dpId
        this.pludgeUrl = checkData.url
        this.pludgeVersion = checkData.version
        this.pludgeTransId = checkData.transDtls
        this.pludgeReqId = checkData.reqId         
        }
    }
}
</script>
<style>

</style>
