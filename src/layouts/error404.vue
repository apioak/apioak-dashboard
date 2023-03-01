<template>
  <div class="content">
    <div class="img-logo-err">
      <div class="logo"></div>
      <div class="err-text">出错啦，页面未找到。。。</div>
    </div>
  </div>
</template>

<style lange="scss" scoped>
.content {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #cecece;
  justify-content: center;
  align-items: center;
}
.img-logo-err {
  width: 400px;
  height: 300px;
  justify-content: center;
  align-items: center;
}
.logo {
  height: 200px;
  width: 400px;
  background: url('../assets/img/apioak-logo-err-404.png') no-repeat;
  background-size: 400px 200px;
}
.err-text {
  width: 400px;
  height: 100px;
  align-content: center;
  color: #fff;
  font-size: 33px;
}
</style>
