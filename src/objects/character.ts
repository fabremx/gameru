import { ICharacterSpriteConstructor } from "../interfaces/sprite.interface";

export default class Character {
  sprite: Phaser.Physics.Matter.Sprite;
  scene: Phaser.Scene;

  x: number;
  y: number;
  name: string;

  private talkKeyImage: Phaser.GameObjects.Image;
  private talkNotificationText: Phaser.GameObjects.Text;

  private isSpeakableCharacter: boolean = true;

  constructor({ scene, x, y, name, sprite }: ICharacterSpriteConstructor) {
    this.scene = scene
    this.x = x;
    this.y = y;
    this.name = name;

    this.scene.load.image("keyTalk", 'assets/images/keyE.png');
    this.scene.load.spritesheet(name, sprite.path, {
      frameWidth: sprite.width,
      frameHeight: sprite.height,
      margin: sprite.margin,
      spacing: sprite.spacing,
    });

    this.scene.events.on(`OVERLAP_START_${name}`, () => this.initOverlapWithPlayer());
    this.scene.events.on(`OVERLAP_END_${name}`, () => this.endOverlapWithPlayer());
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

  getDialogs(): string[] {
    return [
      'test',
      'Salut à toi joueur, je suis une boite de dialogue avec du texte à l\'inérieur. J\'essaye d\'écrire un très très long texte pour voir comment se comporte les retours à la ligne dans cette boite. Esperons que cela marche bien',
      'Profite de pouvoir ta baller sur la carte. A plus'
    ]
  }

  private initOverlapWithPlayer() {
    if (!this.isSpeakableCharacter) return
    this.createTalkNotification()
  }
  private endOverlapWithPlayer() {
    this.destroyTalkNotification()
  }

  private createTalkNotification() {
    this.talkKeyImage = this.scene.add.image(this.sprite.x - 30, this.sprite.y - 85, "keyTalk", 0);
    this.talkNotificationText = this.scene.add.text(this.sprite.x, this.sprite.y - 100, 'Parler', {
      font: "32px Arial",
      color: 'white',
      backgroundColor: 'rgba(0,0,0,0.5)'
    });
  }

  private destroyTalkNotification() {
    this.talkKeyImage.destroy();
    this.talkNotificationText.destroy();
  }
}
