import { Scene, Physics } from 'phaser';
import { Player } from '../entities/players/player';
import { Boss } from '../entities/boss/boss';
import { NormalEnemy } from '../entities/enemies/normal-enemy';
import { FastEnemy } from '../entities/enemies/fast-enemy';
import { ShootingEnemy } from '../entities/enemies/shooting-enemy';
import { BulletSupply } from '../entities/supplies/bullet-supply';
import { BombSupply } from '../entities/supplies/bomb-supply';
import { FirepowerSupply } from '../entities/supplies/firepower-supply';

class ObjectManager {
    private static instance: ObjectManager;
    public player!: Player;
    public boss!: Boss;
    public shieldSprite!: Phaser.GameObjects.Sprite;
    public normalEnemies!: Physics.Arcade.Group;
    public fastEnemies!: Physics.Arcade.Group;
    public shootingEnemies!: Physics.Arcade.Group;
    public bulletSupplies!: Physics.Arcade.Group;
    public bombSupplies!: Physics.Arcade.Group;
    public firePowerSupplies!: Physics.Arcade.Group;


    private constructor() { }

    public static getInstance(): ObjectManager {
        if (!ObjectManager.instance) {
            ObjectManager.instance = new ObjectManager();
        }
        return ObjectManager.instance;
    }

    public init(scene: Scene) {
        this.createPlayer(scene);
        this.createShield(scene);
        this.createBoss(scene);
        this.createGroups(scene);
    }

    private createShield(scene: Scene) {
        const { width, height } = scene.cameras.main;
        this.shieldSprite = scene.add.sprite(width, height, 'shield');
        this.shieldSprite.setScale(0.18)
        this.shieldSprite.setDepth(1000);
        this.shieldSprite.setVisible(false); // 初始时隐藏护盾精灵
    }

    private createPlayer(scene: Scene) {
        const { width, height } = scene.cameras.main;
        this.player = new Player(scene, width / 2, height - 50);
    }

    private createBoss(scene: Scene) {
        const { width, height } = scene.cameras.main;
        this.boss = new Boss(scene, width / 2, 50);
    }

    private createGroups(scene: Scene) {
        this.normalEnemies = this.createGroup(scene, NormalEnemy, "enemy1", 30);
        this.fastEnemies = this.createGroup(scene, FastEnemy, "enemy2", 3);
        this.shootingEnemies = this.createGroup(scene, ShootingEnemy, "shooting_enemy", 5);
        this.bulletSupplies = this.createGroup(scene, BulletSupply, "bullet_supply", 20);
        this.bombSupplies = this.createGroup(scene, BombSupply, "bomb_supply", 20);
        this.firePowerSupplies = this.createGroup(scene, FirepowerSupply, "firepower_supply", 20);
    }

    private createGroup(scene: Scene, classType: any, key: string, frameQuantity: number): Physics.Arcade.Group {
        return scene.physics.add.group({
            frameQuantity,
            key,
            active: false,
            visible: false,
            classType,
        });
    }
}

export default ObjectManager;
