import { ICharacterSpriteConstructor } from "../interfaces/sprite.interface";

export default class Character {
  private sprite: Phaser.Physics.Matter.Sprite;
  private scene: Phaser.Scene;

  private x: number;
  private y: number;
  public name: string;

  constructor({ scene, x, y, name }: ICharacterSpriteConstructor) {
    this.scene = scene
    this.x = x;
    this.y = y;
    this.name = name;
  }

  add() {
    this.sprite = this.scene.matter.add.sprite(0, 0, this.name, 0);
    this.sprite
      .setScale(2)
      .setPosition(this.x, this.y);
  }

  destroy() {
    this.sprite.destroy();
  }
}
