import { enemies } from "../../../../../../helpers/vars";
import { PlasmaProjectile } from "../plasma-projectile";
import { EnemyAvatar } from "../../../../avatar";

export class PlasmaProjectileAvatar extends EnemyAvatar {
	public avatar: any;
	public constructor(enemy: PlasmaProjectile) {
		super(enemy);
	}

	start() {
		const scene = this.enemy.scene;
		const container = this.enemy.container;

		this.createAnimation_throw();

		this.avatar = scene.add.sprite(0, 0, "plasma-projectile")
			.setScale(1);
		this.avatar.play("plasma-projectile-throw");
		
		container.add(this.avatar);
		container.setDepth(1);
	}

	createAnimation_throw() {
		const scene = this.enemy.scene;

		scene.anims.create({
			key: "plasma-projectile-throw",
			frameRate: 30,
			frames: scene.anims.generateFrameNames("plasma-projectile", {
				prefix: "plasma_attack_",
				// suffix: "",
				start: 0,
				end: 36,
				zeroPad: 2
			}),
			repeat: 0
		});
	}
}