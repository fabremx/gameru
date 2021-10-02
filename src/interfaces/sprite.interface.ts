export interface IPlayerSpriteConstructor {
  scene: Phaser.Scene;
  x: number;
  y: number;
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
  x: number;
  y: number;
  name: string;
  sprite: {
    path: string;
    width: number;
    height: number;
    margin: number,
    spacing: number,
  }
}
