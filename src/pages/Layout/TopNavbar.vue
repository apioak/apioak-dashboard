<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <md-list>
            <li class="md-list-item">
              <a
                href="javascript:void(0);"
                class="
                  md-list-item-router md-list-item-container md-button-clean
                  dropdown
                "
              >
                <div class="md-list-item-content">
                  <drop-down>
                    <md-button
                      slot="title"
                      class="md-button md-just-icon md-simple"
                      data-toggle="dropdown"
                    >
                      <md-icon>person</md-icon>
                      <p class="hidden-lg hidden-md">Profile</p>
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <li><a href="#" @click="logout">退出</a></li>
                    </ul>
                  </drop-down>
                </div>
              </a>
            </li>
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
import ApiUser from "../../api/ApiUser";

export default {
  data() {
    return {
      selectedEmployee: null,
    };
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    logout: function () {
      ApiUser.logout().then((res) => {
        if (res.code === 0) {
          this.$store.commit("setToken", "");
          this.$router.push({ name: "Login" });
        } else {
          this.$notify({ message: res.msg });
        }
      });
    },
  },
};
</script>

<style lang="css"></style>
