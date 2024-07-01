import { Scene, GameObjects, Display } from "phaser";
import {FIREPOWER_CIRCLE_LATER, FIREPOWER_LAYER, HEATH_SCORE_LAYER} from "../managers/layer-manager";
import {Boss} from "../entities/boss/boss";


export class BattleUI extends Scene {
    private scoreText!: GameObjects.Text;
    private firepowerCircle!: GameObjects.Graphics
    private firepowerFill!: GameObjects.Graphics;
    private firepowerIcon!: GameObjects.Image;
    private BOSS_HP_BAR_WIDTH: number = 400; // Boss 血条宽度
    private bossHpBarBackground!: GameObjects.Graphics;
    private bossHpBarFill!: GameObjects.Graphics;
    private firepowerMask!: GameObjects.Graphics;
    private fuelBarBackground!: GameObjects.Graphics;
    private fuleBarTest!: GameObjects.Text;
    private fuelBarFill!: GameObjects.Graphics;
    private healthBarBackground!: GameObjects.Graphics;
    private healthBarFill!: GameObjects.Graphics;
    private healthText!: GameObjects.Text;
    public bulletStateUI!: Phaser.GameObjects.Image;
    public bombStateUI!: Phaser.GameObjects.Image;
    public bombCountText!: Phaser.GameObjects.Text;
    private burnTimeBar!: GameObjects.Graphics;
    private gameTimeText!: GameObjects.Text;
    private firepowerTween!: Phaser.Tweens.Tween;
    private maxHealth: number = 1000; // 假设最大血量为1000
    private maxFirepower: number = 100; // 假设最大火力值为100
    private HEALTH_BAR_WIDTH: number = 200; // 血条宽度
    private pauseButton!: GameObjects.Image; // 暂停按钮
    private isPaused: boolean = false;

    constructor() {
        super('battle-ui');
    }

    create() {
        this.createBombState();
        this.createBossHpBar();
        this.createBurnTimeBar();
        this.createButtleState();
        this.createPauseButton();
        this.createGameTime();
        this.togglePause();
        this.createScoreText();
        this.createHealthBar();
        this.createFirepowerCircle();
        this.createFuelBar();
    }

    private createButtleState() {
        const { height } = this.cameras.main;
        this.bulletStateUI = this.add.image(95, height - 49, 'bullet_state');
        this.bulletStateUI.setScale(1.4);
        this.bulletStateUI.setVisible(false);
    }

    private createBurnTimeBar() {
        const { width, height } = this.cameras.main;
        this.burnTimeBar = this.add.graphics();
        this.burnTimeBar.fillStyle(0xfdd468, 1);
        this.burnTimeBar.fillRect(width / 2 - 50, height, 100, 10);
    }

    updateBurnTimeBar(burnTime: number, isBurning: boolean) {
        const MAX_LENGTH = 233;
        const BAR_X = this.cameras.main.width - 270;
        const BAR_Y = this.cameras.main.height - 27;
        const BAR_HEIGHT = 10;
        const maxBurnTime = 13140;

        // 如果玩家不处于完全燃烧状态，隐藏这个 UI
        if (!isBurning) {
            this.burnTimeBar.setVisible(false);
            return;
        } else {
            this.burnTimeBar.setVisible(true);
        }

        // 清除旧的图形
        this.burnTimeBar.clear();

        console.log(burnTime)
        // 计算新的长度
        const length = (burnTime / maxBurnTime) * MAX_LENGTH;

        // 绘制新的时间条
        this.burnTimeBar.fillStyle(0xfdd468, 1);
        this.burnTimeBar.fillRect(BAR_X, BAR_Y, length, BAR_HEIGHT);
    }

