import { ICharacterSpriteConstructor } from "../interfaces/sprite.interface";

export default class Character {
  sprite: Phaser.Physics.Matter.Sprite;
  scene: Phaser.Scene;

  x: number;
  y: number;
  name: string;

  constructor({ scene, x, y, name, sprite }: ICharacterSpriteConstructor) {
    this.scene = scene
    this.x = x;
    this.y = y;
    this.name = name;

    this.scene.load.spritesheet(name, sprite.path, {
      frameWidth: sprite.width,
      frameHeight: sprite.height,
      margin: sprite.margin,
      spacing: sprite.spacing,
    });
  }

  add() {
    this.sprite = this.scene.matter.add.sprite(this.x, this.y, this.name, 0);

    this.sprite
      .setPosition(this.x, this.y)
      .setDepth(15);
  }

  collideWith(group: number) {
    this.sprite.setCollisionGroup(group)
  }

  destroy() {
    this.sprite.destroy();
  }
}
