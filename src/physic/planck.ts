import {
  Box,
  Chain,
  Circle,
  Contact,
  Polygon,
  Vec2,
  World,
  internal,
} from "planck-js";
//@ts-ignore
import Poly from "poly-decomp";
const { Manifold, Distance } = internal;

Contact.prototype.update = function (listener: any) {
  // Re-enable this contact.
  // this.m_enabledFlag = false;

  var touching = false;
  var wasTouching = this.m_touchingFlag;

  var sensorA = this.m_fixtureA.isSensor();
  var sensorB = this.m_fixtureB.isSensor();
  var sensor = sensorA || sensorB;

  var bodyA = this.m_fixtureA.getBody();
  var bodyB = this.m_fixtureB.getBody();
  var xfA = bodyA.getTransform();
  var xfB = bodyB.getTransform();

  // Is this contact a sensor?
  if (sensor) {
    var shapeA = this.m_fixtureA.getShape();
    var shapeB = this.m_fixtureB.getShape();
    touching = Distance.testOverlap(
      shapeA,
      this.m_indexA,
      shapeB,
      this.m_indexB,
      xfA,
      xfB
    );

    // Sensors don't generate manifolds.
    this.m_manifold.pointCount = 0;
  } else {
    // TODO reuse manifold
    var oldManifold = this.m_manifold;
    this.m_manifold = new Manifold();

    this.evaluate(this.m_manifold, xfA, xfB);
    touching = this.m_manifold.pointCount > 0;

    // Match old contact ids to new contact ids and copy the
    // stored impulses to warm start the solver.
    for (var i = 0; i < this.m_manifold.pointCount; ++i) {
      var nmp = this.m_manifold.points[i];
      nmp.normalImpulse = 0.0;
      nmp.tangentImpulse = 0.0;

      for (var j = 0; j < oldManifold.pointCount; ++j) {
        var omp = oldManifold.points[j];
        if (omp.id.key == nmp.id.key) {
          // ContactID.key
          nmp.normalImpulse = omp.normalImpulse;
          nmp.tangentImpulse = omp.tangentImpulse;
          break;
        }
      }
    }

    if (touching != wasTouching) {
      bodyA.setAwake(true);
      bodyB.setAwake(true);
    }
  }

  this.m_touchingFlag = touching && this.m_enabledFlag;

  if (wasTouching == false && touching == true && listener) {
    listener.beginContact(this);
  }

  if (wasTouching == true && touching == false && listener) {
    listener.endContact(this);
  }

  if (sensor == false && touching && listener) {
    listener.preSolve(this, oldManifold);
  }
};

export class PlanckPhysics {
  public world: World;
  public constructor(public worldScale: number, public gravity: Vec2) {
    this.world = new World({
      gravity,
    });
  }

  public createRectangle(
    position: Vec2,
    width: number,
    height: number,
    def: any = {}
  ) {
    const body = this.world.createBody({
      type: "dynamic",
      position: position.mul(this.worldScale),
    });
    const shape = Box(
      (width / 2) * this.worldScale,
      (height / 2) * this.worldScale
    );
    body.createFixture({ shape, ...def });
    body.setMassData({
      mass: 1,
      center: Vec2(),
      I: 1,
    });
    body.setUserData({});
    return body;
  }

  public createChain(
    position: Vec2,
    points: { x: number; y: number }[],
    def: any = {}
  ) {
    const body = this.world.createBody({
      type: "dynamic",
      position: position.mul(this.worldScale),
    });
    const shape = Chain(
      points.map((p) => Vec2(p.x, p.y).mul(this.worldScale)),
      false
    );
    const fixture = body.createFixture({ shape, ...def });
    body.setUserData({});
    return body;
  }

  public createPolygon(
    position: Vec2,
    points: { x: number; y: number }[],
    def: any = {}
  ) {
    const body = this.world.createBody({
      type: "dynamic",
      position: position.mul(this.worldScale),
    });
    const convexShape: [number, number][][] = Poly.quickDecomp(
      points.map((p) => [p.x, p.y])
    );
    convexShape.forEach((polygon) => {
      const vertices = polygon.map((p) =>
        Vec2(p[0] * this.worldScale, p[1] * this.worldScale)
      );
      const fixture = Polygon(vertices);
      body.createFixture({
        shape: fixture,
        ...def,
      });
    });
    body.setUserData({});
    return body;
  }

  public createCircle(position: Vec2, radius: number, def: any = {}) {
    const body = this.world.createBody({
      type: "dynamic",
      position: position.mul(this.worldScale),
    });
    const shape = Circle(radius * this.worldScale);
    body.createFixture({
      shape,
      ...def,
    });
    body.setMassData({
      mass: .1,
      I: 1,
      center: Vec2(),
    });
    body.setUserData({});
    return body;
  }
}
