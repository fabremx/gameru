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
  key: string;
  sprite: {
    path: string;
    width: number;
    height: number;
    margin: number,
    spacing: number,
  }
}
