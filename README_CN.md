<p align="center">
  <img width="150" src="src/assets/img/logo.png">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.14-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/creativetimofficial/vue-material-dashboard">
    <img src="https://img.shields.io/badge/vue--material--dashboard-1.5.0-brightgreen" alt="vue-material-dashboard">
  </a>
  <a href="https://github.com/apioak/apioak-dashboard">
    <img src="https://img.shields.io/badge/apioak--dashboard-v0.6.0-blue" alt="apioak-dashboard">
  </a>
</p>

[简体中文](README_CN.md) | [English](README.md)

## 简介
`apioak-dashboard` 是`apioak`网关的控制面，基于 <a target="_blank" href="https://github.com/vuejs/vue">Vue</a> 和 <a target="_blank" href="https://github.com/creativetimofficial/vue-material-dashboard">Vue Material</a> 开发，项目配合控制面的后端项目 <a target="_blank" href="https://github.com/apioak/apioak-admin">apioak-admin</a> 一起使用。

## 快速开始
<a target="_blank" href="https://github.com/apioak/apioak-dashboard"> 从 Github 下载代码</a>

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
npm run dev
```

### 生产环境编辑静态文件
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 项目目录结构
```
apioak-dashboard/
├── public
└── src
    ├── api
    ├── assets
    │   ├── font
    │   ├── img
    │   │   └── faces
    │   └── scss
    │       └── md
    │           ├── mixins
    │           └── plugins
    ├── components
    │   ├── Cards
    │   ├── Common
    │   ├── Dialog
    │   ├── NotificationPlugin
    │   ├── SidebarPlugin
    │   └── Tables
    ├── filters
    ├── libs
    ├── pages
    │   ├── Certificate
    │   ├── Layout
    │   ├── PlugIn
    │   ├── Router
    │   └── Service
    ├── routes
    └── store
```



