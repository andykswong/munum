type parr = number;
type pvec2 = number;
type pvec3 = number;
type pvec4 = number;
type pquat = number;
type pmat2 = number;
type pmat3 = number;
type pmat4 = number;

export const memory: WebAssembly.Memory;

export function create(size: number): parr;
export function free(ptr: parr, size: number): void;

export function vec2add(out: pvec2, a: pvec2, b: pvec2): pvec2;
export function vec2sub(out: pvec2, a: pvec2, b: pvec2): pvec2;
export function vec2mul(out: pvec2, m2: pmat2, a: pvec2): pvec2;
export function vec2scale(out: pvec2, a: pvec2, s: number): pvec2;
export function vec2norm(out: pvec2, a: pvec2): boolean;
export function vec2dot(a: pvec2, b: pvec2): number;
export function vec2lerp(out: pvec2, a: pvec2, b: pvec2, t: number): pvec2;
export function mat3vec2mul(out: pvec2, m3: pmat3, a: pvec2): pvec2;

export function vec3add(out: pvec3, a: pvec3, b: pvec3): pvec3;
export function vec3sub(out: pvec3, a: pvec3, b: pvec3): pvec3;
export function vec3mul(out: pvec3, m3: pmat3, a: pvec3): pvec3;
export function vec3scale(out: pvec3, a: pvec3, s: number): pvec3;
export function vec3norm(out: pvec3, a: pvec3): boolean;
export function vec3dot(a: pvec3, b: pvec3): number;
export function vec3lerp(out: pvec3, a: pvec3, b: pvec3, t: number): pvec3;
export function vec3cross(out: pvec3, a: pvec3, b: pvec3): pvec3;
export function mat4vec3mul(out: pvec3, m4: pmat4, a: pvec3): pvec3;

export function vec4add(out: pvec4, a: pvec4, b: pvec4): pvec4;
export function vec4sub(out: pvec4, a: pvec4, b: pvec4): pvec4;
export function vec4mul(out: pvec4, m4: pmat4, a: pvec4): pvec4;
export function vec4scale(out: pvec4, a: pvec4, s: number): pvec4;
export function vec4norm(out: pvec4, a: pvec4): boolean;
export function vec4dot(a: pvec4, b: pvec4): number;
export function vec4lerp(out: pvec4, a: pvec4, b: pvec4, t: number): pvec4;

export function quatfromunitvecs(fromVec: pvec3, toVec: pvec3): pquat;
export function quatfromaxisangle(axis: pvec3, angle: number): pquat;
export function quatfromanglex(angle: number): pquat;
export function quatfromangley(angle: number): pquat;
export function quatfromanglez(angle: number): pquat;
export function quatidentity(): pquat;
export function quatmul(out: pquat, a: pquat, b: pquat): pquat;
export function quatvec3rotate(out: pvec3, q: pquat, v: pvec3): pvec3;
export function quatnorm(out: pquat, a: pquat): boolean;
export function quatdot(a: pquat, b: pquat): number;
export function quatinvert(out: pquat, a: pquat): boolean;
export function quatlerp(out: pquat, a: pquat, b: pquat, t: number): pquat;
export function quatslerp(out: pquat, a: pquat, b: pquat, t: number): pquat;

export function mat2frommat3(src: pmat3): pmat2;
export function mat2identity(): pmat2;
export function mat2add(out: pmat2, a: pmat2, b: pmat2): pmat2;
export function mat2sub(out: pmat2, a: pmat2, b: pmat2): pmat2;
export function mat2mul(out: pmat2, m2: pmat2, a: pmat2): pmat2;
export function mat2scale(out: pmat2, a: pmat2, s: number): pmat2;
export function mat2transpose(out: pmat2, a: pmat2): pmat2;
export function mat2invert(out: pmat2, a: pmat2): boolean;
export function mat2det(a: pmat2): number;

export function normalmat3(out: pmat3, a: pmat3): boolean;
export function mat3frommat2(src: pmat2): pmat3;
export function mat3frommat4(src: pmat4): pmat3;
export function mat3identity(): pmat3;
export function mat3add(out: pmat3, a: pmat3, b: pmat3): pmat3;
export function mat3sub(out: pmat3, a: pmat3, b: pmat3): pmat3;
export function mat3mul(out: pmat3, m2: pmat3, a: pmat3): pmat3;
export function mat3scale(out: pmat3, a: pmat3, s: number): pmat3;
export function mat3transpose(out: pmat3, a: pmat3): pmat3;
export function mat3invert(out: pmat3, a: pmat3): boolean;
export function mat3det(a: pmat3): number;

export function mat4frommat3(src: pmat3): pmat4;
export function mat4identity(): pmat4;
export function mat4add(out: pmat4, a: pmat4, b: pmat4): pmat4;
export function mat4sub(out: pmat4, a: pmat4, b: pmat4): pmat4;
export function mat4mul(out: pmat4, m2: pmat4, a: pmat4): pmat4;
export function mat4scale(out: pmat4, a: pmat4, s: number): pmat4;
export function mat4transpose(out: pmat4, a: pmat4): pmat4;
export function mat4invert(out: pmat4, a: pmat4): boolean;
export function mat4det(a: pmat4): number;

export function translation2d(out: pmat3, v: pvec2): pmat3;
export function scaling2d(out: pmat3, v: pvec2): pmat3;
export function rotation2d(out: pmat3, theta: number): pmat3;
export function transformation2d(out: pmat3, translate: pvec2, rotate: number, scale: pvec2): pmat3;

export function translation(out: pmat4, v: pvec3): pmat4;
export function scaling(out: pmat4, v: pvec3): pmat4;
export function rotation(out: pmat4, q: pquat): pmat4;
export function translationof(out: pvec3, m: pmat4): pvec3;
export function scalingof(out: pvec3, m: pmat4): pvec3;
export function rotationof(out: pquat, m: pmat4): pquat;

export function transformation(out: pmat4, translate: pvec3, rotate: pquat, scale: pvec3): pmat4;
export function inverttrs(out: pmat4, trs: pmat4): boolean;

export function ortho(out: pmat4, left: number, right: number, bottom: number, top: number, znear: number, zfar: number): pmat4;
export function perspective(out: pmat4, aspect: number, yfov: number, znear: number, zfar: number): pmat4;
export function perspectiveviewport(out: pmat4, left: number, right: number, bottom: number, top: number, znear: number, zfar: number): pmat4;

export function targetto(out: pmat4, eye: pvec3, center: pvec3, up: pvec3): pmat4;
export function lookat(out: pmat4, eye: pvec3, center: pvec3, up: pvec3): pmat4;
export function lookatdir(out: pvec3, pitch: number, yaw: number): pvec3;
