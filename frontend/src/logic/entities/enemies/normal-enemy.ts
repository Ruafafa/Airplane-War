import { Enemy } from "./Enemy";
import {Math, Scene} from "phaser";


export class NormalEnemy extends Enemy {

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "e1_live", 300);
    }

    public spawn() {
        this.resetProperties();
        let x = Math.Between(5, this.scene.cameras.main.width -5);
        let y = Math.Between(-20, -40);
        this.enableBody(true, x, y, true, true);
        this.setVelocityY(this.speed);
        this.setScale(0.5);
    }

    public die() {
        this.play("e1_down", true);
        this.scene.sound.play('e1_down');

        // 当动画播放完毕后，隐藏敌机
        this.on('animationcomplete', () => {
            // 动画播放完毕后，隐藏对象
            this.disableBody(true, true);
        }, this);
    }

    public resetProperties() {
        this.hp = 10;
        this.setTexture('e1_live');
    }
}