    private createPauseButton() {
        // 创建暂停按钮
        this.pauseButton = this.add.image(25, 25, 'pauseButton_nor')
            .setOrigin(0.5)
            .setScale(0.6)
            .setDepth(999)
            .setInteractive()
            .on('pointerdown', (x : any, y : any, gameObject : any) => {
                // 播放按钮点击音效
                this.sound.play('button');
                // logic
                const battleScene = this.scene.get('battle') as Phaser.Scene;
                if (this.isPaused) {
                    this.pauseButton.setTexture('pauseButton_nor');
                    this.isPaused = false;
                    battleScene.scene.resume();
                } else {
                    this.pauseButton.setTexture('resumeButton_nor');
                    this.isPaused = true;
                    battleScene.scene.pause();
                }
            })
            .on('pointerover', () => {
                if (this.isPaused) {
                    this.pauseButton.setTexture('resumeButton_pressed');
                } else {
                    this.pauseButton.setTexture('pauseButton_pressed');
                }
            });
    }

    togglePause() {
        this.input.keyboard?.on('keydown-ESC', () => {
            this.sound.play('button');

            const battleScene = this.scene.get('battle') as Phaser.Scene;
            if (this.isPaused) {
                this.pauseButton?.setTexture('pauseButton_nor');
                this.isPaused = false;
                battleScene.scene.resume();
            } else {
                this.pauseButton?.setTexture('resumeButton_nor');
                this.isPaused = true;
                battleScene.scene.pause();
            }
        })
    }


    private createScoreText() {
        const { width, height } = this.cameras.main;

        const goalText = this.add.text(width - 32, 20, "得分", {
            fontFamily: "Pixel-zh",
            fontSize: "16px",
            color: "#f3bc05",
            stroke: '#000000',
            strokeThickness: 2
        });

        this.scoreText = this.add.text(width, 40, "0", {
            fontFamily: "Pixel-zh",
            fontSize: "20px",
            color: "#ffffff",
            stroke: '#000000',
            strokeThickness: 2
        });

        // 设置 scoreText 的原点为 (1, 0)，使其向左扩展
        this.scoreText.setOrigin(1, 0);
    }

    public updateScore(score: number) {
        this.scoreText.text = String(score);
    }

