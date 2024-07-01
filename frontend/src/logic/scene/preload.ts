import Phaser from 'phaser';
import { images, spritesheets, audio, animations } from '../../resource/resource-config';

// 预加载资源场景
export class Preload extends Phaser.Scene {
    constructor() {
        super('preload');
    }

    preload() {
        // 加载图片资源
        Object.entries(images).forEach(([key, image]) => {
            this.load.image(key, image);
            console.log(key, image);
        });

        // 加载精灵图资源
        Object.entries(spritesheets).forEach(([key, { path, frameConfig }]) => {
            this.load.spritesheet(key, path, frameConfig);
            console.log(key, path, frameConfig);
        });

        // 加载音频资源
        Object.entries(audio).forEach(([key, sound]) => {
            this.load.audio(key, sound);
            console.log(key, sound);
        });

        // 监听资源加载完毕
        this.load.on('complete', () => {
            // 所有资源加载完毕，启动游戏
            this.scene.start('menu');
        });
    }

    create() {
        // 创建动画
        console.log("创建动画");
        animations.forEach(({ key, spritesheetKey, frames, frameRate, repeat }) => {
            this.anims.create({
                key,
                frames: this.anims.generateFrameNumbers(spritesheetKey, frames),
                frameRate,
                repeat,
            });

            console.log(key, spritesheetKey, frames, frameRate, repeat);
        });
    }
}
