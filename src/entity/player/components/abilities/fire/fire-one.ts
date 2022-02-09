import {
  Body,
  Circle,
  Contact,
  Fixture,
  RevoluteJoint,
  RevoluteJointDef,
  Vec2,
} from "planck-js";
import { CircleShape } from "planck-js/lib/shape/index";
import { PlanckPhaserAdapter } from "../../../../../physic/planck-phaser-adapter";
import { Player } from "../../../player";
import { Ability, ConsumableAbility } from "../ability";
import { FireAbility } from "./fire";
import { PlayerBody } from "../../body";
import { identifyBodiesTag } from "../../../../../physic/planck-utils";
import { EnemyBody } from "../../../../enemies/body";
import { EnemyMovement } from "../../../../enemies/movement";
import { PlayerAvatar } from "../../avatar";
import { AnimationObject } from "../../../../../animation/animation";
import { PlayerAbilities } from "../../abilities";
import { ContactManager } from "../../../../contact";
import { enemies } from "../../../../../helpers/vars";
import { BaseContact } from "../../contact/base-contact";
import { GameCore } from "../../../../../core/game";

const adapter = PlanckPhaserAdapter;

export class FireOne extends ConsumableAbility {
  public player: Player;
  public abilityAmmo = 4;

  public body: Body;
  public radius: number = 100; // Radius in pixel;
  public joint: RevoluteJoint;

  public skillName: string = "ሓዊ";

  public contactsManager: Map<string, ContactManager> = new Map();

  public container: Phaser.GameObjects.Container;
  public circlesCount: number = 1;

  public constructor(public abilities: PlayerAbilities) {
    super();
    this.player = abilities.parent;
    this._initBodies();
  }

  private _initBodies() {
    let angleOffset = 360 / this.circlesCount;
    let container = this.player.container;
    let scene = this.player.scene;

    let worldScale = adapter.planckPhysics.worldScale;

    this.container = scene.add.container(0, 0);
    container.add(this.container);

    let playerBody = this.player.getComponent<PlayerBody>("player-body");

    const defensiveBody = adapter.createCircle(container.x, container.y, 10);
    const joint: RevoluteJointDef = {
      localAnchorA: Vec2(0, 0),
      localAnchorB: Vec2(0, 0),
      bodyA: playerBody.body,
      bodyB: defensiveBody,
      referenceAngle: 0,
      enableMotor: true,
      maxMotorTorque: 20,
      collideConnected: false,
    };

    this.body = defensiveBody;
    this.body.setUserData({ tag: "player-defensive-balls", parent: this });
    this._registerContacts();

    this.joint = adapter.world.createJoint<RevoluteJoint>(RevoluteJoint(joint));

    defensiveBody.setGravityScale(0);

    for (let i = 0; i < this.circlesCount; i += 1) {
      let angle = (i * angleOffset * Math.PI) / 180;
      let x = Math.cos(angle) * this.radius;
      let y = Math.sin(angle) * this.radius;
      let fixture: Fixture;

      if (i === 0) {
        fixture = defensiveBody.getFixtureList();
      } else {
        fixture = defensiveBody.createFixture({
          shape: Circle(10 * adapter.planckPhysics.worldScale),
          friction: 0,
        });
      }
      fixture.setSensor(true);

      let shape: CircleShape = fixture.m_shape as CircleShape;
      shape.m_p.set(x * worldScale, y * worldScale);

      let fireBall = new AnimationObject(scene, "4", x, y);
      fireBall.framerate = 1000 / 24;
      this.container.add(fireBall.image);

      //   console.log(x, y);

      //   const circle = adapter.createCircle(container.x + x, container.y + y, 10);
      //   circle.getFixtureList().setSensor(true);
      //   circle.setGravityScale(0);
    }
  }

  private _registerContacts() {
    const { enemiesTag } = enemies;
    this.contactsManager.set(
      "enemy",
      new BaseContact(this, enemiesTag, "player-defensive-balls")
    );
    adapter.world.on("begin-contact", this.beginContact.bind(this));
    adapter.world.on("end-contact", this.endContact.bind(this));
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

  public destroy() {
    adapter.world.destroyBody(this.body);
    adapter.world.off("begin-contact", this.beginContact.bind(this));
    adapter.world.off("end-contact", this.endContact.bind(this));
    if (this.container) {
      this.container.destroy();
      this.joint = undefined;
    }
  }

  public update() {
    if (this.joint) {
      this.joint.setMotorSpeed(2);
      this.container.rotation = this.body.getAngle();

      if (this.abilityAmmo <= 0) {
        this.container.setAlpha(0);
      } else {
        this.container.setAlpha(1);
      }
    }

    const contactManager = this.contactsManager.get("enemy");
    if (contactManager) {
      const contacts = contactManager.activeContact;
      contacts.forEach((contact) => {

        const { parent: enemy } = contact.getUserData() as any;
        const movement = (enemy as EnemyBody).enemy.getComponent<EnemyMovement>(
          "movement"
        );
        if (!movement.knockBack && enemy.landed && this.abilityAmmo > 0) {
          const avatar =
            this.player.getComponent<PlayerAvatar>("player-avatar");
          const s = GameCore.skills.get(this.skillName);

          movement.doKnockedback(movement.enemy.x > avatar.player.x ? 1 : -1);
          movement.enemy.life -= 7 + s.count * 1.2;
          this.abilityAmmo -= 1;
          this.circlesCount -= 1;
          this.destroy();
          this._initBodies()
        }
      });
    }
  }

  public stack() {
    if (this.abilityAmmo <= 0) {
      this.abilityAmmo = 3;
      this.circlesCount = 1;
    } else {
      this.abilityAmmo += 3;
      this.circlesCount += 1;
    }
    this.destroy();
    this._initBodies();
  }
}
