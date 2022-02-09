import {
  Body,
  Box,
  Circle,
  Contact,
  Fixture,
  RevoluteJoint,
  RevoluteJointDef,
  Vec2,
} from "planck-js";
import { PlanckPhaserAdapter } from "../../../physic/planck-phaser-adapter";
import { EnemyBody } from "../../enemies/body";
import { EntityComponent } from "../../entity";
import { Player } from "../player";
import { GameCore } from "../../../core/game";
import { PlayerMovement } from "./movement";
import { PlayerAvatar } from "./avatar";
import { ContactManager } from "../../contact";
import { BaseContact } from "./contact/base-contact";
import { identifyBodiesTag } from "../../../physic/planck-utils";
import { BubbleEnemyBody } from "../../enemies/melee/small/bubbleEnemy/components/body";
import { BubbleBody } from "./abilities/water/entity/bubble-attack/components/body";
import { enemies } from "../../../helpers/vars";

const adapter = PlanckPhaserAdapter;

export class PlayerBody extends EntityComponent {
  public body: Body;

  public contactsManager: Map<string, ContactManager> = new Map();

  public constructor(public player: Player) {
    super();
  }

  start() {
    this.initBody();
  }

  public initBody() {
    const player = this.player;
    const container = player.container;
    const scene = this.player.scene;
    const worldScale = adapter.planckPhysics.worldScale;

    this.body = adapter.createCircle(player.x, player.y, 20);
    const chest = this.createChestFixture();

    this.body.setMassData({
      I: 0,
      center: Vec2(),
      mass: 1,
    });

    this.body.setUserData({ parent: this, tag: "player" });

    this.createSensor(40, 40, 0, 0, "player");

    this.createGroundSensor();
    this.createGrabsSensors();
    this.createBaseAttackSensor();
    this.createFireAttackSensor();
    this.createLightingAttackSensor();

    this.registerContacts();

    for (
      let fixture = this.body.getFixtureList();
      fixture;
      fixture = fixture.getNext()
    ) {
      if (fixture !== chest) {
        fixture.m_filterCategoryBits = 0x0002;
        fixture.m_filterMaskBits = 0x0001;
      }
    }

    adapter.bodies.get(this.body).setAlpha(0);

    adapter.world.on("begin-contact", this.beginContact.bind(this));
    adapter.world.on("end-contact", this.endContact.bind(this));
    adapter.world.on("pre-solve", this.preSolve.bind(this));
  }

  private createChestFixture() {
    const worldScale = adapter.planckPhysics.worldScale;
    const body = this.body;

    const chest = body.createFixture({
      shape: Box(
        (40 / 2) * worldScale,
        (40 / 2) * worldScale,
        Vec2(0, -20 * worldScale)
      ),
    });

    chest.setSensor(true);
    return chest;
  }

  private createGroundSensor() {
    this.createSensor(10, 2, 0, 21, "ground-sensor");
  }

  public createBaseAttackSensor() {
    this.createSensor(90, 40, 50, -20, "base-attack-right-sensor");
    this.createSensor(90, 40, -50, -20, "base-attack-left-sensor");
  }

  public createFireAttackSensor() {
    this.createSensor(170, 60, 120, -30, "fire-attack-right-sensor");
    this.createSensor(-170, 60, -120, -30, "fire-attack-left-sensor");
  }

  public createLightingAttackSensor() {
    this.createSensor(340, 60, 170, -30, "lighting-attack-right-sensor");
    this.createSensor(-340, 60, -170, -30, "lighting-attack-left-sensor");
  }

  public createGrabsSensors() {
    this.createSensor(10, 10, 20, -25, "grab-right-sensor");
    this.createSensor(10, 10, -20, -25, "grab-left-sensor");
  }

  public createSensor(
    width: number,
    height: number,
    ox: number,
    oy: number,
    tag: string
  ) {
    const worldScale = adapter.planckPhysics.worldScale;
    const body = this.body;
    const sensor = adapter.createRectangle(0, 0, width, height);

    sensor.setGravityScale(0);
    sensor.setUserData({ tag, parent: this });
    sensor.getFixtureList().setSensor(true);
    sensor.getFixtureList().setDensity(0.02);
    sensor.resetMassData();

    adapter.bodies.get(sensor).setAlpha(0);

    const sensorJoint: RevoluteJointDef = {
      localAnchorA: Vec2(ox * worldScale, oy * worldScale),
      localAnchorB: Vec2(0, 0),
      bodyA: this.body,
      bodyB: sensor,
      referenceAngle: 0,
      enableMotor: true,
      maxMotorTorque: 20,
      collideConnected: false,
    };

    adapter.world.createJoint(RevoluteJoint(sensorJoint));
  }

