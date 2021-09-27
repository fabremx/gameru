import { Player } from "../objects/player";
import { Player2 } from "../objects/player2";
import { Pnj } from "../objects/pnj";

export class MainScene extends Phaser.Scene {
  private player: Player2;
  private pnj: Pnj;
  background: any;
  background2: any;
  background3: any;
  ground: any;
  verts: any
  text: any;
  label: any;
  collider: Phaser.Physics.Arcade.Collider;

  constructor() {
    super({ key: "MainScene" });
  }

  preload(): void {
    this.load.image('background1', 'assets/backgrounds/back1.png');
    this.load.image('background2', 'assets/backgrounds/back2.png');
    this.load.image('background3', 'assets/backgrounds/back3.png');

    this.load.image("tiles", "assets/tilemaps/tiles/tiles.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/maps/prelude.json");

    this.load.spritesheet("player", "assets/sprites/player.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2,
    });
  }

  create(): void {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("Tiles", "tiles");

    const worldLayer = map.createLayer("world", tileset, 0, 35);
    const platformLayer = map.createLayer("platforms", tileset, 0, 35);

    platformLayer.setCollisionByProperty({ collides: true });
    platformLayer.setDepth(10);
    worldLayer.setDepth(15);

    this.matter.world.convertTilemapLayer(platformLayer);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


    this.background = this.add.image(this.scale.width - 200, this.scale.height - 400, 'background1');
    this.background2 = this.add.image(this.scale.width - 200, this.scale.height - 300, 'background2');
    this.background3 = this.add.image(this.scale.width - 200, this.scale.height - 200, 'background3');

    // const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn");
    // this.player = new Player({
    //   scene: this,
    //   x: spawnPoint.x,
    //   y: spawnPoint.x,
    //   texture: "player",
    // });

    // this.player = new Player({
    //   scene: this,
    //   x: this.scale.width - 400,
    //   y: 300,
    //   texture: "player",
    // });

    // this.physics.add.collider(this.player, worldLayer);

    // this.physics.world.setBounds(0, 0, this.scale.width * 3, this.scale.height);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const spawn = map.findObject("Spawn", (obj) => obj.name === "Spawn Point");
    console.log('Spawn', spawn)
    this.player = new Player2({
      scene: this,
      x: this.scale.width - 400,
      y: 700,
      texture: ''
    });

    this.player.sprite.setDepth(20);

    // this.pnj = new Pnj({
    //   scene: this,
    //   x: this.scale.width + 1000,
    //   y: 500,
    //   texture: "player",
    // });

    // this.player.setScale(2);

    // this.ground = this.add.image(this.scale.width + 500, this.scale.height / 2, 'ground');
    // this.background.setDisplaySize(this.scale.width * 2, this.scale.height);
    // this.ground.setDisplaySize(this.scale.width * 2, this.scale.height);


    this.label = this.add.text(this.scale.width + 500, 500, '')
      .setWordWrapWidth(100)
    this.typewriteTextWrapped('Hello, World!')


    this.text = this.add.text(this.scale.width + 500, 200, 'Chapitre 1. Prélude', { color: 'green', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '44px' });

    this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

    // this.physics.add.overlap(this.player, this.pnj, () => console.log('overlap'))
    // this.cameras.main.setZoom(2);


  }

  update() {
    this.player.handleInput(this.cameras.main, this.scale.width, this.scale.height);

    // console.log('this.player.x', this.player.x)
    // if (this.player.x <= 900) {
    //   this.scene.start('SceneB');
    // }

    this.background.x -= 0.05;
    this.background2.x -= 0.15;
    this.background3.x -= 0.25;
  }

  typewriteText(text: string) {
    const length = text.length
    let i = 0
    this.time.addEvent({
      callback: () => {
        this.label.text += text[i]
        ++i
      },
      repeat: length - 1,
      delay: 100
    })
  }

  typewriteTextWrapped(text: string) {
    const lines = this.label.getWrappedText(text)
    const wrappedText = lines.join('\n')

    this.typewriteText(wrappedText)
  }
}
