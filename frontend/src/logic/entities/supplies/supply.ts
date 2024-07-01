import {Scene, Physics, Math} from "phaser";
import { Player } from "../players/player";
import {SUPPLY_LAYER} from "../../managers/layer-manager";

export abstract class Supply extends Physics.Arcade.Sprite {

    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.setDepth(SUPPLY_LAYER);
    }

    public abstract onPickup(player: Player): void;

    public born() {
        let x = Math.Between(30, 345);
        let y = Math.Between(-20, -40);
        this.enableBody(true, x, y, true, true);
        this.setVelocityY(300);
    }
}
