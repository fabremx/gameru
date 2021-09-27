import { Player } from "../objects/player";
import { Pnj } from "../objects/pnj";

export class SceneB extends Phaser.Scene {
  private player: Player;
  private pnj: Pnj;
  a: any;
  collider: Phaser.Physics.Arcade.Collider;

  constructor() {
    super({ key: "SceneB" });
  }

  preload(): void {
    this.load.image('background2', 'assets/background2.jpg');
    this.load.spritesheet("player", "assets/player.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create(): void {
    this.physics.world.setBounds(0, 0, this.scale.width * 3, this.scale.height);
    this.cameras.main.setBounds(0, 0, this.scale.width * 3, this.scale.height);

    this.player = new Player({
      scene: this,
      x: this.scale.width + 200,
      y: 300,
      texture: "player",
    });

    this.pnj = new Pnj({
      scene: this,
      x: this.scale.width + 1000,
      y: 500,
      texture: "player",
    });

    console.log('BBBBBB', this.scale.width, this.scale.height)
    this.a = this.add.image(this.scale.width, this.scale.height / 2, 'background2');
    this.a.setDisplaySize(this.scale.width, this.scale.height);

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // this.cameras.main.setZoom(2);
  }

  update() {
    this.player.handleInput(this.cameras.main, this.scale.width, this.scale.height);

    // console.log(this.player.x)
    if (this.player.x >= this.scale.width * 3 - 50) {
      this.scene.start('MainScene');
    }
  }
}
