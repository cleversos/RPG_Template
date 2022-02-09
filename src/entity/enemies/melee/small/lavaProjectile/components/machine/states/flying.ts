import { Vec2 } from "planck-js";
import { adapter } from "../../../../../../../../scene/main-scene";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { LavaProjectileBody } from "../../body";
import { LavaProjectileMachine } from "../machine";
import { BrokenState } from "./broken";
import { LavaProjectileState } from "./state";

export class FlyingState extends LavaProjectileState {
  private current_flightDuration_ms = 0;
  private target_flightDuration_ms = 4000;
  private curve: Phaser.Curves.CubicBezier;
  private projectileCurveHeight = 10;
  private isFlightComplete = false;
  public constructor(public machine: LavaProjectileMachine) {
    super(machine);

    const brokenTransition = (machine: LavaProjectileMachine) => {
      const avatar = this.machine.avatar;

      if (this.machine.hasCollided || this.isFlightComplete) {
        this.machine.state = new BrokenState(machine);
        this.machine.state.enter();
        return true;
      }
    };

    this.transitions.set("broken", brokenTransition);
  }

  enter() {
    // console.log(this.machine.enemy.name + " entered FlyingState");

    this.createCurve();
  }

  update() {
    this.incrementFlightDuration();
    this.moveProjectileOnCurve();
    super.update();
  }

  incrementFlightDuration() {
    if(this.current_flightDuration_ms < this.target_flightDuration_ms) {
      this.current_flightDuration_ms += adapter.deltaTime;
    } else {
      this.current_flightDuration_ms = this.target_flightDuration_ms;
    }
  }

  createCurve() {
    const projectileBody =
      this.machine.enemy.getComponent<LavaProjectileBody>("body");
    const projectileBodyPosition = projectileBody.body.getPosition();

    const playerBody =
      playerInWorld.getComponent<PlayerBody>("player-body");
    const playerPosition = playerBody.body.getPosition();

    let distance = Phaser.Math.Distance.Between(projectileBodyPosition.x, projectileBodyPosition.y, playerPosition.x, playerPosition.y);
    const distanceDirection = projectileBodyPosition.x < playerPosition.x ? 1 : -1;
    distance *= distanceDirection;

    const startPoint = new Phaser.Math.Vector2(projectileBodyPosition.x, projectileBodyPosition.y);
    const controlPoint1 = new Phaser.Math.Vector2(projectileBodyPosition.x + (distance * 0.333), playerPosition.y - this.projectileCurveHeight);
    const controlPoint2 = new Phaser.Math.Vector2(projectileBodyPosition.x + (distance * 0.666), playerPosition.y - this.projectileCurveHeight);
    const endPoint = new Phaser.Math.Vector2(playerPosition.x, playerPosition.y);

    this.curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);
  }

  moveProjectileOnCurve() {
    const projectileBody =
      this.machine.enemy.getComponent<LavaProjectileBody>("body");
    const timePercentage = this.current_flightDuration_ms / this.target_flightDuration_ms;
    const point = this.curve.getPoint(timePercentage);
    projectileBody.body.setPosition(Vec2(point.x, point.y));
    if(timePercentage >= 1) {
      this.isFlightComplete = true;
    }
  }
}
