import { Scene, GameObjects } from 'phaser';
import TextStyle = Phaser.GameObjects.TextStyle;

export class GameOver extends Scene {
    constructor() {
        super('game-over');
    }

    init(data: { score: number, highScore: number, playerName: string, gameTime: number }) {
        // 在这里，我们可以从Battle场景传递过来的数据中获取玩家的分数、历史最高纪录和昵称
        const { score, highScore, playerName } = data;
        const { width, height} = this.scale;

        // 添加背景图像
        let background = this.add.image(0, 0, 'summary_background').setOrigin(0, 0);
        background.displayWidth = this.scale.width;
        background.displayHeight = this.scale.height;

        let style = { fontFamily: 'Pixel-zh', fontSize: '25px', color: '#141514' };
        let textX = 80;

        // 显示玩家昵称
        this.add.text(textX, 225, `玩家: ${playerName}`, style);

        // 显示玩家分数
        this.add.text(textX, 285, `分数: ${score}`, style);

        // 显示历史最高纪录
        this.add.text(textX, 345, `史高: ${highScore}`, style);

        // 显示玩家用时
        this.add.text(textX, 405, `时长: ${Math.floor(data.gameTime)}s`, style);

        // 添加一个确定按钮，点击后返回到菜单界面
        const backButton = this.add.image(width / 2, height - 86, 'out_button');
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.sound.stopByKey('p5_bgm');
            this.scene.start('menu')
        });
        backButton.on('pointerover', () => backButton.setTexture('out_button_pressed'));
        backButton.on('pointerout', () => backButton.setTexture('out_button'));
    }
}