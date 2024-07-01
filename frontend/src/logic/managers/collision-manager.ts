import { Physics, Scene } from 'phaser';
import ObjectManager from "../managers/object-manager";
import {Boss} from "../entities/boss/boss";
import objectManager from "../managers/object-manager";
import {Player} from "../entities/players/player";

export class CollisionManager {
    private scene: Scene;
    private objectManager: ObjectManager;

    constructor(scene: Scene) {
        this.scene = scene;
        this.objectManager = ObjectManager.getInstance();
    }

    public setupCollisions() {
        const { player, normalEnemies, fastEnemies, shootingEnemies, bulletSupplies, bombSupplies, firePowerSupplies, boss } = this.objectManager;

        // 子弹射击敌人
        this.scene.physics.add.overlap(player.bullets, normalEnemies, this.onBulletHitEnemy, undefined, this);
        this.scene.physics.add.overlap(player.bullets, fastEnemies, this.onBulletHitEnemy, undefined, this);
        this.scene.physics.add.overlap(player.bullets, shootingEnemies, this.onBulletHitEnemy, undefined, this);
        this.scene.physics.add.overlap(player.bullets, boss, this.onBulletHitBoss, undefined, this);

        // 玩家碰到敌人
        this.scene.physics.add.overlap(player, normalEnemies, this.onPlayerHitEnemy, undefined, this);
        this.scene.physics.add.overlap(player, fastEnemies, this.onPlayerHitEnemy, undefined, this);
        this.scene.physics.add.overlap(player, shootingEnemies, this.onPlayerHitEnemy, undefined, this);
        this.scene.physics.add.overlap(player, shootingEnemies.getChildren().flatMap((enemy: any) => enemy.bullets), this.onPlayerHitBullet, undefined, this);
        this.scene.physics.add.overlap(player, boss, this.onPlayerHitEnemy, undefined, this);
        this.scene.physics.add.overlap(player, boss.bullets, this.onPlayerHitBullet, undefined, this);

        // 玩家碰到补给
        this.scene.physics.add.overlap(player, bulletSupplies, this.onPlayerHitSupply, undefined, this);
        this.scene.physics.add.overlap(player, bombSupplies, this.onPlayerHitSupply, undefined, this);
        this.scene.physics.add.overlap(player, firePowerSupplies, this.onPlayerHitSupply, undefined, this);
    }

    private onBulletHitEnemy(bullet: any, enemy: any) {
        bullet.disableBody(true, true);
        enemy.getDamage(this.objectManager.player.attackPower);
        let addScore = enemy.getScore();

        // 获取当前的 score
        let currentScore = this.scene.registry.get('score');
        // 更新 score 和 firepower
        this.scene.registry.set('score', currentScore + addScore);
        this.objectManager.player.increaseFirepower(addScore);
    }

    private onBulletHitBoss(bullet: any, boss: any) {
        if (bullet instanceof Boss) {
            [bullet, boss] = [boss, bullet];
        }

        bullet.disableBody(true, true);
        boss.getDamage(this.objectManager.player.attackPower);
        this.objectManager.player.increaseFirepower(1);
    }

    private onPlayerHitEnemy(player: any, enemy: any) {
        let player1 = player as Player;
        if (!player1.isInvincible) {
            // 播放音效
            this.scene.sound.play('get_damage');

            // 玩家无敌状态
            player1.isInvincible = true;
            player1.getDamage(400);
            enemy.disableBody(true, true);

            // 设置半透明并闪烁
            player1.alpha = 0.4;
            this.scene.tweens.add({
                targets: player1,
                alpha: 1,
                duration: 300,
                ease: 'Linear',
                repeat: 7,
                yoyo: true
            });

            // 三秒后取消无敌状态
            this.scene.time.delayedCall(3000, () => {
                player1.isInvincible = false;
                this.scene.tweens.killTweensOf(player); // 停止闪烁动画
                player.alpha = 1; // 确保玩家不透明
            }, [], this);
        }
    }

    private onPlayerHitBullet(player: any, bullet: any) {
        let player1 = player as Player;
        if (!player.isInvincible) {
            bullet.disableBody(true, true);
            player1.getDamage(100);
        }
    }

    private onPlayerHitSupply(player: any, supply: any) {
        supply.disableBody(true, true);
        supply.onPickup(player);
    }
}
