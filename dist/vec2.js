import*as mat from"./mat.js";import*as vec3 from"./vec3.js";const v=create();const v3a=vec3.create();const v3b=vec3.create();export function create(x=0,y=0){return[x,y]}export function set(v,x=0,y=0){v[0]=x;v[1]=y;return v}export function copy(v,out=create()){return mat.copy(v,out)}export function add(a,b,out=create()){return mat.add(a,b,out)}export function sub(a,b,out=create()){return mat.sub(a,b,out)}export function scale(v,s,out=create()){return mat.scale(v,s,out)}export function mul(m,x,out=create()){return mat.mul(2,m,x,out)}export function mmul3(m,x,out=create()){vec3.set(v3a,x[0],x[1],1);return mat.copy(mat.mul(3,m,v3a,v3b),out,0,0,2)}export function dot(a,b){return mat.dot(a,b)}export function lerp(a,b,t,out=create()){return mat.lerp(a,b,t,out)}export function sqrLen(v){return dot(v,v)}export function len(v){return Math.hypot(v[0],v[1])}export function dist(a,b){return len(sub(a,b,v))}export function norm(v,out=create()){return mat.scale(v,1/(len(v)||1),out)}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtYXQiLCJ2ZWMzIiwidiIsImNyZWF0ZSIsInYzYSIsInYzYiIsIngiLCJ5Iiwic2V0IiwiY29weSIsIm91dCIsImFkZCIsImEiLCJiIiwic3ViIiwic2NhbGUiLCJzIiwibXVsIiwibSIsIm1tdWwzIiwiZG90IiwibGVycCIsInQiLCJzcXJMZW4iLCJsZW4iLCJNYXRoIiwiaHlwb3QiLCJkaXN0Iiwibm9ybSJdLCJzb3VyY2VzIjpbIi4uL2Fzc2VtYmx5L3ZlYzIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmxvYXQsIFJlYWRvbmx5TWF0MiwgUmVhZG9ubHlNYXQzLCBSZWFkb25seVZlYzIsIFZlYzIsIFZlYzMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCAqIGFzIG1hdCBmcm9tICcuL21hdCc7XG5pbXBvcnQgKiBhcyB2ZWMzIGZyb20gJy4vdmVjMyc7XG5cbi8vIFRlbXAgdmFyaWFibGVzXG5jb25zdCB2OiBWZWMyID0gY3JlYXRlKCk7XG5jb25zdCB2M2E6IFZlYzMgPSB2ZWMzLmNyZWF0ZSgpO1xuY29uc3QgdjNiOiBWZWMzID0gdmVjMy5jcmVhdGUoKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcge0BsaW5rIFZlYzJ9LlxuICogQHBhcmFtIHggZGVmYXVsdHMgdG8gMFxuICogQHBhcmFtIHkgZGVmYXVsdHMgdG8gMFxuICogQHJldHVybnMgW3gsIHldXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoeDogRmxvYXQgPSAwLCB5OiBGbG9hdCA9IDApOiBWZWMyIHtcbiAgcmV0dXJuIFt4LCB5XTtcbn1cblxuLyoqXG4gKiBTZXQgdmFsdWVzIG9mIGEge0BsaW5rIFZlYzJ9LlxuICogQHBhcmFtIHYgdGhlIHZlY1xuICogQHBhcmFtIHggZGVmYXVsdHMgdG8gMFxuICogQHBhcmFtIHkgZGVmYXVsdHMgdG8gMFxuICogQHJldHVybnMgdlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0KHY6IFZlYzIsIHg6IEZsb2F0ID0gMCwgeTogRmxvYXQgPSAwKTogVmVjMiB7XG4gIHVuY2hlY2tlZCh2WzBdID0geCk7XG4gIHVuY2hlY2tlZCh2WzFdID0geSk7XG4gIHJldHVybiB2O1xufVxuXG4vKipcbiAqIENvcHkgYSB7QGxpbmsgVmVjMn0uXG4gKiBAcmV0dXJucyBvdXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHkodjogUmVhZG9ubHlWZWMyLCBvdXQ6IFZlYzIgPSBjcmVhdGUoKSk6IFZlYzIge1xuICByZXR1cm4gbWF0LmNvcHkodiwgb3V0KSBhcyBWZWMyO1xufVxuXG4vKipcbiAqIFN1bSAyIHtAbGluayBWZWMyfS5cbiAqIEByZXR1cm5zIG91dCA9IGEgKyBiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGQoYTogUmVhZG9ubHlWZWMyLCBiOiBSZWFkb25seVZlYzIsIG91dDogVmVjMiA9IGNyZWF0ZSgpKTogVmVjMiB7XG4gIHJldHVybiBtYXQuYWRkKGEsIGIsIG91dCkgYXMgVmVjMjtcbn1cblxuLyoqXG4gKiBTdWJ0cmFjdCAyIHtAbGluayBWZWMyfS5cbiAqIEByZXR1cm5zIG91dCA9IGEgLSBiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdWIoYTogUmVhZG9ubHlWZWMyLCBiOiBSZWFkb25seVZlYzIsIG91dDogVmVjMiA9IGNyZWF0ZSgpKTogVmVjMiB7XG4gIHJldHVybiBtYXQuc3ViKGEsIGIsIG91dCkgYXMgVmVjMjtcbn1cblxuLyoqXG4gKiBNdWx0aXBseSBhIHtAbGluayBWZWMyfSBieSBhIGNvbnN0YW50LlxuICogQHJldHVybnMgb3V0ID0gcyAqIHZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlKHY6IFJlYWRvbmx5VmVjMiwgczogRmxvYXQsIG91dDogVmVjMiA9IGNyZWF0ZSgpKTogVmVjMiB7XG4gIHJldHVybiBtYXQuc2NhbGUodiwgcywgb3V0KSBhcyBWZWMyO1xufVxuXG4vKipcbiAqIE11bHRpcGx5IGEge0BsaW5rIFJlYWRvbmx5TWF0Mn0gd2l0aCBhIHtAbGluayBSZWFkb25seVZlYzJ9LlxuICogQHJldHVybnMgb3V0ID0gbSAqIHhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG11bChtOiBSZWFkb25seU1hdDIsIHg6IFJlYWRvbmx5VmVjMiwgb3V0OiBWZWMyID0gY3JlYXRlKCkpOiBWZWMyIHtcbiAgcmV0dXJuIG1hdC5tdWwoMiwgbSwgeCwgb3V0KSBhcyBWZWMyO1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSBhIHtAbGluayBSZWFkb25seVZlYzJ9IGJ5IGEge0BsaW5rIFJlYWRvbmx5TWF0M30uXG4gKiBAcmV0dXJucyBvdXQgPSBtICogW3ggMV1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1tdWwzKG06IFJlYWRvbmx5TWF0MywgeDogUmVhZG9ubHlWZWMyLCBvdXQ6IFZlYzIgPSBjcmVhdGUoKSk6IFZlYzIge1xuICB1bmNoZWNrZWQodmVjMy5zZXQodjNhLCB4WzBdLCB4WzFdLCAxKSk7XG4gIHJldHVybiBtYXQuY29weShtYXQubXVsKDMsIG0sIHYzYSwgdjNiKSwgb3V0LCAwLCAwLCAyKSBhcyBWZWMyO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgZG90IHByb2R1Y3Qgb2YgMiB7QGxpbmsgVmVjMn0uXG4gKiBAcmV0dXJucyBhICogYlxuICovXG5leHBvcnQgZnVuY3Rpb24gZG90KGE6IFJlYWRvbmx5VmVjMiwgYjogUmVhZG9ubHlWZWMyKTogRmxvYXQge1xuICByZXR1cm4gbWF0LmRvdChhLCBiKTtcbn1cblxuLyoqXG4gKiBMaW5lYXIgaW50ZXJwb2xhdGUgMiB7QGxpbmsgVmVjMn0uXG4gKiBAcmV0dXJucyBvdXQgPSBsZXJwKGEsIGIsIHQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsZXJwKGE6IFJlYWRvbmx5VmVjMiwgYjogUmVhZG9ubHlWZWMyLCB0OiBGbG9hdCwgb3V0OiBWZWMyID0gY3JlYXRlKCkpOiBWZWMyIHtcbiAgcmV0dXJuIG1hdC5sZXJwKGEsIGIsIHQsIG91dCkgYXMgVmVjMjtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgc3F1YXJlZCBsZW5ndGggb2YgYSB7QGxpbmsgVmVjMn0uXG4gKiBAcmV0dXJucyBkb3QodiwgdilcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNxckxlbih2OiBSZWFkb25seVZlYzIpOiBGbG9hdCB7XG4gIHJldHVybiBkb3Qodiwgdik7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIGxlbmd0aCBvZiBhIHtAbGluayBWZWMyfS5cbiAqIEByZXR1cm5zIHx2fFxuICovXG5leHBvcnQgZnVuY3Rpb24gbGVuKHY6IFJlYWRvbmx5VmVjMik6IEZsb2F0IHtcbiAgcmV0dXJuIE1hdGguaHlwb3QodlswXSwgdlsxXSkgYXMgRmxvYXQ7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIEV1Y2xpZGVhbiBkaXN0YW5jZSBvZiAyIHtAbGluayBWZWMyfS5cbiAqIEByZXR1cm5zIHxhIC0gYnxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3QoYTogUmVhZG9ubHlWZWMyLCBiOiBSZWFkb25seVZlYzIpOiBGbG9hdCB7XG4gIHJldHVybiBsZW4oc3ViKGEsIGIsIHYpKTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgYSB7QGxpbmsgVmVjMn0gYW5kIG9wdGlvbmFsbHkgc3RvcmVzIHJlc3VsdCB0byB0aGUgb3V0IHBhcmFtLlxuICogQHJldHVybnMgdi98dnxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm0odjogUmVhZG9ubHlWZWMyLCBvdXQ6IFZlYzIgPSBjcmVhdGUoKSk6IFZlYzIge1xuICByZXR1cm4gbWF0LnNjYWxlKHYsIDEgLyAobGVuKHYpIHx8IDEpLCBvdXQpIGFzIFZlYzI7XG59XG4iXSwibWFwcGluZ3MiOiJNQUNPLEdBQUssQ0FBQUEsR0FBRyxzQkFDUixHQUFLLENBQUFDLElBQUksaUJBR2hCLEtBQU0sQ0FBQUMsQ0FBTyxDQUFHQyxNQUFNLENBQUMsQ0FBQyxDQUN4QixLQUFNLENBQUFDLEdBQVMsQ0FBR0gsSUFBSSxDQUFDRSxNQUFNLENBQUMsQ0FBQyxDQUMvQixLQUFNLENBQUFFLEdBQVMsQ0FBR0osSUFBSSxDQUFDRSxNQUFNLENB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