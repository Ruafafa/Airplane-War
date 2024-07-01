import Phaser, { Physics, Scene } from 'phaser';
import { EnemyBullet } from "../bullets/enemy-bullet";
import {ENEMY_LAYER} from "../../managers/layer-manager";

export class Boss extends Physics.Arcade.Sprite {
    private attackEvent?: Phaser.Time.TimerEvent;
    private attackPatterns: Function[];
    public hp: number;
    public bullets: Phaser.Physics.Arcade.Group;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'boss_live1');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.hp = 1000;

        this.bullets = scene.physics.add.group({
            classType: EnemyBullet,
            runChildUpdate: true,
            frameQuantity: 50,
        });

        this.setDepth(ENEMY_LAYER);

        this.attackPatterns = [
            () => this.shootCircularBullets(),
            () => this.shootSpiralBullets(),
            () => this.shootReverseSpiralBullets(),
        ];

        this.disableBody(true, true);
    }

    spawn() {
        this.reset();
        this.enableBody(true, this.scene.cameras.main.width / 2, -this.height);
        this.setActive(true);
        this.setVisible(true);

        console.log(this)

        // 创建一个 tween 来移动 Boss 到屏幕内
        this.scene.tweens.add({
            targets: this,
            y: 100, // Boss 的目标 y 坐标
            duration: 2000, // 动画持续时间
            ease: 'Power2', // 缓动函数，用于计算动画的进度
            onComplete: () => {
                // 动画完成后，开始攻击和移动
                this.startAttacking();
                this.moveRandomly();
            }
        });
    }

    startAttacking() {
        this.attackEvent = this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                const randomPattern = Phaser.Math.RND.pick(this.attackPatterns);
                randomPattern.call(this);
            },
            loop: true,
        });
    }

    shootCircularBullets() {
        const bulletCount = 12;
        for (let i = 0; i < 6; i++) {
            for (let i = 0; i < bulletCount; i++) {
                const angle = (i / bulletCount) * 360;
                const bullet = this.bullets.getFirstDead(true, this.x, this.y, 'bullet2');
                if (bullet) {
                    bullet.setScale(0.8);
                    bullet.enableBody(true, this.x, this.y, true, true);
                    this.scene.physics.velocityFromAngle(angle, 200, bullet.body.velocity);
                }
            }
        }
    }

    shootSpiralBullets() {
        for (let i = 0; i < 6; i++) {
            const bulletCount = 36;
            let angle = 0;
            this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    angle += 10;
                    const bullet = this.bullets.getFirstDead(true, this.x, this.y, 'bullet2');
                    if (bullet) {
                        bullet.setScale(0.8);
                        bullet.enableBody(true, this.x, this.y, true, true);
                        this.scene.physics.velocityFromAngle(angle, 200, bullet.body.velocity);
                    }
                },
                repeat: bulletCount - 1,
            });
        }
    }

    shootReverseSpiralBullets() {
        for (let i = 0; i < 6; i++) {
            const bulletCount = 36;
            let angle = 360;
            this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    angle -= 10;
                    const bullet = this.bullets.getFirstDead(true, this.x, this.y, 'bullet2');
                    if (bullet) {
                        bullet.setScale(0.8);
                        bullet.enableBody(true, this.x, this.y, true, true);
                        this.scene.physics.velocityFromAngle(angle, 200, bullet.body.velocity);
                    }
                },
                repeat: bulletCount - 1,
            });
        }
    }

    moveRandomly() {
        this.scene.time.addEvent({
            delay: 5000,
            callback: () => {
                const targetX = Phaser.Math.Between(100, this.scene.cameras.main.width - 100);
                this.scene.tweens.add({
                    targets: this,
                    x: targetX,
                    duration: 1000,
                    ease: 'Power2',
                });
            },
            loop: true,
        });
    }

    private die() {
        this.bullets.getChildren().forEach((bullet) => {
            (bullet as EnemyBullet).destroy();
        });

        // 播放动画和音效
        this.play('boss_down', true);
        this.scene.sound.play('boss_down');

        this.on('animationcomplete', () => {
            this.disableBody(true, true);
        }, this);
    }

    public getDamage(n: number) {
        this.hp -= n;

        this.setTexture('boss_hit');
        // 200 毫秒后恢复
        this.scene.time.delayedCall(200, () => {
            this.setTexture("boss_live1");
        });
        // 死亡判断
        if (this.hp <= 0) {
            this.hp = 0;
            this.attackEvent?.remove();
            this.die();
        }
    }

    public isDead(): boolean {
        return this.hp <= 0;
    }

    public isActive(): boolean {
        return this.active;
    }

    public clearBullets() {
        // 清除 Boss 的所有子弹
        this.bullets.clear(true, true);
    }

    public reset() {
        this.hp = 1000;
        this.play("boss_live");
    }
}
