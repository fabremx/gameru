import { MainScene } from "./scenes/main-scene";
import { SceneB } from "./scenes/sceneB";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  parent: "game",
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 1 }, // This is the default value, so we could omit this

      // Enable debug graphics, so we can see the bounds of each physics 
      // object in our scene. Note: this can slow things down, so be sure 
      // to turn it off when you aren't debugging
      debug: true
    }
  },
  scene: [MainScene, SceneB],
};
