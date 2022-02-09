import { Vec2, Body, World } from "planck-js";
import { PlanckPhysics } from "./planck";
// @ts-ignore
import SAT from "sat";
import Phaser from "phaser";

type BodyShapeGraphics =
  | Phaser.GameObjects.Rectangle
  | Phaser.GameObjects.Polygon
  | Phaser.GameObjects.Arc
  | Phaser.GameObjects.Container;

export class PlanckPhaserAdapter {
  public static world: World;
  public static planckPhysics: PlanckPhysics;
  public static bodies: Map<Body, BodyShapeGraphics>;
  public static bodiesSat: Map<Body, SAT.Box | SAT.Circle | SAT.Polygon>;
  public static framerate: number = 1 / 60;
  public static scene: Phaser.Scene;
  public static interval: any | null = null;

  public static lastUpdate: number | null = null;
  public static onBlur: null | Function = null;

  public static deltaTime: number = 0;

  public static init(planckPhysics: PlanckPhysics, scene: Phaser.Scene) {
    const adapter = PlanckPhaserAdapter;
    adapter.planckPhysics = planckPhysics;
    adapter.scene = scene;
    adapter.bodies = new Map();
    adapter.bodiesSat = new Map();
    adapter.world = planckPhysics.world;
    adapter.lastUpdate = null;

    const bodies = adapter.bodies;
    const world = planckPhysics.world;

    if (adapter.onBlur)
      window.removeEventListener("blur", adapter.onBlur as any);
    adapter.onBlur = () => {
      // let time = 1000;
      // while (time > 16.66) {
      //   world.step(adapter.framerate);
      //   world.clearForces();
      //   this.updateBodiesPosition(bodies, true);
      //   time -= 16.66;
      // }
    };
    window.addEventListener("blur", adapter.onBlur as any);

    world.on("remove-body", (body: Body) => {
      const gameObject = bodies.get(body);
      if (gameObject) gameObject.destroy();
    });
  }

  public static update() {
    const adapter = PlanckPhaserAdapter;
    const planckPhysics = PlanckPhaserAdapter.planckPhysics;
    const bodies = PlanckPhaserAdapter.bodies;
    const world = planckPhysics.world;

    this.deltaTime = adapter.framerate;
    if (adapter.lastUpdate !== null) {
      this.deltaTime = 1000 / 24;
    }
    adapter.lastUpdate = Date.now();
    if (!document.hidden) {
      world.step(
        this.deltaTime <= 16.66 ? this.deltaTime * 0.001 : adapter.framerate
      );
      world.clearForces();

      this.updateBodiesPosition(bodies, false);
    } else {
      // while (deltaTime > 16.66 && document.hidden) {
      //   world.step(adapter.framerate);
      //   world.clearForces();
      //   deltaTime -= 16.16;
      //   this.updateBodiesPosition(bodies, true);
      // }
    }
  }

  public static updateBodiesPosition(
    bodies: Map<Body, BodyShapeGraphics>,
    forced: boolean
  ) {
    const adapter = PlanckPhaserAdapter;
    bodies.forEach((gameObject, body) => {
      const screenPosition = adapter.getScreenPosition(body.getPosition());
      const angle = body.getAngle();

      gameObject.setPosition(screenPosition.x, screenPosition.y);
      gameObject.rotation = angle;
      if (forced) gameObject.update(true);
    });
  }

  public static createRectangle(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const scene = PlanckPhaserAdapter.scene;
    const planckPhysics = PlanckPhaserAdapter.planckPhysics;
    const bodies = PlanckPhaserAdapter.bodies;
    const bodiesSat = PlanckPhaserAdapter.bodiesSat;

    if (!scene || !planckPhysics || !bodies || !bodiesSat) return;

    const position = Vec2(x, y);
    const body = planckPhysics.createRectangle(position, width, height);
    const graphics = scene.add.rectangle(x, y, width, height, 0xff0000);
    const sat = new SAT.Box(new SAT.Vector(x, y), width, height);

    bodiesSat.set(body, sat);
    bodies.set(body, graphics);

    return body;
  }

  public static createCircle(x: number, y: number, radius: number, def: any = {}) {
    const scene = PlanckPhaserAdapter.scene;
    const planckPhysics = PlanckPhaserAdapter.planckPhysics;
    const bodies = PlanckPhaserAdapter.bodies;
    const bodiesSat = PlanckPhaserAdapter.bodiesSat;

    if (!scene || !planckPhysics || !bodies || !bodiesSat) return;

    const position = Vec2(x, y);
    const body = planckPhysics.createCircle(position, radius, def);
    const graphics = scene.add.arc(
      x,
      y,
      radius,
      0,
      2 * Math.PI,
      true,
      0xff0000
    );
    const sat = new SAT.Circle(new SAT.Vector(x, y), radius);

    bodiesSat.set(body, sat);
    bodies.set(body, graphics);

    return body;
  }

