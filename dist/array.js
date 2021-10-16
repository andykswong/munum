import{EPSILON,fequal as fequalNum,lerp as lerpNum}from"./scalar.js";export function copy(src,dst,srcOffset=0,dstOffset=0,count=src.length-srcOffset){for(let i=0;i<count;++i){dst[dstOffset+i]=src[srcOffset+i]}return dst}export function copyEx(src,dst,srcOffset,dstOffset,count){for(let i=0;i<count;++i){dst[dstOffset+i]=src[srcOffset+i]}return dst}export function fequal(a,b,epsilon=EPSILON){if(a.length-b.length){return false}for(let i=0;i<a.length;++i){if(!fequalNum(a[i],b[i],epsilon)){return false}}return true}export function add(a,b,out){for(let i=0;i<a.length;++i){out[i]=a[i]+b[i]}return out}export function sub(a,b,out){for(let i=0;i<a.length;++i){out[i]=a[i]-b[i]}return out}export function scale(a,s,out){for(let i=0;i<a.length;++i){out[i]=a[i]*s}return out}export function mul(a,b,out){for(let i=0;i<a.length;++i){out[i]=a[i]*b[i]}return out}export function lerp(a,b,t,out){for(let i=0;i<a.length;++i){out[i]=lerpNum(a[i],b[i],t)}return out}export function dot(a,b){let f=0;for(let i=0;i<a.length;++i){f+=a[i]*b[i]}return f}export function transpose(n,m,out){let f=0;for(let i=0;i<n;++i){for(let j=i;j<n;++j){f=m[j*n+i];out[j*n+i]=m[i*n+j];out[i*n+j]=f}}return out}export function mmul(n,a,b,out){const rr=a.length/n;const rc=b.length/n;let f=0;for(let i=0;i<rc;++i){for(let j=0;j<rr;++j){f=0;for(let k=0;k<n;++k){f+=a[k*rr+j]*b[i*n+k]}out[i*rr+j]=f}}return out}
//# sourceMappingURL=array.js.map