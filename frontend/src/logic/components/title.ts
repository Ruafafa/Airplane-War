import { Scene } from 'phaser';

export class Title {
    static createTitle(scene: Scene, x: number, y: number, text: string): void {
        scene.add
            .text(x, y, text, {
                fontFamily: 'Pixel-zh',
                fontSize: 60,
                color: '#e3f2ed',
                stroke: '#203c5b',
                strokeThickness: 6,
            })
            .setOrigin(0.5);
    }
}
