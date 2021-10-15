export default class MultiKey {
    keys: Phaser.Input.Keyboard.Key[];

    constructor(scene: Phaser.Scene, keys: number[]) {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }

        this.keys = keys.map((key: number) => scene.input.keyboard.addKey(key));
    }

    justDown() {
        return this.keys.some((key: Phaser.Input.Keyboard.Key) => Phaser.Input.Keyboard.JustDown(key));
    }

    isDown() {
        return this.keys.some((key: Phaser.Input.Keyboard.Key) => key.isDown);
    }

    isUp() {
        return this.keys.every((key: Phaser.Input.Keyboard.Key) => key.isUp);
    }
}
