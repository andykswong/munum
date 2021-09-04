import*as mat3 from"./mat3.js";export function translate2d(x,y,out=mat3.create()){mat3.id(out);out[6]=x;out[7]=y;return out}export function scale2d(x,y,out=mat3.create()){mat3.id(out);out[0]=x;out[4]=y;return out}export function rotate2d(theta,out=mat3.create()){mat3.id(out);out[0]=out[4]=Math.cos(theta);out[1]=out[3]=Math.sin(theta);out[3]*=-1;return out}export function transform2d(translation,rotation,scaling,out=mat3.create()){rotate2d(rotation,out);for(let i=0;i<2;++i){for(let j=0;j<2;++j){out[3*i+j]*=scaling[i]}}out[6]=translation[0];out[7]=translation[1];return out}
//# sourceMappingURL=transform2d.js.map