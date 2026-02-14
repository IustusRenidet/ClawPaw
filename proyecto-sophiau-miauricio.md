# 🎮 PROYECTO: "A Través de las Dimensiones"
## Juego Web Interactivo para San Valentín — S & M (Sophiau & Miauricio)

---

## 📋 RESUMEN EJECUTIVO

**Tipo:** Experiencia web interactiva con cutscenes + 2 minijuegos  
**Plataforma:** Navegador web (HTML5/CSS3/JavaScript vanilla)  
**Duración total:** ~5-8 minutos de experiencia  
**Audiencia:** Regalo personal romántico  
**Entrega:** Archivo HTML único autocontenido (hosteable en cualquier servidor estático)

---

## 🎬 ESTRUCTURA NARRATIVA COMPLETA

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUJO DEL JUEGO                         │
│              ⚠️ AMBOS MINIJUEGOS SON OBLIGATORIOS ⚠️             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [VIDEO: parte_inicio.mp4]                                     │
│   Los gatos se separan hacia diferentes portales                │
│            │                                                    │
│            ▼                                                    │
│   ┌─────────────────┐                                          │
│   │  TRANSICIÓN     │  "Sophiau entra al portal cósmico..."    │
│   └────────┬────────┘                                          │
│            │                                                    │
│            ▼                                                    │
│   ┌─────────────────┐                                          │
│   │  MINIJUEGO #1   │  ← OBLIGATORIO                           │
│   │    SOPHIAU      │                                          │
│   │  Platformer 2D  │  Atravesar el cosmos saltando            │
│   │    cósmico      │  plataformas hasta el portal             │
│   └────────┬────────┘                                          │
│            │                                                    │
│            ▼ (al completar)                                     │
│   ┌─────────────────┐                                          │
│   │  TRANSICIÓN     │  "¡Sophiau llegó! Ahora Miauricio..."    │
│   └────────┬────────┘                                          │
│            │                                                    │
│            ▼                                                    │
│   ┌─────────────────┐                                          │
│   │  MINIJUEGO #2   │  ← OBLIGATORIO                           │
│   │   MIAURICIO     │                                          │
│   │   Garabatos     │  Dibujar 4 símbolos mágicos para         │
│   │   mágicos 1D    │  abrir el portal de reunión              │
│   └────────┬────────┘                                          │
│            │                                                    │
│            ▼ (al completar)                                     │
│   ┌─────────────────┐                                          │
│   │  TRANSICIÓN     │  "¡Los portales resuenan!"               │
│   └────────┬────────┘                                          │
│            │                                                    │
│            ▼                                                    │
│   [VIDEO: parte_fin.mp4]                                        │
│   Los gatos emergen de sus portales y se reencuentran          │
│            │                                                    │
│            ▼                                                    │
│   ┌─────────────────┐                                          │
│   │  PANTALLA FINAL │  Mensaje de amor personalizado           │
│   │    "S & M"      │  "Juntos, a través de cualquier          │
│   │       ∞         │   dimensión"                             │
│   │                 │  + Opción de rejugar                     │
│   └─────────────────┘                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### ⚠️ REGLA CRÍTICA: PROGRESIÓN LINEAL OBLIGATORIA

**El jugador DEBE completar ambos minijuegos en orden:**

1. **Primero:** Minijuego de Sophiau (Platformer 2D)
2. **Después:** Minijuego de Miauricio (Garabatos mágicos)
3. **Solo entonces:** Se desbloquea el video final y la pantalla de amor

**NO hay selección de personaje.** El flujo es lineal y narrativo:
- Intro → Sophiau juega → Transición → Miauricio juega → Reunión → Final

Esto refuerza la narrativa de que **ambos** deben esforzarse para encontrarse.

---

## 🐱 PERSONAJES

