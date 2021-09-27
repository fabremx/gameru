import { IImageConstructor } from "../interfaces/image.interface";

export class Player extends Phaser.GameObjects.Image {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private walkingSpeed: number = 5;
  body: Phaser.Physics.Arcade.Body;


  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.initSprite();
    this.initPhysics();
    this.initInput();
    this.setInteractive();
    this.depth = 50;
    this.body.setGravityY(0);
    this.scene.add.existing(this);
    this.body.setGravityY(1000);
  }


  private initSprite() {
    // this.scene.physics.add.sprite(100, 450, 'player');
    // this.setScale(0.5);
  }

  private initInput(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  private initPhysics() {
    // this.scene.physics.world.enable(this);
    // this.body.setVelocity(0, 0);
    // this.body.setBounce(1, 1);
    this.body.setCollideWorldBounds(true);
  }

  handleInput(camera: any, width: number, height: number): void {
    if (this.cursors.right.isDown) {
      this.x += this.walkingSpeed;

      // if (this.x + 50 > width) {
      //   console.log('scale RIGHT')
      //   camera.scrollX -= 50
      // }

      this.setFlipX(false);
    } else if (this.cursors.left.isDown) {
      this.x -= this.walkingSpeed;
      // if (this.x - 50 < 0) {
      //   console.log('scale LEFT')
      //   camera.scrollX -= 50
      // }
      this.setFlipX(true);
    } else if (this.cursors.up.isDown) {
      this.y -= this.walkingSpeed;

      // this.body.setGravityY(1000);
    } else if (this.cursors.down.isDown) {
      this.y += this.walkingSpeed;
    }
  }
}
