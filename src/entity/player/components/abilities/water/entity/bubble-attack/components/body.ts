import { Body, Contact } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { PlanckPhaserAdapter } from "../../../../../../../../physic/planck-phaser-adapter";
import { identifyBodiesTag } from "../../../../../../../../physic/planck-utils";
import { ContactManager } from "../../../../../../../contact";
import { EntityComponent } from "../../../../../../../entity";
import { BaseContact } from "../../../../../contact/base-contact";
import { BubbleAttack } from "../bubble-attack";

const adapter = PlanckPhaserAdapter;

export class BubbleBody extends EntityComponent {
  public body: Body;
  public contactsManager: Map<string, ContactManager> = new Map();
  public constructor(public parent: BubbleAttack) {
    super();
  }

  public start() {
    const parent = this.parent;
    this.body = adapter.createCircle(parent.x, parent.y, 150);
    this.body.setGravityScale(0);
    this.body.getFixtureList().setSensor(true);
    this.body.setUserData({ tag: "bubble-attack", parent: this });

    adapter.bodies.get(this.body).setAlpha(0);
    this.registerContacts();
  }

  public registerContacts() {
    const { enemiesTag } = enemies;
    this.contactsManager.set(
      "enemy",
      new BaseContact(this, enemiesTag, "bubble-attack")
    );

    adapter.world.on("begin-contact", this.beginContact.bind(this));
    adapter.world.on("end-contact", this.endContact.bind(this));
    adapter.world.on("pre-solve", this.preSolve.bind(this));
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
}