    private createBombState() {
        const { height } = this.cameras.main;
        this.bombStateUI = this.add.image(30, height - 50 , 'bomb_state');
        this.bombStateUI.setScale(0.3);

        this.bombCountText = this.add.text(65, height - 50, 'X0', {
            fontFamily: 'Pixel-zh',
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.bombCountText.setOrigin(0.5, 0.5);
    }

    public updateBombCount(bombCount: number) {
        this.bombCountText.text = 'X' + String(bombCount);
    }


    private createGameTime() {
        this.gameTimeText = this.add.text(this.cameras.main.width - 10, this.cameras.main.height - 25, '0', {
            fontFamily: 'Pixel-zh',
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 1); // 设置原点为 (1, 1)，使其向左和向上扩展
        // 设置 scoreText 的原点为 (1, 0)，使其向左扩展
        this.gameTimeText.setOrigin(1, 0);
    }

    updateGameTime(gameTime: number) {
        // 将游戏时间转换为分钟和秒
        const seconds = Math.floor(gameTime % 60);

        // 更新文本
        this.gameTimeText.text = `${seconds < 10 ? '0' : ''}${seconds}s`;
    }

    private createFirepowerCircle() {
        const { width, height } = this.cameras.main;
        let x = 170;
        let y = height - 70;
        let radius = 30;

        // 创建火力值填充图形
        this.firepowerFill = this.add.graphics();
        this.firepowerFill.fillStyle(0xff0000, 1);
        this.firepowerFill.fillRect(-25, -radius, 2 * radius, 2 * radius); // 方形填充区域
        this.firepowerFill.setPosition(x, y);
        this.firepowerFill.setDepth(FIREPOWER_LAYER);

        this.firepowerTween = this.tweens.add({
            targets: this.firepowerFill,
            alpha: { from: 1, to: 0 },
            duration: 500,
            repeat: -1, // 重复无限次
            yoyo: true, // 在每次重复之间反转动画
        });


        // 创建火力值遮罩
        this.firepowerMask = this.make.graphics({ x: 0, y: 0 });
        this.firepowerMask.fillStyle(0xffffff, 1);
        this.firepowerMask.fillCircle(x, y, radius - 2); // 圆形遮罩

        // 应用遮罩
        this.firepowerFill.mask = new Phaser.Display.Masks.GeometryMask(this, this.firepowerMask);

        // 创建圆形背景
        this.firepowerCircle = this.add.graphics();
        this.firepowerCircle.fillStyle(0xffcccc, 0.6); // 添加这行来填充颜色
        this.firepowerCircle.fillCircle(x, y, radius); // 使用 fillCircle 而不是 strokeCircle
        this.firepowerCircle.lineStyle(2, 0x000000, 1); // 设置描边样式
        this.firepowerCircle.strokeCircle(x, y, radius + 4); // 圆心(140, height - 50)，半径25
        this.firepowerCircle.setDepth(FIREPOWER_CIRCLE_LATER);

        // 添加火力图标
        this.firepowerIcon = this.add.image(x, y, 'firepower_icon').setScale(0.3).setDepth(10).setAlpha(0.6); // 需要提前加载'firepower-icon'资源
    }

    public updateFirepower(firepower: number) {
        const { height } = this.cameras.main;
        const maxHeight = 60; // 定义填充最大高度
        const fillHeight = (firepower / this.maxFirepower) * maxHeight;

        this.firepowerFill.clear();
        this.firepowerFill.fillStyle(0xff0000, 1);
        this.firepowerFill.fillRect(-30, 30 - fillHeight, 60, fillHeight); // 从底部往上填充

        if (firepower >= this.maxFirepower) {
            // 如果火力值已满，将 firepower_icon 的颜色设置为 #fa5d24
            this.firepowerIcon.setTint(0xfa5d24);
        } else {
            // 否则，将 firepower_icon 的颜色设置为原色
            this.firepowerIcon.clearTint();
        }
    }

    private createFuelBar() {
        const { width, height } = this.cameras.main;

        const FUEL_BAR_X = width - 25;
        const FUEL_BAR_Y = 90;
        const FUEL_BAR_HEIGHT = 100 + 6;

        // 燃料条背景
        this.fuelBarBackground = this.add.graphics();
        this.fuelBarBackground.lineStyle(2, 0x000000, 1);
        this.fuelBarBackground.fillStyle(0x000000, 0.5);
        this.fuelBarBackground.fillRect(FUEL_BAR_X, FUEL_BAR_Y, 20, FUEL_BAR_HEIGHT);
        this.fuelBarBackground.strokeRect(FUEL_BAR_X, FUEL_BAR_Y, 20, FUEL_BAR_HEIGHT); // 添加这行来绘

        // 燃料条填充
        this.fuelBarFill = this.add.graphics();
        this.fuelBarFill.fillStyle(0xa7acac, 1);
        this.fuelBarFill.fillRect(FUEL_BAR_X, FUEL_BAR_Y, 20, FUEL_BAR_HEIGHT);

        // 燃料条文字
        this.fuleBarTest = this.add.text(FUEL_BAR_X + 9, FUEL_BAR_Y - 13, '燃料', {
            fontFamily: 'Pixel-zh',
            fontSize: '16px',
            color: "#ffa831",
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
    }


    public updateFuelBar(fuel: number) {
        const { width } = this.cameras.main;

        const FULE_BAR_X = width - 25;
        const FULE_BAR_Y = 90;
        const FUEL_BAR_HEIGHT = 100;

        this.fuelBarFill.clear();

        let color;
        if (fuel > 50) {
            // #0xCEF1B9
            color = new Phaser.Display.Color(206,241,185,0.8 );
        } else if (fuel > 20) {
            color = new Phaser.Display.Color(46,105,93,0.7);
        } else {
            color = new Phaser.Display.Color(196,99,51,0.6);
        }

        this.fuelBarFill.fillStyle(color.color, 1);
        this.fuelBarFill.fillRect(FULE_BAR_X + 3, FULE_BAR_Y + FUEL_BAR_HEIGHT - fuel + 4, 14, fuel); // 从底部往上填充
    }

    private createHealthBar() {
        const { width, height } = this.cameras.main;
        this.healthBarBackground = this.add.graphics();
        this.healthBarBackground.fillStyle(0x000000, 0.5);
        this.healthBarBackground.fillRect(10, height - 30, this.HEALTH_BAR_WIDTH, 14);
        this.healthBarBackground.lineStyle(2, 0x000000, 1);
        this.healthBarBackground.strokeRect(10, height - 30, this.HEALTH_BAR_WIDTH, 14); // 添加这行来绘

        this.healthBarFill = this.add.graphics();

        // 初始化 healthText
        this.healthText = this.add.text(190, height - 40, '100', {
            fontFamily: 'Pixel-zh',
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
        this.healthText.setDepth(HEATH_SCORE_LAYER);

        this.updateHealthBar(this.maxHealth); // 初始血量为最大血量
    }

    public updateHealthBar(health: number) {
        const { height } = this.cameras.main;
        this.healthBarFill.clear();

        // 设置渐变填充样式
        this.healthBarFill.fillGradientStyle(0xccffff, 0x00ffff, 0xccffff, 0x00ffff, 1);
        // 计算自适应的填充宽度
        const fillWidth = (health / this.maxHealth) * this.HEALTH_BAR_WIDTH - 4; // 减去4个像素的边框
        this.healthBarFill.fillRect(12, height - 29, fillWidth, 11);

        if (this.healthText) {
            this.healthText.text = String(health);
        }
    }


    private createBossHpBar() {
        const { width, height } = this.cameras.main;
        // 创建 Boss 血条背景
        this.bossHpBarBackground = this.add.graphics();
        this.bossHpBarBackground.lineStyle(2, 0x000000, 0.5); // 设置线条样式
        this.bossHpBarBackground.strokeRoundedRect(width / 2 - this.BOSS_HP_BAR_WIDTH / 2, 20, this.BOSS_HP_BAR_WIDTH, 14, 7); // 绘制圆角矩形边框
        this.bossHpBarBackground.fillStyle(0x000000, 0.5); // 设置填充样式
        this.bossHpBarBackground.fillRoundedRect(width / 2 - this.BOSS_HP_BAR_WIDTH / 2, 20, this.BOSS_HP_BAR_WIDTH, 14, 7); // 填充圆角矩形
        // 创建 Boss 血条填充
        this.bossHpBarFill = this.add.graphics();
        this.updateBossHpBar(1000); // 初始血量为最大血量
    }

    // 更新 Boss 血条
    updateBossHpBar(hp: number) {
        const { width } = this.cameras.main;
        this.bossHpBarFill.clear();
        // 设置渐变填充样式
        this.bossHpBarFill.fillStyle(0xA5AAA3, 0.8);
        // 计算自适应的填充宽度
        const fillWidth = (hp / 1000) * this.BOSS_HP_BAR_WIDTH - 4; // 减去4个像素的边框
        this.bossHpBarFill.fillRoundedRect(width / 2 - this.BOSS_HP_BAR_WIDTH / 2 + 2, 22, fillWidth, 11, 7); // 填充圆角矩形
    }

    public updateIfHideBossBar(boss: Boss) {
        if (!boss.isActive()) {
            this.bossHpBarBackground.setVisible(false);
            this.bossHpBarFill.setVisible(false);
        } else {
            this.bossHpBarBackground.setVisible(true);
            this.bossHpBarFill.setVisible(true);
        }
    }

}
