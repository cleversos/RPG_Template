import { Body, Box, Circle, Contact, Fixture, Vec2 } from "planck-js";
import { GameCore } from "../../../../../../core/game";
import { enemies } from "../../../../../../helpers/vars";
import { PlanckPhaserAdapter } from "../../../../../../physic/planck-phaser-adapter";
import { EntityComponent } from "../../../../../entity";
import { PlayerBody } from "../../../../../player/components/body";
import { PlayerMovement } from "../../../../../player/components/movement";
import { playerInWorld } from "../../../../../player/player";
import { BubbleEnemy } from "../bubble-enemy";
import { LaunchState } from "./machine/states/launch";
import { BubbleEnemyMovement } from "./movement";
import { EnemyBody } from "../../../../body";
import { Scene } from "phaser";
import { BubbleEnemyMachine } from "./machine/machine";
import { BubbleEnemyAvatar } from "./avatar";
import { LetterSystem } from "../../../../../letter-system/letter-system";

const adapter = PlanckPhaserAdapter;

export class BubbleEnemyBody extends EnemyBody {
  public body: Body;

  public constructor(enemy: BubbleEnemy) {
    super(enemy);
  }

  start() {
    const bubbleEnemy = this.enemy;
    const scene = this.enemy.scene;
    const worldScale = adapter.planckPhysics.worldScale;

    this.body = adapter.createCircle(
      bubbleEnemy.x,
      bubbleEnemy.y,
      enemies.bubbleEnemy.enemyRadius
    );

    this.body.setGravityScale(0.0);
    this.body.getFixtureList().setSensor(true);

    this.body.setMassData({
      I: 0,
      mass: 0.1,
      center: Vec2(),
    });

    this.body.setUserData({ tag: "bubble-enemy-body", parent: this });

    adapter.world.on("begin-contact", this.beginContact.bind(this));
    adapter.world.on("end-contact", this.endContact.bind(this));
    //
    // adapter.bodies.get(this.body).setAlpha(0);
  }

  public beginContact(contact: Contact) {
    if (contact.isTouching() && !this.enemy.dead) {
      const bodies = [
        contact.getFixtureA().getBody(),
        contact.getFixtureB().getBody(),
      ];
      const bodiesTag = this.identifyBodiesTag(bodies);
      if (bodiesTag.has("bubble-enemy-body")) {
        contact.setEnabled(false);
      }
      const isPlayerOrGroundTag =
        bodiesTag.has("player") || bodiesTag.has("ground");
      if (isPlayerOrGroundTag && bodiesTag.has("bubble-enemy-body")) {
        const bubbleEnemy = bodiesTag.get("bubble-enemy-body");
        const { tag, parent } = bubbleEnemy.getUserData() as any;

        const bubbleEnemyMovement: BubbleEnemyMovement =
          parent.enemy.getComponent("movement");
        if (parent === this && !bubbleEnemyMovement.machine.hasCollided) {
          if (bodiesTag.has("player")) {
            this.handleBubbleHitPlayer();
          }
        }
      }
    }
  }

  public endContact(contact: Contact) {}

  update() {
    if (!this.body) return;
    if (this.enemy.dead) return;
    const screenPosition = adapter.getScreenPosition(this.body.getPosition());
    this.enemy.x = this.enemy.container.x = Math.floor(screenPosition.x);
    this.enemy.y = this.enemy.container.y = Math.floor(screenPosition.y);
  }

  handleBubbleHitPlayer() {
    // console.log(this.enemy.name + " hit player.");
    const player = playerInWorld;
    const movement = player.getComponent<PlayerMovement>("player-movement");

    if (!movement.knockBack) {
      movement.knockback(
        this.enemy.direction,
        false,
        enemies.bubbleEnemy.onBurstPlayerKnockback.x,
        enemies.bubbleEnemy.onBurstPlayerKnockback.y
      );
    }

    this.burst();
    if (!movement.preventKnockBack) GameCore.heart -= 1;
  }

  destroy() {
    if (this.body) {
      const wasDestroyed = adapter.world.destroyBody(this.body);
      // console.log("Was " + this.enemy.name + " destroyed: " + wasDestroyed);
    }
    // console.log("Bodies in world after bubble was supposed to be destroyed:", adapter.world.getBodyCount());
    adapter.world.off("begin-contact", this.beginContact.bind(this));
    adapter.world.off("end-contact", this.endContact.bind(this));
  }

  public burst() {
    const bubbleEnemyMovement: BubbleEnemyMovement =
      this.enemy.getComponent("movement");

    if (bubbleEnemyMovement.machine.hasCollided) return;
    bubbleEnemyMovement.machine.hasCollided = true;

    const bubbleEnemy = this.enemy as BubbleEnemy;
    const bubbleEnemyAvatar =
      bubbleEnemy.getComponent<BubbleEnemyAvatar>("avatar");

    bubbleEnemyAvatar.avatar.play("ocean-bubble");

    const bubbleEnemyBody = bubbleEnemy.getComponent<BubbleEnemyBody>("body");
    const bubbleEnemyBodyBody = bubbleEnemyBody.body;
    bubbleEnemyBodyBody.setGravityScale(0);

    bubbleEnemyBodyBody.setLinearVelocity(Vec2(0, 0));

    bubbleEnemyAvatar.avatar.on("animationcomplete", () => {
      bubbleEnemyAvatar.avatar.destroy();
    });

    if (bubbleEnemy.oceanEnemy) {
      bubbleEnemy.oceanEnemy.modifyCurrentBubblesActive(-1);
    }

    this.enemy.dead = true;

    // this.destroy();
    // this.enemy.destroy();

    const bubble = this.enemy;
    const scene = bubble.scene;
    const container = bubble.container;

    scene.tweens.add({
      targets: [container],
      alpha: 1,
      duration: 400,
      onComplete: () => {
        bubble.destroy();
        GameCore.points += 100;
        LetterSystem.enemySpawned -= 1;
      },
    });
  }
}
