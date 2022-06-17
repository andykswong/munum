import{AABB}from"./types/index.js";import*as mat from"./mat.js";import*as vec3 from"./vec3.js";const v0=vec3.create();const v1=vec3.create();export function create(min=vec3.create(),max=vec3.create()){return new AABB(min,max)}export function copy(a,out=create()){mat.copy(a.min,out.min);mat.copy(a.max,out.max);return out}export function set(a,min=vec3.create(),max=vec3.create()){mat.copy(min,a.min);mat.copy(max,a.max);return a}export function union(a,b,out=create()){out.min[0]=Math.min(a.min[0],b.min[0]);out.min[1]=Math.min(a.min[1],b.min[1]);out.min[2]=Math.min(a.min[2],b.min[2]);out.max[0]=Math.max(a.max[0],b.max[0]);out.max[1]=Math.max(a.max[1],b.max[1]);out.max[2]=Math.max(a.max[2],b.max[2]);return out}export function intersection(a,b,out=create()){out.min[0]=Math.max(a.min[0],b.min[0]);out.min[1]=Math.max(a.min[1],b.min[1]);out.min[2]=Math.max(a.min[2],b.min[2]);out.max[0]=Math.min(a.max[0],b.max[0]);out.max[1]=Math.min(a.max[1],b.max[1]);out.max[2]=Math.min(a.max[2],b.max[2]);out.max[0]=Math.max(out.min[0],out.max[0]);out.max[1]=Math.max(out.min[1],out.max[1]);out.max[2]=Math.max(out.min[2],out.max[2]);return out}export function transform(a,m,out=create()){for(let i=0;i<3;++i){v0[i]=m[3*4+i];v1[i]=m[3*4+i];for(let j=0;j<3;++j){const x=a.min[j]*m[j*4+i];const y=a.max[j]*m[j*4+i];v0[i]+=Math.min(x,y);v1[i]+=Math.max(x,y)}}mat.copy(v0,out.min);mat.copy(v1,out.max);return out}export function displacement(box,point,out=vec3.create()){vec3.add(box.min,box.max,v0);vec3.sub(box.max,box.min,v1);vec3.scale(v0,0.5,v0);vec3.scale(v1,0.5,v1);out[0]=Math.abs(point[0]-v0[0])-v1[0];out[1]=Math.abs(point[1]-v0[1])-v1[1];out[2]=Math.abs(point[2]-v0[2])-v1[2];return out}export function dist(box,point){displacement(box,point,v0);if(v0[0]<=0&&v0[1]<=0&&v0[2]<=0){const dxy=Math.max(v0[0],v0[1]);return Math.max(dxy,v0[2])}v0[0]=Math.max(0,v0[0]);v0[1]=Math.max(0,v0[1]);v0[2]=Math.max(0,v0[2]);return vec3.len(v0)}export function containsPoint(box,center,radius=0){return dist(box,center)<=radius}export function intersect(a,b){for(let i=0;i<3;++i){if(a.min[i]>b.max[i]||b.min[i]>a.max[i]){return false}}return true}
//# sourceMappingURL=aabb.js.map