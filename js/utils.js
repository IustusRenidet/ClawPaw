export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function createStarField(count, width, height) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.7 + Math.random() * 1.8,
    twinkle: Math.random() * Math.PI * 2
  }));
}

export function drawStarField(ctx, stars, cameraX, parallax, viewWidth, baseAlpha = 1) {
  for (const star of stars) {
    const x = star.x - cameraX * parallax;
    if (x < -4 || x > viewWidth + 4) continue;
    const alpha = (0.38 + Math.sin(star.twinkle) * 0.26) * baseAlpha;
    ctx.fillStyle = `rgba(255, 255, 255, ${clamp(alpha, 0.1, 0.95)})`;
    ctx.beginPath();
    ctx.arc(x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    star.twinkle += 0.016;
  }
}

export function drawHeart(ctx, x, y, size, color = "#ff69b4") {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-10, -4, -20, 8, 0, 22);
  ctx.bezierCurveTo(20, 8, 10, -4, 0, 6);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export function drawGlowCircle(ctx, x, y, radius, color, alpha = 0.9) {
  const gradient = ctx.createRadialGradient(x, y, 2, x, y, radius);
  gradient.addColorStop(0, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`);
  gradient.addColorStop(1, `${color}00`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function pathLength(points) {
  let length = 0;
  for (let i = 1; i < points.length; i += 1) {
    length += distance(points[i - 1], points[i]);
  }
  return length;
}

export function resamplePath(points, targetCount) {
  if (points.length < 2) return points.slice();
  const total = pathLength(points);
  if (total === 0) return points.slice(0, targetCount);
  const segment = total / (targetCount - 1);
  const result = [points[0]];
  let currentDistance = 0;
  let index = 1;
  let prev = points[0];

  while (index < points.length) {
    const point = points[index];
    const d = distance(prev, point);
    if (currentDistance + d >= segment) {
      const t = (segment - currentDistance) / d;
      const interpolated = {
        x: prev.x + t * (point.x - prev.x),
        y: prev.y + t * (point.y - prev.y)
      };
      result.push(interpolated);
      prev = interpolated;
      currentDistance = 0;
    } else {
      currentDistance += d;
      prev = point;
      index += 1;
    }
  }

  while (result.length < targetCount) {
    result.push({ ...points[points.length - 1] });
  }

  return result.slice(0, targetCount);
}

export function normalizePath(points, targetCount = 64) {
  if (!points || points.length < 2) return null;
  const resampled = resamplePath(points, targetCount);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const point of resampled) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const scale = Math.max(maxX - minX, maxY - minY) || 1;

  return resampled.map((point) => ({
    x: (point.x - cx) / scale,
    y: (point.y - cy) / scale
  }));
}

export function averageDistance(pathA, pathB) {
  if (!pathA || !pathB || pathA.length !== pathB.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < pathA.length; i += 1) {
    sum += distance(pathA[i], pathB[i]);
  }
  return sum / pathA.length;
}

export function toCanvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}
