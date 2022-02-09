import { Body, Contact, Fixture, Vec2 } from "planck-js";
import { GameCore } from "../../../../../../../../core/game";
import { enemies } from "../../../../../../../../helpers/vars";
import { PlanckPhaserAdapter } from "../../../../../../../../physic/planck-phaser-adapter";
import { ContactManager } from "../../../../../../../contact";
import { EnemyBody } from "../../../../../../../enemies/body";
import { EnemyMovement } from "../../../../../../../enemies/movement";
import { EntityComponent } from "../../../../../../../entity";
import { playerInWorld } from "../../../../../../player";
import { PlayerAvatar } from "../../../../../avatar";
import { BaseContact } from "../../../../../contact/base-contact";
import { ThunderBall } from "../thunderball";

const adapter = PlanckPhaserAdapter;

export class FireballBody extends EntityComponent {
  public body: Body;
  public landed: boolean = false;
  public catched: boolean = false;
  public destroyed: boolean = false;
  public destroyDelay: number = 60000;

  public contactsManager: Map<string, ContactManager> = new Map();

  public constructor(public parent: ThunderBall) {
    super();
  }

  public start() {
    this.body = adapter.createCircle(this.parent.x, this.parent.y, 80 * 0.3);
    this.body.setGravityScale(0);
    this.body.getFixtureList().setSensor(true);

    this.body.setUserData({ tag: "thunderball", parent: this });
    this._registerContacts();

    adapter.bodies.get(this.body).setAlpha(0);
  }

  private _registerContacts() {
    const { enemiesTag } = enemies;
    this.contactsManager.set(
      "enemy",
      new BaseContact(this, enemiesTag, "thunderball")
    );
    this.contactsManager.set(
      "ground",
      new BaseContact(this, ["ground"], "thunderball")
    );
    adapter.world.on("begin-contact", this.beginContact.bind(this));
  }

  public beginContact(contact: Contact) {
    const bodies = [
      contact.getFixtureA().getBody(),
      contact.getFixtureB().getBody(),
    ];
    const bodiesTag = this.identifyBodiesTag(bodies);

    this.contactsManager.forEach((manager) => {
      manager.beginContact(bodiesTag, contact);
    });
    // if (!contact.isTouching()) return;
    // const bodies = [
    //   contact.getFixtureA().getBody(),
    //   contact.getFixtureB().getBody(),
    // ];
    // const bodiesTag = this.identifyBodiesTag(bodies);

    // // const touchEnemy =
    // //   bodiesTag.has("egg-enemy-body") || bodiesTag.has("egg-small-enemy-body") || ;
    // if (bodiesTag.has("fireball") && bodiesTag.has("egg-enemy-body")) {
    //   const attackSensor = bodiesTag.get("fireball");
    //   const { tag, parent } = attackSensor.getUserData() as any;
    //   if (parent === this) {
    //     const { parent: enemy } = bodiesTag
    //       .get("egg-enemy-body")
    //       .getUserData() as any;
    //     const movement = (enemy as EnemyBody).enemy.getComponent<EnemyMovement>(
    //       "movement"
    //     );
    //     if (!movement.knockBack && enemy.landed) {
    //       const avatar =
    //         playerInWorld.getComponent<PlayerAvatar>("player-avatar").avatar;
    //       movement.doKnockedback(avatar.image.scaleX);
    //       this.destroyed = true;
    //     }
    //   }
    // }
  }

  public destroy() {
    adapter.world.destroyBody(this.body);
    adapter.world.off("begin-contact", this.beginContact.bind(this));
  }

  public contactEnd(contact: Contact) {}

  public identifyBodiesTag(bodies: Body[]) {
    const tags: Map<string, Body> = new Map();
    bodies.forEach((body) => {
      const data = body.getUserData() as { tag: string };
      if (data && data.tag) {
        tags.set(data.tag, body);
      }
    });
    return tags;
  }

  public identifyBodies(
    contact: Contact,
    ref: Fixture
  ): undefined | [Body, Body] {
    const fixtureA = contact.getFixtureA();
    const fixtureB = contact.getFixtureB();

    let fixture: Fixture | undefined =
      fixtureA === ref ? fixtureA : fixtureB === ref ? fixtureB : undefined;

    if (!fixture) return undefined;

    const bodies: [Body, Body] =
      fixtureA === fixture
        ? [fixtureA.getBody(), fixtureB.getBody()]
        : [fixtureB.getBody(), fixtureA.getBody()];

    return bodies;
  }

  public update() {
    const screenPosition = adapter.getScreenPosition(this.body.getPosition());
    this.parent.container.x = screenPosition.x;
    this.parent.container.y = screenPosition.y;
    if (this.catched) return this.parent.destroy();

    if (!this.landed) {
      const groundContacts = this.contactsManager.get("ground");
      if (groundContacts) {
        const contacts = groundContacts.activeContact;
        if (contacts.size !== 0) {
          console.log("landed");
          this.landed = true;
          this.body.getFixtureList().setSensor(true);
          this.body.setGravityScale(0);
          this.body.setLinearVelocity(Vec2());
        }
      }
      return;
    }

    const enemyContacts = this.contactsManager.get("enemy");
    if (enemyContacts) {
      const contacts = enemyContacts.activeContact;
      contacts.forEach((contact) => {
        const { parent: enemy } = contact.getUserData() as any;
        const movement = (enemy as EnemyBody).enemy.getComponent<EnemyMovement>(
          "movement"
        );
        if (!movement.knockBack && enemy.landed) {
          const avatar =
            playerInWorld.getComponent<PlayerAvatar>("player-avatar");
          const s = GameCore.skills.get("እሳት");

          movement.doKnockedback(movement.enemy.x > avatar.player.x ? 1 : -1);
          movement.enemy.life -= 2 * 4 * s.count;
          this.destroyed = true;
        }
      });
    }

    if (this.destroyed) {
      this.parent.destroy();
      return;
    }
    // console.log(this.landed, this.letter.letter);
    if (this.landed && this.destroyDelay > 0) {
      this.destroyDelay -= 16.66;

      return;
    }
    this.parent.destroy();
  }
}
