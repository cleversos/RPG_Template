import { Body, Contact } from "planck-js";
import { PlayerBody } from "../body";
import { ContactManager } from "../../../contact";

export class BaseContact extends ContactManager {
  public constructor(
    public parent: any,
    public tag: string[],
    public parentTag: string
  ) {
    super();
  }

  public beginContact(bodies: Map<string, Body>, contact: Contact) {
    if (!this.validBody(bodies)) return;
    if (contact.isTouching()) {
      let currentTag = Array.from(bodies.keys()).find(
        (k) => this.tag.indexOf(k) !== -1
      );
      if (currentTag) {
        this.activeContact.set(contact, bodies.get(currentTag));
      }
    }
  }

  public endContact(bodies: Map<string, Body>, contact: Contact) {
    if (!this.validBody(bodies)) return;
    this.activeContact.delete(contact);
  }
}
