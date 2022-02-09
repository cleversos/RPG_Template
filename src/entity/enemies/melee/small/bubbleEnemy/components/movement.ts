import { Vec2 } from "planck-js";
import { EnemyMovement } from "../../../../../enemies/movement";
import { BubbleEnemy } from "../bubble-enemy";
import { BubbleEnemyBody } from "./body";
import { BubbleEnemyMachine } from "./machine/machine";

export class BubbleEnemyMovement extends EnemyMovement {
  public inputs: Phaser.Types.Input.Keyboard.CursorKeys;
  public speed: Vec2 = Vec2(15, 24);
  public bubbleEnemy: BubbleEnemy;
  public constructor(public enemy: BubbleEnemy) {
    super(enemy);
    this.bubbleEnemy = enemy;
  }

  doKnockedback(nDirection: number, fx: number = 9, fy: number = 0) {


    console.log('Bubble Knocked Back');
    this.knockBack = true;
    this.knockBackDelay = 80;


    const body = this.enemy.getComponent<BubbleEnemyBody>("body");
    body.burst.bind(body);
    body.burst();
  }

  start() {
    this.machine = new BubbleEnemyMachine(this.bubbleEnemy);
  }
}
