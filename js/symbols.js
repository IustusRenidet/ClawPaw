import {
  averageDistance,
  clamp,
  createStarField,
  drawHeart,
  drawStarField,
  normalizePath,
  toCanvasPoint
} from "./utils.js";

function makeHeartTemplate() {
  const points = [];
  for (let i = 0; i <= 80; i += 1) {
    const t = (i / 80) * Math.PI * 2;
    const x = 0.75 * Math.pow(Math.sin(t), 3);
    const y =
      0.58 *
      -(
        0.8 * Math.cos(t) -
        0.32 * Math.cos(2 * t) -
        0.16 * Math.cos(3 * t) -
        0.08 * Math.cos(4 * t)
      );
    points.push({ x, y });
  }
  return points;
}

function makeStarTemplate() {
  const points = [];
  const spikes = 5;
  const outer = 1;
  const inner = 0.42;
  for (let i = 0; i <= spikes * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / spikes;
    points.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    });
  }
  return points;
}

function makeInfinityTemplate() {
  const points = [];
  for (let i = 0; i <= 100; i += 1) {
    const t = (i / 100) * Math.PI * 2;
    points.push({
      x: Math.sin(t),
      y: 0.55 * Math.sin(2 * t)
    });
  }
  return points;
}

function makeSMTemplate() {
  return [
    { x: -0.95, y: -0.34 },
    { x: -0.66, y: -0.66 },
    { x: -0.38, y: -0.3 },
    { x: -0.66, y: 0.02 },
    { x: -0.31, y: 0.4 },
    { x: 0.02, y: 0.02 },
    { x: 0.1, y: -0.5 },
    { x: 0.28, y: 0.4 },
    { x: 0.49, y: -0.42 },
    { x: 0.69, y: 0.4 },
    { x: 0.92, y: -0.1 }
  ];
}

function toGuidePath(points, cx, cy, scale) {
  return points.map((point) => ({
    x: cx + point.x * scale,
    y: cy + point.y * scale
  }));
}

