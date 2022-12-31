<template>
  <ul class="nav nav-mobile-menu">
    <li>
      <a href="#" data-toggle="dropdown" class="dropdown-toggle"
        ><i class="material-icons">person</i>
        <p @click="logout">退出</p></a
      >
    </li>
  </ul>
</template>
<script>
import ApiUser from "../../api/ApiUser";

export default {
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
