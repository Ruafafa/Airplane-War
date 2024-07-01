import { Scene, GameObjects } from "phaser";
import { BattleUI } from "./battle-ui-scene";
import { CollisionManager } from "../managers/collision-manager";
import { EnemySpawner } from "../managers/enemy-spawner";
import { GetUserHighestScoreInHistory, InsertOrUpdateUser } from "../../../wailsjs/go/backend/UserService";
import ObjectManager from "../managers/object-manager";

export class Battle extends Scene {

    private username!: string;
    private background!: GameObjects.TileSprite;
    private burningBackground!: GameObjects.TileSprite;
    private ui?: BattleUI;
    private collisionManager!: CollisionManager;
    private enemySpawner!: EnemySpawner;
    private objectManager: ObjectManager;
    private gameStartTime!: number;
    private normalMusic!: Phaser.Sound.BaseSound;
    private burningMusic!: Phaser.Sound.BaseSound;

    constructor() {
        super("battle");
        this.objectManager = ObjectManager.getInstance();
    }

    init(data: any) {
        this.username = data.username || '无名';
    }

    create() {
        this.registry.set('score', 0);

        // 加载并播放背景音乐
        this.loadBackgroundMusic();
        // 初始化对象管理类
        this.objectManager.init(this);
        // 初始化按键事件
        this.addKeyBoard();
        // 初始化背景
        this.createBackground();
        // 初始化 UI
        this.setupUI();
        // 初始化事件监听
        this.addEventHandlers();

        // 初始化游戏开始的时间
        this.gameStartTime = this.time.now;

        // 初始化碰撞管理类
        this.collisionManager = new CollisionManager(this);
        this.collisionManager.setupCollisions();

        // 初始化敌人生成类
        this.enemySpawner = new EnemySpawner(this);
        this.enemySpawner.startSpawning();
    }

    private loadBackgroundMusic() {
        this.normalMusic = this.sound.add('p5_bgm');
        this.burningMusic = this.sound.add('p5_bgm_upgrade');
        this.normalMusic.play({loop: true});
        this.burningMusic.play({loop: true});
        this.burningMusic.pause();
    }

    private addKeyBoard() {
        this.addBurnKeyBoard();
        this.addBombKeyBoard();
    }


    private addBombKeyBoard() {
        this.input.keyboard!.on('keydown-F', () => {
            this.dropBomb();
        });
    }

    private dropBomb() {
        if (this.objectManager.player.bombs > 0) {
            this.objectManager.player.bombs--;
            // 显示炸弹动画
            this.showBombAnimation();
            // 炸弹逻辑处理
            const enemies = [
                ...this.objectManager.normalEnemies.getChildren(),
                ...this.objectManager.fastEnemies.getChildren(),
                ...this.objectManager.shootingEnemies.getChildren()
            ];
            enemies.forEach(enemy => {
                if (enemy.active) {
                    const typedEnemy = enemy as any;
                    typedEnemy.getDamage(99999);
                    let score = typedEnemy.getScore();
                    this.objectManager.player.increaseFirepower(score);
                }
            });



            enemies.forEach(enemy => {
                if (enemy.active) {
                    const typedEnemy = enemy as any;
                    typedEnemy.getDamage(99999);
                    // 如果敌人有 clearBullets 方法，调用它来清除子弹
                    if (typeof typedEnemy.clearBullets === 'function') {
                        typedEnemy.clearBullets();
                    }
                }
            });

            // 如果 Boss 存在并且活跃，清除它的所有子弹
            if (this.objectManager.boss && this.objectManager.boss.isActive()) {
                this.objectManager.boss.getDamage(200);
                this.objectManager.player.increaseFirepower(20);
                this.objectManager.boss.clearBullets();
            }
        }
    }

    private showBombAnimation() {
        // 创建炸弹图片
        const bomb = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bomb');
        bomb.setScale(0); // 初始大小为 0
        bomb.setAlpha(0.5); // 初始透明度为 0.5

        // 创建动画
        this.tweens.add({
            targets: bomb,
            scale: 3, // 最终大小为 1
            alpha: 1, // 最终透明度为 1
            duration: 800, // 动画持续时间为 8000 毫秒
            onComplete: () => {
                // 动画完成后，销毁炸弹图片
                bomb.destroy();
            }
        });

        // 播放炸弹音效
        this.sound.play('bomb');
    }