function strokePath(ctx, points) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function tuxedoFallback(ctx, x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#0b0b0f";
  ctx.beginPath();
  ctx.roundRect(0, 16, w, h - 16, 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(24, 24);
  ctx.lineTo(40, 0);
  ctx.lineTo(54, 24);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w - 24, 24);
  ctx.lineTo(w - 40, 0);
  ctx.lineTo(w - 54, 24);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(w * 0.36, h * 0.38, w * 0.28, h * 0.46, 18);
  ctx.fill();
  ctx.fillStyle = "#f2c867";
  ctx.beginPath();
  ctx.arc(w * 0.34, h * 0.38, 6, 0, Math.PI * 2);
  ctx.arc(w * 0.66, h * 0.38, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function createSymbolsGame({
  canvas,
  imageSrc,
  onFeedback,
  onProgress,
  onComplete
}) {
  const ctx = canvas.getContext("2d");
  const catImage = new Image();
  catImage.src = imageSrc;
  const stars = createStarField(130, canvas.width, canvas.height);

  const symbols = [
    {
      id: "heart",
      label: "Corazon",
      color: "#ff83ba",
      template: makeHeartTemplate(),
      threshold: 0.52
    },
    {
      id: "star",
      label: "Estrella",
      color: "#ffd36f",
      template: makeStarTemplate(),
      threshold: 0.53
    },
    {
      id: "infinity",
      label: "Infinito",
      color: "#9fd9ff",
      template: makeInfinityTemplate(),
      threshold: 0.55
    },
    {
      id: "sm",
      label: "S y M",
      color: "#ffc1e7",
      template: makeSMTemplate(),
      threshold: 0.58
    }
  ];

  let active = false;
  let currentIndex = 0;
  let attempts = 0;
  let guidePulse = 0;
  let lastScore = 0;
  let drawing = false;
  let stroke = [];
  let ghostStroke = [];
  let ghostLife = 0;
  let particles = [];
  let progress = symbols.map(() => false);

  function refreshGuides() {
    const cx = canvas.width * 0.66;
    const cy = canvas.height * 0.5;
    for (const symbol of symbols) {
      symbol.guide = toGuidePath(symbol.template, cx, cy, 122);
      symbol.normalized = normalizePath(symbol.guide, 64);
    }
  }

  refreshGuides();

  function emitFeedback(message, type = "neutral") {
    if (typeof onFeedback === "function") onFeedback(message, type);
  }

  function emitProgress() {
    if (typeof onProgress === "function") {
      onProgress({
        current: currentIndex,
        total: symbols.length,
        label: symbols[currentIndex]?.label ?? "Completado",
        progress: progress.slice()
      });
    }
  }

  function reset() {
    active = false;
    currentIndex = 0;
    attempts = 0;
    guidePulse = 0;
    lastScore = 0;
    drawing = false;
    stroke = [];
    ghostStroke = [];
    ghostLife = 0;
    particles = [];
    progress = symbols.map(() => false);
    emitProgress();
    emitFeedback("Dibuja el simbolo guia para abrir el portal.");
  }

  reset();

  function spawnParticles(x, y, color) {
    for (let i = 0; i < 30; i += 1) {
      const angle = (Math.PI * 2 * i) / 30 + Math.random() * 0.2;
      const speed = 60 + Math.random() * 140;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.9 + Math.random() * 0.4,
        maxLife: 1.1,
        color
      });
    }
  }

  function evaluateStroke() {
    if (!active || currentIndex >= symbols.length) return;
    if (stroke.length < 10) {
      ghostStroke = stroke.slice();
      ghostLife = 0.5;
      stroke = [];
      attempts += 1;
      if (attempts >= 3) {
        const target = symbols[currentIndex];
        progress[currentIndex] = true;
        attempts = 0;
        currentIndex += 1;
        emitProgress();
        emitFeedback("La magia responde a tu intento.", "ok");
        if (currentIndex >= symbols.length) {
          active = false;
          emitFeedback("Los simbolos resuenan. S te espera.", "ok");
          if (typeof onComplete === "function") {
            window.setTimeout(() => onComplete(), 700);
          }
        }
      } else {
        emitFeedback("Trazo muy corto. Intenta de nuevo.", "error");
      }
      return;
    }

    const target = symbols[currentIndex];
    const normalized = normalizePath(stroke, 64);
    if (!normalized) {
      emitFeedback("No se pudo leer el trazo. Repite.", "error");
      stroke = [];
      return;
    }

    const distForward = averageDistance(normalized, target.normalized);
    const distBackward = averageDistance(normalized.slice().reverse(), target.normalized);
    const dist = Math.min(distForward, distBackward);
    const score = clamp(1 - dist / 0.85, 0, 1);
    lastScore = score;

    const success = score >= target.threshold || attempts >= 2;
    if (success) {
      progress[currentIndex] = true;
      const end = stroke[stroke.length - 1];
      spawnParticles(end.x, end.y, target.color);
      emitFeedback("Perfecto. La magia fluye.", "ok");
      stroke = [];
      ghostStroke = [];
      attempts = 0;
      currentIndex += 1;
      emitProgress();
      if (currentIndex >= symbols.length) {
        active = false;
        emitFeedback("Los simbolos resuenan. S te espera.", "ok");
        if (typeof onComplete === "function") {
          window.setTimeout(() => onComplete(), 700);
        }
      }
      return;
    }

    attempts += 1;
    ghostStroke = stroke.slice();
    ghostLife = 0.72;
    stroke = [];
    emitFeedback("Casi. Intenta de nuevo.", "error");
  }

  function onPointerDown(event) {
    if (!active) return;
    drawing = true;
    stroke = [toCanvasPoint(event, canvas)];
    canvas.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!active || !drawing) return;
    stroke.push(toCanvasPoint(event, canvas));
  }

  function onPointerUp() {
    if (!drawing) return;
    drawing = false;
    evaluateStroke();
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  function update(dt) {
    const step = Math.min(0.04, dt);
    guidePulse += step * 3;
    ghostLife = Math.max(0, ghostLife - step);
    particles = particles
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx * step,
        y: particle.y + particle.vy * step,
        vy: particle.vy + 80 * step,
        life: particle.life - step
      }))
      .filter((particle) => particle.life > 0);
  }

  function drawBackdrop() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#12051d");
    gradient.addColorStop(0.55, "#1a1433");
    gradient.addColorStop(1, "#211024");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStarField(ctx, stars, 0, 0, canvas.width, 0.85);

    ctx.strokeStyle = "rgba(255, 126, 191, 0.2)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i += 1) {
      const radius = 60 + i * 36;
      ctx.beginPath();
      ctx.arc(canvas.width * 0.66, canvas.height * 0.5, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawCharacter() {
    if (catImage.complete && catImage.naturalWidth > 0) {
      ctx.drawImage(catImage, 30, canvas.height - 240, 220, 220);
    } else {
      tuxedoFallback(ctx, 42, canvas.height - 228, 194, 194);
    }
  }

  function drawGuides() {
    if (currentIndex >= symbols.length) return;
    const target = symbols[currentIndex];
    const pulse = 0.28 + (Math.sin(guidePulse) + 1) * 0.2;
    ctx.strokeStyle = `rgba(255, 255, 255, ${pulse.toFixed(3)})`;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    strokePath(ctx, target.guide);
  }

  function drawProgressSlots() {
    const startX = 300;
    const y = 48;
    for (let i = 0; i < symbols.length; i += 1) {
      const x = startX + i * 150;
      const done = progress[i];
      ctx.fillStyle = done ? "rgba(255, 215, 128, 0.34)" : "rgba(255, 255, 255, 0.08)";
      ctx.strokeStyle = done ? "rgba(255, 215, 128, 0.86)" : "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, 126, 42, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = done ? "#ffeab8" : "#d7d7f6";
      ctx.font = "600 16px Quicksand";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(symbols[i].label, x + 63, y + 22);
    }
  }

  function drawStrokeLayers() {
    if (ghostStroke.length > 1 && ghostLife > 0) {
      ctx.strokeStyle = `rgba(255, 120, 170, ${ghostLife.toFixed(3)})`;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      strokePath(ctx, ghostStroke);
    }

    if (stroke.length > 1) {
      const color = symbols[currentIndex]?.color ?? "#ffffff";
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      strokePath(ctx, stroke);
    }
  }

  function drawParticles() {
    for (const particle of particles) {
      const alpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.fillStyle = `rgba(255, 210, 240, ${alpha.toFixed(3)})`;
      drawHeart(ctx, particle.x, particle.y, 7, particle.color);
    }
  }

  function drawHint() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "600 20px Quicksand";
    ctx.textAlign = "left";
    const label = symbols[currentIndex]?.label ?? "Completado";
    ctx.fillText(`Traza: ${label}`, 34, 48);
  }

  function render() {
    drawBackdrop();
    drawCharacter();
    drawGuides();
    drawStrokeLayers();
    drawParticles();
    drawProgressSlots();
    drawHint();
  }

  function start() {
    active = true;
    emitProgress();
  }

  function stop() {
    active = false;
    drawing = false;
    stroke = [];
  }

  function clearCurrentStroke() {
    stroke = [];
    ghostStroke = [];
    ghostLife = 0;
  }

  function getState() {
    return {
      coordinateSystem: "origin top-left, +x right, +y down",
      active,
      currentSymbol: symbols[currentIndex]?.id ?? null,
      currentLabel: symbols[currentIndex]?.label ?? "Completado",
      progress: progress.slice(),
      attempts,
      lastScore: Number(lastScore.toFixed(3)),
      drawingPoints: stroke.length
    };
  }

  return {
    start,
    stop,
    update,
    render,
    reset,
    clearCurrentStroke,
    getState
  };
}
