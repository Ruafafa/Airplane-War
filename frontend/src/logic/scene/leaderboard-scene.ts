import { Scene } from 'phaser';
import {GetUsersSortedByScore} from '../../../wailsjs/go/backend/UserService';
import { backend } from "../../../wailsjs/go/models";
import UserGameInfo = backend.UserGameInfo;


export class Leaderboard extends Scene {
    constructor() {
        super('leaderboard');
    }

    create() {
        this.sound.add('battle_bgm_upgrade', { loop: true }).play();
        this.createBackend();
        this.createBackButton();
    }

    private createBackend() {
        // 创建背景
        let background = this.add.image(0, 0, 'rank_background').setOrigin(0, 0);
        // 获取游戏窗口的宽度和高度
        const width = this.scale.width;
        const height = this.scale.height;
        // 根据游戏窗口的尺寸调整背景图像的大小
        background.displayWidth = width;
        background.displayHeight = height;
        // 获取排行榜数据
        this.getRankingList();
    }

    private createBackButton() {
        // 创建返回按钮
        const backButton = this.add.text(50, 50, '返回', {
            fontFamily: 'Pixel-zh',
            fontSize: '32px',
            color: '#ffffff'
        });

        // 设置返回按钮为可交互的
        backButton.setInteractive();

        // 当点击返回按钮时，返回到主菜单
        backButton.on('pointerdown', () => {
            this.sound.stopByKey('battle_bgm_upgrade');
            this.scene.start('menu');
        });
    }

    private getRankingList() {
        // 获取排行榜数据
        GetUsersSortedByScore().then((users) => {
            // 显示排行榜
            this.showLeaderboard(users);
        })
    }

    private showLeaderboard(users: Array<UserGameInfo>) {
        const startX = 100; // 文本的起始 x 坐标
        const startY = 200; // 文本的起始 y 坐标
        const gap = 40; // 每行文本之间的间隔

        // 只获取前十名用户
        const topTenUsers = users.slice(0, 10);

        topTenUsers.forEach((user, index) => {
            console.log(user)
            const rank = index + 1; // 排名
            // NOTE: 无视此处报错
            const rankText = `${rank} `;
            const nameText = ` ✈ [color=#7af6be]${user.name}[/color]  `;
            const scoreText = `[color=#faa82d]★${user.high_score}[/color]`;
            const text = rankText + nameText + scoreText;

            this.add.rexBBCodeText(startX, startY + index * gap, text, {
                fontFamily: 'Pixel-zh',
                fontSize: '25px',
                color: '#000000',
                fontStyle: 'bold',
                stroke: '#ffffff',
                strokeThickness: 2,
                align: 'left'
            }).setOrigin(0);
        });
    }
}