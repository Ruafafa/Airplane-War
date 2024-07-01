import { Scene } from "phaser";
import { Supply } from "./Supply";
import {Player} from "../players/player";
import {BattleUI} from "../../scene/battle-ui-scene";

export class BulletSupply extends Supply {
    private ui?: BattleUI;  // 用户界面

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "bullet_supply");
        this.ui = scene.game.scene.getScene('battle-ui') as BattleUI;
    }

    public onPickup(player: Player) {
        // 播放音效
        this.scene.sound.play("bullet_supply");

        // 更改玩家状态
        player.changeBulletType();
        // 更改射速
        player.updateFireEvent();
        // 显示子弹状态
        this.ui?.bulletStateUI.setVisible(true);
        // 添加定时器，过一段时间后恢复默认子弹类型
        setTimeout(() => {
            player.isBulletBuffed--;
            if (player.isBulletBuffed === 0) {
                player.bulletType = 'SingleBullet';
                player.resetFireEvent();
                this.ui?.bulletStateUI.setVisible(false);
            }
        }, 8000);
    }
}
