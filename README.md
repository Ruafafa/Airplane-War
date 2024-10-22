<h1 align="center"> Airplane War </h1>
<p align="center"> --- 飞机大战单机版 ---</p>

---
## 程序演示
游玩下载见 [release](https://github.com/Ruafafa/Airplane-War/releases/tag/windows)

<p>
    <img src="https://ruafafa-photobed.oss-cn-beijing.aliyuncs.com/202407020133081.png" width="100px"/> 图1
    <img src="https://ruafafa-photobed.oss-cn-beijing.aliyuncs.com/202407020134378.png" width="100px"/> 图2
    <img src="https://ruafafa-photobed.oss-cn-beijing.aliyuncs.com/202407020144760.png" width="100px"/> 图3
    <img src="https://ruafafa-photobed.oss-cn-beijing.aliyuncs.com/202407020144092.png" width="100px"/> 图4
    <img src="https://ruafafa-photobed.oss-cn-beijing.aliyuncs.com/202407020144902.png" width="100px"/> 图5
    <img src="https://ruafafa-photobed.oss-cn-beijing.aliyuncs.com/202407020149755.png" width="100px"/> 图6
</p>

##  操作说明
`WASD` - 控制移动
`Shift` - 加速移动
`Esc` - 局内暂停
`F` - 释放炸弹
`空格键` - 释放大招

## 背景介绍

### 问题描述：设计一款单机版的射击类游戏
#### （1）基本要求
- 玩家注册
- 玩家登录
- 游戏数据持久化到文件或者数据库中
- 游戏具有成绩排行榜
- 游戏具有开始、暂停、结束功能键
    
#### （2）核心功能需求分析参考样例
- **参与的角色**
  - 英雄机、子弹、大敌机、小敌机、子弹补给、炸弹补给、天空
- 英雄机发射子弹
- 英雄机、子弹、小敌机、大敌机、子弹补给、炸弹补给都在天空上飞行
- 子弹可以射击小敌机、大敌机、子弹补给、炸弹补给
- 小敌机、大敌机、子弹补给、炸弹补给可以和英雄机撞击
- 英雄机发射单倍、双倍子弹，由火力值控制
- 英雄机发射单倍火力，火力值不减
- 英雄机发射一次双倍火力，则火力值减 2
- 子弹射击小敌机，子弹与小敌机消失，玩家得分 1
- 子弹射击大敌机，子弹与大敌机消失，玩家得分 2
- 子弹射击子弹补给，子弹与子弹补给消失，英雄机得奖励（20 火力值）
- 子弹射击炸弹补给，子弹与炸弹补给消失，英雄机得奖励（1 炸弹）
-  小敌机、大敌机、子弹补给、炸弹补给撞击英雄机，命减命 1，火力值清空，小敌机、大敌机、子弹补给、
炸弹补给消失

## 项目背景

- 本项目是一个基于 Wails 框架的 Vue.js + Golang 项目，用于学习和实践。**如果能帮到你还请点一个免费的Star欧尼概(>_<)**

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

---
