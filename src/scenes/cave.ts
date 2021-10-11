import Player from "../objects/player";
import Character from "../objects/character";
import SceneTitle from "../objects/sceneTitle";
import Camera from "../objects/camera";
import Map from "../objects/map";
import { DEVELOPER_SPAW_POINT_NAME, OBJECTS_LAYER_NAME, PLATFORMS_LAYER_NAME, PLAYER_SPAW_POINT_NAME } from "../constants/tilemap";

export default class CaveScene extends Phaser.Scene {
    private player: Player;
    private developer: Character;

    private sceneTitle: SceneTitle;
    private camera: Camera;
    private map: Map;

    constructor() {
        super({ key: "CaveScene" });
    }

    preload(): void {
        // Map
        this.load.image("tiles", "assets/tilemaps/tiles/tiles.png");
        this.load.image("tiles", "assets/tilemaps/tiles/tiles2.png");
        this.load.tilemapTiledJSON("map", "assets/tilemaps/maps/cave.json");

        this.sceneTitle = new SceneTitle({
            scene: this, x: this.scale.width + 500, y: 200, text: 'Chapitre 1 - Prélude'
        })

        this.player = new Player({
            scene: this,
            sprite: {
                path: "assets/sprites/player.png",
                width: 32,
                height: 32,
                margin: 1,
                spacing: 2,
            }
        });

        this.developer = new Character({
            scene: this,
            name: "alien",
            sprite: {
                path: "assets/sprites/alien.png",
                width: 66,
                height: 92,
                margin: 1,
                spacing: 2,
            }
        });

        this.camera = new Camera({ scene: this });
    }

    create(): void {
        // Display Map
        const tilemap = this.make.tilemap({ key: "map" });
        const tileset1 = tilemap.addTilesetImage("tiles", "tiles");
        const tileset2 = tilemap.addTilesetImage("tiles2", "tiles2");

        const platformLayer = tilemap.createLayer(PLATFORMS_LAYER_NAME, [tileset1, tileset2], 0, 35);
        platformLayer.setCollisionByProperty({ collides: true });
        platformLayer.setDepth(10);

        // World properties
        this.matter.world.convertTilemapLayer(platformLayer);
        this.matter.world.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);

        var noCollisionGroup = this.matter.world.nextGroup(true);

        const playerSpawnPoint = tilemap.findObject(OBJECTS_LAYER_NAME, obj => obj.name === PLAYER_SPAW_POINT_NAME);
        const developerSpawnPoint = tilemap.findObject(OBJECTS_LAYER_NAME, obj => obj.name === DEVELOPER_SPAW_POINT_NAME);

        this.sceneTitle.add();
        this.player.add(playerSpawnPoint.x, playerSpawnPoint.y);
        this.developer.add(developerSpawnPoint.x, developerSpawnPoint.y);

        this.player.collideWith(noCollisionGroup);
        this.developer.collideWith(noCollisionGroup);

        // Camera
        this.camera.add(tilemap.widthInPixels, tilemap.heightInPixels);
        this.camera.follow(this.player)
    }

    update() {
        this.player.handleMovements();
        this.player.handleDialogs();
        this.player.handleOverlapWith([this.developer]);
    }
}
