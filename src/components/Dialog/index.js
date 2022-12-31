import DialogVue from "./Dialog.vue";
// 定义插件对象
const DialogBox = {};
// vue的install方法，用于定义vue插件
DialogBox.install = function (Vue, options) {
  const DialogBoxInstance = Vue.extend(DialogVue);
  let currentMsg;
  const initInstance = () => {
    // 实例化vue实例
    currentMsg = new DialogBoxInstance();
    let msgBoxEl = currentMsg.$mount().$el;
    document.body.appendChild(msgBoxEl);
  };
  // 在Vue的原型上添加实例方法，以全局调用
  Vue.prototype.$dialog = {
    modal(options) {
      if (!currentMsg) {
        initInstance();
      }
      if (typeof options === "string") {
        currentMsg.content = options;
      } else if (typeof options === "object") {
        Object.assign(currentMsg, options);
      }
      return currentMsg
        .modal()
        .then((val) => {
          currentMsg = null;
          return Promise.resolve(val);
        })
        .catch((err) => {
          currentMsg = null;
          return Promise.reject(err);
        });
    },
  };
};
export default DialogBox;
