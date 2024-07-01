import { Scene } from "phaser";
import { Supply } from "./Supply";
import { Player } from "../players/player";

export class FirepowerSupply extends Supply {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "firepower_supply");
    }

    public onPickup(player: Player) {
        // 播放音效
        this.scene.sound.play("firepower_supply");

        player.increaseFirepower(20);
        player.addFuel(20);
    }
}
