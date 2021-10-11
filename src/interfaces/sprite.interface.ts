export interface IPlayerSpriteConstructor {
  scene: Phaser.Scene;
  sprite: {
    path: string;
    width: number;
    height: number;
    margin: number,
    spacing: number,
  }
}

export interface ICharacterSpriteConstructor {
  scene: Phaser.Scene;
  name: string;
  sprite: {
    path: string;
    width: number;
    height: number;
    margin: number,
    spacing: number,
  }
}
