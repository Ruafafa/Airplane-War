import {Math, Physics, Scene} from "phaser";
import {ENEMY_LAYER} from "../../managers/layer-manager";

export class Enemy extends Physics.Arcade.Sprite {
    protected speed: number;
    protected hp: number;
    protected score: number;

    constructor(scene: Scene, x: number, y: number, texture: string, speed: number) {
        super(scene, x, y, texture);
        this.speed = speed;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.hp = 10;
        this.score = 1;
        this.setDepth(ENEMY_LAYER);
    }

    public preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        let { height } = this.scene.cameras.main;
        // 敌军走到头，销毁
        if (this.y >= height + 20) {
            this.disableBody(true, true)
        }
    }

    public spawn() {
        this.setPosition(Phaser.Math.Between(0, this.scene.cameras.main.width), 0);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityY(this.speed);
    }

    public die() {
        this.setActive(false);
        this.setVisible(false);
        this.body!.stop();
    }

    public getDamage(n : number) {
        this.hp -= n;
        if (this.hp <= 0) {
            this.die();
        }
    }

    public getScore() {
       return this.score;
    }

    public update(time: number, delta: number) {
        if (this.y > this.scene.cameras.main.height) {
            this.die();
        }
    }

}
