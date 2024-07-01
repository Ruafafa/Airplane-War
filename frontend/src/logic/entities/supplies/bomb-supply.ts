import { Scene } from "phaser";
import { Supply } from "./Supply";
import { Player } from "../players/player";

export class BombSupply extends Supply {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "bomb_supply");
    }

    public onPickup(player: Player) {
        player.increaseBombCount();
    }
}
