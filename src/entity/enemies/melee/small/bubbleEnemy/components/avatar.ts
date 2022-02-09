import { enemies } from "../../../../../../helpers/vars";
import { BubbleEnemy } from "../bubble-enemy";
import { EnemyAvatar } from "../../../../avatar";

export class BubbleEnemyAvatar extends EnemyAvatar {
	public avatar: any;
	public constructor(enemy: BubbleEnemy) {
		super(enemy);
	}

	start() {
		const scene = this.enemy.scene;
		const container = this.enemy.container;

		this.createAnimation_bubble();

		this.avatar = scene.add.sprite(0, 0, "ocean-bubble")
		// this.avatar.play("ocean-bubble");
		
		container.add(this.avatar);
		container.setDepth(enemies.bubbleEnemy.textureDepth);
	}

	createAnimation_bubble() {
		const scene = this.enemy.scene;

		scene.anims.create({
			key: "ocean-bubble",
			frameRate: 15,
			frames: scene.anims.generateFrameNames("ocean-bubble", {
				// prefix: "",
				// suffix: "",
				start: 0,
				end: 9,
				zeroPad: 2
			}),
			repeat: 0
		});
	}
}