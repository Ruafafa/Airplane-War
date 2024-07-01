<template>
  <!-- Phaser 游戏的容器 -->
  <div id="container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { Game, AUTO, Scale } from "phaser";
import { Battle } from "../logic/scene/battle-scene";
import { BattleUI } from "../logic/scene/battle-ui-scene";
import { Menu } from "../logic/scene/menu-scene";
import { Preload } from "../logic/scene/preload";
import { GameOver } from "../logic/scene/game-over";
import { Leaderboard } from "../logic/scene/leaderboard-scene";
import RexBBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';

// 定义 Phaser 游戏配置
const gameConfig: Phaser.Types.Core.GameConfig = {
    parent: "container",
    type: AUTO,
    width: 480,
    height: 725,
    scale: {
      mode: Scale.NONE,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
      },
    },
    plugins: {
      global: [{
        key: 'rexBBCodeTextPlugin',
        plugin: RexBBCodeTextPlugin,
        start: true
      }]
    },
    render: {
      pixelArt: true,
    },
    scene: [Preload, Menu, Battle, BattleUI, GameOver, Leaderboard],
    transparent: true,
    dom: {
      createContainer: true,
    },
};

// 定义一个 game 变量来存储 Phaser 游戏实例
let game: Phaser.Game;

onMounted(() => {
    game = new Game(gameConfig);
});

onUnmounted(() => {
    game.destroy(true);
    console.log("Game destroyed");
});
</script>

<style>
body {
  margin: 0;
}

#app {
  height: 100%;
}
</style>