import Phaser from "phaser";
import { EnemiesTestBedScene } from "./scene/enemies-test-bed";
import { FieldScene } from "./scene/field-scene";
import { FPSTestScene } from "./scene/fps-test-scene";
import { GameScene } from "./scene/game-scene";
import { HomeScene } from "./scene/home-scene";
import { MainScene } from "./scene/main-scene";
import { WaveEndScene } from "./scene/wave-end-scene";

import "./style.css";

new Phaser.Game({
  parent: "app",
  width: 1920,
  height: 992,
  backgroundColor: "#48992C",
  scene: [HomeScene, GameScene, FieldScene, EnemiesTestBedScene, WaveEndScene],
  scale: {
    mode: Phaser.Scale.CENTER_BOTH,
  },
  fps: {
    target: 90,
    min: 80,
    forceSetTimeOut: true,
  },
});
