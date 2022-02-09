import { Body, Contact, Vec2, World } from "planck-js";

export function createOneWayCollision(body: Body, tag: string, world: World) {
  world.on("pre-solve", (contact: Contact) => {
    const bodyA = contact.getFixtureA().getBody();
    const bodyB = contact.getFixtureB().getBody();

    const aTag = (<any>bodyA.getUserData()).tag;
    const bTag = (<any>bodyB.getUserData()).tag;

    let playerBody: planck.Body;
    let groundBody: planck.Body;

    if (bodyA === body && bTag === tag) {
      playerBody = bodyA;
      groundBody = bodyB;
    }

    if (bodyB === body && aTag === tag) {
      playerBody = bodyB;
      groundBody = bodyA;
    }

    if (playerBody !== undefined && groundBody !== undefined) {
      let radiusA = playerBody.getFixtureList().getShape().m_radius;
      let radiusB = groundBody.getFixtureList().getShape().m_radius;
      let worldManifold = contact
        .getManifold()
        .getWorldManifold(
          null,
          playerBody.getTransform(),
          radiusA,
          groundBody.getTransform(),
          radiusB
        );
      // if (!contact.m_enabledFlag) {
      //   contact.setEnabled(false);
      //   return;
      // }

      if (playerBody.getGravityScale() === 0) {
        contact.setEnabled(false);
        return;
      }

      let fixture =
        bodyA === groundBody ? contact.getFixtureA() : contact.getFixtureB();

      for (let i = 0; i < worldManifold.points.length; i++) {
        let pointVelPlatform = groundBody.getLinearVelocityFromWorldPoint(
          worldManifold.points[i]
        );
        let pointVelOther = playerBody.getLinearVelocityFromWorldPoint(
          worldManifold.points[i]
        );
        let pointVel = groundBody.getLocalVector(
          Vec2(
            pointVelOther.x - pointVelPlatform.x,
            pointVelOther.y - pointVelPlatform.y
          )
        );

        if (pointVel.y >= 0) {
          return;
        } else if (pointVel.y > -4.5) {
          return;
        }
      }

      contact.setEnabled(false);
    }
  });
}
