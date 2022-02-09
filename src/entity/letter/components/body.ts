import { Body, Contact, Fixture, Vec2 } from "planck-js";
import { PlanckPhaserAdapter } from "../../../physic/planck-phaser-adapter";
import { ContactManager } from "../../contact";
import { EntityComponent } from "../../entity";
import { BaseContact } from "../../player/components/contact/base-contact";
import { PlayerMovement } from "../../player/components/movement";
import { playerInWorld } from "../../player/player";
import { Letter } from "../letter";

const adapter = PlanckPhaserAdapter;

export class LetterBody extends EntityComponent {
  public body: Body;
  public landed: boolean = false;
  public catched: boolean = false;
  public destroyDelay: number = 35000;

  public contactsManager: Map<string, ContactManager> = new Map();
  public constructor(public letter: Letter) {
    super();
  }

  public start() {
    this.body = adapter.createCircle(this.letter.x, this.letter.y, 30);
    this.body.setGravityScale(0);

    this.body.getFixtureList().m_filterCategoryBits = 0x0004;
    this.body.getFixtureList().m_filterMaskBits = 0x0001 | 0x0004;

    this.body.setUserData({ tag: "letter", parent: this });

    this._createContacts();

    adapter.bodies.get(this.body).setAlpha(0);
  }

  private _createContacts() {
    this.contactsManager.set(
      "player",
      new BaseContact(this, ["player"], "letter")
    );

    this.contactsManager.set(
      "ground",
      new BaseContact(this, ["ground"], "letter")
    );
    adapter.world.on("begin-contact", this.beginContact.bind(this));
    adapter.world.on("end-contact", this.endContact.bind(this));
  }

  public beginContact(contact: Contact) {
    if (!contact.isTouching()) return;
    const bodies = [
      contact.getFixtureA().getBody(),
      contact.getFixtureB().getBody(),
    ];
    const bodiesTag = this.identifyBodiesTag(bodies);

    this.contactsManager.forEach((c) => {
      c.beginContact(bodiesTag, contact);
    });

    if (bodiesTag.has("letter") && bodiesTag.has("ground")) {
      const body = bodiesTag.get("letter");
      if (this.body === body && !this.landed) {
        this.landed = true;

        this.body.setStatic();
        this.body.setGravityScale(0);
        this.body.setLinearVelocity(Vec2());
      }
    }
  }

  public endContact(contact: Contact) {
    const bodies = [
      contact.getFixtureA().getBody(),
      contact.getFixtureB().getBody(),
    ];
    const bodiesTag = this.identifyBodiesTag(bodies);

    this.contactsManager.forEach((c) => {
      c.endContact(bodiesTag, contact);
    });
  }

  public destroy() {
    console.log(adapter.world.destroyBody(this.body), this.letter.letter);
    adapter.world.off("begin-contact", this.beginContact.bind(this));
    adapter.world.off("end-contact", this.endContact.bind(this));
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
    this.letter.container.x = screenPosition.x;
    this.letter.container.y = screenPosition.y;
    if (this.catched) return this.letter.destroy();
    this.body.setLinearVelocity(Vec2(0, 3));
    if (!this.landed) {
      for (
        let contact = this.body.getContactList();
        contact;
        contact = contact.next
      ) {
        if (contact.contact.isTouching()) {
          const bodies = [
            contact.contact.getFixtureA().getBody(),
            contact.contact.getFixtureB().getBody(),
          ];
          const bodiesTag = this.identifyBodiesTag(bodies);
          if (bodiesTag.has("letter") && bodiesTag.has("ground")) {
            const body = bodiesTag.get("letter");

            if (this.body === body && !this.landed) {
              this.landed = true;
              this.body.getFixtureList().m_filterCategoryBits = 0x0001;
              this.body.getFixtureList().m_filterMaskBits = 0x0001 | 0x0002;
              this.body.getFixtureList().setSensor(true);
              this.body.setGravityScale(0);
              this.body.setLinearVelocity(Vec2());
            }
          }
        }
      }
      return;
    } else {
      this.body.setLinearVelocity(Vec2());
    }

    const playerMovement =
      playerInWorld.getComponent<PlayerMovement>("player-movement");
    if (playerMovement && !this.catched) {
      if (playerMovement.inputs.down.isDown) {
        const playerContacts = this.contactsManager.get("player");
        if (playerContacts) {
          console.log("S key down", playerContacts.activeContact.size);
          if (
            playerContacts.activeContact.size !== 0 &&
            this.letter.hud.canCatchLetter
          ) {
            this.letter.hud.catchLetter(this.letter.letter);
            this.catched = true;
            return;
          }
        }
      }
      if (!this.letter.hud.canCatchLetter) {
        if (playerMovement.inputs.down.isUp) {
          this.letter.hud.canCatchLetter = true;
        }
      }
    }

    // console.log(this.landed, this.letter.letter);
    if (this.landed && this.destroyDelay > 0) {
      this.destroyDelay -= 16.66;
      return;
    }
    //this.letter.destroy();
  }
}
