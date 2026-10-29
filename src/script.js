const CYCLE_DURATION = 5000;
const TRANSITION_DURATION = 2000;

const BLUE_NOISE_URL = "blue-noise.png";

const PILL = 0;
const BACKGROUND = 1;

// Same order as the p5 sketch: background first, pills on top
const SHAPES = [
  { id: "projects", type: BACKGROUND, paddingX: 20, paddingY: 10, feather: 20 },
  { id: "email", type: PILL, paddingX: 20, paddingY: 10, feather: 50 },
  { id: "view", type: PILL, paddingX: 20, paddingY: 10, feather: 40 },
];

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

// Pass 1: images (multiply) and soft shapes, all in CSS px with y pointing down
const SCENE_FRAGMENT = `#version 300 es
precision highp float;

uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uAspectA;
uniform float uAspectB;
uniform float uWeightA;
uniform float uWeightB;
uniform vec2 uRes;
uniform float uDpr;
uniform vec4 uRect[3];
uniform float uFeather[3];
uniform float uColor[3];
uniform float uType[3];

out vec4 outColor;

// Standard normal CDF (Abramowitz & Stegun erf approximation)
float phi(float z) {
  float x = abs(z) * 0.70710678;
  float t = 1.0 / (1.0 + 0.3275911 * x);
  float erf = 1.0 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * exp(-x * x);
  return 0.5 * (1.0 + sign(z) * erf);
}

// Coverage at signed distance s outside a blurred edge (positive = outside)
float coverage(float s, float feather) {
  return 1.0 - phi(s / (feather / 3.0));
}

// Cover-fit: the same crop as imageCover
vec2 coverUV(vec2 uv, float imgAspect) {
  float canvasAspect = uRes.x / uRes.y;
  vec2 s = imgAspect > canvasAspect
    ? vec2(canvasAspect / imgAspect, 1.0)
    : vec2(1.0, imgAspect / canvasAspect);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 uv = p / uRes;

  // Multiply blend onto white, with each image's alpha as its weight
  vec3 a = texture(uTexA, coverUV(uv, uAspectA)).rgb;
  vec3 b = texture(uTexB, coverUV(uv, uAspectB)).rgb;
  vec3 col = mix(vec3(1.0), a, uWeightA) * mix(vec3(1.0), b, uWeightB);

  for (int i = 0; i < 3; i++) {
    vec4 r = uRect[i];
    if (r.z <= 0.0 || r.w <= 0.0) continue;

    float cov;
    if (uType[i] > 0.5) {
      // Background: hard top and sides, soft bottom edge
      float inside = step(r.x, p.x) * step(p.x, r.x + r.z) * step(r.y, p.y);
      cov = inside * coverage(p.y - (r.y + r.w), uFeather[i]);
    } else {
      // Pill: capsule SDF with radius h / 2, feather capped at the radius
      float rad = r.w * 0.5;
      float f = min(uFeather[i], rad);
      vec2 q = vec2(clamp(p.x, r.x + rad, r.x + r.z - rad), r.y + rad);
      float sd = length(p - q) - rad;
      cov = coverage(sd, f);
    }
    col = mix(col, vec3(uColor[i]), cov);
  }

  outColor = vec4(col, 1.0);
}`;

// Pass 2: monochrome dithering, from the dither-dither package (dist/dither-dither.js)
const POST_FRAGMENT = `#version 300 es
precision mediump float;

uniform sampler2D uScene;
uniform sampler2D uThreshold;
uniform vec2 uBuffer;
uniform vec2 uThresholdSize;
uniform vec4 uDarkColor;
uniform vec4 uLightColor;

out vec4 outColor;

vec4 dither(vec2 position, vec4 color) {
  float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  vec2 uv = mod(position, uThresholdSize) / uThresholdSize;
  vec4 limit = texture(uThreshold, uv);

  float dithered = brightness < limit.x ? 0.0 : 1.0;
  vec4 tone = mix(uDarkColor, uLightColor, dithered);

  float alpha = tone.a * color.a;
  return vec4(tone.rgb * alpha, alpha);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uBuffer;
  vec4 color = texture(uScene, uv);
  outColor = dither(gl_FragCoord.xy, color);
}`;

