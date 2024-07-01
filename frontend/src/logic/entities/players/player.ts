import { Scene, Physics, Input } from "phaser";
import { PLAYER_LAYER } from "../../managers/layer-manager";
import { PlayerBullet } from "../bullets/player-bullet";

let cursors: any;
let shiftKey: Input.Keyboard.Key;

export class Player extends Physics.Arcade.Sprite {
    public bullets!: Physics.Arcade.Group;
    public attackPower!: number; // 攻击力
    public bombs!: number; // 炸弹数量
    public isBurning!: boolean;
    public isShield!: boolean;
    public bulletType!: string; // 子弹类型
    public isBulletBuffed!: number; // 子弹增益状态
    public firepower!: number; // 火力
    public fireRate!: number; // 射击速率
    private fireTimer?: Phaser.Time.TimerEvent;
    private hp!: number; // 血量
    public isInvincible!: boolean; // 是否无敌
    private baseSpeed!: number; // 基础速度
    private isDodging!: boolean; // 是否在闪避状态
    private fuel!: number; // 燃料
    private static readonly MAX_FUEL : number = 100; // 最大燃料
    private static readonly MAX_FIRE_POWER : number = 100; // 最大火力值
    public burnTime: number = 1314;
    private burnTimer!: Phaser.Time.TimerEvent;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "player_normal");
        this.initializePlayer(scene);
    }

    private initializePlayer(scene: Scene) {
        this.bullets = scene.physics.add.group({
            classType: PlayerBullet,
            runChildUpdate: true,
        });

        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setProperties();
        this.setInteractive(true);
        this.setDepth(PLAYER_LAYER);
        this.initializeKeys(scene);
        this.addFireEvent();
    }

    private setProperties() {
        this.setScale(0.5);
        this.setCollideWorldBounds(true);
        this.bulletType = "SingleBullet";
        this.fireRate = 1;
        this.isBurning = false;
        this.isShield = false;
        this.attackPower = 10;
        this.isBulletBuffed = 0;
        this.isInvincible = false;
        this.bombs = 0;
        this.firepower = 0;
        this.hp = 1000;
        this.baseSpeed = 200;
        this.isDodging = false;
        this.fuel = Player.MAX_FUEL;
    }

    private initializeKeys(scene: Scene) {
        cursors = scene.input.keyboard!.addKeys('W,A,S,D');
        shiftKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }

    public move() {
        this.isDodging = this.scene.input.keyboard!.checkDown(shiftKey, 0) && (this.fuel > 0 || this.isBurning);
        this.play(this.isDodging ? 'player_fast' : 'player_normal', true);
        let moveSpeed = this.baseSpeed;
        if (this.isDodging) {
            moveSpeed *= 2;
            this.subFuel(1);
        }

        this.setVelocity(0, 0);

        if (cursors.A.isDown) {
            this.setVelocityX(-moveSpeed);
        } else if (cursors.D.isDown) {
            this.setVelocityX(moveSpeed);
        }

        if (cursors.W.isDown) {
            this.setVelocityY(-moveSpeed);
        } else if (cursors.S.isDown) {
            this.setVelocityY(moveSpeed);
        }
    }


    /**
     * burn 完全燃烧状态
     */
    public burn() {
        if (this.firepower === Player.MAX_FIRE_POWER) {
            this.activateBurnMode();
        }
    }

    private activateBurnMode() {
        this.burnTime = 13140;

        this.burnTimer = this.scene.time.addEvent({
            delay: 1, // 每毫秒
            callback: () => {
                // 在回调函数中，减少 burnTime 的值
                this.burnTime--;
            },
            callbackScope: this,
            loop: true, // 循环调用
        });

        this.firepower = 0;
        this.isBurning = true;
        this.isBulletBuffed++;
        this.baseSpeed *= 2;
        this.fireRate *= 2;
        this.isShield = true;
        this.bulletType = 'ScatterBullet';

        this.scene.time.delayedCall(13140, this.stopBurning, [], this);
    }

    public stopBurning() {
        this.isBulletBuffed--;
        this.isBurning = false;
        this.baseSpeed /= 2;
        this.fireRate /= 2;
        this.isShield = false;
        this.bulletType = 'SingleBullet';

        // 销毁定时器
        if (this.burnTimer) {
            this.burnTimer.destroy();
        }
    }

    public increaseFirepower(amount: number) {
        if (!this.isBurning) {
            this.firepower = Math.min(this.firepower + amount, Player.MAX_FIRE_POWER);
        }
    }

    public increaseFireRate(amount: number) {
        this.fireRate += amount;
        this.updateFireEvent();
    }

    private addFireEvent() {
        this.fireTimer = this.scene.time.addEvent({
            delay: 400 / this.fireRate,
            callback: this.fire,
            callbackScope: this,
            loop: true,
        });
    }

    public updateFireEvent() {
        if (this.fireTimer) {
            this.fireTimer.destroy();
        }
        this.addFireEvent();
    }

    public resetFireEvent() {
        this.fireRate = 1;
        this.updateFireEvent();
    }

    private fire() {
        const fireMethods: { [key: string]: () => void } = {
            "SingleBullet": this.fireSingleBullet,
            "DoubleBullet": this.fireDoubleBullet,
            "TripleBullet": this.fireTripleBullet,
            "ScatterBullet": this.fireScatterBullet,
            "ButterflyBullet": this.fireButterflyBullet,
        };

        if (fireMethods[this.bulletType]) {
            // 播放子弹音效
            this.scene.sound.play('bullet');
            fireMethods[this.bulletType].call(this);
        } else {
            throw new Error("Invalid bullet type: " + this.bulletType);
        }
    }

    private fireSingleBullet() {
        this.createBullet(this.x, this.y - 20, 0, -300);
    }

    private fireDoubleBullet() {
        // 射速补偿
        this.fireRate = 3;
        this.updateFireEvent();
        this.createBullet(this.x - 10, this.y - 20, 0, -300);
        this.createBullet(this.x + 10, this.y - 20, 0, -300);
    }

    private fireTripleBullet() {
        this.createBullet(this.x - 20, this.y - 20, 0, -300);
        this.createBullet(this.x, this.y - 20, 0, -300);
        this.createBullet(this.x + 20, this.y - 20, 0, -300);
    }

    private fireScatterBullet() {
        for (let i = 0; i < 10; i++) {
            const angle = i * 18;
            const velocityX = 300 * Math.cos(Phaser.Math.DegToRad(angle));
            const velocityY = -300 * Math.sin(Phaser.Math.DegToRad(angle));
            this.createBullet(this.x, this.y - 20, velocityX, velocityY);
        }
    }

    private fireButterflyBullet() {
        this.createBullet(this.x - 10, this.y - 20, -50, -300);
        this.createBullet(this.x + 10, this.y - 20, 50, -300);
    }

    private createBullet(x: number, y: number, velocityX: number, velocityY: number) {
        const bullet = this.bullets.getFirstDead(true, x, y, 'bullet');
        if (bullet) {
            bullet.enableBody(true, x, y, true, true);
            bullet.setVelocity(velocityX, velocityY);
        }
    }

    public increaseBombCount() {
        this.bombs++;
    }

    public changeBulletType() {
        const bulletTypes = ['ScatterBullet', 'DoubleBullet', 'TripleBullet', 'ButterflyBullet'];
        this.bulletType = bulletTypes[Math.floor(Math.random() * bulletTypes.length)];
        this.isBulletBuffed++;
    }


    public getDamage(amount: number) {
        if (this.isShield) {
            this.isShield = false;
            return;
        }

        this.scene.cameras.main.shake(233, 0.01);
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.setActive(false);
            this.setVisible(false);
        }
    }

    public getHP() {
        return this.hp;
    }

    public getFuel() {
        return this.fuel;
    }

    public addFuel(n: number) {
        this.fuel = Math.min(this.fuel + n, Player.MAX_FUEL);
    }

    public subFuel(n :number) {
        this.fuel = Math.max(this.fuel - n, 0);
    }
}
