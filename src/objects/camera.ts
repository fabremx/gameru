import { ICameraConstructor } from "../interfaces/camera.interface";
import Player from "./player";

export default class Camera {
    private scene: Phaser.Scene;

    constructor({ scene, map }: ICameraConstructor) {
        this.scene = scene;
    }

    add(width: number, height: number) {
        this.scene.cameras.main.setBounds(0, 0, width, height);
    }

    follow(player: Player) {
        this.scene.cameras.main.startFollow(player.sprite, false, 0.5, 0.5);
    }
}
