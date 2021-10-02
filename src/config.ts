import PreludeScene from "./scenes/prelude";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  backgroundColor: '#6FE7FC',
  parent: "game",
  physics: {
    default: "matter",
    matter: {
      debug: true
    }
  },
  scene: [PreludeScene],
};
