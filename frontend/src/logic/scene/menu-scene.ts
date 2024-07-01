import { GameObjects, Scene } from 'phaser';
import { Button } from '../components/button'
import { InputBox } from '../components/Input-box'
import { Title } from '../components/title';

export class Menu extends Scene {
    editMode: boolean = false;
    inputHtml: HTMLInputElement | undefined = undefined;
    private username: string = '飞机侠';  // 玩家用户名
    private lastInput: boolean = false;  // 上轮玩家用户名
    private p1Button: GameObjects.Image | undefined = undefined;
    private leaderboardButton: GameObjects.Image | undefined = undefined;


    constructor() {
        super('menu');
    }

    create() {
        const { width, height } = this.cameras.main;
        const bgm = this.sound.add('battle_bgm', { loop: true });
        bgm.play();
        this.addBackground(width, height);
        this.createTitle(width, height);
        this.createInput(width, height);
        this.createButtons(width, height);
        this.handleLastInput();
    }


    addBackground(width: number, height: number) {
        this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0, 0);
    }

    createTitle(width: number, height: number) {
        this.add.image(width / 2, height / 4, 'logo').setScale(0.4);
    }

    createInput(width: number, height: number) {
        this.inputHtml = InputBox.createInput(this, width / 2, height / 4 + 100);
    }

    handleLastInput() {
        // 如果上一轮有输入，将上一轮的输入显示在输入框中
        if (this.lastInput) {
            this.inputHtml!.value = this.username;
        }
        // 检查输入框中是否有值，如果有值，就显示按钮；如果没有值，就隐藏按钮
        if (this.inputHtml && this.inputHtml.value) {
            this.p1Button?.setVisible(true);
            this.leaderboardButton?.setVisible(true);
        } else {
            this.p1Button?.setVisible(false);
            this.leaderboardButton?.setVisible(false);
        }
    }

    createButtons(width: number, height: number) {

        // 单人游戏按钮
        this.p1Button = Button.createButton(this, width / 2, (height / 5) * 3, 'p1Button', () => {
            // 播放按钮点击音效
            this.sound.play('button');
            // logic
            this.saveUserName();
            this.sound.stopByKey('battle_bgm');
            this.scene.stop('menu');
            this.game.scene.start('battle', {username: this.username});
        }).setScale(0.8);

        // 编辑按钮
        let editButton = this.add
            .text(width / 2 + 90, height / 4 + 100, 'E', {
                fontFamily: 'Pixel-zh',
                fontSize: 20,
                color: '#e3f2ed',
                stroke: '#535659',
                strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                // 播放按钮点击音效
                this.sound.play('button');

                // logic
                this.editMode = true;
                if (this.inputHtml) {
                    this.inputHtml.disabled = false;
                }
            });

        // 排行榜按钮
        this.leaderboardButton = Button.createButton(this,
            width / 2, (height / 5) * 3 + 50,
            'leaderboard',
            () => {
                // 播放按钮点击音效
                this.sound.play('button');
                this.sound.stopByKey('battle_bgm');
                this.saveUserName();
                this.scene.stop('menu');
                this.game.scene.start('leaderboard');
        }).setScale(0.8);


        if (this.inputHtml) {
            this.checkInputAndShowButtons(this.inputHtml);
        }
    }

    checkInputAndShowButtons(input: HTMLInputElement) {
        input.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter' && this.editMode) {
                event.preventDefault();
                const gameName = input.value;
                if (gameName) {
                    this.p1Button?.setVisible(true);
                    this.leaderboardButton?.setVisible(true);
                    this.editMode = false;
                    input.disabled = true;
                } else {
                    this.p1Button?.setVisible(false);
                    this.leaderboardButton?.setVisible(false);
                }
            }
        });
    }

    saveUserName() {
        this.username = this.inputHtml?.value || '飞机侠';
        this.lastInput = true;
    }
}
