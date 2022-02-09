import { enemies } from "../../../../../../helpers/vars";
import { EggProjectile } from "../egg-projectile";
import { EnemyAvatar } from "../../../../avatar";

export class EggProjectileAvatar extends EnemyAvatar {
	public avatar: any;
	public constructor(enemy: EggProjectile) {
		super(enemy);
	}

	start() {
		const scene = this.enemy.scene;
		const container = this.enemy.container;

		this.createAnimation_throw();
		this.createAnimation_break();

		this.avatar = scene.add.sprite(0, 0, "egg-projectile-throw")
			.setScale(enemies.eggEnemy.eggProjectile.avatarScale);
		this.avatar.play("egg-projectile-throw");
		
		container.add(this.avatar);
		container.setDepth(enemies.eggEnemy.eggProjectile.textureDepth);
	}

	createAnimation_throw() {
		const scene = this.enemy.scene;

		scene.anims.create({
			key: "egg-projectile-throw",
			frameRate: 60,
			frames: scene.anims.generateFrameNames("egg-projectile-throw", {
				// prefix: "",
				// suffix: "",
				start: 0,
				end: 59,
				zeroPad: 2
			}),
			repeat: -1
		});
	}

	createAnimation_break() {
		const scene = this.enemy.scene;

		scene.anims.create({
			key: "egg-projectile-break",
			frameRate: 30,
			frames: scene.anims.generateFrameNames("egg-projectile-break", {
				// prefix: "",
				// suffix: "",
				start: 0,
				end: 59,
				zeroPad: 2
			}),
			repeat: 0
		});
	}
}