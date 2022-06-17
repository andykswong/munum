import*as mat from"./mat.js";import*as vec3 from"./vec3.js";const v=create();const v3a=vec3.create();const v3b=vec3.create();export function create(x=0,y=0){return[x,y]}export function set(v,x=0,y=0){v[0]=x;v[1]=y;return v}export function copy(v,out=create()){return mat.copy(v,out)}export function add(a,b,out=create()){return mat.add(a,b,out)}export function sub(a,b,out=create()){return mat.sub(a,b,out)}export function scale(v,s,out=create()){return mat.scale(v,s,out)}export function mul(m,x,out=create()){return mat.mul(2,m,x,out)}export function mmul3(m,x,out=create()){vec3.set(v3a,x[0],x[1],1);return mat.copy(mat.mul(3,m,v3a,v3b),out,0,0,2)}export function dot(a,b){return mat.dot(a,b)}export function lerp(a,b,t,out=create()){return mat.lerp(a,b,t,out)}export function sqrLen(v){return dot(v,v)}export function len(v){return Math.hypot(v[0],v[1])}export function dist(a,b){return len(sub(a,b,v))}export function norm(v,out=create()){return mat.scale(v,1/(len(v)||1),out)}
//# sourceMappingURL=vec2.js.map