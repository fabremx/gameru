import { IImageConstructor } from "../interfaces/image.interface";

export class Pnj extends Phaser.GameObjects.Image {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private walkingSpeed: number = 5;
  body: Phaser.Physics.Arcade.Body;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.initSprite();
    this.initPhysics();
    this.initInput();
    this.setInteractive();
    this.body.setGravityY(0);
    this.scene.add.existing(this);
  }


  private initSprite() {
    // this.scene.physics.add.sprite(100, 450, 'player');
    // this.setScale(0.5);
  }

  private initInput(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  private initPhysics() {
    this.scene.physics.world.enable(this);
    // this.body.setVelocity(0, 0);
    // this.body.setBounce(1, 1);
    // this.body.setCollideWorldBounds(true);
  }

  handleInput(): void {
    if (this.cursors.right.isDown) {
      console.log('right')
      this.x += this.walkingSpeed;
      this.setFlipX(false);
    } else if (this.cursors.left.isDown) {
      this.x -= this.walkingSpeed;
      this.setFlipX(true);
    } else if (this.cursors.up.isDown) {
      this.body.setGravityY(1000);
    } else if (this.cursors.down.isDown) {
      this.y += this.walkingSpeed;
    }
  }
}