  public static createPolygon(
    x: number,
    y: number,
    points: { x: number; y: number }[]
  ) {
    const scene = PlanckPhaserAdapter.scene;
    const planckPhysics = PlanckPhaserAdapter.planckPhysics;
    const bodies = PlanckPhaserAdapter.bodies;
    const bodiesSat = PlanckPhaserAdapter.bodiesSat;

    if (!scene || !planckPhysics || !bodies || !bodiesSat) return;

    const position = Vec2(x, y);
    const body = planckPhysics.createPolygon(position, points);
    const displayOrigin = points[0];
    const graphics = scene.add.polygon(x, y, points, 0x00aaff);
    const sat = new SAT.Polygon(
      new SAT.Vector(x, y),
      points.map(
        (p) => new SAT.Vector(p.x - displayOrigin.x, p.y - displayOrigin.y)
      )
    );

    graphics.setDisplayOrigin(displayOrigin.x, displayOrigin.y);

    bodiesSat.set(body, sat);
    bodies.set(body, graphics);
    return body;
  }

  public static createChain(
    x: number,
    y: number,
    points: { x: number; y: number }[]
  ) {
    const scene = PlanckPhaserAdapter.scene;
    const planckPhysics = PlanckPhaserAdapter.planckPhysics;
    const bodies = PlanckPhaserAdapter.bodies;
    const bodiesSat = PlanckPhaserAdapter.bodiesSat;

    if (!scene || !planckPhysics || !bodies || !bodiesSat) return;

    const position = Vec2(x, y);
    const body = planckPhysics.createChain(position, points);
    const displayOrigin = points[0];
    const graphics = scene.add.container(x, y);

    let g = scene.add.graphics();
    let path = new Phaser.Curves.Path(points[0].x, points[0].y);
    graphics.add(g);
    for (let i = 1; i < points.length; i += 1) {
      path.lineTo(points[i].x, points[i].y);
    }
    g.lineStyle(2, 0xffffff, 1);
    path.draw(g);

    // bodiesSat.set(body, sat);
    bodies.set(body, graphics);
    return body;
  }

  public static getWorldPosition(screenPosition: Vec2) {
    const physics = this.planckPhysics;
    const worldPosition = Vec2(
      screenPosition.x * physics.worldScale,
      screenPosition.y * physics.worldScale
    );
    return worldPosition;
  }

  public static getScreenPosition(worldPosition: Vec2): Vec2 {
    const physics = this.planckPhysics;
    const screenPosition = Vec2(
      worldPosition.x / physics.worldScale,
      worldPosition.y / physics.worldScale
    );

    return screenPosition;
  }

  public static getPolygonAABB(points: { x: number; y: number }[]): {
    width: number;
    height: number;
  } {
    let topLeft = { x: 0, y: 0 };
    let bottomRight = { x: 0, y: 0 };

    points.forEach((p: { x: number; y: number }) => {
      if (p.x < topLeft.x) topLeft.x = p.x;
      if (p.y < topLeft.y) topLeft.y = p.y;

      if (p.x > bottomRight.x) bottomRight.x = p.x;
      if (p.y > bottomRight.y) bottomRight.y = p.y;
    });

    return {
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
    };
  }

  public static collide(bodyA: Body, bodyB: Body) {
    let touching = false;

    for (
      let contact = bodyA.getContactList();
      contact;
      contact = contact.next ? contact.next : null
    ) {
      if (touching) continue;
      contact.contact.update();
      if (contact.contact.isTouching() && contact.contact.isEnabled()) {
        const fA = contact.contact.getFixtureA();
        const fB = contact.contact.getFixtureB();

        const bA = fA.getBody();
        const bB = fB.getBody();

        if ((bA === bodyA && bB === bodyB) || (bB === bodyA && bA === bodyB)) {
          touching = true;
        }
      }
    }

    return touching;
  }

  public static touchTag(
    tag: string,
    body: Body,
    callback?: (b: Body) => void
  ): boolean {
    const adapter = PlanckPhaserAdapter;
    const planckPhysics = adapter.planckPhysics;
    const world = planckPhysics.world;

    let touching = false;
    for (let b: Body | null = world.getBodyList(); b; b = b.getNext()) {
      let data: any = b.getUserData();
      if (data && data.tag === tag) {
        if (!touching) {
          touching = adapter.collide(b, body);
          if (touching && callback) callback(b);
        }
      }
    }
    return touching;
  }
}