  public registerContacts() {
    const enemiesTag = enemies.enemiesTag;
    this.contactsManager.set(
      "ground",
      new BaseContact(this, ["ground"], "ground-sensor")
    );
    this.contactsManager.set(
      "base-attack-right-sensor",
      new BaseContact(this, enemiesTag, "base-attack-right-sensor")
    );
    this.contactsManager.set(
      "base-attack-left-sensor",
      new BaseContact(this, enemiesTag, "base-attack-left-sensor")
    );

    this.contactsManager.set(
      "fire-attack-right-sensor",
      new BaseContact(this, enemiesTag, "fire-attack-right-sensor")
    );
    this.contactsManager.set(
      "fire-attack-left-sensor",
      new BaseContact(this, enemiesTag, "fire-attack-left-sensor")
    );

    this.contactsManager.set(
      "lighting-attack-right-sensor",
      new BaseContact(this, enemiesTag, "lighting-attack-right-sensor")
    );
    this.contactsManager.set(
      "lighting-attack-left-sensor",
      new BaseContact(this, enemiesTag, "lighting-attack-left-sensor")
    );

    this.contactsManager.set(
      "enemy",
      new BaseContact(this, enemiesTag, "player")
    );

    this.contactsManager.set(
      "puddle",
      new BaseContact(this, ["puddle"], "ground-sensor")
    );
  }

  public onGround() {
    const groundContactManager = this.contactsManager.get("ground");
    if (!groundContactManager) return false;
    return groundContactManager.activeContact.size !== 0;
  }

  public destroy() {
    adapter.world.destroyBody(this.body);
    adapter.world.off("begin-contact", this.beginContact.bind(this));
    adapter.world.off("end-contact", this.endContact.bind(this));
    adapter.world.off("pre-solve", this.preSolve.bind(this));
  }

  public beginContact(contact: Contact) {
    const bodies = [
      contact.getFixtureA().getBody(),
      contact.getFixtureB().getBody(),
    ];
    const bodiesTag = identifyBodiesTag(bodies);

    this.contactsManager.forEach((manager) => {
      manager.beginContact(bodiesTag, contact);
    });
  }

  public endContact(contact: Contact) {
    const bodies = [
      contact.getFixtureA().getBody(),
      contact.getFixtureB().getBody(),
    ];
    const bodiesTag = identifyBodiesTag(bodies);

    this.contactsManager.forEach((manager) => {
      manager.endContact(bodiesTag, contact);
    });
  }

  public preSolve(contact: Contact) {
    const bodies = [
      contact.getFixtureA().getBody(),
      contact.getFixtureB().getBody(),
    ];
    const bodiesTag = identifyBodiesTag(bodies);

    this.contactsManager.forEach((manager) => {
      manager.preSolve(bodiesTag, contact);
    });
  }

  update() {
    const screenPosition = adapter.getScreenPosition(this.body.getPosition());
    this.player.x = this.player.container.x = Math.floor(screenPosition.x);
    this.player.y = this.player.container.y = Math.floor(screenPosition.y);

    const enemyContact = this.contactsManager.get("enemy");
    const movement =
      this.player.getComponent<PlayerMovement>("player-movement");
    if (
      enemyContact &&
      enemyContact.activeContact.size !== 0 &&
      !movement.knockBack
    ) {
      const contacts = Array.from(enemyContact.activeContact.values());
      let bubble = false;
      for (let i = 0; i < contacts.length; i += 1) {
        const { parent } = contacts[i].getUserData() as any;
        if (parent instanceof BubbleEnemyBody) {
          if (parent.enemy.container) {
            bubble = true;
            break;
          } else {
            enemyContact.activeContact.forEach((c, k) => {
              if (c === contacts[i]) {
                enemyContact.activeContact.delete(k);
              }
            });
          }
        }
      }
      if (bubble) return;
      const avatar = this.player.getComponent<PlayerAvatar>("player-avatar");
      console.log("call knockback from body");
      movement.knockback(avatar.avatar.image.scaleX * -1);
    }
  }
}
