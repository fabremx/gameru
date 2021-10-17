import { IItemConstructor } from "../interfaces/items.interface";

export default class Item {
    protected scene: Phaser.Scene;
    protected spawnKey: string;

    constructor({ scene, spawnKey }: IItemConstructor) {
        this.scene = scene;
        this.spawnKey = spawnKey;
    }
}