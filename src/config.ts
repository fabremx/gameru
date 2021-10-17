import Phaser from "phaser";
import PreludeScene from "./scenes/prelude";
import CaveScene from "./scenes/cave";
// import * as PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

const pluginConfig = {
  // The plugin class:
  plugin: PhaserMatterCollisionPlugin,
  // Where to store in Scene.Systems, e.g. scene.sys.matterCollision:
  key: "matterCollision" as "matterCollision",
  // Where to store in the Scene, e.g. scene.matterCollision:
  mapping: "matterCollision" as "matterCollision",
};

declare module "phaser" {
  interface Scene {
    [pluginConfig.mapping]: PhaserMatterCollisionPlugin;
  }
  namespace Scenes {
    interface Systems {
      [pluginConfig.key]: PhaserMatterCollisionPlugin;
    }
  }
}

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  backgroundColor: '#6FE7FC',
  parent: "game",
  scene: [CaveScene, PreludeScene],
  physics: {
    default: "matter",
    matter: {
      debug: true
    }
  },
  plugins: {
    scene: [pluginConfig]
  },
};
