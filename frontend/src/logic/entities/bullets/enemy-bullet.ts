import {Bullet} from "./Bullet";
import {Scene} from "phaser";

export class EnemyBullet extends Bullet {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'bullet2');
    }
}