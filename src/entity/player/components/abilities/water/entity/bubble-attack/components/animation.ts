import { AnimationObject } from "../../../../../../../../animation/animation";
import { GameCore } from "../../../../../../../../core/game";
import { EnemyAvatar } from "../../../../../../../enemies/avatar";
import { EnemyBody } from "../../../../../../../enemies/body";
import { EnemyMovement } from "../../../../../../../enemies/movement";
import { EntityComponent } from "../../../../../../../entity";
import { BubbleAttack } from "../bubble-attack";
import { BubbleBody } from "./body";

export class BubbleAnimation extends EntityComponent {
  public animationObject: AnimationObject;

  public constructor(public parent: BubbleAttack) {
    super();
  }

  public start() {
    const { scene, container } = this.parent;

    this.animationObject = new AnimationObject(scene, "5", 0, 0);
    this.animationObject.loop = false;
    this.animationObject.action = 1;
    this.animationObject.getFrame();

    container.add(this.animationObject.image);
  }

  public update() {
    const animation = this.animationObject;

    if (animation.frame === 18) {
      this.parent.destroy();
    }

    if (animation.frame > 3) {
      const body = this.parent.getComponent<BubbleBody>("body");
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
