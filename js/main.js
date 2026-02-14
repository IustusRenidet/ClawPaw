import { createPlatformer } from "./platformer.js";
import { createSymbolsGame } from "./symbols.js";

const SCENES = {
  TITLE: "title-screen",
  INTRO_VIDEO: "intro-video-screen",
  TRANSITION_1: "transition-1-screen",
  PLATFORMER: "platformer-screen",
  TRANSITION_2: "transition-2-screen",
  SYMBOLS: "symbols-screen",
  TRANSITION_3: "transition-3-screen",
  OUTRO_VIDEO: "outro-video-screen",
  FINAL: "final-screen"
};

const sceneNodes = [...document.querySelectorAll(".scene")];

const ui = {
  startAdventure: document.getElementById("start-adventure"),
  toPlatformer: document.getElementById("to-platformer-btn"),
  toSymbols: document.getElementById("to-symbols-btn"),
  toOutro: document.getElementById("to-outro-btn"),
  replay: document.getElementById("replay-btn"),
  platformerReset: document.getElementById("platformer-reset"),
  symbolsClear: document.getElementById("symbols-clear"),
  introVideo: document.getElementById("intro-video"),
  outroVideo: document.getElementById("outro-video"),
  introFallbackBtn: document.getElementById("intro-fallback-btn"),
  outroFallbackBtn: document.getElementById("outro-fallback-btn"),
  introStatus: document.getElementById("intro-status"),
  outroStatus: document.getElementById("outro-status"),
  platformerHearts: document.getElementById("platformer-hearts"),
  platformerMessage: document.getElementById("platformer-message"),
  symbolsCurrent: document.getElementById("symbols-current"),
  symbolsProgress: document.getElementById("symbols-progress"),
  symbolsFeedback: document.getElementById("symbols-feedback"),
  platformerCanvas: document.getElementById("platformer-canvas"),
  symbolsCanvas: document.getElementById("symbols-canvas"),
  touchButtons: [...document.querySelectorAll("#platformer-touch button")]
};

const gameState = {
  scene: SCENES.TITLE,
  platformerDone: false,
  symbolsDone: false
};

const platformer = createPlatformer({
  canvas: ui.platformerCanvas,
  imageSrc: "assets/images/gato_negro.png",
  onCollectHeart: ({ collected, total }) => {
    ui.platformerHearts.textContent = `Corazones: ${collected} / ${total}`;
  },
  onMessage: (message) => {
    ui.platformerMessage.textContent = message;
  },
  onComplete: () => {
    gameState.platformerDone = true;
    ui.platformerMessage.textContent = "Sophiau llego al portal. Excelente.";
    setScene(SCENES.TRANSITION_2);
  }
});

const symbols = createSymbolsGame({
  canvas: ui.symbolsCanvas,
  imageSrc: "assets/images/gato_vaca.png",
  onFeedback: (message) => {
    ui.symbolsFeedback.textContent = message;
  },
  onProgress: ({ current, total, label, progress }) => {
    const done = progress.filter(Boolean).length;
    ui.symbolsCurrent.textContent = `Simbolo: ${label}`;
    ui.symbolsProgress.textContent = `Progreso: ${done} / ${total}`;
    if (current >= total) {
      ui.symbolsCurrent.textContent = "Simbolo: Completado";
    }
  },
  onComplete: () => {
    gameState.symbolsDone = true;
    ui.symbolsFeedback.textContent = "Los portales responden a su magia.";
    setScene(SCENES.TRANSITION_3);
  }
});

function stopGameplay() {
  platformer.stop();
  symbols.stop();
}

function setActiveScene(sceneId) {
  for (const node of sceneNodes) {
    node.classList.toggle("active", node.id === sceneId);
  }
  gameState.scene = sceneId;
}

function playVideo(kind) {
  const isIntro = kind === "intro";
  const video = isIntro ? ui.introVideo : ui.outroVideo;
  const statusNode = isIntro ? ui.introStatus : ui.outroStatus;
  const fallbackBtn = isIntro ? ui.introFallbackBtn : ui.outroFallbackBtn;
  const nextScene = isIntro ? SCENES.TRANSITION_1 : SCENES.FINAL;

  fallbackBtn.classList.add("hidden");
  statusNode.textContent = isIntro
    ? "Los gatos cruzan hacia dimensiones distintas..."
    : "Los portales se fusionan en un solo latido...";

  video.currentTime = 0;
  let finished = false;
  let timeoutId = null;

  const goNext = () => {
    if (finished) return;
    finished = true;
    if (timeoutId) window.clearTimeout(timeoutId);
    setScene(nextScene);
  };

  const failVideo = () => {
    if (finished) return;
    finished = true;
    if (timeoutId) window.clearTimeout(timeoutId);
    video.pause();
    statusNode.textContent = "Video no disponible. Usaremos transicion narrativa.";
    fallbackBtn.classList.remove("hidden");
  };

  fallbackBtn.onclick = goNext;
  video.onended = goNext;
  video.onerror = failVideo;

  timeoutId = window.setTimeout(() => {
    if (video.readyState < 2) failVideo();
  }, 3500);

  const playAttempt = video.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => failVideo());
  }
}

