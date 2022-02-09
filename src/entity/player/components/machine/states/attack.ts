import { Vec2 } from "planck-js";
import { AnimationData } from "../../../../../animation/data";
import { EnemyMovement } from "../../../../enemies/movement";
import { PlayerAvatar } from "../../avatar";
import { PlayerBody } from "../../body";
import { PlayerMachine } from "../machine";
import { IdleState } from "./idle";
import { MidAirState } from "./mid-air";
import { PlayerState } from "./state";
import { playerInWorld, Player } from "../../../player";
import { EnemyBody } from "../../../../enemies/body";
import { PlayerAbilities } from "../../abilities";
import { EggEnemyBody } from "../../../../enemies/ranged/small/eggEnemy/components/body";
import { EggProjectileBody } from "../../../../enemies/melee/small/eggProjectile/components/body";
import { FireTwo } from "../../abilities/fire/fire-two";
import { GameCore } from "../../../../../core/game";
import { LightingOne } from "../../abilities/lighting/lighting-one";

let attackSlashDamage: number = 2;
let attackFireSlash: number = 1.5;

export class AttackState extends PlayerState {
  public avatar: PlayerAvatar;
  public emitHitEnemy: boolean = false;
  public decreaseFireAttack: boolean = false;
  public constructor(public machine: PlayerMachine, public action: number) {
    super(machine);
    const idleTransition = (machine: PlayerMachine) => {
      const slash = this.avatar.attackSlash;
      const body = this.machine.player.getComponent<PlayerBody>("player-body");
      const avatar = this.avatar.avatar;
      const data = AnimationData.get(this.machine.player.scene, "2");
      if (!data) return;
      const frames = data.actionsFrames.get(0);
      if (!frames) return;
      const end = frames.size;

      slash.image.scaleX = Math.abs(slash.image.scaleX) * avatar.image.scaleX;
      const playerDirection = avatar.image.scaleX;
      const abilities =
        this.machine.player.getComponent<PlayerAbilities>("player-abilities");

      const sensorDirection =
        avatar.image.scaleX === 1 ? "right-sensor" : "left-sensor";
      const sensorTag = abilities.attackSensor + "-" + sensorDirection;
      const sensor = body.contactsManager.get(sensorTag);

      if (sensor) {
        sensor.activeContact.forEach((b) => {
          const enemyBody = (b.getUserData() as any).parent as EnemyBody;
          if (enemyBody) {
            const enemyMovement =
              enemyBody.enemy.getComponent<EnemyMovement>("movement");
            if (!enemyMovement) return;
            if (enemyBody instanceof EggProjectileBody) {
              enemyBody.enemy.destroy();
            } else {
              if (!enemyMovement.knockBack) {
                enemyMovement.doKnockedback(avatar.image.scaleX);
                if (abilities.attackSensor === "fire-attack") {
                  const s = GameCore.skills.get("ሃልሃልታ");
                  enemyMovement.enemy.life -=
                    attackSlashDamage + attackFireSlash * s.count;
                } else if (abilities.attackSensor === "lighting-attack") {
                  const s = GameCore.skills.get("ህቦብላ");
                  enemyMovement.enemy.life -=
                    attackSlashDamage + attackFireSlash + 1.5 * s.count;
                } else {
                  enemyMovement.enemy.life -= attackSlashDamage;
                }
              }
            }
          }
        });
      }

      const movement = this.machine.movement;
      const inputsKey = movement.inputs;
      const inputs = Vec2();
      const grounded = body.onGround();

      if (inputsKey.left.isDown) inputs.x = -1;
      else if (inputsKey.right.isDown) inputs.x = 1;

      if (inputsKey.up.isDown) inputs.y = -1;

      if (avatar && movement && inputs && grounded) {
        if (inputs.y === -1) {
          this.machine.player
            .getComponent<PlayerBody>("player-body")
            .body.setLinearVelocity(Vec2(0, -1 * 84));
          this.machine.state = new MidAirState(machine);
          this.machine.state.enter();
          return true;
        }
      }
      if (slash.frame + 1 === end) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        if (
          !this.emitHitEnemy &&
          abilities.attackSensor === "fire-attack" &&
          !this.decreaseFireAttack
        ) {
          const fireTwo = abilities.abilities.get("fire-two") as FireTwo;
          this.decreaseFireAttack = true;
          if (fireTwo) {
            fireTwo.abilityAmmo -= 1;
          }
        }

        if (
          !this.emitHitEnemy &&
          abilities.attackSensor === "lighting-attack"
        ) {
          const lightingOne = abilities.abilities.get(
            "lighting-one"
          ) as LightingOne;
          if (lightingOne) {
            lightingOne.abilityAmmo -= 1;
          }
        }
        return true;
      }
    };

    this.transitions.set("idle", idleTransition);
    this.avatar = this.machine.avatar;
  }

  public enter() {
    this.avatar.avatar.action = this.action;
    this.avatar.avatar.frame = 0;
    this.avatar.avatar.framerate = this.avatar.attackSlash.framerate =
      1000 / 100;
    this.avatar.attackSlash.frame = 0;
  }

  public update() {
    const avatar = this.machine.avatar;
    const movement = this.machine.movement;
    const body =
      this.machine.player.getComponent<PlayerBody>("player-body").body;
    const inputsKey = movement.inputs;
    const inputs = Vec2();

    const bodyVelocity = body.getLinearVelocity();

    if (inputsKey.left.isDown) inputs.x = -1;
    else if (inputsKey.right.isDown) inputs.x = 1;

    if (inputsKey.up.isDown) inputs.y = -1;

    if (!this.machine.movement.knockBack)
      body.setLinearVelocity(Vec2(inputs.x * 3, bodyVelocity.y * 0.055));

    super.update();
  }
}
