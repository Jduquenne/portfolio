/** GLSL of the scene. Every colour is the accent or the contrast colour of the site. */

export const BODY_VERTEX = /* glsl */ `
  attribute float aSize; attribute vec4 aStages; attribute float aBoost; attribute float aPhase;
  attribute float aKind; attribute float aLevel;
  uniform vec4 uActive; uniform float uDpr; uniform float uTime; uniform float uIntro;
  varying float vLit; varying float vBoost; varying float vKind; varying float vTw; varying float vIn; varying float vLevel;
  void main() {
    vLevel = aLevel;
    vLit = clamp(dot(aStages, uActive), 0., 1.); vBoost = aBoost; vKind = aKind;
    vTw = .85 + .15 * sin(uTime * (1.2 + aPhase * 1.6) + aPhase * 6.283);
    vIn = smoothstep(aPhase * .6, aPhase * .6 + .4, uIntro);
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    gl_PointSize = aSize * (1. + aBoost * .6) * uDpr * (12. / -mv.z) * mix(.65, 1., vLit) * (.92 + .08 * vTw);
    gl_Position = projectionMatrix * mv;
  }`;

/** Sun: octagon frame. Planet: hexagon frame. Tool: a diamond that fills with its level. */
export const BODY_FRAGMENT = /* glsl */ `
  varying float vLit; varying float vBoost; varying float vKind; varying float vTw; varying float vIn; varying float vLevel;
  void main() {
    vec2 p = gl_PointCoord - .5; float d = length(p);
    float sun = step(vKind, .5);
    float pl = step(.5, vKind) * step(vKind, 1.5);
    float tool = step(1.5, vKind);
    float core = smoothstep(mix(.2, .12, sun), .0, d) * (1. - tool * .7);
    float halo = smoothstep(.5, .0, d) * mix(.3, .45, sun) * (1. - tool * .75);
    float spike = (exp(-abs(p.y) * 70.) * smoothstep(.5, .0, abs(p.x)) + exp(-abs(p.x) * 70.) * smoothstep(.5, .0, abs(p.y))) * .55 * sun;
    float oct = max(max(abs(p.x), abs(p.y)), (abs(p.x) + abs(p.y)) * .7071);
    float hex = max(abs(p.x) * .866 + abs(p.y) * .5, abs(p.y));
    float dia = abs(p.x) + abs(p.y);
    float frame = sun * (1. - smoothstep(0., .016, abs(oct - .36))) * .9 + sun * (1. - smoothstep(0., .012, abs(oct - .27))) * .5
                + pl * (1. - smoothstep(0., .022, abs(hex - .34))) * .9;
    float shape = 0.;
    if (tool > .5) {
      float edge = 1. - smoothstep(0., .03, abs(dia - .36));
      float g = (.33 - p.y) / .66;
      float fill = step(dia, .33) * (vLevel >= 0. ? mix(.1, .8, step(g, vLevel + .001)) : .5);
      shape = edge * .95 + fill;
    }
    float a = (core + halo + spike + frame + shape) * mix(.16, 1., vLit) * (1. + vBoost * .6) * vTw * vIn;
    vec3 col = mix(vec3(.97, .98, .99), vec3(.22, .74, .97), clamp(halo * 1.6 + spike * .6, 0., 1.) * mix(.4, 1., vLit));
    if (a < .01) discard;
    gl_FragColor = vec4(col, a);
  }`;

export const LINE_VERTEX = /* glsl */ `
  attribute vec4 aStages; attribute float aO; attribute float aW; uniform vec4 uActive;
  varying float vA; varying float vO;
  void main() {
    vO = aO; vA = aW * mix(.1, 1., clamp(dot(aStages, uActive), 0., 1.));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }`;

/** A line is drawn in from its start, with a bright head, like a print head. */
export const LINE_FRAGMENT = /* glsl */ `
  uniform float uDraw; varying float vA; varying float vO;
  void main() {
    float behind = uDraw - vO;
    float vis = smoothstep(0., .02, behind);
    float head = exp(-max(behind, 0.) * 22.) * step(uDraw, 1.05) * step(0., behind);
    gl_FragColor = vec4(mix(vec3(.22, .74, .97), vec3(1.), head), vA * (.5 + head * .6) * vis);
  }`;

export const TRAIL_VERTEX = /* glsl */ `
  attribute float aT; uniform float uDpr; varying float vT;
  void main() {
    vT = aT; vec4 mv = modelViewMatrix * vec4(position, 1.);
    gl_PointSize = (1. - aT) * 22. * uDpr * (12. / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;

export const TRAIL_FRAGMENT = /* glsl */ `
  varying float vT;
  void main() {
    float d = length(gl_PointCoord - .5);
    gl_FragColor = vec4(1., 1., 1., smoothstep(.5, .0, d) * (1. - vT));
  }`;

export const nebulaVertex = (size: number) => /* glsl */ `
  attribute vec4 aStages; uniform vec4 uActive; uniform float uDpr; varying float vLit;
  void main() {
    vLit = clamp(dot(aStages, uActive), 0., 1.);
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    gl_PointSize = ${size.toFixed(1)} * uDpr * (12. / -mv.z) * mix(.8, 1.1, vLit);
    gl_Position = projectionMatrix * mv;
  }`;

export const NEBULA_FRAGMENT = /* glsl */ `
  varying float vLit; uniform float uIntro;
  void main() {
    float d = length(gl_PointCoord - .5) * 2.;
    float a = pow(max(1. - d, 0.), 2.4) * mix(.03, .14, vLit) * uIntro;
    gl_FragColor = vec4(.22, .74, .97, a);
  }`;
