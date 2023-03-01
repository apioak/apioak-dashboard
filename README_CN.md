<p align="center">
  <img width="150" src="src/assets/img/logo.png">
</p>

<p align="center">

  <a href="https://github.com/apioak/apioak-dashboard">
    <img src="https://img.shields.io/badge/apioak--dashboard-v0.6.1-blue" alt="apioak-dashboard">
  </a>

  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-3.2.13-brightgreen" alt="vue">
  </a>

  <a href="https://github.com/vueComponent/ant-design-vue">
    <img src="https://img.shields.io/badge/ant--design--vue-3.2.14-brightgreen" alt="ant-design-vue">
  </a>

  <a href="https://www.npmjs.com/package/vue">
    <img src="https://img.shields.io/badge/npm-6.14.13-blue" alt="npm">
  </a>

  <a href="https://github.com/nodejs/release">
    <img src="https://img.shields.io/badge/node-v14.17.0-brightgreen" alt="node">
  </a>
  
</p>

[简体中文](README_CN.md) | [English](README.md)

## 简介
`apioak-dashboard` 是`apioak`网关的控制面，基于 <a target="_blank" href="https://github.com/vuejs/vue">Vue 3.x</a>、<a target="_blank" href="https://antdv.com/components/overview">ant-design-vue 3.x</a>、<a target="_blank" href="https://github.com/npm/cli">npm 6.14.13</a> 开发，项目配合控制面的后端项目 <a target="_blank" href="https://github.com/apioak/apioak-admin">apioak-admin</a> 一起使用。

## 快速开始
<a target="_blank" href="https://gitee.com/apioak/apioak-dashboard"> 从 Gitee 下载代码</a>

### 安装cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

### 安装项目依赖
```
cnpm install
```

### 开发环境启动项目
```
npm run serve
```

### 生产环境编辑静态文件
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 项目目录结构
```
apioak-dashboard
├── public
└── src
    ├── api
    ├── assets
    │   ├── css
    │   ├── font
    │   └── img
    ├── components
    ├── hooks
    ├── layouts
    ├── router
    ├── schema
    │    └── plugins
    ├── store
    │   └── modules
    ├── utils
    └── views
        ├── plugin
        │   └── components
        ├── router
        ├── services
        ├── ssl
        ├── upstream
        └── user
```



