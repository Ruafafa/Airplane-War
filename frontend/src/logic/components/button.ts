import { Scene, GameObjects } from 'phaser';

export class Button {
    static createButton(scene: Scene, x: number, y: number, key: string, callback: () => void): GameObjects.Image {
        return scene.add
            .image(x, y, key)
            .setScale(1, 1)
            .setInteractive()
            .on('pointerdown', callback)
            .setVisible(false);
    }
}
