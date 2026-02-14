import {
  clamp,
  createStarField,
  distance,
  drawHeart,
  drawStarField,
  rectsOverlap
} from "./utils.js";

const KEYSET = {
  left: new Set(["ArrowLeft", "a", "A"]),
  right: new Set(["ArrowRight", "d", "D"]),
  jump: new Set(["ArrowUp", "w", "W", " "]),
  assist: new Set(["b", "B"])
};

function catFallback(ctx, player) {
  const x = player.x;
  const y = player.y;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.roundRect(4, 8, player.w - 8, player.h - 8, 12);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(16, 14);
  ctx.lineTo(24, 0);
  ctx.lineTo(32, 14);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(player.w - 16, 14);
  ctx.lineTo(player.w - 24, 0);
  ctx.lineTo(player.w - 32, 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f5c65f";
  ctx.beginPath();
  ctx.arc(20, 24, 4, 0, Math.PI * 2);
  ctx.arc(player.w - 20, 24, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function createPlatformer({
  canvas,
  imageSrc,
  onCollectHeart,
  onMessage,
  onComplete
}) {
  const ctx = canvas.getContext("2d");
  const world = {
    width: 1900,
    height: 540,
    groundY: 470
  };
  const physics = {
    gravity: 1880,
    moveSpeed: 280,
    jumpSpeed: -710
  };

  const starsFar = createStarField(95, world.width, world.height);
  const starsNear = createStarField(170, world.width, world.height);

  const catImage = new Image();
  catImage.src = imageSrc;

  const keys = { left: false, right: false, jump: false, assist: false };
  const virtual = { left: false, right: false, jump: false };
  const checkpoints = [82, 420, 940, 1420];

  const player = {
    x: 82,
    y: 362,
    w: 56,
    h: 56,
    vx: 0,
    vy: 0,
    onGround: false,
    farthestX: 82
  };

  const portal = {
    x: world.width - 138,
    y: 316,
    w: 98,
    h: 144,
    pulse: 0
  };

  function buildPlatforms() {
    return [
      { x: 0, y: 468, w: world.width, h: 84, ground: true },
      { x: 0, y: 438, w: 360, h: 36 },
      { x: 360, y: 392, w: 150, h: 30 },
      { x: 560, y: 348, w: 150, h: 26 },
      { x: 760, y: 312, w: 150, h: 24 },
      { x: 980, y: 352, w: 188, h: 26 },
      { x: 1160, y: 296, w: 170, h: 26, collectibleHint: true },
      { x: 1360, y: 350, w: 160, h: 28, moving: true, baseX: 1360, range: 54, speed: 1.4, dx: 0 },
      { x: 1540, y: 304, w: 160, h: 24 },
      { x: 1710, y: 424, w: 190, h: 30 }
    ];
  }

  function buildHearts() {
    return [
      { x: 515, y: 346, collected: false },
      { x: 705, y: 302, collected: false },
      { x: 1180, y: 250, collected: false },
      { x: 1445, y: 300, collected: false },
      { x: 1695, y: 250, collected: false }
    ];
  }

  let platforms = buildPlatforms();
  let hearts = buildHearts();
  const totalHearts = hearts.length;

  let active = false;
  let completed = false;
  let elapsed = 0;
  let cameraX = 0;
  let collected = 0;
  let deaths = 0;
  let checkpointIndex = 0;
  let jumpConsumed = false;

  const setMessage = (message) => {
    if (typeof onMessage === "function") onMessage(message);
  };

  function pointRectCollision(point, rect) {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.w &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.h
    );
  }

  function reset(fullReset = true) {
    completed = false;
    active = false;
    elapsed = 0;
    cameraX = 0;
    checkpointIndex = 0;
    player.x = 82;
    player.y = 362;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.farthestX = 82;
    portalsafe();
    platforms = buildPlatforms();
    hearts = buildHearts();
    if (fullReset) {
      collected = 0;
      deaths = 0;
    }
    if (typeof onCollectHeart === "function") {
      onCollectHeart({ collected, total: totalHearts });
    }
  }

  function portalsafe() {
    portal.pulse = 0;
  }

  reset(true);

  function respawn() {
    deaths += 1;
    const checkpointX = checkpoints[checkpointIndex] ?? checkpoints[0];
    player.x = checkpointX;
    player.y = 324;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    setMessage("M te espera... no te rindas.");
  }

  function getRect(entity) {
    return {
      x: entity.x,
      y: entity.y,
      w: entity.w,
      h: entity.h
    };
  }

  const handleKeyDown = (event) => {
    if (KEYSET.left.has(event.key)) keys.left = true;
    if (KEYSET.right.has(event.key)) keys.right = true;
    if (KEYSET.jump.has(event.key)) keys.jump = true;
    if (KEYSET.assist.has(event.key)) keys.assist = true;
    if (
      KEYSET.left.has(event.key) ||
      KEYSET.right.has(event.key) ||
      KEYSET.jump.has(event.key) ||
      KEYSET.assist.has(event.key)
    ) {
      event.preventDefault();
    }
  };

  const handleKeyUp = (event) => {
    if (KEYSET.left.has(event.key)) keys.left = false;
    if (KEYSET.right.has(event.key)) keys.right = false;
    if (KEYSET.jump.has(event.key)) keys.jump = false;
    if (KEYSET.assist.has(event.key)) keys.assist = false;
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  function update(dt) {
    if (!active || completed) return;
    if (keys.assist) {
      keys.assist = false;
      completed = true;
      active = false;
      setMessage("Lo lograste. El portal se abre.");
      if (typeof onComplete === "function") {
        onComplete({ collected, total: totalHearts, deaths });
      }
      return;
    }
    const step = Math.min(0.04, dt);
    elapsed += step;
    portal.pulse += step * 2.2;

    for (const platform of platforms) {
      if (!platform.moving) {
        platform.dx = 0;
        continue;
      }
      const previousX = platform.x;
      platform.x = platform.baseX + Math.sin(elapsed * platform.speed) * platform.range;
      platform.dx = platform.x - previousX;
    }

    const movingLeft = keys.left || virtual.left;
    const movingRight = keys.right || virtual.right;
    const jumping = keys.jump || virtual.jump;

    player.vx = ((movingRight ? 1 : 0) - (movingLeft ? 1 : 0)) * physics.moveSpeed;

    if (jumping && player.onGround && !jumpConsumed) {
      player.vy = physics.jumpSpeed;
      player.onGround = false;
      jumpConsumed = true;
    }
    if (!jumping) jumpConsumed = false;

    const prevX = player.x;
    player.x += player.vx * step;

    for (const platform of platforms) {
      if (!platform.ground) continue;
      const a = getRect(player);
      const b = getRect(platform);
      if (!rectsOverlap(a, b)) continue;
      if (prevX + player.w <= platform.x + 8 && player.vx > 0) {
        player.x = platform.x - player.w;
      } else if (prevX >= platform.x + platform.w - 8 && player.vx < 0) {
        player.x = platform.x + platform.w;
      }
    }

    const prevY = player.y;
    player.vy += physics.gravity * step;
    player.y += player.vy * step;
    player.onGround = false;
    let standingPlatform = null;

    for (const platform of platforms) {
      const a = getRect(player);
      const b = getRect(platform);
      if (!rectsOverlap(a, b)) continue;

      if (prevY + player.h <= platform.y + 10 && player.vy >= 0) {
        player.y = platform.y - player.h;
        player.vy = 0;
        player.onGround = true;
        standingPlatform = platform;
      } else if (platform.ground && prevY >= platform.y + platform.h - 6 && player.vy < 0) {
        player.y = platform.y + platform.h;
        player.vy = 40;
      } else if (platform.ground && player.x + player.w / 2 < platform.x + platform.w / 2) {
        player.x = platform.x - player.w;
      } else if (platform.ground) {
        player.x = platform.x + platform.w;
      }
    }

    if (standingPlatform?.moving) {
      player.x += standingPlatform.dx;
    }

    player.x = clamp(player.x, 0, world.width - player.w);

    if (player.y > world.height + 230) {
      respawn();
      return;
    }

    player.farthestX = Math.max(player.farthestX, player.x);
    while (
      checkpointIndex < checkpoints.length - 1 &&
      player.farthestX > checkpoints[checkpointIndex + 1]
    ) {
      checkpointIndex += 1;
    }

    for (const heart of hearts) {
      if (heart.collected) continue;
      const d = distance(
        { x: player.x + player.w / 2, y: player.y + player.h / 2 },
        { x: heart.x, y: heart.y }
      );
      if (d < 34) {
        heart.collected = true;
        collected += 1;
        if (typeof onCollectHeart === "function") {
          onCollectHeart({ collected, total: totalHearts });
        }
        setMessage("Mas amor en camino.");
      }
    }

    if (pointRectCollision({ x: player.x + player.w / 2, y: player.y + player.h / 2 }, portal)) {
      completed = true;
      active = false;
      setMessage("Lo lograste. El portal se abre.");
      if (typeof onComplete === "function") {
        onComplete({ collected, total: totalHearts, deaths });
      }
    }

    cameraX = clamp(player.x - canvas.width * 0.34, 0, world.width - canvas.width);
  }

  function renderBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#120a25");
    gradient.addColorStop(0.5, "#1b1640");
    gradient.addColorStop(1, "#080914");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStarField(ctx, starsFar, cameraX, 0.18, canvas.width, 0.8);
    drawStarField(ctx, starsNear, cameraX, 0.45, canvas.width, 1);

    ctx.fillStyle = "rgba(192, 100, 255, 0.14)";
    ctx.beginPath();
    ctx.ellipse(180, 130, 160, 76, 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0, 212, 255, 0.12)";
    ctx.beginPath();
    ctx.ellipse(canvas.width - 150, 190, 180, 72, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  function renderWorld() {
    ctx.save();
    ctx.translate(-cameraX, 0);

    ctx.fillStyle = "rgba(35, 16, 56, 0.9)";
    ctx.fillRect(0, world.groundY, world.width, world.height - world.groundY);

    for (const platform of platforms) {
      const g = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.h);
      g.addColorStop(0, "rgba(70, 215, 255, 0.85)");
      g.addColorStop(1, "rgba(42, 132, 186, 0.85)");
      ctx.fillStyle = g;
      ctx.strokeStyle = "rgba(230, 250, 255, 0.56)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(platform.x, platform.y, platform.w, platform.h, 10);
      ctx.fill();
      ctx.stroke();
    }

    for (const heart of hearts) {
      if (heart.collected) continue;
      const bob = Math.sin((elapsed + heart.x * 0.01) * 2.2) * 6;
      drawHeart(ctx, heart.x, heart.y + bob, 18, "#ff72c4");
    }

    const pulse = 1 + Math.sin(portal.pulse) * 0.08;
    ctx.save();
    ctx.translate(portal.x + portal.w / 2, portal.y + portal.h / 2);
    ctx.scale(pulse, pulse);
    drawHeart(ctx, 0, 0, 86, "#ff9ad4");
    ctx.strokeStyle = "rgba(250, 230, 120, 0.82)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.bezierCurveTo(-38, -56, -74, -14, 0, 62);
    ctx.bezierCurveTo(74, -14, 38, -56, 0, -24);
    ctx.stroke();
    ctx.restore();

    if (catImage.complete && catImage.naturalWidth > 0) {
      ctx.drawImage(catImage, player.x, player.y, player.w, player.h);
    } else {
      catFallback(ctx, player);
    }
    ctx.restore();
  }

  function renderHud() {
    const progress = clamp(player.x / (portal.x - 80), 0, 1);
    ctx.fillStyle = "rgba(7, 8, 20, 0.52)";
    ctx.fillRect(18, 18, 220, 18);
    ctx.fillStyle = "rgba(255, 126, 191, 0.86)";
    ctx.fillRect(18, 18, 220 * progress, 18);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
    ctx.strokeRect(18, 18, 220, 18);
  }

  function render() {
    renderBackground();
    renderWorld();
    renderHud();
  }

  function start() {
    active = true;
  }

  function stop() {
    active = false;
    keys.left = false;
    keys.right = false;
    keys.jump = false;
    keys.assist = false;
    virtual.left = false;
    virtual.right = false;
    virtual.jump = false;
  }

  function setVirtualControl(control, isPressed) {
    if (!(control in virtual)) return;
    virtual[control] = isPressed;
  }

  function getState() {
    return {
      coordinateSystem: "origin top-left, +x right, +y down",
      active,
      completed,
      cameraX: Number(cameraX.toFixed(2)),
      player: {
        x: Number(player.x.toFixed(2)),
        y: Number(player.y.toFixed(2)),
        vx: Number(player.vx.toFixed(2)),
        vy: Number(player.vy.toFixed(2)),
        onGround: player.onGround
      },
      hearts: {
        collected,
        total: totalHearts
      },
      portalDistance: Number((portal.x - player.x).toFixed(2)),
      deaths
    };
  }

  return {
    start,
    stop,
    update,
    render,
    reset: () => reset(true),
    setVirtualControl,
    getState
  };
}