function setScene(sceneId) {
  stopGameplay();
  if (sceneId !== SCENES.INTRO_VIDEO) ui.introVideo.pause();
  if (sceneId !== SCENES.OUTRO_VIDEO) ui.outroVideo.pause();
  setActiveScene(sceneId);

  if (sceneId === SCENES.INTRO_VIDEO) {
    playVideo("intro");
    return;
  }

  if (sceneId === SCENES.OUTRO_VIDEO) {
    playVideo("outro");
    return;
  }

  if (sceneId === SCENES.PLATFORMER) {
    platformer.start();
    return;
  }

  if (sceneId === SCENES.SYMBOLS) {
    symbols.start();
    return;
  }
}

function resetCampaign() {
  gameState.platformerDone = false;
  gameState.symbolsDone = false;
  platformer.reset();
  symbols.reset();
  ui.platformerMessage.textContent = "M te espera... no te rindas.";
  ui.symbolsFeedback.textContent = "Dibuja el simbolo guia para abrir el portal.";
  ui.introStatus.textContent = "Los portales se estan formando...";
  ui.outroStatus.textContent = "Los portales se fusionan en un solo corazon...";
}

ui.startAdventure.addEventListener("click", () => {
  resetCampaign();
  setScene(SCENES.INTRO_VIDEO);
});

ui.toPlatformer.addEventListener("click", () => {
  setScene(SCENES.PLATFORMER);
});

ui.toSymbols.addEventListener("click", () => {
  if (!gameState.platformerDone) return;
  setScene(SCENES.SYMBOLS);
});

ui.toOutro.addEventListener("click", () => {
  if (!gameState.symbolsDone) return;
  setScene(SCENES.OUTRO_VIDEO);
});

ui.replay.addEventListener("click", () => {
  resetCampaign();
  setScene(SCENES.TITLE);
});

ui.platformerReset.addEventListener("click", () => {
  platformer.reset();
  setScene(SCENES.PLATFORMER);
});

ui.symbolsClear.addEventListener("click", () => {
  symbols.clearCurrentStroke();
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  if (gameState.scene === SCENES.TITLE) {
    ui.startAdventure.click();
  } else if (gameState.scene === SCENES.INTRO_VIDEO) {
    setScene(SCENES.TRANSITION_1);
  } else if (gameState.scene === SCENES.TRANSITION_1) {
    ui.toPlatformer.click();
  } else if (gameState.scene === SCENES.TRANSITION_2 && gameState.platformerDone) {
    ui.toSymbols.click();
  } else if (gameState.scene === SCENES.TRANSITION_3 && gameState.symbolsDone) {
    ui.toOutro.click();
  } else if (gameState.scene === SCENES.OUTRO_VIDEO) {
    setScene(SCENES.FINAL);
  } else if (gameState.scene === SCENES.FINAL) {
    ui.replay.click();
  }
});

for (const button of ui.touchButtons) {
  const control = button.dataset.control;
  if (!control) continue;

  const press = (event) => {
    event.preventDefault();
    platformer.setVirtualControl(control, true);
  };
  const release = (event) => {
    event.preventDefault();
    platformer.setVirtualControl(control, false);
  };

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("lostpointercapture", release);
}

function step(dt) {
  if (gameState.scene === SCENES.PLATFORMER) {
    platformer.update(dt);
  } else if (gameState.scene === SCENES.SYMBOLS) {
    symbols.update(dt);
  }
}

function render() {
  if (gameState.scene === SCENES.PLATFORMER) {
    platformer.render();
  } else if (gameState.scene === SCENES.SYMBOLS) {
    symbols.render();
  }
}

let lastTime = performance.now();
function animationLoop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  step(dt);
  render();
  window.requestAnimationFrame(animationLoop);
}

window.requestAnimationFrame(animationLoop);

window.advanceTime = (ms = 16.67) => {
  const frameMs = 1000 / 60;
  const steps = Math.max(1, Math.round(ms / frameMs));
  const dt = (ms / steps) / 1000;
  for (let i = 0; i < steps; i += 1) {
    step(dt);
  }
  render();
};

window.render_game_to_text = () => {
  const payload = {
    scene: gameState.scene,
    progression: {
      platformerDone: gameState.platformerDone,
      symbolsDone: gameState.symbolsDone
    },
    coordinateSystem:
      "UI and canvas coordinates use origin at top-left, x increases right, y increases down."
  };

  if (gameState.scene === SCENES.PLATFORMER) {
    payload.platformer = platformer.getState();
  } else if (gameState.scene === SCENES.SYMBOLS) {
    payload.symbols = symbols.getState();
  }

  return JSON.stringify(payload);
};

setScene(SCENES.TITLE);
