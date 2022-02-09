import { Body, Contact, Vec2 } from "planck-js";
import { enemies, PLAYER_VARS } from "../../../../../../../helpers/vars";
import { PlanckPhaserAdapter } from "../../../../../../../physic/planck-phaser-adapter";
import { identifyBodiesTag } from "../../../../../../../physic/planck-utils";
import { ContactManager } from "../../../../../../contact";
import { EnemyBody } from "../../../../../../enemies/body";
import { EnemyMovement } from "../../../../../../enemies/movement";
import { EntityComponent } from "../../../../../../entity";
import { BaseContact } from "../../../../contact/base-contact";
import { Drone } from "../../../drone";
import { Bullet } from "../bullet";

const adapter = PlanckPhaserAdapter;

export class BulletBody extends EntityComponent {
  public body: Body;
  public contactsManager: Map<string, ContactManager> = new Map();

  public destroyed: boolean = false;
  public constructor(public parent: Bullet) {
    super();
  }

  public start() {
    const parent = this.parent;
    const { scene, container } = parent;
    const body = adapter.createCircle(parent.x, parent.y, 4);

    body.setGravityScale(0);
    body.getFixtureList().setSensor(true);
    body.setUserData({ tag: "bullet", parent: this });
    body.setLinearVelocity(
      Vec2(parent.dx, parent.dy).mul(PLAYER_VARS.bullet.speed)
    );

    this.body = body;

    adapter.bodies.get(this.body).setAlpha(0);

    this._registerContacts();
  }

  private _registerContacts() {
    const { enemiesTag } = enemies;

    this.contactsManager.set(
      "enemy",
      new BaseContact(this, enemiesTag, "bullet")
    );

    this.contactsManager.set(
      "ground",
      new BaseContact(this, ["ground"], "bullet")
    );

    adapter.world.on("begin-contact", this.beginContact.bind(this));
  }

  public update() {
    if (this.destroyed) {
      if (this.body) {
        this.body.setLinearVelocity(Vec2(0, 0));
      }

      return;
    }
    const screenPosition = adapter.getScreenPosition(this.body.getPosition());
    this.parent.x = this.parent.container.x = Math.floor(screenPosition.x);
    this.parent.y = this.parent.container.y = Math.floor(screenPosition.y);

    if (screenPosition.x < -2050) {
      this.destroyed = true;
      return;
    }
    if (screenPosition.x > 2200) {
      this.destroyed = true;
      return;
    }

    if (screenPosition.y < -100) {
      this.destroyed = true;
      return;
    }

    if (screenPosition.y > 1000) {
      this.destroyed = true;
      return;
    }

    const groundsContact = this.contactsManager.get("ground");
    if (groundsContact) {
      const contacts = groundsContact.activeContact;
      if (contacts.size !== 0) {
        this.destroyed = true;
        return;
      }
    }

    const enemiesContact = this.contactsManager.get("enemy");
    if (enemiesContact) {
      const contacts = enemiesContact.activeContact;
      if (contacts.size !== 0) {
        this.destroyed = true;
        contacts.forEach((contact) => {
          const { parent } = contact.getUserData() as { parent: EnemyBody };
          if (parent) {
            const enemy = parent.enemy.container;
            const movement =
              parent.enemy.getComponent<EnemyMovement>("movement");
            const direction = this.parent.dx > 0 ? 1 : -1;
            movement.doKnockedback(
              direction,
              PLAYER_VARS.bullet.force.x,
              PLAYER_VARS.bullet.force.y
            );
            parent.enemy.life -= PLAYER_VARS.bullet.damage;
          }
        });
        return;
      }
    }
  }

  public destroy() {
    adapter.world.destroyBody(this.body);
    adapter.world.off("begin-contact", this.beginContact.bind(this));
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
}
