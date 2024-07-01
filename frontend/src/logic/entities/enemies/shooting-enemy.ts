import {Scene, Physics, Math, Time} from "phaser";
import { Enemy } from "./enemy";
import {EnemyBullet} from "../bullets/enemy-bullet";

export class ShootingEnemy extends Enemy {

    public bullets: Physics.Arcade.Group;
    private fireTimer?: Time.TimerEvent;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "shooting_enemy_live", 150);
        this.bullets = scene.physics.add.group({
            classType: EnemyBullet,
            runChildUpdate: true,
            frameQuantity: 30,
        });
    }

    public spawn() {
        this.setTexture("shooting_enemy_live")

        let x = Math.Between(5, this.scene.cameras.main.width - 5);
        let y = Math.Between(-20, -40);
        this.enableBody(true, x, y, true, true);
        this.setVelocityY(150);
        this.setScale(0.5);

        // 创建定时器，每隔一段时间就发射一颗子弹
        this.fireTimer = this.scene.time.addEvent({
            delay: 400, // 每隔1000毫秒发射一颗子弹
            callback: this.fireBullet,
            callbackScope: this,
            loop: true,
        });
    }

    private fireBullet() {
        const bullet = this.bullets.getFirstDead(true, this.x, this.y, 'bullet2');
        if (bullet) {
            bullet.enableBody(true, this.x, this.y, true, true);
            bullet.setVelocityY(300); // 子弹向下移动
        }
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.fireBullet();
    }

    public die() {
        this.play("e1_down", true);
        this.scene.sound.play('e1_down');

        // 当动画播放完毕后，隐藏敌机
        this.on('animationcomplete', () => {
            // 动画播放完毕后，隐藏对象
            this.disableBody(true, true);
        }, this);

        // 销毁所有子弹
        this.bullets.getChildren().forEach((bullet) => {
            (bullet as EnemyBullet).destroy();
        });
    }

    public disableBody(destroy: boolean | undefined, hide: boolean | undefined) : any {
        super.disableBody(destroy, hide);

        // 当敌人被销毁时，停止定时器
        if (this.fireTimer) {
            this.fireTimer.destroy();
            this.fireTimer = undefined;
        }
    }

    public clearBullets() {
        // 清除这个敌人的所有子弹
        this.bullets.clear(true, true);
    }
}