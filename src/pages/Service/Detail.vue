<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <list-header :sidebar-item-color="sidebarBackground" icon="icon-fuwuqi" :title="serviceId" title_href="ServiceDetail"/>
          <md-card-content>
            <div class="service_tab md-gutter">
              <a class="tab_active" href="javascript:void(0);">服务详情</a>
              <router-link
                :to="{
                  name: 'ServiceRoute',
                  params: { service_id: serviceId },
                }"
                >路由列表</router-link
              >
            </div>
          </md-card-content>
        </md-card>
        <md-card>
          <md-card-content>
            <ServiceModify :serviceId="serviceId" :advanced="true"/>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceModify from "./Modify";
import ListHeader from "../../components/Common/ListHeader";
import Drawer from "../../components/Common/Drawer";
import Pager from "../../components/Common/Pager";
export default {
  name: "Detail",
  components: {
    ServiceModify,
    ListHeader,
  },
  data() {
    return {
      sidebarBackground: "blue",
      serviceId: "",
    };
  },
  created() {
    this.getRouteParams();
  },
  methods: {
    //获取路由传参数据
    getRouteParams() {
      let params = this.$route.params;
      let name = this.$route.name;
      if (Object.keys(params).length === 0) {
        params = this.$store.state.routerParams[name];
      } else {
        this.$store.commit("setRouterParams", { name: name, params: params });
      }
      this.serviceId = params.service_id;
    },
  },
};
</script>

<style lang="scss" scoped>
.service_tab {
  width: 100%;
  border-bottom: 1px solid #c8c8c8;
  //margin-bottom: 0px;
  a {
    color: #c8c8c8 !important;
    font-size: 16px;
    display: inline-block;
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  a.tab_active,
  a:hover {
    color: #1e88e5 !important;
    border-bottom: 2px solid #1e88e5;
  }
}
</style>
