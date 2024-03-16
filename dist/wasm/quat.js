import{quatdot,quatfromanglex,quatfromangley,quatfromanglez,quatfromaxisangle,quatfromunitvecs,quatidentity,quatinvert,quatlerp,quatmul,quatnorm,quatslerp,quatvec3rotate}from"../../wasm/index.js";import{ManagedFloat64Array}from"./memory.js";export class Quat extends ManagedFloat64Array{static identity(){return new Quat(quatidentity())}static fromUnitVecs(from,to){return new Quat(quatfromunitvecs(from.byteOffset,to.byteOffset))}static fromAxisAngle(axis,angle){return new Quat(quatfromaxisangle(axis.byteOffset,angle))}static fromAngleX(angle){return new Quat(quatfromanglex(angle))}static fromAngleY(angle){return new Quat(quatfromangley(angle))}static fromAngleZ(angle){return new Quat(quatfromanglez(angle))}constructor(ptr){super(4,ptr)}mul(rhs){quatmul(this.byteOffset,this.byteOffset,rhs.byteOffset);return this}rotate(v){quatvec3rotate(v.byteOffset,this.byteOffset,v.byteOffset);return v}dot(rhs){return quatdot(this.byteOffset,rhs.byteOffset)}lerp(rhs,t){quatlerp(this.byteOffset,this.byteOffset,rhs.byteOffset,t);return this}slerp(rhs,t){quatslerp(this.byteOffset,this.byteOffset,rhs.byteOffset,t);return this}normalize(){return!!quatnorm(this.byteOffset,this.byteOffset)}invert(){return!!quatinvert(this.byteOffset,this.byteOffset)}}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJxdWF0ZG90IiwicXVhdGZyb21hbmdsZXgiLCJxdWF0ZnJvbWFuZ2xleSIsInF1YXRmcm9tYW5nbGV6IiwicXVhdGZyb21heGlzYW5nbGUiLCJxdWF0ZnJvbXVuaXR2ZWNzIiwicXVhdGlkZW50aXR5IiwicXVhdGludmVydCIsInF1YXRsZXJwIiwicXVhdG11bCIsInF1YXRub3JtIiwicXVhdHNsZXJwIiwicXVhdHZlYzNyb3RhdGUiLCJNYW5hZ2VkRmxvYXQ2NEFycmF5IiwiUXVhdCIsImlkZW50aXR5IiwiZnJvbVVuaXRWZWNzIiwiZnJvbSIsInRvIiwiYnl0ZU9mZnNldCIsImZyb21BeGlzQW5nbGUiLCJheGlzIiwiYW5nbGUiLCJmcm9tQW5nbGVYIiwiZnJvbUFuZ2xlWSIsImZyb21BbmdsZVoiLCJjb25zdHJ1Y3RvciIsInB0ciIsIm11bCIsInJocyIsInJvdGF0ZSIsInYiLCJkb3QiLCJsZXJwIiwidCIsInNsZXJwIiwibm9ybWFsaXplIiwiaW52ZXJ0Il0sInNvdXJjZXMiOlsiLi4vLi4vanMvd2FzbS9xdWF0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIHF1YXRkb3QsIHF1YXRmcm9tYW5nbGV4LCBxdWF0ZnJvbWFuZ2xleSwgcXVhdGZyb21hbmdsZXosIHF1YXRmcm9tYXhpc2FuZ2xlLCBxdWF0ZnJvbXVuaXR2ZWNzLCBxdWF0aWRlbnRpdHksXG4gIHF1YXRpbnZlcnQsIHF1YXRsZXJwLCBxdWF0bXVsLCBxdWF0bm9ybSwgcXVhdHNsZXJwLCBxdWF0dmVjM3JvdGF0ZVxufSBmcm9tICcuLi8uLi93YXNtL2luZGV4LmpzJztcbmltcG9ydCB7IElRdWF0LCBJbmRleGFibGUgfSBmcm9tICcuLi90eXBlcy50cyc7XG5pbXBvcnQgeyBNYW5hZ2VkRmxvYXQ2NEFycmF5IH0gZnJvbSAnLi9tZW1vcnkudHMnO1xuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4vdmVjLnRzJztcblxuLyoqIEEgcXVhdGVybmlvbi4gKi9cbmV4cG9ydCBjbGFzcyBRdWF0IGV4dGVuZHMgTWFuYWdlZEZsb2F0NjRBcnJheTw0PiBpbXBsZW1lbnRzIElRdWF0LCBJbmRleGFibGU8ND4ge1xuICBwdWJsaWMgMDogbnVtYmVyO1xuICBwdWJsaWMgMTogbnVtYmVyO1xuICBwdWJsaWMgMjogbnVtYmVyO1xuICBwdWJsaWMgMzogbnVtYmVyO1xuXG4gIC8qKiBSZXR1cm4gYW4gaWRlbnRpdHkgUXVhdC4gKi9cbiAgcHVibGljIHN0YXRpYyBpZGVudGl0eSgpOiBRdWF0IHtcbiAgICByZXR1cm4gbmV3IFF1YXQocXVhdGlkZW50aXR5KCkpO1xuICB9XG5cbiAgLyoqIFJldHVybiBhIFF1YXQgZnJvbSB1bml0IHZlY3RvcnMuICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVVuaXRWZWNzKGZyb206IFZlYzMsIHRvOiBWZWMzKTogUXVhdCB7XG4gICAgcmV0dXJuIG5ldyBRdWF0KHF1YXRmcm9tdW5pdHZlY3MoZnJvbS5ieXRlT2Zmc2V0LCB0by5ieXRlT2Zmc2V0KSk7XG4gIH1cblxuICAvKiogUmV0dXJuIGEgUXVhdCBmcm9tIGF4aXMgYW5kIGFuZ2xlICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUF4aXNBbmdsZShheGlzOiBWZWMzLCBhbmdsZTogbnVtYmVyKTogUXVhdCB7XG4gICAgcmV0dXJuIG5ldyBRdWF0KHF1YXRmcm9tYXhpc2FuZ2xlKGF4aXMuYnl0ZU9mZnNldCwgYW5nbGUpKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBRdWF0IGZyb20gcm90YXRpb24gYXJvdW5kIHgtYXhpcy4gKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQW5nbGVYKGFuZ2xlOiBudW1iZXIpOiBRdWF0IHtcbiAgICByZXR1cm4gbmV3IFF1YXQocXVhdGZyb21hbmdsZXgoYW5nbGUpKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBRdWF0IGZyb20gcm90YXRpb24gYXJvdW5kIHktYXhpcy4gKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQW5nbGVZKGFuZ2xlOiBudW1iZXIpOiBRdWF0IHtcbiAgICByZXR1cm4gbmV3IFF1YXQocXVhdGZyb21hbmdsZXkoYW5nbGUpKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBRdWF0IGZyb20gcm90YXRpb24gYXJvdW5kIHotYXhpcy4gKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQW5nbGVaKGFuZ2xlOiBudW1iZXIpOiBRdWF0IHtcbiAgICByZXR1cm4gbmV3IFF1YXQocXVhdGZyb21hbmdsZXooYW5nbGUpKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHRyOiBudW1iZXIpIHtcbiAgICBzdXBlcig0LCBwdHIpO1xuICB9XG5cbiAgcHVibGljIG11bChyaHM6IFF1YXQpOiB0aGlzIHtcbiAgICBxdWF0bXVsKHRoaXMuYnl0ZU9mZnNldCwgdGhpcy5ieXRlT2Zmc2V0LCByaHMuYnl0ZU9mZnNldCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgcm90YXRlKHY6IFZlYzMpOiBWZWMzIHtcbiAgICBxdWF0dmVjM3JvdGF0ZSh2LmJ5dGVPZmZzZXQsIHRoaXMuYnl0ZU9mZnNldCwgdi5ieXRlT2Zmc2V0KTtcbiAgICByZXR1cm4gdjtcbiAgfVxuXG4gIHB1YmxpYyBkb3QocmhzOiBRdWF0KTogbnVtYmVyIHtcbiAgICByZXR1cm4gcXVhdGRvdCh0aGlzLmJ5dGVPZmZzZXQsIHJocy5ieXRlT2Zmc2V0KTtcbiAgfVxuXG4gIHB1YmxpYyBsZXJwKHJoczogUXVhdCwgdDogbnVtYmVyKTogdGhpcyB7XG4gICAgcXVhdGxlcnAodGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmJ5dGVPZmZzZXQsIHJocy5ieXRlT2Zmc2V0LCB0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBzbGVycChyaHM6IFF1YXQsIHQ6IG51bWJlcik6IHRoaXMge1xuICAgIHF1YXRzbGVycCh0aGlzLmJ5dGVPZmZzZXQsIHRoaXMuYnl0ZU9mZnNldCwgcmhzLmJ5dGVPZmZzZXQsIHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIG5vcm1hbGl6ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISFxdWF0bm9ybSh0aGlzLmJ5dGVPZmZzZXQsIHRoaXMuYnl0ZU9mZnNldCk7XG4gIH1cblxuICBwdWJsaWMgaW52ZXJ0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXF1YXRpbnZlcnQodGhpcy5ieXRlT2Zmc2V0LCB0aGlzLmJ5dGVPZmZzZXQpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiJBQUFBLE9BQ0VBLE9BQU8sQ0FBRUMsY0FBYyxDQUFFQyxjQUFjLENBQUVDLGNBQWMsQ0FBRUMsaUJBQWlCLENBQUVDLGdCQUFnQixDQUFFQyxZQUFZLENBQzFHQyxVQUFVLENBQUVDLFFBQVEsQ0FBRUMsT0FBTyxDQUFFQyxRQUFRLENBQUVDLFNBQVMsQ0FBRUMsY0FBYyxLQUM3RCxxQkFBcUIsQ0FBQyxPQUVwQkMsbUJBQW1CLG1CQUk1QixNQUFPLE1BQU0sQ0FBQUMsSUFBSSxRQUFTLENBQUFELG1CQUFzRCxDQU85RSxNQUFjLENBQUFFLFFBQVFBLENBQUEsQ0FBUyxDQUM3QixNQUFPLElBQUksQ0FBQUQsSUFBSSxDQUFDUixZQUFZLENBQUMsQ0FBQyxDQUNoQyxDQUdBLE1BQWMsQ0FBQVUsWUFBWUEsQ0FBQ0MsSUFBVSxDQUFFQyxFQUFRLENBQVEsQ0FDckQsTUFBTyxJQUFJLENBQUFKLElBQUksQ0FBQ1QsZ0JBQWdCLENBQUNZLElBQUksQ0FBQ0UsVUFBVSxDQUFFRCxFQUFFLENBQUNDLFVBQVUsQ0FBQyxDQUNsRSxDQUdBLE1BQWMsQ0FBQUMsYUFBYUEsQ0FBQ0MsSUFBVSxDQUFFQyxLQUFhLENBQVEsQ0FDM0QsTUFBTyxJQUFJLENBQUFSLElBQUksQ0FBQ1YsaUJBQWlCLENBQUNpQixJQUFJLENBQUNGLFVBQVUsQ0FBRUcsS0FBSyxDQUFDLENBQzNELENBR0EsTUFBYyxDQUFBQyxVQUFVQSxDQUFDRCxLQUFhLENBQVEsQ0FDNUMsTUFBTyxJQUFJLENBQUFSLElBQUksQ0FBQ2IsY0FBYyxDQUFDcUIsS0FBSyxDQUFDLENBQ3ZDLENBR0EsTUFBYyxDQUFBRSxVQUFVQSxDQUFDRixLQUFhLENBQVEsQ0FDNUMsTUFBTyxJQUFJLENBQUFSLElBQUksQ0FBQ1osY0FBYyxDQUFDb0IsS0FBSyxDQUFDLENBQ3ZDLENBR0EsTUFBYyxDQUFBRyxVQUFVQSxDQUFDSCxLQUFhLENBQVEsQ0FDNUMsTUFBTyxJQUFJLENBQUFSLElBQUksQ0FBQ1gsY0FBYyxDQUFDbUIsS0FBSyxDQUFDLENBQ3ZDLENBRVFJLFdBQVdBLENBQUNDLEdBQVcsQ0FBRSxDQUMvQixLQUFLLENBQUMsQ0FBQyxDQUFFQSxHQUFHLENBQ2QsQ0FFT0MsR0FBR0EsQ0FBQ0MsR0FBUyxDQUFRLENBQzFCcEIsT0FBTyxDQUFDLElBQUksQ0FBQ1UsVUFBVSxDQUFFLElBQUksQ0FBQ0EsVUFBVSxDQUFFVSxHQUFHLENBQUNWLFVBQVUsQ0FBQyxDQUN6RCxNQUFPLEtBQ1QsQ0FFT1csTUFBTUEsQ0FBQ0MsQ0FBTyxDQUFRLENBQzNCbkIsY0FBYyxDQUFDbUIsQ0FBQyxDQUFDWixVQUFVLENBQUUsSUFBSSxDQUFDQSxVQUFVLENBQUVZLENBQUMsQ0FBQ1osVUFBVSxDQUFDLENBQzNELE1BQU8sQ0FBQVksQ0FDVCxDQUVPQyxHQUFHQSxDQUFDSCxHQUFTLENBQVUsQ0FDNUIsTUFBTyxDQUFBN0IsT0FBTyxDQUFDLElBQUksQ0FBQ21CLFVBQVUsQ0FBRVUsR0FBRyxDQUFDVixVQUFVLENBQ2hELENBRU9jLElBQUlBLENBQUNKLEdBQVMsQ0FBRUssQ0FBUyxDQUFRLENBQ3RDMUIsUUFBUSxDQUFDLElBQUksQ0FBQ1csVUFBVSxDQUFFLElBQUksQ0FBQ0EsVUFBVSxDQUFFVSxHQUFHLENBQUNWLFVBQVUsQ0FBRWUsQ0FBQyxDQUFDLENBQzdELE1BQU8sS0FDVCxDQUVPQyxLQUFLQSxDQUFDTixHQUFTLENBQUVLLENBQVMsQ0FBUSxDQUN2Q3ZCLFNBQVMsQ0FBQyxJQUFJLENBQUNRLFVBQVUsQ0FBRSxJQUFJLENBQUNBLFVBQVUsQ0FBRVUsR0FBRyxDQUFDVixVQUFVLENBQUVlLENBQUMsQ0FBQyxDQUM5RCxNQUFPLEtBQ1QsQ0FFT0UsU0FBU0EsQ0FBQSxDQUFZLENBQzFCLE1BQU8sQ0FBQyxDQUFDMUIsUUFBUSxDQUFDLElBQUksQ0FBQ1MsVUFBVSxDQUFFLElBQUksQ0FBQ0EsVUFBVSxDQUNwRCxDQUVPa0IsTUFBTUEsQ0FBQSxDQUFZLENBQ3ZCLE1BQU8sQ0FBQyxDQUFDOUIsVUFBVSxDQUFDLElBQUksQ0FBQ1ksVUFBVSxDQUFFLElBQUksQ0FBQ0EsVUFBVSxDQUN0RCxDQUNGIiwiaWdub3JlTGlzdCI6W119