import { OBJECTS_LAYER_NAME } from "../constants/tilemap";
import { IItemConstructor } from "../interfaces/items.interface";
import Item from "./item";

export default class Box extends Item {
    private sprite: Phaser.Physics.Matter.Sprite;

    constructor(params: IItemConstructor) {
        super(params)
    }

    addWithSpawnPoint(tilemap: Phaser.Tilemaps.Tilemap) {
        const boxSpawnPoints = tilemap.findObject(OBJECTS_LAYER_NAME, obj => obj.name === this.spawnKey);
        this.sprite = this.scene.matter.add.sprite(boxSpawnPoints.x, boxSpawnPoints.y, 'box', 0);
        this.sprite
            .setFixedRotation()
            .setFrictionStatic(0)
        this.sprite.setMass(9)
    }
}
