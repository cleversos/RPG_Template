import { Body, Contact } from "planck-js";

export class ContactManager {
  public parent: any;
  public tag: string[];
  public parentTag: string;

  public activeContact: Map<Contact, Body> = new Map();

  public validBody(bodies: Map<string, Body>): boolean {
    let currentTag = Array.from(bodies.keys()).find(
      (k) => this.tag.indexOf(k) !== -1
    );
    if (!bodies.has(currentTag) || !bodies.has(this.parentTag)) return false;
    const { parent } = bodies.get(this.parentTag).getUserData() as any;

    if (!parent) return false;
    if (parent && parent !== this.parent) return false;

    return true;
  }

  public preSolve(bodies: Map<string, Body>, contact: Contact) {}
  public postSolve(bodies: Map<string, Body>, contact: Contact) {}
  public beginContact(bodies: Map<string, Body>, contact: Contact) {}
  public endContact(bodies: Map<string, Body>, contact: Contact) {}
}
