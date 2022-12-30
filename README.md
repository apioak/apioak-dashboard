<p align="center">
  <img width="150" src="src/assets/img/logo.png">
</p>

<p align="center">
  <a href="https://github.com/apioak/apioak-dashboard">
    <img src="https://img.shields.io/badge/apioak--dashboard-v0.6.0-blue" alt="apioak-dashboard">
  </a>
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.14-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/creativetimofficial/vue-material-dashboard">
    <img src="https://img.shields.io/badge/vue--material--dashboard-1.5.0-brightgreen" alt="vue-material-dashboard">
  </a>
</p>

[简体中文](README_CN.md) | [English](README.md)

## Introduction
`apioak-dashboard` is the control plane of `apioak` gateway, based on <a target="_blank" href="https://github.com/vuejs/vue">Vue</a> and <a target="_blank" href=" https://github.com/creativetimofficial/vue-material-dashboard">Vue Material</a> development, the project cooperates with the back-end project of the control surface <a target="_blank" href="https://github.com /apioak/apioak-admin">apioak-admin</a>.

## Quick start
<a target="_blank" href="https://github.com/apioak/apioak-dashboard">Download code from Github</a>

### Install cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

### Install project dependencies
```
cnpm install
```

### Start the development environment
```
npm run dev
```

### Edit static files in production environment
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Project directory structure
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