function createProgram(gl, vertex, fragment) {
  const program = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  return program;
}

function uniformLocations(gl, program, names) {
  return Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)]));
}

function createTarget(gl, width, height) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { texture, framebuffer };
}

async function loadTexture(gl, url) {
  const bitmap = await createImageBitmap(await (await fetch(url)).blob());
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return { texture, aspect: bitmap.width / bitmap.height };
}

// Blue-noise threshold map from dither-dither, sampled with NEAREST like the package
async function loadThreshold(gl, url) {
  const bitmap = await createImageBitmap(await (await fetch(url)).blob());
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return { texture, width: bitmap.width, height: bitmap.height };
}

// Opacity of the current and next image, matching the p5 timeline
function imageWeights(cycleTime) {
  if (cycleTime < TRANSITION_DURATION) {
    return [1, cycleTime / TRANSITION_DURATION];
  }
  if (cycleTime < TRANSITION_DURATION * 2) {
    return [1 - (cycleTime - TRANSITION_DURATION) / TRANSITION_DURATION, 1];
  }
  return [0, 1];
}

// Moves the project images to the pointer. Showing them is left to CSS :hover, and touch never moves them
function initHoverImage() {
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    document.documentElement.style.setProperty("--hover-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--hover-y", `${e.clientY}px`);
  });
}

