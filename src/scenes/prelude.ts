import Player from "../objects/player";
import Character from "../objects/character";
import SceneTitle from "../objects/sceneTitle";
import Camera from "../objects/camera";
import Map from "../objects/map";

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
    super({ key: "MainScene" });
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
      x: this.scale.width - 100,
      y: 700,
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
      x: this.scale.width + 650,
      y: 970,
      name: "alien",
      sprite: {
        path: "assets/sprites/alien.png",
        width: 66,
        height: 92,
        margin: 1,
        spacing: 2,
      }
    });

    this.camera = new Camera({ scene: this, map: this.map });
  }

  create(): void {
    // Display Map
    this.map.add();
    const platformLayer = this.map.createLayer({ name: 'platforms', options: { collision: true, depth: 10 } });
    this.map.createLayer({ name: 'world', options: { collision: false, depth: 15 } })

    // World properties
    this.matter.world.convertTilemapLayer(platformLayer);
    this.matter.world.setBounds(0, 0, this.map.size().width, this.map.size().height);

    this.background = this.add.image(this.scale.width - 200, this.scale.height - 400, 'background1');
    this.background2 = this.add.image(this.scale.width - 200, this.scale.height - 300, 'background2');
    this.background3 = this.add.image(this.scale.width - 200, this.scale.height - 200, 'background3');

    var noCollisionGroup = this.matter.world.nextGroup(true);

    this.sceneTitle.add();
    this.player.add();
    this.developer.add();

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
