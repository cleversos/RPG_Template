/**
 * This file's purpose is to have a central place for various static variables, ex.: player/enemy avatar's texture depths
 */

export const PLAYER_TEXTURE_DEPTH = 15;

export const PLAYER_VARS = {
  bullet: {
    speed: 60, // bullet speed
    force: {
      // -> Bullet knockback
      x: 15,
      y: -30,
    },
    damage: 14, // -> bullet damage
    delay: 200, // -> bullet delay in milliseconds
  },
  movementCost: {
    dash: 20,
    dodging: 30,
  },
};

export const enemies = {
  enemiesTag: [
    "egg-enemy-body",
    "sick-enemy-body",
    "egg-projectile",
    "egg-small-enemy-body",
    "night-enemy-body",
    "ocean-enemy-body",
    "bubble-enemy-body",
    "cycle-enemy-body",
    "heat-enemy-body",
    "plasma-enemy-body",
  ],
  IS_ENEMIES_TEST_BED_SCENE: false,
  eggEnemy: {
    visualExtraY: -25,
    minDistanceToPlayerForAttack_largeEnemy: 10,
    minDistanceToPlayerForAttack_smallEnemy: 3,
    xMoveSpeedRange: {
      min: 3,
      max: 5,
      getRandom: () => {
        return (
          Math.random() *
            (enemies.eggEnemy.xMoveSpeedRange.max -
              enemies.eggEnemy.xMoveSpeedRange.min) +
          enemies.eggEnemy.xMoveSpeedRange.min
        );
      },
    },
    textureDepth: 14,
    attackFrameRate: 30,
    smallEnemyAvatarScale: 0.5,
    smallEnemyRadius: 13,
    largeEnemyRadius: 25,
    smallEnemyExtraTextureY: -10,
    smallEnemySideSensorSize: 50,
    eggProjectile: {
      textureDepth: 13,
      avatarScale: 0.5,
      bodyRadius: 25,
      brokenTextureExtraY: -20,
    },
  },
  sickEnemy: {
    visualExtraY: -25,
    minDistanceToPlayerForAttack_enemy: 2,
    minDistanceToPlayerForChasing_enemy: 15,
    xMoveSpeedRange: {
      min: 5,
      max: 8,
      getRandom: () => {
        return (
          Math.random() *
            (enemies.sickEnemy.xMoveSpeedRange.max -
              enemies.sickEnemy.xMoveSpeedRange.min) +
          enemies.sickEnemy.xMoveSpeedRange.min
        );
      },
    },
    textureDepth: 14,
    attackFrameRate: 30,
    enemyRadius: 15,
  },

  nightEnemy: {
    visualExtraY: -25,
    minDistanceToPlayerForAttack_enemy: 2,
    minDistanceToPlayerForChasing_enemy: 15,
    xMoveSpeedRange: {
      min: 4,
      max: 6,
      getRandom: () => {
        return (
          Math.random() *
            (enemies.nightEnemy.xMoveSpeedRange.max -
              enemies.nightEnemy.xMoveSpeedRange.min) +
          enemies.nightEnemy.xMoveSpeedRange.min
        );
      },
    },
    textureDepth: 14,
    attackFrameRate: 30,
    enemyRadius: 25,
    explosionSize: 0.3,
    explosionHeight: 0.4,
    minExplosionTime: 1,
    maxExplosionTime: 10,
  },

  oceanEnemy: {
    visualExtraY: -25,
    minDistanceToPlayerForAttack_enemy: 10,
    minDistanceToPlayerForChasing_enemy: 20,
    xMoveSpeedRange: {
      min: 4,
      max: 7,
      getRandom: () => {
        return (
          Math.random() *
            (enemies.oceanEnemy.xMoveSpeedRange.max -
              enemies.oceanEnemy.xMoveSpeedRange.min) +
          enemies.oceanEnemy.xMoveSpeedRange.min
        );
      },
    },
    textureDepth: 14,
    attackFrameRate: 30,
    enemyRadius: 25,
    logColor: "color: #5c96ff",
    maxBubblesActive: 3,
    isLogStateChanges: false,
    isLogAnimatedPlayed: false,
  },

  bubbleEnemy: {
    visualExtraY: -25,
    minDistanceToPlayerForAttack_enemy: 2,
    minDistanceToPlayerForChasing_enemy: 10,
    xMoveSpeedRange: {
      min: 6,
      max: 9,
      getRandom: () => {
        return (
          Math.random() *
            (enemies.bubbleEnemy.xMoveSpeedRange.max -
              enemies.bubbleEnemy.xMoveSpeedRange.min) +
          enemies.bubbleEnemy.xMoveSpeedRange.min
        );
      },
    },
    textureDepth: 14,
    attackFrameRate: 30,
    enemyRadius: 25,
    onBurstPlayerKnockback: {
      x: 2000,
      y: -4500,
    },
  },

  cycleEnemy: {
    visualExtraY: -25,
    minDistanceToPlayerForAttackingRunning: 15,
    minDistanceToPlayerForMeleeAttack: 3,
    minDistanceToPlayerToExitMeleeAttackState: 5, // think of it like this: enemy enters melee range, now they need to be outside of this variable's distance to exit (to avoid studdering)
    xMoveSpeedRange: {
      min: 5,
      max: 8,
      getRandom: () => {
        return (
          Math.random() *
            (enemies.cycleEnemy.xMoveSpeedRange.max -
              enemies.cycleEnemy.xMoveSpeedRange.min) +
          enemies.cycleEnemy.xMoveSpeedRange.min
        );
      },
    },
    textureDepth: 14,
    attackFrameRate: 30,
    enemyRadius: 30,
    logColor: "color: #c071ff",
    isLogStateChanges: true,
  },

  heatEnemy: {
    minDistanceToPlayerForAttack_range: {
      min: 10,
      max: 40,
      getRandom: () => {
        return (
          Math.random() *
            (enemies.heatEnemy.minDistanceToPlayerForAttack_range.max -
              enemies.heatEnemy.minDistanceToPlayerForAttack_range.min) +
          enemies.heatEnemy.minDistanceToPlayerForAttack_range.min
        );
      },
    },
  },

  plasmaEnemy: {
    minDistanceToPlayerForAttack_range: {
      min: 10,
      max: 40,
      getRandom: () => {
        return (
          Math.random() *
            (enemies.plasmaEnemy.minDistanceToPlayerForAttack_range.max -
              enemies.plasmaEnemy.minDistanceToPlayerForAttack_range.min) +
          enemies.plasmaEnemy.minDistanceToPlayerForAttack_range.min
        );
      },
    },
  },
};

export const logColors = {
  create: "color: #90ff78",
  state: "color: #f9ff71",
  animation: "color: #ff65cb",
};
