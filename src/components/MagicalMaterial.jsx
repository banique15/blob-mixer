import { useRef, useState } from 'react'
import { MeshPhysicalMaterial, ShaderChunk } from 'three'
import { useFrame } from '@react-three/fiber'

// Import shaders as raw strings
const headersGLSL = `
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float pnoise(vec3 P, vec3 rep) {
  vec3 Pi0 = mod(floor(P), rep);
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

uniform float time;
uniform float radius;
uniform float distort;
uniform float frequency;
uniform float surfaceDistort;
uniform float surfaceFrequency;
uniform float surfaceTime;
uniform float numberOfWaves;
uniform float fixNormals;
uniform float surfacePoleAmount;
uniform float gooPoleAmount;

#define M_PI 3.1415926538
#define NOISE_PERIOD 10.

float f(vec3 point) {
    float yPos = smoothstep(-1., 1., point.y);
    float amount = sin(yPos * M_PI);
    float wavePoleAmount = mix(amount * 1.0, 1.0, surfacePoleAmount);
    float gooPoleAmountMix = mix(amount * 1.0, 1.0, gooPoleAmount);

    float goo = pnoise(vec3(point / (frequency) + mod(time, NOISE_PERIOD)), vec3(NOISE_PERIOD)) * pow(distort, 2.0);
    float surfaceNoise = pnoise(vec3(point / (surfaceFrequency) + mod(surfaceTime, NOISE_PERIOD)), vec3(NOISE_PERIOD));
    float waves = (point.x * sin((point.y+surfaceNoise)*M_PI*numberOfWaves) + point.z * cos((point.y+surfaceNoise)*M_PI*numberOfWaves)) * 0.01 * pow(surfaceDistort, 2.0);

    return waves * wavePoleAmount + goo * gooPoleAmountMix;
}

vec3 orthogonal(vec3 v) {
    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}
`

const displacementGLSL = `
vec3 displacedPosition = position + normalize(normal) * f(position);
vec3 displacedNormal = normalize(normal);

if (fixNormals == 1.0) {
    float offset = .5 / 512.;
    vec3 tangent = orthogonal(normal);
    vec3 bitangent = normalize(cross(normal, tangent));
    vec3 neighbour1 = position + tangent * offset;
    vec3 neighbour2 = position + bitangent * offset;
    vec3 displacedNeighbour1 = neighbour1 + normal * f(neighbour1);
    vec3 displacedNeighbour2 = neighbour2 + normal * f(neighbour2);

    vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
    vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;

    displacedNormal = normalize(cross(displacedTangent, displacedBitangent));
}
`

class MagicalMaterialImpl extends MeshPhysicalMaterial {
  constructor(parameters = {}) {
    super(parameters)
    this.setValues(parameters)
    this._time = { value: 0 }
    this._distort = { value: 0 }
    this._radius = { value: 1 }
    this._frequency = { value: 2 }
    this._speed = { value: 0 }
    this._surfaceDistort = { value: 0 }
    this._surfaceFrequency = { value: 0 }
    this._surfaceTime = { value: 0 }
    this._surfaceSpeed = { value: 0 }
    this._numberOfWaves = { value: 5 }
    this._fixNormals = { value: true }
    this._surfacePoleAmount = { value: 1 }
    this._gooPoleAmount = { value: 1 }
  }

  onBeforeCompile(shader) {
    shader.uniforms.time = this._time
    shader.uniforms.radius = this._radius
    shader.uniforms.distort = this._distort
    shader.uniforms.frequency = this._frequency
    shader.uniforms.surfaceDistort = this._surfaceDistort
    shader.uniforms.surfaceFrequency = this._surfaceFrequency
    shader.uniforms.surfaceTime = this._surfaceTime
    shader.uniforms.numberOfWaves = this._numberOfWaves
    shader.uniforms.fixNormals = this._fixNormals
    shader.uniforms.surfacePoleAmount = this._surfacePoleAmount
    shader.uniforms.gooPoleAmount = this._gooPoleAmount

    shader.vertexShader = `
      ${headersGLSL}
      ${shader.vertexShader}
    `

    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      `void main() {
        ${displacementGLSL}
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <displacementmap_vertex>',
      `transformed = displacedPosition;`
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <defaultnormal_vertex>',
      ShaderChunk.defaultnormal_vertex.replace(
        'vec3 transformedNormal = objectNormal;',
        `vec3 transformedNormal = displacedNormal;`
      )
    )
  }

  get time() { return this._time.value }
  set time(v) { this._time.value = v }
  
  get distort() { return this._distort.value }
  set distort(v) { this._distort.value = v }
  
  get radius() { return this._radius.value }
  set radius(v) { this._radius.value = v }
  
  get frequency() { return this._frequency.value }
  set frequency(v) { this._frequency.value = v }
  
  get speed() { return this._speed.value }
  set speed(v) { this._speed.value = v }

  get surfaceDistort() { return this._surfaceDistort.value }
  set surfaceDistort(v) { this._surfaceDistort.value = v }

  get surfaceFrequency() { return this._surfaceFrequency.value }
  set surfaceFrequency(v) { this._surfaceFrequency.value = v }

  get surfaceTime() { return this._surfaceTime.value }
  set surfaceTime(v) { this._surfaceTime.value = v }

  get surfaceSpeed() { return this._surfaceSpeed.value }
  set surfaceSpeed(v) { this._surfaceSpeed.value = v }

  get numberOfWaves() { return this._numberOfWaves.value }
  set numberOfWaves(v) { this._numberOfWaves.value = v }

  get fixNormals() { return this._fixNormals.value }
  set fixNormals(v) { this._fixNormals.value = v }

  get surfacePoleAmount() { return this._surfacePoleAmount.value }
  set surfacePoleAmount(v) { this._surfacePoleAmount.value = v }

  get gooPoleAmount() { return this._gooPoleAmount.value }
  set gooPoleAmount(v) { this._gooPoleAmount.value = v }
}

const fpsInterval = 1000 / 60

export function MagicalMaterial(props) {
  const [material] = useState(() => new MagicalMaterialImpl())
  const localRef = useRef({ lastFrame: 0 })
  
  useFrame(({ clock }) => {
    const now = clock.getElapsedTime() * 1000
    const delta = now - localRef.current.lastFrame
    localRef.current.lastFrame = now - (delta % fpsInterval)
    
    material.time += 0.001 * 0.5 * delta * material.speed
    material.surfaceTime += 0.001 * 0.5 * delta * material.surfaceSpeed
  })
  
  return <primitive dispose={undefined} object={material} attach="material" {...props} />
}

export default MagicalMaterial