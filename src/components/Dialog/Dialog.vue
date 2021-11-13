<template>
  <div>
    <!-- 删除确认弹框 -->
    <md-dialog-confirm
      :md-active.sync="isShowMessageBox"
      :md-title="title"
      :md-content="content"
      md-confirm-text="同意"
      md-cancel-text="取消"
      @md-cancel="cancel"
      @md-confirm="confirm"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "",
      content: "",
      isShowMessageBox: false,
      resolve: "",
      reject: "",
      promise: "", // 保存promise对象
    };
  },
  methods: {
    close(state) {
      this.model.show = false;
      if (this.model.callback) {
        this.model.callback(state);
      }
    },
    // 确定,将promise断定为resolve状态
    confirm: function () {
      this.isShowMessageBox = false;
      if (this.isShowInput) {
        this.resolve(this.inputValue);
      } else {
        this.resolve("confirm");
      }
      this.remove();
    },
    // 取消,将promise断定为reject状态
    cancel: function () {
      this.isShowMessageBox = false;
      this.reject("cancel");
      this.remove();
    },
    // 弹出messageBox,并创建promise对象
    modal: function () {
      this.isShowMessageBox = true;
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
      // 返回promise对象
      return this.promise;
    },
    remove: function () {
      setTimeout(() => {
        this.destroy();
      }, 300);
    },
    destroy: function () {
      this.$destroy();
      document.body.removeChild(this.$el);
    },
  },
};
</script>
<style lang="scss"></style>
