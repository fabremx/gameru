import { retrieveAlienDialogs } from "../dialogs/alien/dialogsHandler";
import { ITalk } from "../interfaces/dialogs.interface";
import { ICharacterSpriteConstructor } from "../interfaces/sprite.interface";

export default class Character {
  sprite: Phaser.Physics.Matter.Sprite;
  scene: Phaser.Scene;

  x: number;
  y: number;
  name: string;

  private talkKeyImage: Phaser.GameObjects.Image;
  private talkNotificationText: Phaser.GameObjects.Text;
  private dialogCounter: number = 0;

  public isSpeakableCharacter: boolean = true;

  constructor({ scene, name, sprite }: ICharacterSpriteConstructor) {
    this.scene = scene
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
    this.scene.events.on(`RESET_LAST_DIALOG_REPEATED_${name}`, () => this.dialogCounter = 0);
  }

  add(x: number, y: number) {
    this.x = x;
    this.y = y;

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
    const currentTalk: ITalk = retrieveAlienDialogs()
    return currentTalk.dialogs[this.dialogCounter];
  }
  prepareNextDialog() {
    const currentTalk: ITalk = retrieveAlienDialogs()
    const isLastTalk = this.dialogCounter === currentTalk.dialogs.length - 1

    if (isLastTalk) {
      if (currentTalk.repeatLast) return;

      this.dialogCounter = 0;
      return;
    }

    this.dialogCounter += 1;
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
    if (this.talkKeyImage) {
      this.talkKeyImage.destroy();
    }

    if (this.talkNotificationText) {
      this.talkNotificationText.destroy();
    }
  }
}
