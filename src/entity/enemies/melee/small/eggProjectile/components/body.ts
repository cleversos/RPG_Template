import { Body, Box, Circle, Contact, Fixture, Vec2 } from "planck-js";
import { GameCore } from "../../../../../../core/game";
import { enemies } from "../../../../../../helpers/vars";
import { PlanckPhaserAdapter } from "../../../../../../physic/planck-phaser-adapter";
import { EntityComponent } from "../../../../../entity";
import { PlayerBody } from "../../../../../player/components/body";
import { PlayerMovement } from "../../../../../player/components/movement";
import { playerInWorld } from "../../../../../player/player";
import { EggProjectile } from "../egg-projectile";
import { FlyingState } from "./machine/states/flying";
import { EggProjectileMovement } from "./movement";
import { EnemyBody } from "../../../../body";
import { Scene } from "phaser";

const adapter = PlanckPhaserAdapter;

export class EggProjectileBody extends EnemyBody {
  public body: Body;

  public chestFixture: Fixture;
  public feetFixture: Fixture;

  public constructor(enemy: EggProjectile) {
    super(enemy);
  }

  start() {
    const eggProjectile = this.enemy;
    const scene = this.enemy.scene;
    const worldScale = adapter.planckPhysics.worldScale;

    this.body = adapter.createCircle(
      eggProjectile.x,
      eggProjectile.y,
      enemies.eggEnemy.eggProjectile.bodyRadius
    );

    this.body.setGravityScale(0.2);
    this.body.getFixtureList().setSensor(true);

    this.body.setMassData({
      I: 0,
      mass: 0.1,
      center: Vec2(),
    });

    this.body.setUserData({ tag: "egg-projectile", parent: this });

    adapter.world.on("begin-contact", this.beginContact.bind(this));
    adapter.world.on("end-contact", this.endContact.bind(this));

    adapter.bodies.get(this.body).setAlpha(0);
  }

  public beginContact(contact: Contact) {
    if (contact.isTouching() && !this.enemy.dead) {
      const bodies = [
        contact.getFixtureA().getBody(),
        contact.getFixtureB().getBody(),
      ];
      const bodiesTag = this.identifyBodiesTag(bodies);
      const isPlayerOrGroundTag =
        bodiesTag.has("player") || bodiesTag.has("ground");
      if (isPlayerOrGroundTag && bodiesTag.has("egg-projectile")) {
        const eggProjectile = bodiesTag.get("egg-projectile");
        const { tag, parent } = eggProjectile.getUserData() as any;

        const eggProjectileMovement: EggProjectileMovement =
          parent.enemy.getComponent("movement");
        if (parent === this && !eggProjectileMovement.machine.hasCollided) {
          if (bodiesTag.has("player")) {
            const player = playerInWorld;
            const movement =
              player.getComponent<PlayerMovement>("player-movement");
            if (!movement.preventKnockBack) GameCore.heart -= 1;
            movement.knockback(this.enemy.direction);
          }

          eggProjectileMovement.machine.hasCollided = true;
        }
      }
    }
  }

  public endContact(contact: Contact) {}

  update() {
    if (!this.body) return;
    const screenPosition = adapter.getScreenPosition(this.body.getPosition());
    this.enemy.x = this.enemy.container.x = Math.floor(screenPosition.x);
    this.enemy.y = this.enemy.container.y = Math.floor(screenPosition.y);
  }
}
