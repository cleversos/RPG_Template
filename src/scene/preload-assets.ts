const icons = [
  "attack",
  "blink",
  "hook",
  "dash",
  "defense",
  "drone",
  "energy",
  "health",
  "heart-full",
  "heart-full",
  "heart-half",
  "heart-zero",
  "star-0",
  "star-1",
  "star-2",
  "star-3",
];
const decors = [
  "drone",
  "energy_ball",
  "houses",
  "ciel",
  "sol",
  "larger_character",
  "larger_character_wave_end",
  "logo",
  "big-letter-1",
  "big-letter-2",
];
const parts = [
  "house-body",
  "house-door",
  "house-head",
  "tree-branch-normal",
  "tree-branch-thick",
  "tree-leaf-half-circle",
  "tree-leaf-heart",
  "tree-leaf-normal",
  "cloud-1",
  "cloud-2",
  "cloud-3",
  "bar-white",
  "bar-yello",
  "mountain-small",
  "mountain-large",
];

const buttons = ["next-wave", "play", "fields"];

const particles = ["rain"];

const enemies = [
  {
    textureName: "egg-thrower-avoid",
    textureImageURL:
      "assets/animation/Enemies/Small/Egg-Thrower/Avoid/egg-thrower-avoid.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Egg-Thrower/Avoid/egg-thrower-avoid.json",
  },
  {
    textureName: "egg-thrower-attack",
    textureImageURL:
      "assets/animation/Enemies/Small/Egg-Thrower/Attack/egg-thrower-attack.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Egg-Thrower/Attack/egg-thrower-attack.json",
  },
  {
    textureName: "egg-projectile-throw",
    textureImageURL:
      "assets/animation/Enemies/Small/Egg-Thrower/blck_small_ranged_egg/egg-projectile-throw.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Egg-Thrower/blck_small_ranged_egg/egg-projectile-throw.json",
  },
  {
    textureName: "egg-projectile-break",
    textureImageURL:
      "assets/animation/Enemies/Small/Egg-Thrower/broken_egg/egg-projectile-break.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Egg-Thrower/broken_egg/egg-projectile-break.json",
  },
  {
    textureName: "sick-attack",
    textureImageURL:
      "assets/animation/Enemies/Small/Sick/Attack/sick-attack.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Sick/Attack/sick-attack.json",
  },
  {
    textureName: "sick-walk",
    textureImageURL: "assets/animation/Enemies/Small/Sick/Walk/sick-walk.png",
    textureJSONURL: "assets/animation/Enemies/Small/Sick/Walk/sick-walk.json",
  },
  {
    textureName: "egg-thrower-avoid",
    textureImageURL:
      "assets/animation/Enemies/Small/Egg-Thrower/Avoid/egg-thrower-avoid.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Egg-Thrower/Avoid/egg-thrower-avoid.json",
  },
  {
    textureName: "egg-thrower-attack",
    textureImageURL:
      "assets/animation/Enemies/Small/Egg-Thrower/Attack/egg-thrower-attack.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Egg-Thrower/Attack/egg-thrower-attack.json",
  },
  {
    textureName: "egg-projectile-throw",
    textureImageURL:
      "assets/animation/Enemies/Small/Egg-Thrower/blck_small_ranged_egg/egg-projectile-throw.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Egg-Thrower/blck_small_ranged_egg/egg-projectile-throw.json",
  },
  {
    textureName: "egg-projectile-break",
    textureImageURL:
      "assets/animation/Enemies/Small/Egg-Thrower/broken_egg/egg-projectile-break.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Egg-Thrower/broken_egg/egg-projectile-break.json",
  },
  {
    textureName: "sick-attack",
    textureImageURL:
      "assets/animation/Enemies/Small/Sick/Attack/sick-attack.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Sick/Attack/sick-attack.json",
  },
  {
    textureName: "sick-walk",
    textureImageURL: "assets/animation/Enemies/Small/Sick/Walk/sick-walk.png",
    textureJSONURL: "assets/animation/Enemies/Small/Sick/Walk/sick-walk.json",
  },
  {
    textureName: "night-attack",
    textureImageURL:
      "assets/animation/Enemies/Small/Night/Attack/night-attack.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Night/Attack/night-attack.json",
  },
  {
    textureName: "night-walk",
    textureImageURL: "assets/animation/Enemies/Small/Night/Walk/night-walk.png",
    textureJSONURL: "assets/animation/Enemies/Small/Night/Walk/night-walk.json",
  },
  {
    textureName: "night-idle",
    textureImageURL: "assets/animation/Enemies/Small/Night/Idle/night-idle.png",
    textureJSONURL: "assets/animation/Enemies/Small/Night/Idle/night-idle.json",
  },
  {
    textureName: "night-dead",
    textureImageURL: "assets/animation/Enemies/Small/Night/Dead/night-dead.png",
    textureJSONURL: "assets/animation/Enemies/Small/Night/Dead/night-dead.json",
  },
  {
    textureName: "night-explode",
    textureImageURL:
      "assets/animation/Enemies/Small/Night/Explode/night-explode.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Night/Explode/night-explode.json",
  },
  {
    textureName: "ocean-idle",
    textureImageURL: "assets/animation/Enemies/Small/Ocean/Idle/ocean-idle.png",
    textureJSONURL: "assets/animation/Enemies/Small/Ocean/Idle/ocean-idle.json",
  },
  {
    textureName: "ocean-attack",
    textureImageURL:
      "assets/animation/Enemies/Small/Ocean/Attack/ocean-attack.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Ocean/Attack/ocean-attack.json",
  },
  {
    textureName: "ocean-walk",
    textureImageURL: "assets/animation/Enemies/Small/Ocean/Walk/ocean-walk.png",
    textureJSONURL: "assets/animation/Enemies/Small/Ocean/Walk/ocean-walk.json",
  },
  {
    textureName: "ocean-bubble",
    textureImageURL:
      "assets/animation/Enemies/Small/Ocean/Bubble/bubble-burst/bubble-burst.png",
    textureJSONURL:
      "assets/animation/Enemies/Small/Ocean/Bubble/bubble-burst/bubble-burst.json",
  },
  {
    textureName: "cycle-idle",
    textureImageURL:
      "assets/animation/Enemies/Medium/Cycle/Idle/cycle-idle.png",
    textureJSONURL:
      "assets/animation/Enemies/Medium/Cycle/Idle/cycle-idle.json",
  },
  {
    textureName: "cycle-attacking-running",
    textureImageURL:
      "assets/animation/Enemies/Medium/Cycle/Attacking-Running/cycle-attacking-running.png",
    textureJSONURL:
      "assets/animation/Enemies/Medium/Cycle/Attacking-Running/cycle-attacking-running.json",
  },
  {
    textureName: "heat-idle",
    textureImageURL:
      "assets/animation/Enemies/Medium/Heat/Idle/heat-enemy_idle.png",
    textureJSONURL:
      "assets/animation/Enemies/Medium/Heat/Idle/heat-enemy_idle.json",
  },
  {
    textureName: "heat-run",
    textureImageURL:
      "assets/animation/Enemies/Medium/Heat/Run/heat-enemy_run.png",
    textureJSONURL:
      "assets/animation/Enemies/Medium/Heat/Run/heat-enemy_run.json",
  },
  {
    textureName: "heat-attack",
    textureImageURL:
      "assets/animation/Enemies/Medium/Heat/Attack/heat-enemy_attack.png",
    textureJSONURL:
      "assets/animation/Enemies/Medium/Heat/Attack/heat-enemy_attack.json",
  },
  {
    textureName: "heat-projectile",
    textureImageURL:
      "assets/animation/Enemies/Medium/Heat/Projectile/heat-enemy_projectile.png",
    textureJSONURL:
      "assets/animation/Enemies/Medium/Heat/Projectile/heat-enemy_projectile.json",
  },
  {
    textureName: "plasma-enemy_idle",
    textureImageURL:
      "assets/animation/Enemies/Medium/Plasma/Idle/plasma-enemy_idle.png",
    textureJSONURL:
      "assets/animation/Enemies/Medium/Plasma/Idle/plasma-enemy_idle.json",
  },
  {
    textureName: "plasma-enemy_run",
    textureImageURL:
      "assets/animation/Enemies/Medium/Plasma/Run/plasma-enemy_run.png",
    textureJSONURL:
      "assets/animation/Enemies/Medium/Plasma/Run/plasma-enemy_run.json",
  },
  {
    textureName: "plasma-enemy_attack",
    textureImageURL:
      "assets/animation/Enemies/Medium/Plasma/Attack/plasma-enemy_attack.png",
    textureJSONURL:
      "assets/animation/Enemies/Medium/Plasma/Attack/plasma-enemy_attack.json",
  },
  {
    textureName: "plasma-projectile",
    textureImageURL:
      "assets/animation/Enemies/Medium/Plasma/PlasmaBall/plasma-ball.png",
    textureJSONURL:
      "assets/animation/Enemies/Medium/Plasma/PlasmaBall/plasma-ball.json",
  },
];

export { icons, decors, parts, buttons, enemies, particles };
