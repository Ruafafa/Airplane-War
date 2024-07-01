
## 功能介绍


## 项目背景

- 本项目是一个基于 Wails 框架的 Vue.js + Golang 项目，用于学习和实践。

## 项目开发与编译

- [参考文档](https://wails.io/zh-Hans/docs/gettingstarted/development) 

- 开发调试 `wails dev`

- 编译构建 `wails build`

## 项目技术栈 

Vue.js + Phaser3 + Golang + Wails + SQLite

## 目录结构

---
├───backend # Golang 项目 
├───build # 编译生成的文件
│   ├───bin
│   ├───darwin
│   ├───db
│   └───windows
├───frontend # Vue.js 项目
│   ├───dist
│   ├───node_modules
│   ├───src 
│   │   ├───assets # 静态资源
│   │   │   ├───audio
│   │   │   ├───fonts
│   │   │   ├───images
│   │   │   └───spritesheets # 精灵表
│   │   ├───components
│   │   ├───logic
│   │   └───resource
│   └───wailsjs # Wails 框架生成
│       ├───go
│       └───runtime
└───sqlite # SQLite 工具
