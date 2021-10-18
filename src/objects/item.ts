import { IItemConstructor } from "../interfaces/items.interface";

export default class Item {
    scene: Phaser.Scene;
    sprite: Phaser.Physics.Matter.Sprite;
    key: string
    spawnKey: string;

    constructor({ scene, spawnKey, key }: IItemConstructor) {
        this.scene = scene;
        this.key = key;
        this.spawnKey = spawnKey;
    }
}