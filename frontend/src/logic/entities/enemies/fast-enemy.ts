import {Enemy} from "./Enemy";
import {Math, Scene} from "phaser";


export class FastEnemy extends Enemy {

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "e2_live", 300);
        this.hp = 20;
        this.score = 2;
    }

    public spawn() {
        this.resetProperties();
        let x = Math.Between(5, this.scene.cameras.main.width -5);
        let y = Math.Between(-20, -40);
        this.enableBody(true, x, y, true, true);
        this.setVelocityY(this.speed + Math.Between(100, 200));
        this.setScale(0.5);
    }

    public die() {

        // 播放动画和音效
        this.play("e2_down", true);
        this.scene.sound.play('e2_down');

        // 当动画播放完毕后，隐藏敌机
        this.on('animationcomplete', () => {
            // 动画播放完毕后，隐藏对象
            this.disableBody(true, true);
        }, this);
    }

    public getDamage(n : number) {
        // 播放受伤动画
        this.setTexture("e2_hit");
        // 200 毫秒后恢复
        this.scene.time.delayedCall(200, () => {
            this.setTexture("e2_live");
        });
        this.hp -= n;
        console.log(this.hp);
        // 死亡判断
        if (this.hp <= 0) {
            this.die();
        }
    }

    public resetProperties() {
        this.hp = 20;
        this.setTexture('e2_live');
    }
}
