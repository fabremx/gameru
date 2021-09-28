import PreludeScene from "./scenes/prelude";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  parent: "game",
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 1 },
      debug: true
    }
  },
  scene: [PreludeScene],
};
