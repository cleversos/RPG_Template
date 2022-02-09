import { AnimationObject } from "../../../../../../../../animation/animation";
import { GameCore } from "../../../../../../../../core/game";
import { EnemyAvatar } from "../../../../../../../enemies/avatar";
import { EnemyBody } from "../../../../../../../enemies/body";
import { EnemyMovement } from "../../../../../../../enemies/movement";
import { EntityComponent } from "../../../../../../../entity";
import { ThunderAttack } from "../thunder";
import { ThunderBody } from "./body";

export class ThunderAnimation extends EntityComponent {
  public animationObject: AnimationObject;

  public constructor(public parent: ThunderAttack) {
    super();
  }

  public start() {
    const { scene, container } = this.parent;

    this.animationObject = new AnimationObject(scene, "7", 0, -20);
    this.animationObject.loop = false;
    this.animationObject.action = 1;
    this.animationObject.getFrame();
    const { width, height } = this.animationObject.image;
    this.animationObject.image.setDisplaySize(width * 0.65, height * 0.65);

    container.add(this.animationObject.image);
  }

  public update() {
    const animation = this.animationObject;

    if (animation.frame + 1 === animation.getAnimationSize()) {
      this.parent.destroy();
      return;
    }

    if (animation.frame > 3) {
      const body = this.parent.getComponent<ThunderBody>("body");
      const enemyContactManager = body.contactsManager.get("enemy");
      if (enemyContactManager) {
        enemyContactManager.activeContact.forEach((c) => {
          const { parent } = c.getUserData() as { parent: EnemyBody };
          if (parent) {
            const enemy = parent.enemy.container;
            if (enemy) {
              const movement =
                parent.enemy.getComponent<EnemyMovement>("movement");
              const direction = enemy.x > this.parent.x ? 1 : -1;
              if (!movement.knockBack) {
                const s = GameCore.skills.get("ነጐዳ");

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
