import { Scene, Physics } from 'phaser';
import ObjectManager from "../managers/object-manager";

export class EnemySpawner {
    private scene: Scene;
    private objectManager: ObjectManager;
    private normalEnemies: Physics.Arcade.Group;
    private fastEnemies: Physics.Arcade.Group;
    private shootingEnemies: Physics.Arcade.Group;
    private isSpawnEnemy: boolean;
    private bossSpawnTimer: Phaser.Time.TimerEvent | null = null;
    private bossSpawnInterval: number = Phaser.Math.Between(30000, 60000); // 初始Boss生成间隔，随机在30到60秒之间
    private isBossActive: boolean = false;
    private baseDelay: number = 2000; // 初始敌人生成间隔
    private minDelay: number = 300; // 最小敌人生成间隔
    private delayReductionRate: number = 75; // 每次生成后的延迟减少量

    constructor(scene: Scene) {
        this.scene = scene;
        this.isSpawnEnemy = true;
        this.objectManager = ObjectManager.getInstance();
        this.normalEnemies = this.objectManager.normalEnemies;
        this.fastEnemies = this.objectManager.fastEnemies;
        this.shootingEnemies = this.objectManager.shootingEnemies;
    }

    public startSpawning() {
        this.spawnNormalEnemies();
        this.spawnFastEnemies();
        this.spawnShootingEnemies();
        this.scheduleBossSpawn();
    }

    private spawnNormalEnemies() {
        const spawnNormalEnemy = () => {
            if (!this.isBossActive) {
                this.normalEnemies.getFirstDead()?.spawn();
                this.scene.time.addEvent({
                    delay: this.getAdjustedDelay() * 1.5,
                    callback: spawnNormalEnemy,
                    callbackScope: this,
                });
            }
        };
        this.scene.time.addEvent({
            delay: this.baseDelay,
            callback: spawnNormalEnemy,
            callbackScope: this,
        });
    }

    private spawnFastEnemies() {
        const spawnFastEnemy = () => {
            if (!this.isBossActive) {
                this.fastEnemies.getFirstDead()?.spawn();
                this.scene.time.addEvent({
                    delay: this.getAdjustedDelay() * 1.5,
                    callback: spawnFastEnemy,
                    callbackScope: this,
                });
            }
        };
        this.scene.time.addEvent({
            delay: this.baseDelay * 2,
            callback: spawnFastEnemy,
            callbackScope: this,
        });
    }

    private spawnShootingEnemies() {
        const spawnShootingEnemy = () => {
            if (!this.isBossActive) {
                this.shootingEnemies.getFirstDead()?.spawn();
                this.scene.time.addEvent({
                    delay: this.getAdjustedDelay(),
                    callback: spawnShootingEnemy,
                    callbackScope: this,
                });
            }
        };
        this.scene.time.addEvent({
            delay: this.baseDelay * 2,
            callback: spawnShootingEnemy,
            callbackScope: this,
        });
    }

    private getAdjustedDelay(): number {
        const elapsedTime = this.scene.time.now;
        const newDelay = this.baseDelay - (Math.floor(elapsedTime / 10000) * this.delayReductionRate);
        return Math.max(this.minDelay, newDelay); // 确保延迟不小于最小值
    }

    private scheduleBossSpawn() {
        this.bossSpawnTimer = this.scene.time.addEvent({
            delay: this.bossSpawnInterval,
            callback: () => {
                if (!this.isBossActive) {
                    this.spawnBoss();
                }
                this.bossSpawnInterval = Phaser.Math.Between(60000, 90000); // 设置下一个Boss生成的间隔时间
            },
            callbackScope: this,
            loop: true
        });
    }

    private spawnBoss() {
        this.isBossActive = true;
        this.isSpawnEnemy = false;
        const boss = this.objectManager.boss;

        boss.spawn();
    }

    public updateIsBossActive() {
        if (!this.objectManager.boss.isActive()) {
            this.isBossActive = false;
        }
        if (!this.isBossActive && !this.isSpawnEnemy) {
            this.isSpawnEnemy = true;
            this.spawnNormalEnemies();
            this.spawnFastEnemies();
            this.spawnShootingEnemies();
        }
    }

}
