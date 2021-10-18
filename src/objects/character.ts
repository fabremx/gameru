import { retrieveAlienDialogs } from "../dialogs/alien/dialogsHandler";
import { ITalk } from "../interfaces/dialogs.interface";
import { ICharacterSpriteConstructor } from "../interfaces/sprite.interface";
import Player from "./player";

export default class Character {
  sprite: Phaser.Physics.Matter.Sprite;
  private scene: Phaser.Scene;

  private x: number;
  private y: number;
  private key: string;

  private isAlreadyOverlap: boolean = false;

  private talkKeyImage: Phaser.GameObjects.Image;
  private talkNotificationText: Phaser.GameObjects.Text;
  private dialogCounter: number = 0;

  public isSpeakableCharacter: boolean = true;

  constructor({ scene, key, sprite }: ICharacterSpriteConstructor) {
    this.scene = scene
    this.key = key;

    this.scene.load.image("keyTalk", 'assets/images/keyE.png');
    this.scene.load.spritesheet(key, sprite.path, {
      frameWidth: sprite.width,
      frameHeight: sprite.height,
      margin: sprite.margin,
      spacing: sprite.spacing,
    });

    this.scene.events.on(`RESET_LAST_DIALOG_REPEATED_${key}`, () => this.dialogCounter = 0);
  }

  add(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.sprite = this.scene.matter.add.sprite(this.x, this.y, this.key, 0);
    this.sprite.setDataEnabled()
    this.sprite.setData({ type: 'character', key: this.key });

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

  handleOverlapWith(player: Player) {
    const isOverlaping = this.scene.matter.overlap(this.sprite, [player.sprite]);

    const isFirstOverlapping = isOverlaping && !this.isAlreadyOverlap;
    const isLastOverlapping = !isOverlaping && this.isAlreadyOverlap;

    if (isFirstOverlapping && this.isSpeakableCharacter) {
      this.isAlreadyOverlap = true;
      this.createTalkNotification();
      this.scene.events.emit(`OVERLAP_CHARACTER_START`, this);
    }

    if (isLastOverlapping) {
      this.isAlreadyOverlap = false;
      this.destroyTalkNotification();
      this.scene.events.emit(`OVERLAP_CHARACTER_END`);
    }
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
