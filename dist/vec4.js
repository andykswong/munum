import*as array from"./array.js";const v=create();export function create(x=0,y=0,z=0,w=0){return[x,y,z,w]}export function set(v,x=0,y=0,z=0,w=0){v[0]=x;v[1]=y;v[2]=z;v[3]=w;return v}export function fromVec3(v,out=create()){out[0]=v[0];out[1]=v[1];out[2]=v[2];out[3]=0;return out}export function copy(v,out=create()){return array.copy(v,out)}export function add(a,b,out=create()){return array.add(a,b,out)}export function sub(a,b,out=create()){return array.sub(a,b,out)}export function scale(v,s,out=create()){return array.scale(v,s,out)}export function mul(v,s,out=create()){return array.mul(v,s,out)}export function mmul(a,b,out=create()){return array.copy(array.mmul(4,a,b,v),out)}export function dot(a,b){return array.dot(a,b)}export function lerp(a,b,t,out=create()){return array.lerp(a,b,t,out)}export function len2(v){return dot(v,v)}export function len(v){return Math.sqrt(dot(v,v))}export function norm(v,out=create()){return array.scale(v,1/(len(v)||1),out)}
//# sourceMappingURL=vec4.js.map