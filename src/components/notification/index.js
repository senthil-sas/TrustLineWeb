import Notification from "./Notification";
import Vue from "vue";
import store from "../../store"

//Track all instances of notifications currently open
let notificationState = [];

//Set default values
const durationDefault = 4500;
const typeDefault = "primary";

//Create a component container for the notification to bind to
const notificationContainer = document.createElement("div");
notificationContainer.id = "notification-container";
document.body.appendChild(notificationContainer);

//Extend the notification SFC as a class and mount it to the container
const ComponentClass = Vue.extend(Notification);
var notificationInstance = new ComponentClass({
  data: { notificationState },
  computed: {
    isHaveInerant: {
      get(){
        return store.state.isHaveInternet
      },
      set(){

      }
    }
  }
});
notificationInstance.$mount("#notification-container").$on("close", key => {
  closeNotification(key);
});

//Create a new notification
function newNotification(args) {
  if (typeof args === "string") {
    args = {
      message: args,
      status: args,
      comment: args
    };
  }
  args.key = args.key || new Date().getTime();
  args.duration = args.duration || durationDefault;
  args.type = args.type || typeDefault;
  args._timer = setTimer(args.key, args.duration);
  
  notificationState.push(args);
}

//Set a timer to kill the notification after the specified duration
function setTimer(key, duration) {
  return setTimeout(() => {
    closeNotification(key);
  }, duration);
}

//Remove the notification from state
function closeNotification(key) {
  let i = notificationState.findIndex(n => key === n.key);
  clearTimeout(notificationState[i]._timer);
  notificationState.splice(i, 1);
}

const api = {
  open: newNotification,
  close: closeNotification,
  getState: () => {
    return notificationState;
  }
};
export default api;
