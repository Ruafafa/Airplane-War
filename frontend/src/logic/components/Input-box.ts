import { Scene } from 'phaser';

export class InputBox {
    static createInput(scene: Scene, x: number, y: number): HTMLInputElement {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '请输入游戏名';
        input.style.width = '150px';
        input.style.height = '30px';
        input.style.zIndex = '1000';
        input.style.fontFamily = 'Pixel-zh';
        input.style.textAlign = 'center';
        input.style.borderRadius = '10px';
        input.style.border = '1px solid #000';
        input.disabled = true;

        scene.add.dom(x, y, input).setOrigin(0.5);
        return input;
    }
}
