import { Scene, Physics } from "phaser";
import {BULLET_LAYER} from "../../managers/layer-manager";

export class Bullet extends Physics.Arcade.Sprite {
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.setActive(true);
        this.setVisible(true);
        this.setDepth(BULLET_LAYER)
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        // 子弹走到头，销毁
        if (this.y <= -14) {
            this.disableBody(true, true);
        }
    }

}