    private updateShield() {
        // 位置和玩家重合
        this.objectManager.shieldSprite
            .setPosition(this.objectManager.player.x, this.objectManager.player.y);

        // 如果玩家有护盾，显示护盾；否则隐藏护盾
        if (this.objectManager.player.isShield) {
            this.objectManager.shieldSprite.setVisible(true);
        } else {
            this.objectManager.shieldSprite.setVisible(false);
        }

    }

    private updateMusic() {
        if (this.objectManager.player.isBurning) {
            if (this.normalMusic.isPlaying) {
                this.normalMusic.pause();
                this.burningMusic.resume();
            }
        } else {
            if (this.burningMusic.isPlaying) {
                this.burningMusic.pause();
                this.normalMusic.resume();
            }
        }
    }

    private addBurnKeyBoard() {
        this.input.keyboard!.on('keydown-SPACE', () => {
            this.objectManager.player.burn();
        });
    }

    private createBackground() {
        const { width, height } = this.cameras.main;
        this.background = this.add.tileSprite(0, 0, width, height, "background").setOrigin(0, 0)
        this.burningBackground = this.add.tileSprite(0, 0, width, height, "background_grade").setOrigin(0, 0);
        this.burningBackground.setVisible(false);
    }


    private setupUI() {
        this.ui = this.scene.get('battle-ui') as BattleUI;
        this.scene.run('battle-ui');
    }

    private addEventHandlers() {
        this.addSupplySpawnEvent();
    }

    private addSupplySpawnEvent() {
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                const rand = Math.random();
                if (rand < 0.3) {
                    this.objectManager.bulletSupplies.getFirstDead()?.born();
                } else if (rand < 0.6) {
                    this.objectManager.bombSupplies.getFirstDead()?.born();
                } else {
                    this.objectManager.firePowerSupplies.getFirstDead()?.born();
                }
            },
            callbackScope: this,
            repeat: -1,
        });
    }

    /**
     * 核心渲染方法
     */
    update() {
        this.updateBackground();
        this.updatePlayer();
        this.updateUI();
        this.checkGameOver();
        this.updateShield();
        this.updateMusic();
        this.enemySpawner.updateIsBossActive();
    }

    private updateBackground() {
        if (this.objectManager.player.isBurning) {
            this.background.setVisible(false);
            this.burningBackground.setVisible(true);
        } else {
            this.background.setVisible(true);
            this.burningBackground.setVisible(false);
        }
        this.background.tilePositionY -= 1;
        this.burningBackground.tilePositionY -= 1;
    }

    private updatePlayer() {
        this.objectManager.player.move();
    }

    private updateUI() {
        this.ui?.updateHealthBar(this.objectManager.player.getHP());
        this.ui?.updateFirepower(this.objectManager.player.firepower);
        this.ui?.updateFuelBar(this.objectManager.player.getFuel());
        this.ui?.updateBombCount(this.objectManager.player.bombs);
        this.ui?.updateBossHpBar(this.objectManager.boss.hp);
        this.ui?.updateScore(this.registry.get('score'));
        this.ui?.updateIfHideBossBar(this.objectManager.boss);
        this.ui?.updateBurnTimeBar(this.objectManager.player.burnTime, this.objectManager.player.isBurning);
        const gameTime = (this.time.now - this.gameStartTime) / 1000;
        this.ui?.updateGameTime(gameTime - 1) // 更新游戏时间
    }


    private checkGameOver() {
        if (this.objectManager.player.getHP() <= 0) {
            this.gameOver();
        }
    }

    private gameOver() {
        const playerName = this.username;
        const score = this.registry.get('score');
        let highScore = 0;
        const gameTime = new Date().toISOString();
        let duration = new Date().getTime() - this.gameStartTime;

        GetUserHighestScoreInHistory(playerName).then(r => {
            highScore = r;
            if (score > r) {
                InsertOrUpdateUser(playerName, score, gameTime).then(r => {
                    console.log(r);
                });
            }
        });

        this.scene.stop('battle-ui');
        this.scene.stop('battle');
        this.scene.start('game-over', { score, highScore, playerName, duration});
    }



}
