<p align="center">
  <img width="150" src="src/assets/img/logo.png">
</p>

<p align="center">

  <a href="https://github.com/apioak/apioak-dashboard">
    <img src="https://img.shields.io/badge/Apioak--Dashboard-Master-blue" alt="Apioak-Dashboard">
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
</p>

[简体中文](README_CN.md) | [English](README.md)

## Introduction
`apioak-dashboard` is the control plane of `apioak` gateway, based on <a target="_blank" href="https://github.com/vuejs/vue">Vue 3.x</a> 、<a target="_blank" href="https://antdv.com/components/overview">ant-design-vue 3.x</a>、<a target="_blank" href="https://github.com/npm/cli">npm 6.14.13</a>  development, the project cooperates with the back-end project of the control surface <a target="_blank" href="https://github.com /apioak/apioak-admin">apioak-admin</a>.

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
npm run serve
```

### Edit static files in production environment
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Project directory structure
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



