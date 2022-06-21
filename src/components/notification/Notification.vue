<template>
  <div class="notification-container-outer" :class="isHaveInerant ? 'top-20' : 'bottom-20'">
    <transition-group name="notification" tag="div">
      <div
        class="notification-item"
        :class="notification.type"
        v-for="notification in notificationState"
        :key="notification.key"
      >
        <div class="notification-content">
          <div v-if="notification.title" class="notification-title">{{notification.title}}</div>
          <div class="notification-message">{{notification.message}}</div>
          <div class="notification-status">{{notification.status}}</div>
          <div class="notification-status">{{notification.comment}}</div>
        </div>
        <div class="close" @click="$emit('close', notification.key)">×</div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "Notification",
  data() {
    return {
      notificationState: [],
    };
  },

};
</script>

<style scoped>
.notification-container-outer {
  position: fixed;
  z-index: 1080;
  right: 20px;
  width: 384px;
  max-width: calc(100vw - 32px);
  margin-right: 24px;
}

.notification-item {
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff;
  line-height: 1.5;
  position: relative;
  margin-bottom: 16px;
  overflow: hidden;
  border-left: 5px solid #ccc;
  max-height: 150px;
  transition: all 0.3s;
  display: block;
  width: 100%;
  display: flex;
  font-size: 14px;
}

.notification-item.primary {
  border-left-color: #2196f3;
}

.notification-item.danger {
  border-left-color: #EC4C47;
}

.notification-item.success {
  border-left-color: #47B881;
}
.notification-item.info {
  border-left-color: orangered;
}
.notification-content {
  flex: 1;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.notification-title {
  font-weight: bold;
}

.notification-message {
  color: #56585a;
}
.notification-status{
  color: #56585a;
}
.close {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  font-size: 22px;
  color: #888;
  transition: all 0.3s;
}

.close:hover {
  background-color: #ddd;
  color: #222;
}

/* Vue Animations */
.notification-enter {
  opacity: 0;
  transform: translateX(384px);
}

.notification-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.notification-leave-active {
  position: absolute;
}
.top-20{
top: 20px;
}
.bottom-20{
  bottom: 20px;
}
</style>