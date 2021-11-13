import Notifications from "./Notifications.vue";

const NotificationStore = {
  state: [], // here the notifications will be added

  initParams: {
    icon: "add_alert",
    horizontalAlign: "center",
    verticalAlign: "top",
    type: "danger",
  },

  removeNotification(timestamp) {
    const indexToDelete = this.state.findIndex(
      (n) => n.timestamp === timestamp
    );
    if (indexToDelete !== -1) {
      this.state.splice(indexToDelete, 1);
    }
  },
  addNotification(notification) {
    notification.timestamp = new Date();
    notification.timestamp.setMilliseconds(
      notification.timestamp.getMilliseconds() + this.state.length
    );
    this.state.push(notification);
  },
  notify(notification) {
    let notifyParams = {};
    if (Array.isArray(notification)) {
      notification.forEach((notificationInstance) => {
        this.addNotification(notificationInstance);
      });
    } else {
      Object.assign(notifyParams, this.initParams, notification);
      this.addNotification(notifyParams);
    }
  },
};

var NotificationsPlugin = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          notificationStore: NotificationStore,
        };
      },
      methods: {
        notify(notification) {
          this.notificationStore.notify(notification);
        },
      },
    });
    Object.defineProperty(Vue.prototype, "$notify", {
      get() {
        return this.$root.notify;
      },
    });
    Object.defineProperty(Vue.prototype, "$notifications", {
      get() {
        return this.$root.notificationStore;
      },
    });
    Vue.component("Notifications", Notifications);
  },
};

export default NotificationsPlugin;
