import { Body, Contact } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { PlanckPhaserAdapter } from "../../../../../../../../physic/planck-phaser-adapter";
import { identifyBodiesTag } from "../../../../../../../../physic/planck-utils";
import { ContactManager } from "../../../../../../../contact";
import { EntityComponent } from "../../../../../../../entity";
import { BaseContact } from "../../../../../contact/base-contact";
import { WaveAttack } from "../wave-attack";
import { WaveAttackAnimation } from "./animation";

const adapter = PlanckPhaserAdapter;
export class WaveAttackBody extends EntityComponent {
  public body: Body;
  public contactsManager: Map<string, ContactManager> = new Map();
  public constructor(public parent: WaveAttack) {
    super();
  }

  public start() {
    const parent = this.parent;
    const animation = parent.getComponent<WaveAttackAnimation>("animation");
    const { width, height, scaleX } = animation.animationObject.image;
    this.body = adapter.createRectangle(
      parent.x + (width / 2) * scaleX,
      parent.y - height / 2,
      width,
      height
    );
    this.body.setGravityScale(0);
    this.body.getFixtureList().setSensor(true);
    this.body.setUserData({ tag: "wave-attack", parent: this });

    adapter.bodies.get(this.body).setAlpha(0);
    this.registerContacts();
  }

  public registerContacts() {
    const enemiesTag = enemies.enemiesTag;
    this.contactsManager.set(
      "enemy",
      new BaseContact(this, enemiesTag, "wave-attack")
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
