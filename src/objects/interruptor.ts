import { OBJECTS_LAYER_NAME } from "../constants/tilemap";
import { IItemConstructor } from "../interfaces/items.interface";
import Item from "./item";

export default class Interruptor extends Item {
    private sprite: Phaser.Physics.Matter.Sprite;

    private actionKeyImage: Phaser.GameObjects.Image;
    private actionNotificationText: Phaser.GameObjects.Text;

    constructor(params: IItemConstructor) {
        super(params)
    }

    addWithSpawnPoint(tilemap: Phaser.Tilemaps.Tilemap) {
        const boxSpawnPoints = tilemap.findObject(OBJECTS_LAYER_NAME, obj => obj.name === this.spawnKey);
        this.sprite = this.scene.matter.add.sprite(boxSpawnPoints.x, boxSpawnPoints.y, 'interruptor', 0);
        this.sprite
            .setFixedRotation()
            .setFrictionStatic(0)
        this.sprite.setMass(9)
    }

    collideWith(group: number) {
        this.sprite.setCollisionGroup(group)
    }

    private createActionNotification() {
        this.actionKeyImage = this.scene.add.image(this.sprite.x - 30, this.sprite.y - 85, "keyTalk", 0);
        this.actionNotificationText = this.scene.add.text(this.sprite.x, this.sprite.y - 100, 'Activer', {
            font: "32px Arial",
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)'
        });
    }

    private destroyActionNotification() {
        if (this.actionKeyImage) {
            this.actionKeyImage.destroy();
        }

        if (this.actionNotificationText) {
            this.actionNotificationText.destroy();
        }
    }
}