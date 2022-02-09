import { Body, Contact, Fixture } from "planck-js";

export function identifyBodiesTag(bodies: Body[]) {
  const tags: Map<string, Body> = new Map();
  bodies.forEach((body) => {
    const data = body.getUserData() as { tag: string };
    if (data && data.tag) {
      tags.set(data.tag, body);
    }
  });
  return tags;
}

export function identifyBodies(
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
