import Player from "../objects/player";
import Character from "../objects/character";
import SceneTitle from "../objects/sceneTitle";
import Camera from "../objects/camera";
import { CAVE_MAP, DEVELOPER_SPAW_POINT_NAME, OBJECTS_LAYER_NAME, PLATFORMS_LAYER_NAME, PLAYER_SPAW_POINT_NAME } from "../constants/tilemap";
import { CAVE_SCENE } from "../constants/scenes";
import { SPAWN_BOX_INTERRUPTOR_LEVEL_2, SPAWN_BOX_LEVEL_1, SPAWN_BOX_LEVEL_2 } from "../constants/caveSceneObjects";
import Box from "../objects/box";
import Interruptor from "../objects/interruptor";

export default class CaveScene extends Phaser.Scene {
    private player: Player;
    private developer: Character;

    private sceneTitle: SceneTitle;
    private camera: Camera;

    private boxes: Box[] = [];
    private interruptorBoxLvl2: Interruptor;

    constructor() {
        super({ key: CAVE_SCENE });
    }

    preload(): void {
        // Map
        this.load.image("tiles", "assets/tilemaps/tiles/tiles.png");
        this.load.image("tiles2", "assets/tilemaps/tiles/tiles2.png");
        this.load.tilemapTiledJSON(CAVE_MAP, "assets/tilemaps/maps/cave.json");

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

        this.load.image('box', 'assets/images/box.png');
        this.boxes = [
            // Level 1
            new Box({ scene: this, spawnKey: SPAWN_BOX_LEVEL_1 }),
            // Level 2
            new Box({ scene: this, spawnKey: SPAWN_BOX_LEVEL_2 }),
            new Box({ scene: this, spawnKey: SPAWN_BOX_LEVEL_2 })
        ]

        this.load.image('interruptor', 'assets/sprites/switchRedMid.png');
        this.interruptorBoxLvl2 = new Interruptor({ scene: this, spawnKey: SPAWN_BOX_INTERRUPTOR_LEVEL_2 })

        this.camera = new Camera({ scene: this });
    }

    create(): void {
        // Display Map
        this.cameras.main.fadeIn(500);

        const tilemap = this.make.tilemap({ key: CAVE_MAP });
        const tileset1 = tilemap.addTilesetImage("Tiles", "tiles");
        const tileset2 = tilemap.addTilesetImage("tiles2", "tiles2");

        const platformLayer = tilemap.createLayer(PLATFORMS_LAYER_NAME, [tileset1, tileset2], 0, 35);
        platformLayer.setCollisionByProperty({ collides: true });
        platformLayer.setDepth(10);

        // World properties
        this.matter.world.convertTilemapLayer(platformLayer);
        this.matter.world.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);

        // Title
        this.sceneTitle.add();

        // Add players and characters
        const playerSpawnPoint = tilemap.findObject(OBJECTS_LAYER_NAME, obj => obj.name === PLAYER_SPAW_POINT_NAME);
        const developerSpawnPoint = tilemap.findObject(OBJECTS_LAYER_NAME, obj => obj.name === DEVELOPER_SPAW_POINT_NAME);
        this.player.add(playerSpawnPoint.x, playerSpawnPoint.y);
        this.developer.add(developerSpawnPoint.x, developerSpawnPoint.y);

        // Collision groups
        const noCollisionGroup = this.matter.world.nextGroup(true);
        this.player.collideWith(noCollisionGroup);
        this.developer.collideWith(noCollisionGroup);

        // Camera
        this.camera.add(tilemap.widthInPixels, tilemap.heightInPixels);
        this.camera.follow(this.player)

        // Level 1
        this.boxes[0].addWithSpawnPoint(tilemap)

        // Level 2
        this.interruptorBoxLvl2.addWithSpawnPoint(tilemap)
        this.interruptorBoxLvl2.collideWith(noCollisionGroup);
    }

    update() {
        this.player.handleMovements();
    }
}