### **SOPHIAU (S)**
- **Apariencia:** Gata completamente negra con tonos gris oscuro sutiles
- **Ojos:** Dorados/ámbar con reflejos cálidos
- **Expresión:** Ligeramente somnolienta pero segura, mirada gentil
- **Características:** Pelaje hiperrealista estilo Pixar, cabeza redondeada grande, cuerpo pequeño compacto
- **Color asociado:** Cyan/Morado (#00d4ff, #9b59b6)
- **Portal:** Forma de corazón con borde cyan-morado brillante

### **MIAURICIO (M)**
- **Apariencia:** Gato tuxedo (blanco y negro parcheado)
- **Ojos:** Ámbar/dorados grandes y expresivos
- **Expresión:** Ligeramente somnolienta pero confiada, sonrisa suave
- **Características:** Pelaje hiperrealista estilo Pixar, cabeza redondeada grande, cuerpo pequeño compacto
- **Color asociado:** Dorado/Rosa (#f39c12, #ff6b9d)
- **Portal:** Forma de corazón con borde dorado-rosa brillante

### **ELEMENTO COMPARTIDO**
- Cuando completan sus misiones y se reencuentran, sus corazones se unen formando un corazón gigante brillante
- Paleta romántica: Rosa pastel (#ffb6c1), magenta suave, dorado cálido

---

## 🎮 MINIJUEGO #1: SOPHIAU'S COSMIC PLATFORMER

**Estilo:** Side-scroller 2D tipo Mario cósmico  
**Jugador:** Sophiau (gata negra)  
**Duración:** 1-2 minutos  
**Dificultad:** Fácil-Media (es un regalo, debe ser completable)

### Mecánicas
- **Movimiento:** Flechas izquierda/derecha o A/D
- **Salto:** Espacio o flecha arriba
- **Objetivo:** Llegar al portal de corazón al final del nivel

### Diseño Visual
- **Fondo:** Espacio cósmico con nebulosas moradas/cyan, estrellas titilantes
- **Plataformas:** Asteroides flotantes con glow cyan, plataformas cristalinas
- **Obstáculos:** Simples (hoyos, plataformas móviles) — NO enemigos agresivos
- **Coleccionables:** Pequeños corazones que dejan trail de partículas
- **Meta:** Portal en forma de corazón brillante dorado (representa a Miauricio esperando)

### Assets Necesarios
```
sprites/
  sophiau_idle.png       (sprite estático o spritesheet simple)
  sophiau_run.png        (animación de correr, 4-6 frames)
  sophiau_jump.png       (sprite de salto)
  platform_asteroid.png  (plataforma principal)
  heart_collectible.png  (corazón pequeño)
  portal_heart.png       (meta final)
  background_cosmic.png  (fondo parallax)
```

### UI del Minijuego
- Contador de corazones recolectados (esquina superior)
- Sin timer (no queremos presión)
- Mensaje motivacional al morir: "¡Inténtalo de nuevo! M te espera 💕"

---

## 🎮 MINIJUEGO #2: MIAURICIO'S MAGIC SYMBOLS

**Estilo:** Dibujo de símbolos tipo Google Doodle Halloween (Magic Cat Academy)  
**Jugador:** Miauricio (gato tuxedo)  
**Duración:** 1-2 minutos  
**Dificultad:** Fácil (reconocimiento de gestos generoso)

### Mecánicas
- **Input:** Mouse/touch para dibujar símbolos
- **Objetivo:** Dibujar correctamente 4 símbolos mágicos para abrir el portal hacia Sophiau
- **Símbolos requeridos:**
  1. ❤️ **Corazón** — Símbolo del amor
  2. ⭐ **Estrella** — Símbolo de la esperanza
  3. ∞ **Infinito** — Símbolo de lo eterno
  4. **S & M** — Sus iniciales entrelazadas (símbolo final)

### Diseño Visual
- **Fondo:** Espacio abstracto oscuro con líneas de energía swirling (rosa/dorado)
- **Personaje:** Miauricio en el centro/lateral, reacciona a los trazos
- **Canvas de dibujo:** Área central donde aparece el símbolo guía en líneas tenues
- **Feedback:** 
  - Trazo correcto: Línea brilla dorada, partículas de corazones
  - Trazo incorrecto: Línea se desvanece suavemente, "Intenta de nuevo"
  - Símbolo completado: Explosión de partículas, símbolo flota hacia el portal

### Sistema de Reconocimiento
- Usar algoritmo simple de comparación de trazos (no necesita ML)
- Tolerancia generosa (es un regalo, debe ser completable)
- Mostrar símbolo guía semitransparente que el jugador debe trazar encima

### UI del Minijuego
- Símbolo actual a dibujar (indicador visual)
- Progreso: 4 slots de símbolos (se llenan al completar)
- Miauricio con expresiones reactivas (feliz al acertar, motivador al fallar)

---

## 🎬 CUTSCENES (VIDEOS PRE-RENDERIZADOS)

### Video Intro: `parte_inicio.mp4`
**Contenido confirmado (analizado del video):**
1. Sophiau y Miauricio sentados en escritorio, trabajando en laptops
2. Pantallas muestran código/trabajo (manzana y banana como easter egg)
3. Se miran, aparece corazón flotante rosa entre ellos
4. El corazón crece y brilla intensamente
5. Magia rosa los envuelve, corazones flotan por el piso
6. Se separan hacia diferentes dimensiones/portales

**Duración estimada:** ~8-10 segundos

### Video Outro: `parte_fin.mp4`  
**Contenido confirmado (analizado del video):**
1. Dos portales de corazón (morado y dorado) flotan en el espacio
2. Los gatos emergen volando hacia el centro
3. Colisionan/se encuentran en el medio
4. Los portales se fusionan en un corazón gigante brillante
5. Quedan juntos dentro del corazón unificado

**Duración estimada:** ~5-6 segundos

---

## 🎨 ESPECIFICACIONES TÉCNICAS

### Stack Tecnológico
```javascript
// Core
- HTML5 (estructura)
- CSS3 (estilos, animaciones, transiciones)
- JavaScript ES6+ (lógica de juego)

// Para Minijuego Platformer
- Canvas API o sprites con CSS transforms
- requestAnimationFrame para game loop

// Para Minijuego Garabatos
- Canvas API para dibujo
- Algoritmo de reconocimiento de gestos simple

// Videos
- HTML5 <video> tag
- Videos embebidos como base64 O referenciados externamente

// Audio (opcional pero recomendado)
- Web Audio API
- Música ambient romántica de fondo
- SFX: saltos, colección de items, símbolos correctos
```

### Estructura de Archivos (Opción Modular)
```
proyecto/
├── index.html              # Entry point
├── css/
│   └── styles.css          # Estilos globales
├── js/
│   ├── main.js             # Controlador principal, flujo del juego
│   ├── platformer.js       # Lógica minijuego 1
│   ├── symbols.js          # Lógica minijuego 2
│   └── utils.js            # Funciones compartidas
├── assets/
│   ├── videos/
│   │   ├── parte_inicio.mp4
│   │   └── parte_fin.mp4
│   ├── sprites/
│   │   ├── sophiau/
│   │   └── miauricio/
│   ├── backgrounds/
│   └── audio/
└── README.md
```

### Estructura de Archivos (Opción HTML Único)
```
dimensions-game.html        # Todo embebido en un solo archivo
                            # - CSS inline en <style>
                            # - JS inline en <script>
                            # - Assets como base64 data URIs
                            # - Videos como base64 o URLs externas
```

---

## 🖼️ PALETA DE COLORES

```css
:root {
  /* Fondo Cósmico */
  --void-black: #050510;
  --cosmic-dark: #0a0a1a;
  --nebula-purple: #4a1c6b;
  --deep-space: #1a1a2e;
  
  /* Sophiau (Cyan/Morado) */
  --sophiau-primary: #00d4ff;
  --sophiau-secondary: #9b59b6;
  --sophiau-glow: rgba(0, 212, 255, 0.6);
  
  /* Miauricio (Dorado/Rosa) */
  --miauricio-primary: #f39c12;
  --miauricio-secondary: #ff6b9d;
  --miauricio-glow: rgba(255, 107, 157, 0.6);
  
  /* Amor/Corazones */
  --heart-pink: #ff69b4;
  --heart-soft: #ffb6c1;
  --heart-glow: rgba(255, 105, 180, 0.8);
  
  /* UI */
  --text-primary: #e8e8ff;
  --text-secondary: rgba(232, 232, 255, 0.7);
}
```

---

## 📱 RESPONSIVE DESIGN

El juego debe funcionar en:
- **Desktop:** Controles de teclado + mouse
- **Tablet:** Touch controls
- **Mobile:** Touch controls (botones en pantalla para platformer)

### Breakpoints
```css
/* Mobile */
@media (max-width: 480px) { }

/* Tablet */
@media (min-width: 481px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Estructura Base
- [ ] HTML base con todas las pantallas/estados
- [ ] CSS global con paleta de colores y tipografía
- [ ] Sistema de estados del juego (intro → select → game1/game2 → outro → end)
- [ ] Integración de videos con eventos de finalización

### Fase 2: Minijuego Platformer (Sophiau)
- [ ] Canvas/área de juego
- [ ] Sprite de Sophiau con animaciones básicas
- [ ] Sistema de plataformas y colisiones
- [ ] Física de salto (gravedad, velocidad)
- [ ] Coleccionables (corazones)
- [ ] Portal de meta con detección de victoria
- [ ] Parallax background cósmico

### Fase 3: Minijuego Garabatos (Miauricio)
- [ ] Canvas de dibujo
- [ ] Sistema de trazos del usuario
- [ ] Templates de símbolos (corazón, estrella, infinito, S&M)
- [ ] Algoritmo de comparación/reconocimiento
- [ ] Feedback visual (correcto/incorrecto)
- [ ] Progresión de símbolos
- [ ] Animaciones de Miauricio reactivas

### Fase 4: Integración y Pulido
- [ ] Transiciones suaves entre pantallas
- [ ] Pantalla de selección de personaje
- [ ] Tracking de progreso (ambos minijuegos completados)
- [ ] Pantalla final con mensaje personalizado
- [ ] Audio/música (opcional)
- [ ] Testing en diferentes dispositivos
- [ ] Optimización de assets

### Fase 5: Entrega
- [ ] Compilar en HTML único (si se requiere)
- [ ] Verificar que videos cargan correctamente
- [ ] Test final completo del flujo
- [ ] Preparar para hosting

---

## 💕 MENSAJES Y TEXTOS

### Pantalla de Título
```
"A Través de las Dimensiones"
Una aventura de S & M
[Comenzar]
```

### Transición Post-Intro (antes de Minijuego 1)
```
"Sophiau cae hacia el vacío cósmico...
 Debe atravesar las plataformas dimensionales
 para llegar al portal de reunión"

[¡Adelante!]
```

### Transición Entre Minijuegos (después de completar Sophiau)
```
"¡Sophiau llegó al portal! ✨
 
 Pero necesita que Miauricio 
 abra el camino desde el otro lado...
 
 Dibuja los símbolos del amor"

[Continuar]
```

### Durante Minijuego Sophiau
```
// Al recoger corazón
"¡+1 amor!"

// Al morir/caer
"M te espera... ¡no te rindas! 💕"

// Al llegar al portal
"¡Lo lograste! El portal se abre..."
```

### Durante Minijuego Miauricio
```
// Símbolo correcto
"¡Perfecto! La magia fluye..."

// Símbolo incorrecto
"Casi... ¡intenta de nuevo!"

// Todos los símbolos completos
"¡Los símbolos resuenan! S te espera..."
```

### Pantalla Final (después del video outro)
```
"Juntos, a través de cualquier dimensión"

S & M
∞

"Te amo"

[Volver a jugar]
```

---

## 🎵 AUDIO (OPCIONAL)

### Música
- **Intro/Menús:** Ambient espacial suave, piano melancólico
- **Platformer:** Synthwave cósmico upbeat pero no estresante
- **Garabatos:** Música mística/mágica con bells y pads
- **Outro/Final:** Crescendo emocional, romántico

### SFX
- Salto: "boing" suave
- Aterrizar: "puff" gentil  
- Recoger corazón: "sparkle" brillante
- Trazo correcto: "ding" mágico
- Símbolo completo: "whoosh" + "sparkles"
- Portal: "hum" resonante

---

## 📎 ASSETS ADJUNTOS

1. `gato_negro.png` — Referencia visual de Sophiau
2. `gato_vaca.png` — Referencia visual de Miauricio
3. `parte_inicio.mp4` — Video cutscene introductoria
4. `parte_fin.mp4` — Video cutscene final/reunión

---

## 🚀 NOTAS FINALES PARA EL AGENTE

1. **FLUJO OBLIGATORIO:** El jugador DEBE completar AMBOS minijuegos en ORDEN (Sophiau primero → Miauricio después). NO hay selección de personaje, NO hay forma de saltarse ninguno. La narrativa requiere que ambos se esfuercen para reunirse.

2. **Prioridad:** La experiencia debe ser COMPLETABLE y DISFRUTABLE. Es un regalo romántico, no un desafío hardcore. Errores generosos, respawn inmediato si es necesario, sin game overs definitivos.

3. **Estética:** Mantener consistencia con los videos de Sora (estilo Pixar, iluminación cinematográfica, colores cósmicos). Los minijuegos pueden ser más estilizados/flat pero deben sentirse parte del mismo universo.

4. **Personalización:** Los nombres "Sophiau" y "Miauricio" y las iniciales "S & M" son específicos y deben aparecer en el juego.

5. **Transiciones narrativas:** Entre cada sección debe haber una breve pantalla de transición que conecte la historia. El jugador debe sentir que está viviendo una aventura épica romántica.

6. **Fallback:** Si los videos no cargan, tener una pantalla de transición animada alternativa con texto narrativo.

7. **Easter eggs sugeridos:** 
   - La manzana y banana de las laptops del video podrían ser coleccionables secretos
   - Referencia al "trabajar juntos en la compu" del video intro

---

*Documento creado para facilitar el desarrollo del proyecto. ¡Que el amor atraviese todas las dimensiones! 💕*
