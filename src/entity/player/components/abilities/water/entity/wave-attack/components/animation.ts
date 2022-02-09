import { AnimationObject } from "../../../../../../../../animation/animation";
import { GameCore } from "../../../../../../../../core/game";
import { EnemyBody } from "../../../../../../../enemies/body";
import { EnemyMovement } from "../../../../../../../enemies/movement";
import { EntityComponent } from "../../../../../../../entity";
import { Player } from "../../../../../../player";
import { WaveAttack } from "../wave-attack";
import { WaveAttackBody } from "./body";

export class WaveAttackAnimation extends EntityComponent {
  public animationObject: AnimationObject;
  public constructor(public parent: WaveAttack) {
    super();
  }

  public awake() {
    const parent = this.parent;
    const container = this.parent.container;
    const scene = this.parent.scene;

    this.animationObject = new AnimationObject(scene, "5", 0, 0);
    this.animationObject.loop = false;
    this.animationObject.frame = 0;
    this.animationObject.action = 3;

    this.animationObject.image.scaleX = parent.direction;
    this.animationObject.getFrame();

    container.add(this.animationObject.image);
  }

  public update() {
    const animation = this.animationObject;
    console.log(animation.frame);
    if (animation.frame === 31) {
      this.parent.destroy();
      return;
    }

    if (animation.frame >= 2) {
      this.parent.waveOver = true;
      const body = this.parent.getComponent<WaveAttackBody>("body");
      const enemyContactManager = body.contactsManager.get("enemy");
      if (enemyContactManager) {
        enemyContactManager.activeContact.forEach((c) => {
          const { parent } = c.getUserData() as { parent: EnemyBody };
          if (parent) {
            const enemy = parent.enemy.container;
            if (enemy) {
              const movement =
                parent.enemy.getComponent<EnemyMovement>("movement");
              const direction = this.animationObject.image.scaleX;

              if (!movement.knockBack) {
                const s = GameCore.skills.get("ነጐዳበ");

                movement.doKnockedback(direction, 15, -30);

                parent.enemy.life -= 4 + 1.5 * s.count;
              }
            }
          }
        });
      }
    }
  }
}
