import{mat2identity,mat2add,mat2det,mat2frommat3,mat2invert,mat2mul,mat2scale,mat2sub,mat2transpose,mat3identity,mat3add,mat3det,mat3frommat2,mat3frommat4,mat3invert,mat3mul,mat3scale,mat3sub,mat3transpose,mat4identity,mat4add,mat4det,mat4frommat3,mat4invert,mat4mul,mat4scale,mat4sub,mat4transpose,normalmat3}from"../../wasm/index.js";import{ManagedFloat64Array}from"./memory.js";export class Mat2 extends ManagedFloat64Array{static identity(){return new Mat2(mat2identity())}static fromMat3(m){return new Mat2(mat2frommat3(m.byteOffset))}constructor(ptr){super(ptr)}get length(){return 4}add(rhs){mat2add(this.byteOffset,this.byteOffset,rhs.byteOffset);return this}sub(rhs){mat2sub(this.byteOffset,this.byteOffset,rhs.byteOffset);return this}mul(rhs){mat2mul(this.byteOffset,this.byteOffset,rhs.byteOffset);return this}scale(factor){mat2scale(this.byteOffset,this.byteOffset,factor);return this}transpose(){mat2transpose(this.byteOffset,this.byteOffset);return this}invert(){return!!mat2invert(this.byteOffset,this.byteOffset)}det(){return mat2det(this.byteOffset)}}export class Mat3 extends ManagedFloat64Array{static identity(){return new Mat3(mat3identity())}static fromMat2(m){return new Mat3(mat3frommat2(m.byteOffset))}static fromMat4(m){return new Mat3(mat3frommat4(m.byteOffset))}constructor(ptr){super(ptr)}get length(){return 9}add(rhs){mat3add(this.byteOffset,this.byteOffset,rhs.byteOffset);return this}sub(rhs){mat3sub(this.byteOffset,this.byteOffset,rhs.byteOffset);return this}mul(rhs){mat3mul(this.byteOffset,this.byteOffset,rhs.byteOffset);return this}scale(factor){mat3scale(this.byteOffset,this.byteOffset,factor);return this}transpose(){mat3transpose(this.byteOffset,this.byteOffset);return this}invert(){return!!mat3invert(this.byteOffset,this.byteOffset)}det(){return mat3det(this.byteOffset)}normalMat(){return!!normalmat3(this.byteOffset,this.byteOffset)}}export class Mat4 extends ManagedFloat64Array{static identity(){return new Mat4(mat4identity())}static fromMat3(m){return new Mat4(mat4frommat3(m.byteOffset))}constructor(ptr){super(ptr)}get length(){return 16}add(rhs){mat4add(this.byteOffset,this.byteOffset,rhs.byteOffset);return this}sub(rhs){mat4sub(this.byteOffset,this.byteOffset,rhs.byteOffset);return this}mul(rhs){mat4mul(this.byteOffset,this.byteOffset,rhs.byteOffset);return this}scale(factor){mat4scale(this.byteOffset,this.byteOffset,factor);return this}transpose(){mat4transpose(this.byteOffset,this.byteOffset);return this}invert(){return!!mat4invert(this.byteOffset,this.byteOffset)}det(){return mat4det(this.byteOffset)}}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtYXQyaWRlbnRpdHkiLCJtYXQyYWRkIiwibWF0MmRldCIsIm1hdDJmcm9tbWF0MyIsIm1hdDJpbnZlcnQiLCJtYXQybXVsIiwibWF0MnNjYWxlIiwibWF0MnN1YiIsIm1hdDJ0cmFuc3Bvc2UiLCJtYXQzaWRlbnRpdHkiLCJtYXQzYWRkIiwibWF0M2RldCIsIm1hdDNmcm9tbWF0MiIsIm1hdDNmcm9tbWF0NCIsIm1hdDNpbnZlcnQiLCJtYXQzbXVsIiwibWF0M3NjYWxlIiwibWF0M3N1YiIsIm1hdDN0cmFuc3Bvc2UiLCJtYXQ0aWRlbnRpdHkiLCJtYXQ0YWRkIiwibWF0NGRldCIsIm1hdDRmcm9tbWF0MyIsIm1hdDRpbnZlcnQiLCJtYXQ0bXVsIiwibWF0NHNjYWxlIiwibWF0NHN1YiIsIm1hdDR0cmFuc3Bvc2UiLCJub3JtYWxtYXQzIiwiTWFuYWdlZEZsb2F0NjRBcnJheSIsIk1hdDIiLCJpZGVudGl0eSIsImZyb21NYXQzIiwibSIsImJ5dGVPZmZzZXQiLCJjb25zdHJ1Y3RvciIsInB0ciIsImxlbmd0aCIsImFkZCIsInJocyIsInN1YiIsIm11bCIsInNjYWxlIiwiZmFjdG9yIiwidHJhbnNwb3NlIiwiaW52ZXJ0IiwiZGV0IiwiTWF0MyIsImZyb21NYXQyIiwiZnJvbU1hdDQiLCJub3JtYWxNYXQiLCJNYXQ0Il0sInNvdXJjZXMiOlsiLi4vLi4vanMvd2FzbS9tYXQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgbWF0MmlkZW50aXR5LCBtYXQyYWRkLCBtYXQyZGV0LCBtYXQyZnJvbW1hdDMsIG1hdDJpbnZlcnQsIG1hdDJtdWwsIG1hdDJzY2FsZSwgbWF0MnN1YiwgbWF0MnRyYW5zcG9zZSxcbiAgbWF0M2lkZW50aXR5LCBtYXQzYWRkLCBtYXQzZGV0LCBtYXQzZnJvbW1hdDIsIG1hdDNmcm9tbWF0NCwgbWF0M2ludmVydCwgbWF0M211bCwgbWF0M3NjYWxlLCBtYXQzc3ViLCBtYXQzdHJhbnNwb3NlLFxuICBtYXQ0aWRlbnRpdHksIG1hdDRhZGQsIG1hdDRkZXQsIG1hdDRmcm9tbWF0MywgbWF0NGludmVydCwgbWF0NG11bCwgbWF0NHNjYWxlLCBtYXQ0c3ViLCBtYXQ0dHJhbnNwb3NlLCBub3JtYWxtYXQzLFxufSBmcm9tICcuLi8uLi93YXNtL2luZGV4LmpzJztcbmltcG9ydCB7IE1hdCB9IGZyb20gJy4uL3R5cGVzLnRzJztcbmltcG9ydCB7IE1hbmFnZWRGbG9hdDY0QXJyYXkgfSBmcm9tICcuL21lbW9yeS50cyc7XG5cbi8qKiBBIDJ4MiBtYXRyaXguICovXG5leHBvcnQgY2xhc3MgTWF0MiBleHRlbmRzIE1hbmFnZWRGbG9hdDY0QXJyYXk8ND4gaW1wbGVtZW50cyBNYXQ8Mj4ge1xuICAvKiogUmV0dXJuIGFuIGlkZW50aXR5IE1hdDIuICovXG4gIHB1YmxpYyBzdGF0aWMgaWRlbnRpdHkoKTogTWF0MiB7XG4gICAgcmV0dXJuIG5ldyBNYXQyKG1hdDJpZGVudGl0eSgpKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBNYXQyIGZyb20gTWF0My4gKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTWF0MyhtOiBNYXQzKTogTWF0MiB7XG4gICAgcmV0dXJuIG5ldyBNYXQyKG1hdDJmcm9tbWF0MyhtLmJ5dGVPZmZzZXQpKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHRyOiBudW1iZXIpIHtcbiAgICBzdXBlcihwdHIpO1xuICB9XG5cbiAgcHVibGljIG92ZXJyaWRlIGdldCBsZW5ndGgoKTogNCB7XG4gICAgcmV0dXJuIDQ7XG4gIH1cblxuICBwdWJsaWMgYWRkKHJoczogTWF0Mik6IHRoaXMge1xuICAgIG1hdDJhZGQodGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmJ5dGVPZmZzZXQsIHJocy5ieXRlT2Zmc2V0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBzdWIocmhzOiBNYXQyKTogdGhpcyB7XG4gICAgbWF0MnN1Yih0aGlzLmJ5dGVPZmZzZXQsIHRoaXMuYnl0ZU9mZnNldCwgcmhzLmJ5dGVPZmZzZXQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIG11bChyaHM6IE1hdDIpOiB0aGlzIHtcbiAgICBtYXQybXVsKHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5ieXRlT2Zmc2V0LCByaHMuYnl0ZU9mZnNldCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgc2NhbGUoZmFjdG9yOiBudW1iZXIpOiB0aGlzIHtcbiAgICBtYXQyc2NhbGUodGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmJ5dGVPZmZzZXQsIGZhY3Rvcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgdHJhbnNwb3NlKCk6IHRoaXMge1xuICAgIG1hdDJ0cmFuc3Bvc2UodGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmJ5dGVPZmZzZXQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIGludmVydCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISFtYXQyaW52ZXJ0KHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5ieXRlT2Zmc2V0KTtcbiAgfVxuXG4gIHB1YmxpYyBkZXQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gbWF0MmRldCh0aGlzLmJ5dGVPZmZzZXQpO1xuICB9XG59XG5cbi8qKiBBIDN4MyBtYXRyaXguICovXG5leHBvcnQgY2xhc3MgTWF0MyBleHRlbmRzIE1hbmFnZWRGbG9hdDY0QXJyYXk8OT4gaW1wbGVtZW50cyBNYXQ8Mz4ge1xuICAvKiogUmV0dXJuIGFuIGlkZW50aXR5IE1hdDMuICovXG4gIHB1YmxpYyBzdGF0aWMgaWRlbnRpdHkoKTogTWF0MyB7XG4gICAgcmV0dXJuIG5ldyBNYXQzKG1hdDNpZGVudGl0eSgpKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBNYXQzIGZyb20gTWF0Mi4gKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTWF0MihtOiBNYXQyKTogTWF0MyB7XG4gICAgcmV0dXJuIG5ldyBNYXQzKG1hdDNmcm9tbWF0MihtLmJ5dGVPZmZzZXQpKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBNYXQzIGZyb20gTWF0NC4gKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTWF0NChtOiBNYXQ0KTogTWF0MyB7XG4gICAgcmV0dXJuIG5ldyBNYXQzKG1hdDNmcm9tbWF0NChtLmJ5dGVPZmZzZXQpKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHRyOiBudW1iZXIpIHtcbiAgICBzdXBlcihwdHIpO1xuICB9XG5cbiAgcHVibGljIG92ZXJyaWRlIGdldCBsZW5ndGgoKTogOSB7XG4gICAgcmV0dXJuIDk7XG4gIH1cblxuICBwdWJsaWMgYWRkKHJoczogTWF0Myk6IHRoaXMge1xuICAgIG1hdDNhZGQodGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmJ5dGVPZmZzZXQsIHJocy5ieXRlT2Zmc2V0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBzdWIocmhzOiBNYXQzKTogdGhpcyB7XG4gICAgbWF0M3N1Yih0aGlzLmJ5dGVPZmZzZXQsIHRoaXMuYnl0ZU9mZnNldCwgcmhzLmJ5dGVPZmZzZXQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIG11bChyaHM6IE1hdDMpOiB0aGlzIHtcbiAgICBtYXQzbXVsKHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5ieXRlT2Zmc2V0LCByaHMuYnl0ZU9mZnNldCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgc2NhbGUoZmFjdG9yOiBudW1iZXIpOiB0aGlzIHtcbiAgICBtYXQzc2NhbGUodGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmJ5dGVPZmZzZXQsIGZhY3Rvcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgdHJhbnNwb3NlKCk6IHRoaXMge1xuICAgIG1hdDN0cmFuc3Bvc2UodGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmJ5dGVPZmZzZXQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIGludmVydCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISFtYXQzaW52ZXJ0KHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5ieXRlT2Zmc2V0KTtcbiAgfVxuXG4gIHB1YmxpYyBkZXQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gbWF0M2RldCh0aGlzLmJ5dGVPZmZzZXQpO1xuICB9XG5cbiAgLyoqIENvdmVydHMgdGhpcyB0byBhIG5vcm1hbCBtYXRyaXgsIHdoaWNoIGlzIHRoZSBpbnZlcnNlIHRyYW5zcG9zZSBtYXRyaXguICovXG4gIHB1YmxpYyBub3JtYWxNYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhbm9ybWFsbWF0Myh0aGlzLmJ5dGVPZmZzZXQsIHRoaXMuYnl0ZU9mZnNldCk7XG4gIH1cbn1cblxuLyoqIEEgNHg0IG1hdHJpeC4gKi9cbmV4cG9ydCBjbGFzcyBNYXQ0IGV4dGVuZHMgTWFuYWdlZEZsb2F0NjRBcnJheTwxNj4gaW1wbGVtZW50cyBNYXQ8ND4ge1xuICAvKiogUmV0dXJuIGFuIGlkZW50aXR5IE1hdDQuICovXG4gIHB1YmxpYyBzdGF0aWMgaWRlbnRpdHkoKTogTWF0NCB7XG4gICAgcmV0dXJuIG5ldyBNYXQ0KG1hdDRpZGVudGl0eSgpKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBNYXQ0IGZyb20gTWF0My4gKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTWF0MyhtOiBNYXQzKTogTWF0NCB7XG4gICAgcmV0dXJuIG5ldyBNYXQ0KG1hdDRmcm9tbWF0MyhtLmJ5dGVPZmZzZXQpKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHRyOiBudW1iZXIpIHtcbiAgICBzdXBlcihwdHIpO1xuICB9XG5cbiAgcHVibGljIG92ZXJyaWRlIGdldCBsZW5ndGgoKTogMTYge1xuICAgIHJldHVybiAxNjtcbiAgfVxuXG4gIHB1YmxpYyBhZGQocmhzOiBNYXQ0KTogdGhpcyB7XG4gICAgbWF0NGFkZCh0aGlzLmJ5dGVPZmZzZXQsIHRoaXMuYnl0ZU9mZnNldCwgcmhzLmJ5dGVPZmZzZXQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIHN1YihyaHM6IE1hdDQpOiB0aGlzIHtcbiAgICBtYXQ0c3ViKHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5ieXRlT2Zmc2V0LCByaHMuYnl0ZU9mZnNldCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgbXVsKHJoczogTWF0NCk6IHRoaXMge1xuICAgIG1hdDRtdWwodGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmJ5dGVPZmZzZXQsIHJocy5ieXRlT2Zmc2V0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBzY2FsZShmYWN0b3I6IG51bWJlcik6IHRoaXMge1xuICAgIG1hdDRzY2FsZSh0aGlzLmJ5dGVPZmZzZXQsIHRoaXMuYnl0ZU9mZnNldCwgZmFjdG9yKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyB0cmFuc3Bvc2UoKTogdGhpcyB7XG4gICAgbWF0NHRyYW5zcG9zZSh0aGlzLmJ5dGVPZmZzZXQsIHRoaXMuYnl0ZU9mZnNldCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgaW52ZXJ0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIW1hdDRpbnZlcnQodGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmJ5dGVPZmZzZXQpO1xuICB9XG5cbiAgcHVibGljIGRldCgpOiBudW1iZXIge1xuICAgIHJldHVybiBtYXQ0ZGV0KHRoaXMuYnl0ZU9mZnNldCk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUEsT0FDRUEsWUFBWSxDQUFFQyxPQUFPLENBQUVDLE9BQU8sQ0FBRUMsWUFBWSxDQUFFQyxVQUFVLENBQUVDLE9BQU8sQ0FBRUMsU0FBUyxDQUFFQyxPQUFPLENBQUVDLGFBQWEsQ0FDcEdDLFlBQVksQ0FBRUMsT0FBTyxDQUFFQyxPQUFPLENBQUVDLFlBQVksQ0FBRUMsWUFBWSxDQUFFQyxVQUFVLENBQUVDLE9BQU8sQ0FBRUMsU0FBUyxDQUFFQyxPQUFPLENBQUVDLGFBQWEsQ0FDbEhDLFlBQVksQ0FBRUMsT0FBTyxDQUFFQyxPQUFPLENBQUVDLFlBQVksQ0FBRUMsVUFBVSxDQUFFQyxPQUFPLENBQUVDLFNBQVMsQ0FBRUMsT0FBTyxDQUFFQyxhQUFhLENBQUVDLFVBQVUsS0FDM0cscUJBQXFCLENBQUMsT0FFcEJDLG1CQUFtQixtQkFHNUIsTUFBTyxNQUFNLENBQUFDLElBQUksUUFBUyxDQUFBRCxtQkFBeUMsQ0FFakUsTUFBYyxDQUFBRSxRQUFRQSxDQUFBLENBQVMsQ0FDN0IsTUFBTyxJQUFJLENBQUFELElBQUksQ0FBQzlCLFlBQVksQ0FBQyxDQUFDLENBQ2hDLENBR0EsTUFBYyxDQUFBZ0MsUUFBUUEsQ0FBQ0MsQ0FBTyxDQUFRLENBQ3BDLE1BQU8sSUFBSSxDQUFBSCxJQUFJLENBQUMzQixZQUFZLENBQUM4QixDQUFDLENBQUNDLFVBQVUsQ0FBQyxDQUM1QyxDQUVRQyxXQUFXQSxDQUFDQyxHQUFXLENBQUUsQ0FDL0IsS0FBSyxDQUFDQSxHQUFHLENBQ1gsQ0FFQSxHQUFvQixDQUFBQyxNQUFNQSxDQUFBLENBQU0sQ0FDOUIsTUFBTyxFQUNULENBRU9DLEdBQUdBLENBQUNDLEdBQVMsQ0FBUSxDQUMxQnRDLE9BQU8sQ0FBQyxJQUFJLENBQUNpQyxVQUFVLENBQUUsSUFBSSxDQUFDQSxVQUFVLENBQUVLLEdBQUcsQ0FBQ0wsVUFBVSxDQUFDLENBQ3pELE1BQU8sS0FDVCxDQUVPTSxHQUFHQSxDQUFDRCxHQUFTLENBQVEsQ0FDMUJoQyxPQUFPLENBQUMsSUFBSSxDQUFDMkIsVUFBVSxDQUFFLElBQUksQ0FBQ0EsVUFBVSxDQUFFSyxHQUFHLENBQUNMLFVBQVUsQ0FBQyxDQUN6RCxNQUFPLEtBQ1QsQ0FFT08sR0FBR0EsQ0FBQ0YsR0FBUyxDQUFRLENBQzFCbEMsT0FBTyxDQUFDLElBQUksQ0FBQzZCLFVBQVUsQ0FBRSxJQUFJLENBQUNBLFVBQVUsQ0FBRUssR0FBRyxDQUFDTCxVQUFVLENBQUMsQ0FDekQsTUFBTyxLQUNULENBRU9RLEtBQUtBLENBQUNDLE1BQWMsQ0FBUSxDQUNqQ3JDLFNBQVMsQ0FBQyxJQUFJLENBQUM0QixVQUFVLENBQUUsSUFBSSxDQUFDQSxVQUFVLENBQUVTLE1BQU0sQ0FBQyxDQUNuRCxNQUFPLEtBQ1QsQ0FFT0MsU0FBU0EsQ0FBQSxDQUFTLENBQ3ZCcEMsYUFBYSxDQUFDLElBQUksQ0FBQzBCLFVBQVUsQ0FBRSxJQUFJLENBQUNBLFVBQVUsQ0FBQyxDQUMvQyxNQUFPLEtBQ1QsQ0FFT1csTUFBTUEsQ0FBQSxDQUFZLENBQ3ZCLE1BQU8sQ0FBQyxDQUFDekMsVUFBVSxDQUFDLElBQUksQ0FBQzhCLFVBQVUsQ0FBRSxJQUFJLENBQUNBLFVBQVUsQ0FDdEQsQ0FFT1ksR0FBR0EsQ0FBQSxDQUFXLENBQ25CLE1BQU8sQ0FBQTVDLE9BQU8sQ0FBQyxJQUFJLENBQUNnQyxVQUFVLENBQ2hDLENBQ0YsQ0FHQSxNQUFPLE1BQU0sQ0FBQWEsSUFBSSxRQUFTLENBQUFsQixtQkFBeUMsQ0FFakUsTUFBYyxDQUFBRSxRQUFRQSxDQUFBLENBQVMsQ0FDN0IsTUFBTyxJQUFJLENBQUFnQixJQUFJLENBQUN0QyxZQUFZLENBQUMsQ0FBQyxDQUNoQyxDQUdBLE1BQWMsQ0FBQXVDLFFBQVFBLENBQUNmLENBQU8sQ0FBUSxDQUNwQyxNQUFPLElBQUksQ0FBQWMsSUFBSSxDQUFDbkMsWUFBWSxDQUFDcUIsQ0FBQyxDQUFDQyxVQUFVLENBQUMsQ0FDNUMsQ0FHQSxNQUFjLENBQUFlLFFBQVFBLENBQUNoQixDQUFPLENBQVEsQ0FDcEMsTUFBTyxJQUFJLENBQUFjLElBQUksQ0FBQ2xDLFlBQVksQ0FBQ29CLENBQUMsQ0FBQ0MsVUFBVSxDQUFDLENBQzVDLENBRVFDLFdBQVdBLENBQUNDLEdBQVcsQ0FBRSxDQUMvQixLQUFLLENBQUNBLEdBQUcsQ0FDWCxDQUVBLEdBQW9CLENBQUFDLE1BQU1BLENBQUEsQ0FBTSxDQUM5QixNQUFPLEVBQ1QsQ0FFT0MsR0FBR0EsQ0FBQ0MsR0FBUyxDQUFRLENBQzFCN0IsT0FBTyxDQUFDLElBQUksQ0FBQ3dCLFVBQVUsQ0FBRSxJQUFJLENBQUNBLFVBQVUsQ0FBRUssR0FBRyxDQUFDTCxVQUFVLENBQUMsQ0FDekQsTUFBTyxLQUNULENBRU9NLEdBQUdBLENBQUNELEdBQVMsQ0FBUSxDQUMxQnRCLE9BQU8sQ0FBQyxJQUFJLENBQUNpQixVQUFVLENBQUUsSUFBSSxDQUFDQSxVQUFVLENBQUVLLEdBQUcsQ0FBQ0wsVUFBVSxDQUFDLENBQ3pELE1BQU8sS0FDVCxDQUVPTyxHQUFHQSxDQUFDRixHQUFTLENBQVEsQ0FDMUJ4QixPQUFPLENBQUMsSUFBSSxDQUFDbUIsVUFBVSxDQUFFLElBQUksQ0FBQ0EsVUFBVSxDQUFFSyxHQUFHLENBQUNMLFVBQVUsQ0FBQyxDQUN6RCxNQUFPLEtBQ1QsQ0FFT1EsS0FBS0EsQ0FBQ0MsTUFBYyxDQUFRLENBQ2pDM0IsU0FBUyxDQUFDLElBQUksQ0FBQ2tCLFVBQVUsQ0FBRSxJQUFJLENBQUNBLFVBQVUsQ0FBRVMsTUFBTSxDQUFDLENBQ25ELE1BQU8sS0FDVCxDQUVPQyxTQUFTQSxDQUFBLENBQVMsQ0FDdkIxQixhQUFhLENBQUMsSUFBSSxDQUFDZ0IsVUFBVSxDQUFFLElBQUksQ0FBQ0EsVUFBVSxDQUFDLENBQy9DLE1BQU8sS0FDVCxDQUVPVyxNQUFNQSxDQUFBLENBQVksQ0FDdkIsTUFBTyxDQUFDLENBQUMvQixVQUFVLENBQUMsSUFBSSxDQUFDb0IsVUFBVSxDQUFFLElBQUksQ0FBQ0EsVUFBVSxDQUN0RCxDQUVPWSxHQUFHQSxDQUFBLENBQVcsQ0FDbkIsTUFBTyxDQUFBbkMsT0FBTyxDQUFDLElBQUksQ0FBQ3VCLFVBQVUsQ0FDaEMsQ0FHT2dCLFNBQVNBLENBQUEsQ0FBWSxDQUMxQixNQUFPLENBQUMsQ0FBQ3RCLFVBQVUsQ0FBQyxJQUFJLENBQUNNLFVBQVUsQ0FBRSxJQUFJLENBQUNBLFVBQVUsQ0FDdEQsQ0FDRixDQUdBLE1BQU8sTUFBTSxDQUFBaUIsSUFBSSxRQUFTLENBQUF0QixtQkFBMEMsQ0FFbEUsTUFBYyxDQUFBRSxRQUFRQSxDQUFBLENBQVMsQ0FDN0IsTUFBTyxJQUFJLENBQUFvQixJQUFJLENBQUNoQyxZQUFZLENBQUMsQ0FBQyxDQUNoQyxDQUdBLE1BQWMsQ0FBQWEsUUFBUUEsQ0FBQ0MsQ0FBTyxDQUFRLENBQ3BDLE1BQU8sSUFBSSxDQUFBa0IsSUFBSSxDQUFDN0IsWUFBWSxDQUFDVyxDQUFDLENBQUNDLFVBQVUsQ0FBQyxDQUM1QyxDQUVRQyxXQUFXQSxDQUFDQyxHQUFXLENBQUUsQ0FDL0IsS0FBSyxDQUFDQSxHQUFHLENBQ1gsQ0FFQSxHQUFvQixDQUFBQyxNQUFNQSxDQUFBLENBQU8sQ0FDL0IsTUFBTyxHQUNULENBRU9DLEdBQUdBLENBQUNDLEdBQVMsQ0FBUSxDQUMxQm5CLE9BQU8sQ0FBQyxJQUFJLENBQUNjLFVBQVUsQ0FBRSxJQUFJLENBQUNBLFVBQVUsQ0FBRUssR0FBRyxDQUFDTCxVQUFVLENBQUMsQ0FDekQsTUFBTyxLQUNULENBRU9NLEdBQUdBLENBQUNELEdBQVMsQ0FBUSxDQUMxQmIsT0FBTyxDQUFDLElBQUksQ0FBQ1EsVUFBVSxDQUFFLElBQUksQ0FBQ0EsVUFBVSxDQUFFSyxHQUFHLENBQUNMLFVBQVUsQ0FBQyxDQUN6RCxNQUFPLEtBQ1QsQ0FFT08sR0FBR0EsQ0FBQ0YsR0FBUyxDQUFRLENBQzFCZixPQUFPLENBQUMsSUFBSSxDQUFDVSxVQUFVLENBQUUsSUFBSSxDQUFDQSxVQUFVLENBQUVLLEdBQUcsQ0FBQ0wsVUFBVSxDQUFDLENBQ3pELE1BQU8sS0FDVCxDQUVPUSxLQUFLQSxDQUFDQyxNQUFjLENBQVEsQ0FDakNsQixTQUFTLENBQUMsSUFBSSxDQUFDUyxVQUFVLENBQUUsSUFBSSxDQUFDQSxVQUFVLENBQUVTLE1BQU0sQ0FBQyxDQUNuRCxNQUFPLEtBQ1QsQ0FFT0MsU0FBU0EsQ0FBQSxDQUFTLENBQ3ZCakIsYUFBYSxDQUFDLElBQUksQ0FBQ08sVUFBVSxDQUFFLElBQUksQ0FBQ0EsVUFBVSxDQUFDLENBQy9DLE1BQU8sS0FDVCxDQUVPVyxNQUFNQSxDQUFBLENBQVksQ0FDdkIsTUFBTyxDQUFDLENBQUN0QixVQUFVLENBQUMsSUFBSSxDQUFDVyxVQUFVLENBQUUsSUFBSSxDQUFDQSxVQUFVLENBQ3RELENBRU9ZLEdBQUdBLENBQUEsQ0FBVyxDQUNuQixNQUFPLENBQUF6QixPQUFPLENBQUMsSUFBSSxDQUFDYSxVQUFVLENBQ2hDLENBQ0YiLCJpZ25vcmVMaXN0IjpbXX0=