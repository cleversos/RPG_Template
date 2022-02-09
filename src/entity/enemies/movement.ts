import { Vec2 } from "planck-js";
import { enemies } from "../../helpers/vars";
import { EntityComponent } from "../entity";
import { EnemyMachine } from "./machine";
import { Enemy } from "./enemy";
import { EnemyBody } from "./body";
import { Cameras, Scene } from "phaser";

export class EnemyMovement extends EntityComponent {
  public enemy: Enemy;
  public machine: EnemyMachine;
  public knockBack: boolean = false;
  public knockBackDelay: number = 300;

  public knockBackFlashDelay: number = 0;
  public flash: boolean = false;
  public moveSpeed: number = 0;
  public constructor(enemy: Enemy) {
    super();
    this.enemy = enemy;
  }

  update() {
    if (this.knockBack) {
      if (this.knockBackDelay > 0) {
        this.knockBackDelay -= 200 / 8;
        if (this.knockBackFlashDelay > 0) {
          this.knockBackFlashDelay -= 200 / 8;
        } else {
          if (this.flash) {
            this.machine.avatar.avatar.setTintFill(0xffffff);
          } else this.machine.avatar.avatar.clearTint();
          this.flash = !this.flash;
          this.knockBackFlashDelay = 8;
        }
      } else {
        this.knockBack = false;
        this.machine.avatar.avatar.clearTint();
      }
    }
    this.machine.update();
  }

  public doKnockedback(nDirection: number, fx: number = 9, fy: number = 0) {
    // console.log('Enemy Knocked Back');

    this.enemy.scene.cameras.main.shake(30, 0.002);
    
    
    this.knockBack = true;
    this.knockBackDelay = 80;
    
    const enemyBody = this.enemy.getComponent<EnemyBody>("body").body;
    enemyBody.setLinearVelocity(Vec2(fx * nDirection, fy));
    enemyBody.applyForceToCenter(Vec2(150 * nDirection, 0));
    enemyBody.setGravityScale(1);
  }
}
