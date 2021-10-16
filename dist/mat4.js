import*as mat3 from"./mat3.js";import*as array from"./array.js";const m=create();export function create(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}export function id(out){for(let i=0;i<16;++i){out[i]=i%5?0:1}return out}export function fromMat3(m,out=create()){for(let i=0;i<3;++i){for(let j=0;j<3;++j){out[i*4+j]=m[i*3+j]}out[i*4+3]=0}out[12]=out[13]=out[14]=0;out[15]=1;return out}export function toMat3(m,out=mat3.create()){for(let i=0;i<3;++i){for(let j=0;j<3;++j){out[i*3+j]=m[i*4+j]}}return out}export function copy(v,out=create()){return array.copy(v,out)}export function add(a,b,out=create()){return array.add(a,b,out)}export function sub(a,b,out=create()){return array.sub(a,b,out)}export function scale(m,s,out=create()){return array.scale(m,s,out)}export function transpose(m,out=create()){return array.transpose(4,m,out)}export function mul(a,b,out=create()){return array.copy(array.mmul(4,a,b,m),out)}export function invert(a,out=create()){const fA0=a[0]*a[5]-a[4]*a[1];const fA1=a[0]*a[9]-a[8]*a[1];const fA2=a[0]*a[13]-a[12]*a[1];const fA3=a[4]*a[9]-a[8]*a[5];const fA4=a[4]*a[13]-a[12]*a[5];const fA5=a[8]*a[13]-a[12]*a[9];const fB0=a[2]*a[7]-a[6]*a[3];const fB1=a[2]*a[11]-a[10]*a[3];const fB2=a[2]*a[15]-a[14]*a[3];const fB3=a[6]*a[11]-a[10]*a[7];const fB4=a[6]*a[15]-a[14]*a[7];const fB5=a[10]*a[15]-a[14]*a[11];const detA=fA0*fB5-fA1*fB4+fA2*fB3+fA3*fB2-fA4*fB1+fA5*fB0;if(!detA){return null}m[0]=+a[5]*fB5-a[9]*fB4+a[13]*fB3;m[1]=-a[1]*fB5+a[9]*fB2-a[13]*fB1;m[2]=+a[1]*fB4-a[5]*fB2+a[13]*fB0;m[3]=-a[1]*fB3+a[5]*fB1-a[9]*fB0;m[4]=-a[4]*fB5+a[8]*fB4-a[12]*fB3;m[5]=+a[0]*fB5-a[8]*fB2+a[12]*fB1;m[6]=-a[0]*fB4+a[4]*fB2-a[12]*fB0;m[7]=+a[0]*fB3-a[4]*fB1+a[8]*fB0;m[8]=+a[7]*fA5-a[11]*fA4+a[15]*fA3;m[9]=-a[3]*fA5+a[11]*fA2-a[15]*fA1;m[10]=+a[3]*fA4-a[7]*fA2+a[15]*fA0;m[11]=-a[3]*fA3+a[7]*fA1-a[11]*fA0;m[12]=-a[6]*fA5+a[10]*fA4-a[14]*fA3;m[13]=+a[2]*fA5-a[10]*fA2+a[14]*fA1;m[14]=-a[2]*fA4+a[6]*fA2-a[14]*fA0;m[15]=+a[2]*fA3-a[6]*fA1+a[10]*fA0;return scale(m,1/detA,out)}export function nmat3(a,out=mat3.create()){return mat3.nmat(toMat3(a,out),out)}
//# sourceMappingURL=mat4.js.map