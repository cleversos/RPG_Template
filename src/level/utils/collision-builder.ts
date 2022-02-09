import { PlanckPhaserAdapter } from "../../physic/planck-phaser-adapter";
import { LevelBuilder } from "../builder";
import { LayerElement } from "./layer-element";

const adapter = PlanckPhaserAdapter;

const getPolygonAABB = (
  points: { x: number; y: number }[]
): { width: number; height: number } => {
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
};

type CollisionBuilderStrategy = (
  object: LayerElement,
  levelBuilder: LevelBuilder
) => any;

const collisionBuilder: Map<string, CollisionBuilderStrategy> = new Map();

const buildRectangle = (object: LayerElement, levelBuilder: LevelBuilder) => {
  const width = object.object.width as number;
  const height = object.object.height as number;
  const x = object.object.x as number;
  const y = object.object.y as number;

  const tag = object.getProperty<string>("tag");
  //   const scene = levelBuilder.level.scene;

  //   const rectangle = scene.add
  //     .rectangle(x, y, width, height, 0xff0000)
  //     .setOrigin(0);
  const rectangle = adapter.createRectangle(
    x + width / 2,
    y + height / 2,
    width,
    height
  );
  rectangle?.setStatic();
  rectangle?.setUserData({ tag });
  if (tag === "door") {
    rectangle.getFixtureList().setSensor(true);
    const target: number = object.getProperty<number>("target");
    const isPublic: boolean = object.getProperty<boolean>("isPublic");
    rectangle?.setUserData({
      tag,
      target,
      isPublic: !isPublic ? false : isPublic,
    });
  }
  console.log(rectangle?.getUserData());
  adapter.bodies.get(rectangle)?.setAlpha(0);
  return rectangle;
};

const buildPolygon = (object: LayerElement, levelBuilder: LevelBuilder) => {
  const x = object.object.x;
  const y = object.object.y;
  const tag = object.getProperty<string>("tag");

  const points = object.object.polygon as { x: number; y: number }[];

  //   const {width, height} = getPolygonAABB(points as {x : number, y : number}[]);
  let polygon: undefined | planck.Body;
  if (tag !== "one-way" && tag !== "one-way-filled") {
    polygon = adapter.createPolygon(x, y, points);
    polygon?.setStatic();
    polygon?.setUserData({ tag });
    const polygonGraphics: Phaser.GameObjects.Polygon = adapter.bodies.get(
      polygon
    ) as Phaser.GameObjects.Polygon;
    polygonGraphics.setAlpha(0);

    if (tag === "ladder" || tag === "water") {
      for (
        let fixture = polygon.getFixtureList();
        fixture;
        fixture = fixture.getNext()
      ) {
        fixture.setSensor(true);
      }
      if (tag === "ladder") {
        polygonGraphics.setFillStyle(0x00df00);
      }
    }
  } else {
    if (tag === "one-way") {
      polygon = adapter.createChain(x, y, points);
      polygon?.setStatic();
      polygon?.setUserData({ tag });
      adapter.bodies.get(polygon)?.setAlpha(0);
    } else if (tag === "one-way-filled") {
      polygon = adapter.createPolygon(x, y, points);
      polygon?.setStatic();
      polygon?.setUserData({ tag });
      const polygonGraphics: Phaser.GameObjects.Polygon = adapter.bodies.get(
        polygon
      ) as Phaser.GameObjects.Polygon;
      polygonGraphics.setAlpha(0);
    }
  }

  return polygon;
};

const buildText = (object: LayerElement, level: LevelBuilder) => {
  const x = object.object.x;
  const y = object.object.y;
  const { text } = object.object.text;

  console.log(object.object.text);

  const gameObject = level.level.scene.add.text(x, y, text).setOrigin(0);
};

collisionBuilder.set("rectangle", buildRectangle);
collisionBuilder.set("polygon", buildPolygon);
collisionBuilder.set("text", buildText);
export { collisionBuilder };
