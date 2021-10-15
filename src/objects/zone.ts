import { OBJECTS_LAYER_NAME } from "../constants/tilemap";
import Map from "./map";

export default class Zone {
    static create(scene: Phaser.Scene, tilemap: Map['tilemap'], objectKey: string): Phaser.GameObjects.Rectangle {
        const tileZoneObject = tilemap.findObject(OBJECTS_LAYER_NAME, obj => obj.name === objectKey);
        const zone = scene.add.rectangle(tileZoneObject.x, tileZoneObject.y, tileZoneObject.width, tileZoneObject.height, 0x6666ff);
        zone.visible = false;

        return zone
    }
}
