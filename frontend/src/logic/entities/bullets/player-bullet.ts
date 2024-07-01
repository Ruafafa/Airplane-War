import { Scene, Physics } from "phaser";
import {Bullet} from "./Bullet";

export class PlayerBullet extends Bullet {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'bullet1');
    }

}
