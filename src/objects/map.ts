import { IMapConstructor, IMapLayer } from "../interfaces/map.interface";

export default class Map {
    private scene: Phaser.Scene;
    private tileset: Phaser.Tilemaps.Tileset;

    tilemap: Phaser.Tilemaps.Tilemap;

    constructor({
        scene,
        mapPath,
        tilesPath,
    }: IMapConstructor) {
        this.scene = scene;

        this.scene.load.image("tiles", tilesPath);
        this.scene.load.tilemapTiledJSON("map", mapPath);
    }

    add() {
        this.tilemap = this.scene.make.tilemap({ key: "map" });
        this.tileset = this.tilemap.addTilesetImage("Tiles", "tiles");
    }

    createLayer({ name, options }: IMapLayer): Phaser.Tilemaps.TilemapLayer {
        const layer = this.tilemap.createLayer(name, this.tileset, 0, 35);

        const { depth, collision } = options;
        if (collision) {
            layer.setCollisionByProperty({ collides: true });
        }

        if (depth) {
            layer.setDepth(depth);
        }

        return layer;
    }

    size() {
        return {
            width: this.tilemap.widthInPixels,
            height: this.tilemap.heightInPixels
        }
    }
}

