import Player from "../objects/player";
import Character from "../objects/character";
import SceneTitle from "../objects/sceneTitle";
import Camera from "../objects/camera";
import Map from "../objects/map";
import { DECORATION_LAYER_NAME, DEVELOPER_SPAW_POINT_NAME, GO_TO_CAVE_ZONE_NAME, OBJECTS_LAYER_NAME, PLATFORMS_LAYER_NAME, PLAYER_SPAW_POINT_NAME } from "../constants/tilemap";

export default class PreludeScene extends Phaser.Scene {
  private player: Player;
  private developer: Character;

  private sceneTitle: SceneTitle;
  private camera: Camera;
  private map: Map;

  background: any;
  background2: any;
  background3: any;

  constructor() {
    super({ key: "PreludeScene" });
  }

  preload(): void {
    this.load.image('background1', 'assets/backgrounds/back1.png');
    this.load.image('background2', 'assets/backgrounds/back2.png');
    this.load.image('background3', 'assets/backgrounds/back3.png');

    this.map = new Map({ scene: this, mapPath: "assets/tilemaps/maps/prelude.json", tilesPath: "assets/tilemaps/tiles/tiles.png" })

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
    this.map.add();
    const platformLayer = this.map.createLayer({ name: PLATFORMS_LAYER_NAME, options: { collision: true, depth: 10 } });
    this.map.createLayer({ name: DECORATION_LAYER_NAME, options: { collision: false, depth: 15 } })

    // World properties
    this.matter.world.convertTilemapLayer(platformLayer);
    this.matter.world.setBounds(0, 0, this.map.size().width, this.map.size().height);

    this.background = this.add.image(this.scale.width - 200, this.scale.height - 400, 'background1');
    this.background2 = this.add.image(this.scale.width - 200, this.scale.height - 300, 'background2');
    this.background3 = this.add.image(this.scale.width - 200, this.scale.height - 200, 'background3');

    var noCollisionGroup = this.matter.world.nextGroup(true);
    const playerSpawnPoint = this.map.tilemap.findObject(OBJECTS_LAYER_NAME, obj => obj.name === PLAYER_SPAW_POINT_NAME);
    const developerSpawnPoint = this.map.tilemap.findObject(OBJECTS_LAYER_NAME, obj => obj.name === DEVELOPER_SPAW_POINT_NAME);
    const gotoCaveZone = this.map.tilemap.findObject(OBJECTS_LAYER_NAME, obj => obj.name === GO_TO_CAVE_ZONE_NAME);

    this.sceneTitle.add();
    this.player.add(playerSpawnPoint.x, playerSpawnPoint.y);
    this.developer.add(developerSpawnPoint.x, developerSpawnPoint.y);

    this.player.collideWith(noCollisionGroup);
    this.developer.collideWith(noCollisionGroup);

    // Camera
    this.camera.add(this.map.size().width, this.map.size().height);
    this.camera.follow(this.player)
  }

  update() {
    this.player.handleMovements();
    this.player.handleDialogs();
    this.player.handleOverlapWith([this.developer]);

    this.background.x -= 0.05;
    this.background2.x -= 0.15;
    this.background3.x -= 0.25;
  }
}
