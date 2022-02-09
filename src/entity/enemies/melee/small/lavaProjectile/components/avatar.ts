import { enemies } from "../../../../../../helpers/vars";
import { LavaProjectile } from "../lava-projectile";
import { EnemyAvatar } from "../../../../avatar";

export class LavaProjectileAvatar extends EnemyAvatar {
	public avatar: any;
	public constructor(enemy: LavaProjectile) {
		super(enemy);
	}

	start() {
		const scene = this.enemy.scene;
		const container = this.enemy.container;

		this.createAnimation_throw();

		this.avatar = scene.add.sprite(0, 0, "heat-projectile")
			.setScale(0.25);
		this.avatar.play("heat-projectile-throw");
		
		container.add(this.avatar);
		container.setDepth(1);
	}

	createAnimation_throw() {
		const scene = this.enemy.scene;

		scene.anims.create({
			key: "heat-projectile-throw",
			frameRate: 30,
			frames: scene.anims.generateFrameNames("heat-projectile", {
				prefix: "heat_attack_",
				// suffix: "",
				start: 0,
				end: 45,
				zeroPad: 2
			}),
			repeat: 0
		});
	}
}