export async function init(imageUrls) {
  initHoverImage();

  const canvas = document.querySelector("canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    console.warn("WebGL2 is not available");
    return;
  }

  const sceneProgram = createProgram(gl, VERTEX, SCENE_FRAGMENT);
  const postProgram = createProgram(gl, VERTEX, POST_FRAGMENT);
  const sceneU = uniformLocations(gl, sceneProgram, [
    "uTexA",
    "uTexB",
    "uAspectA",
    "uAspectB",
    "uWeightA",
    "uWeightB",
    "uRes",
    "uDpr",
    "uRect",
    "uFeather",
    "uColor",
    "uType",
  ]);
  const postU = uniformLocations(gl, postProgram, [
    "uScene",
    "uThreshold",
    "uBuffer",
    "uThresholdSize",
    "uDarkColor",
    "uLightColor",
  ]);

  // Fullscreen triangle generated from gl_VertexID, so no buffers are needed
  gl.bindVertexArray(gl.createVertexArray());

  // Images are fetched when the timeline reaches them, see frame()
  const textures = [];
  const requests = [];
  function requestTexture(index) {
    if (!requests[index]) {
      requests[index] = loadTexture(gl, imageUrls[index]).then((texture) => {
        textures[index] = texture;
      });
    }
  }
  requestTexture(0);

  const threshold = await loadThreshold(gl, BLUE_NOISE_URL);
  let playTime = 0;
  let lastTime = performance.now();

  let dpr = 1;
  let target;
  let mouseX = -1;
  let mouseY = -1;

  // Hover is decided here from the element actually under the pointer, so the shader and the CSS agree
  function updateHover() {
    const target = mouseX < 0 ? null : document.elementFromPoint(mouseX, mouseY);
    for (const shape of SHAPES) {
      const el = document.getElementById(shape.id);
      if (el) el.classList.toggle("is-hover", shape.type === PILL && !!target && el.contains(target));
    }
  }

  function resize() {
    dpr = 1;
    canvas.width = Math.ceil(innerWidth * dpr);
    canvas.height = Math.ceil(innerHeight * dpr);
    if (target) {
      gl.deleteTexture(target.texture);
      gl.deleteFramebuffer(target.framebuffer);
    }
    target = createTarget(gl, canvas.width, canvas.height);
  }

  // Padded rect, hover state and colour for each shape. Missing elements stay zeroed and are skipped.
  function shapeUniforms() {
    const rects = new Float32Array(12);
    const feathers = new Float32Array(3);
    const colors = new Float32Array(3);
    const types = new Float32Array(3);
    // Rects include the top overscroll on some browsers while the fixed canvas does not, so undo it (scrollY is negative there)
    const overscroll = Math.min(0, scrollY);

    SHAPES.forEach((shape, i) => {
      const el = document.getElementById(shape.id);
      if (!el) return;

      const r = el.getBoundingClientRect();
      // if (shape.type === BACKGROUND) {
      //   r.left = 0;
      //   r.width = innerWidth;
      // }
      const hovered = el.classList.contains("is-hover");

      const left = (shape.type === BACKGROUND ? 0 : r.left) - shape.paddingX;
      const top = shape.type === BACKGROUND ? r.top - 500 : r.top - shape.paddingY + overscroll;
      const width = (shape.type === BACKGROUND ? innerWidth : r.width) + shape.paddingX * 2;
      const height = shape.type === BACKGROUND ? r.height + 500 - shape.paddingY : r.height + shape.paddingY * 2;

      rects.set([left, top, width, height], i * 4);
      feathers[i] = shape.feather;
      colors[i] = shape.type === PILL && !hovered ? 1 : 0;
      types[i] = shape.type;
    });

    return { rects, feathers, colors, types };
  }

  function frame() {
    const now = performance.now();
    playTime += now - lastTime;
    lastTime = now;

    const cycle = Math.floor(playTime / CYCLE_DURATION);
    const current = cycle % imageUrls.length;
    const next = (cycle + 1) % imageUrls.length;
    requestTexture(current);
    requestTexture(next);
    if (!textures[current] || !textures[next]) {
      // Hold the timeline at the start of this cycle until its images have arrived
      playTime = cycle * CYCLE_DURATION;
      requestAnimationFrame(frame);
      return;
    }

    const cycleTime = playTime - cycle * CYCLE_DURATION;
    const [weightA, weightB] = imageWeights(cycleTime);
    const shapes = shapeUniforms();

    // Pass 1: scene into the offscreen target
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(sceneProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[current].texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[next].texture);
    gl.uniform1i(sceneU.uTexA, 0);
    gl.uniform1i(sceneU.uTexB, 1);
    gl.uniform1f(sceneU.uAspectA, textures[current].aspect);
    gl.uniform1f(sceneU.uAspectB, textures[next].aspect);
    gl.uniform1f(sceneU.uWeightA, weightA);
    gl.uniform1f(sceneU.uWeightB, weightB);
    gl.uniform2f(sceneU.uRes, innerWidth, innerHeight);
    gl.uniform1f(sceneU.uDpr, dpr);
    gl.uniform4fv(sceneU.uRect, shapes.rects);
    gl.uniform1fv(sceneU.uFeather, shapes.feathers);
    gl.uniform1fv(sceneU.uColor, shapes.colors);
    gl.uniform1fv(sceneU.uType, shapes.types);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Pass 2: post-processing to the screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(postProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, target.texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, threshold.texture);
    gl.uniform1i(postU.uScene, 0);
    gl.uniform1i(postU.uThreshold, 1);
    gl.uniform2f(postU.uBuffer, canvas.width, canvas.height);
    gl.uniform2f(postU.uThresholdSize, threshold.width, threshold.height);
    gl.uniform4fv(postU.uDarkColor, [0x05 / 255, 0x56 / 255, 0xb1 / 255, 1]); // #0556b1
    gl.uniform4fv(postU.uLightColor, [0xff / 255, 0xc8 / 255, 0xf0 / 255, 1]); // #ffc8f0
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", () => {
    resize();
    updateHover();
  });
  window.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateHover();
  });
  // Scrolling moves elements under a still pointer, and leaving the window sends no pointermove
  window.addEventListener("scroll", updateHover, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => {
    mouseX = -1;
    updateHover();
  });

  resize();
  requestAnimationFrame(frame);
}
