<template>
  <div class="page-wrapper clearfix">
    <div class="page-info fl">
      <span class="item-count h50">
        总共
        <span>{{ totals }}</span
        >条，
      </span>
      <span class="h50">
        <span>{{ totalPages }}</span
        >页
      </span>
    </div>
    <div class="page-tab fl clearfix">
      <button
        class="fl h50 cursor"
        :class="{ canNot: currentPage == 1 }"
        @click="firstPage"
        :disabled="preDisabled"
      >
        首页
      </button>
      <button
        class="fl h50 cursor"
        :class="{ canNot: currentPage == 1 }"
        @click="prePage"
        :disabled="preDisabled"
      >
        上一页
      </button>
      <ul class="fl">
        <li
          v-for="(item, index) in itemArr"
          :key="index"
          class="cursor"
          @click="changePage(item)"
          :class="{ activePage: currentPage === item }"
        >
          {{ item }}
        </li>
      </ul>
      <button
        class="fl h50 cursor"
        @click="nextPage"
        :class="{ canNot: currentPage == totalPages }"
        :disabled="nextDisabled"
      >
        下一页
      </button>
      <button
        class="fl h50 cursor"
        :class="{ canNot: currentPage == totalPages }"
        :disabled="nextDisabled"
        @click="lastPage"
      >
        尾页
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Pager",
  props: {
    pageSize: {
      // 每页显示数量
      default: 10,
      type: Number,
    },
    currentPages: {
      // 每页显示数量
      default: 1,
      type: Number,
    },
    totals: {
      // 总数
      default: 0,
      type: Number,
    },
    tab: {
      type: Boolean,
      default: false,
    },
    pageSizeSettings: {
      // 配置下拉 选pageSize
      type: Array,
      default() {
        return [10, 20, 50, 100];
      },
    },
  },
  data() {
    return {
      itemsShow: false, // 控制每页条数下拉框
      itemArr: [], // 显示页数,
      nextDisabled: null,
      preDisabled: "disabled",
      totalPages: 1, // 默认页数
      currentPage: this.currentPages,
      size: this.pageSize, // 获取每页数量
    };
  },
  computed: {
    pageNum() {
      // 由于父组件传递过来的属性 子组件的钩子里面不能直接使用 用计算属性代替接收
      let a = this.pageSize;
      return a;
    },
    pageItems() {
      let b = this.totals;
      return b;
    },
  },
  created() {
    this.pages();
  },
  methods: {
    chooseNum(item) {
      // 改变pageSize
      this.itemsShow = false;
      this.$emit("size-change", {
        pageSize: item,
      });
    },
    handleChooseNumClick() {
      this.itemsShow = !this.itemsShow;
    },
    blur() {
      var that = this;
      setTimeout(function () {
        that.itemsShow = false;
      }, 200);
    },
    changePage(page) {
      // 切换页数
      this.currentPage = page;
      this.pages();
    },
    nextPage() {
      // 下一页
      if (this.currentPage <= this.totalPages - 1) {
        this.currentPage++;
      }
    },
    prePage() {
      // 上一页
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    firstPage() {
      // 首页
      this.currentPage = 1;
    },
    lastPage() {
      // 尾页
      this.currentPage = this.totalPages;
    },
    pages() {
      // 页数改变的逻辑
      this.itemArr = []; // 每次改变得清空数组
      this.totalPages = Math.ceil(this.pageItems / this.pageNum);
      this.preDisabled = this.currentPage === 1 ? "disabled" : null;
      this.nextDisabled =
        this.currentPage === this.totalPages ? "disabled" : null;
      let start = this.currentPage - 2 > 1 ? this.currentPage - 2 : 1;
      let end =
        this.currentPage > 3
          ? this.totalPages - this.currentPage >= 2
            ? this.currentPage + 2
            : this.totalPages
          : 5;
      start = this.totalPages - this.currentPage >= 2 ? start : end - 4;
      if (this.totalPages <= 5) {
        start = 1;
        end = this.totalPages;
      }
      for (let i = start; i <= end; i++) {
        this.itemArr.push(i);
      }
    },
  },
  watch: {
    pageNum() {
      // 每页数量变化后传递出 pageSize 重新请求数据
      this.currentPage = 1; // 改变每页数据 页码回到初始值
      this.pages();
      this.$emit("size-change", {
        pageSize: this.pageNum,
      });
    },
    currentPage() {
      // 当前页数变化后 传递出当前页码 重新请求数据
      this.pages();
      this.$emit("current-change", {
        pageSize: this.pageNum,
        currentPage: this.currentPage,
      });
    },
    totals() {
      // 数据是异步加载的 组件刚开始totals是默认的是渲染不了的
      this.pages();
    },
    tab() {
      // 点击切换条件筛选 重置currentPage
      this.currentPage = 1;
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}

ul,
li {
  list-style: none;
}

.clearfix:after {
  content: ".";
  height: 0;
  display: block;
  visibility: hidden;
  clear: both;
  overflow: hidden;
}

.cursor {
  cursor: pointer;
}

.clearfix {
  zoom: 1;
}

.page-wrapper .fl {
  float: left;
}
.page-wrapper {
  font-size: 14px;
  color: #5e6470;
  float: right;
  margin: 15px 0;
}
.h50 {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  padding: 0 12px;
  border: 1px solid #eaedf1;
}

.page-wrapper .page-tab li {
  float: left;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border: 1px solid #eaedf1;
  box-sizing: border-box;
}

.page-wrapper .page-info {
  margin-right: 6px;
}

.page-wrapper .page-info .h50 {
  border: none;
  padding: 0;
}

.items-choose .h50 {
  border: none 0;
  border-top: 1px solid #eaedf1;
  border-bottom: 1px solid #eaedf1;
  box-sizing: border-box;
  padding: 0 6px;
}

.items-choose .items-show {
  height: 30px;
  width: 74px;
  position: relative;
  box-sizing: border-box;
  border: 1px solid #eaedf1;
}
.items-choose .items-show input {
  height: 100%;
  width: 100%;
  text-align: center;
}
.items-choose .items-show:after {
  content: "";
  position: absolute;
  height: 0;
  border: 4px solid transparent;
  border-top: 6px solid #c4ccc5;
  top: 50%;
  right: 10px;
  transform: translate3d(-50, -50, 0);
  cursor: pointer;
}

.items-choose .items-num {
  width: 100%;
  position: absolute;
  bottom: 42px;
  border: 1px solid #eaedf1;
  background: #f5f7fa;
  z-index: 999;
}

.items-choose .items-num li {
  padding: 10px 0 10px 6px;
  font-size: 14px;
}

.items-choose .items-num li:hover {
  /*background: #1AB394;*/
  background: #4caf50;
  color: #fff;
}

.page-wrapper .activePage {
  color: #fff;
  /*background: #1AB394;*/
  background: #2979ff;
}

.canNot {
  cursor: not-allowed;
}

.page-wrapper button {
  background: #fff;
  font-size: 14px;
  color: #5e6470;
}
.chooseNum {
  cursor: pointer;
  font-size: 14px;
  color: #5e6470;
}
</style>
