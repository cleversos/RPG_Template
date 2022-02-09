import { enemies } from "../../../../../../helpers/vars";
import { EnemyAvatar } from "../../../../avatar";
import { CycleEnemy } from "../cycle-enemy";

export class CycleEnemyAvatar extends EnemyAvatar {
	public avatar: any;
	public constructor(enemy: CycleEnemy) {
		super(enemy);
	}

	start() {
		const scene = this.enemy.scene;
		const container = this.enemy.container;

		this.createAnimation_idle();
    this.createAnimation_attackingRunning();

		this.avatar = scene.add.sprite(0, 0, "cycle-idle")
		this.avatar.play("cycle-idle");
		
		container.add(this.avatar);
		container.setDepth(enemies.bubbleEnemy.textureDepth);
	}

	createAnimation_idle() {
		const scene = this.enemy.scene;

		scene.anims.create({
			key: "cycle-idle",
			frameRate: 30,
			frames: scene.anims.generateFrameNames("cycle-idle", {
				// prefix: "",
				// suffix: "",
				start: 0,
				end: 23,
				zeroPad: 2
			}),
			repeat: -1
		});
	}

  createAnimation_attackingRunning() {
		const scene = this.enemy.scene;

		scene.anims.create({
			key: "cycle-attacking-running",
			frameRate: 30,
			frames: scene.anims.generateFrameNames("cycle-attacking-running", {
				// prefix: "",
				// suffix: "",
				start: 0,
				end: 23,
				zeroPad: 2
			}),
			repeat: -1
		});
	}
}