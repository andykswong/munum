import*as mat from"./mat.js";const m=create();export function create(){return[1,0,0,1]}export function id(out){out[0]=out[3]=1;out[1]=out[2]=0;return out}export function fromMat3(m,out=create()){out[0]=m[0];out[1]=m[1];out[2]=m[3];out[3]=m[4];return out}export function copy(v,out=create()){return mat.copy(v,out)}export function add(a,b,out=create()){return mat.add(a,b,out)}export function sub(a,b,out=create()){return mat.sub(a,b,out)}export function scale(m,s,out=create()){return mat.scale(m,s,out)}export function transpose(m,out=create()){return mat.transpose(2,m,out)}export function mul(a,b,out=create()){return mat.mul(2,a,b,out)}export function det(m){return m[0]*m[3]-m[2]*m[1]}export function invert(a,out=create()){const detA=det(a);if(!detA){return null}m[0]=a[3];m[1]=-a[1];m[2]=-a[2];m[3]=a[0];return scale(m,1/detA,out)}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtYXQiLCJtIiwiY3JlYXRlIiwiaWQiLCJvdXQiLCJmcm9tTWF0MyIsImNvcHkiLCJ2IiwiYWRkIiwiYSIsImIiLCJzdWIiLCJzY2FsZSIsInMiLCJ0cmFuc3Bvc2UiLCJtdWwiLCJkZXQiLCJpbnZlcnQiLCJkZXRBIl0sInNvdXJjZXMiOlsiLi4vYXNzZW1ibHkvbWF0Mi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGbG9hdCwgUmVhZG9ubHlNYXQyLCBNYXQyLCBSZWFkb25seU1hdDMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCAqIGFzIG1hdCBmcm9tICcuL21hdCc7XG5cbi8vIFRlbXAgdmFyaWFibGVzXG5jb25zdCBtOiBNYXQyID0gY3JlYXRlKCk7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGlkZW50aXR5IHtAbGluayBNYXQyfS5cbiAqIEByZXR1cm5zIGlkZW50aXR5IE1hdDJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSgpOiBNYXQyIHtcbiAgcmV0dXJuIFsxLCAwLCAwLCAxXTtcbn1cblxuLyoqXG4gKiBTZXQgYSB7QGxpbmsgTWF0Mn0gdG8gaWRlbnRpdHkuXG4gKiBAcmV0dXJucyBvdXQgPSBJMlxuICovXG5leHBvcnQgZnVuY3Rpb24gaWQob3V0OiBNYXQyKTogTWF0MiB7XG4gIHVuY2hlY2tlZChvdXRbMF0gPSBvdXRbM10gPSAxKTtcbiAgdW5jaGVja2VkKG91dFsxXSA9IG91dFsyXSA9IDApO1xuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHtAbGluayBNYXQyfSBmcm9tIHtAbGluayBSZWFkb25seU1hdDN9LlxuICogQHJldHVybnMgaWRlbnRpdHkgTWF0MlxuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbU1hdDMobTogUmVhZG9ubHlNYXQzLCBvdXQ6IE1hdDIgPSBjcmVhdGUoKSk6IE1hdDIge1xuICB1bmNoZWNrZWQob3V0WzBdID0gbVswXSk7XG4gIHVuY2hlY2tlZChvdXRbMV0gPSBtWzFdKTtcbiAgdW5jaGVja2VkKG91dFsyXSA9IG1bM10pO1xuICB1bmNoZWNrZWQob3V0WzNdID0gbVs0XSk7XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogQ29weSBhIHtAbGluayBNYXQyfS5cbiAqIEByZXR1cm5zIG91dFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weSh2OiBSZWFkb25seU1hdDIsIG91dDogTWF0MiA9IGNyZWF0ZSgpKTogTWF0MiB7XG4gIHJldHVybiBtYXQuY29weSh2LCBvdXQpIGFzIE1hdDI7XG59XG5cbi8qKlxuICogU3VtIDIge0BsaW5rIE1hdDJ9LlxuICogQHJldHVybnMgb3V0ID0gYSArIGJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZChhOiBSZWFkb25seU1hdDIsIGI6IFJlYWRvbmx5TWF0Miwgb3V0OiBNYXQyID0gY3JlYXRlKCkpOiBNYXQyIHtcbiAgcmV0dXJuIG1hdC5hZGQoYSwgYiwgb3V0KSBhcyBNYXQyO1xufVxuXG4vKipcbiAqIFN1YnRyYWN0IDIge0BsaW5rIE1hdDJ9LlxuICogQHJldHVybnMgb3V0ID0gYSAtIGJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1YihhOiBSZWFkb25seU1hdDIsIGI6IFJlYWRvbmx5TWF0Miwgb3V0OiBNYXQyID0gY3JlYXRlKCkpOiBNYXQyIHtcbiAgcmV0dXJuIG1hdC5zdWIoYSwgYiwgb3V0KSBhcyBNYXQyO1xufVxuXG4vKipcbiAqIE11bHRpcGx5IGEge0BsaW5rIE1hdDJ9IGJ5IGEgY29uc3RhbnQuXG4gKiBAcmV0dXJucyBvdXQgPSBzICogTVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2NhbGUobTogUmVhZG9ubHlNYXQyLCBzOiBGbG9hdCwgb3V0OiBNYXQyID0gY3JlYXRlKCkpOiBNYXQyIHtcbiAgcmV0dXJuIG1hdC5zY2FsZShtLCBzLCBvdXQpIGFzIE1hdDI7XG59XG5cbi8qKlxuICogVHJhbnNwb3NlIGEge0BsaW5rIE1hdDJ9LlxuICogQHJldHVybnMgW01dVFxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwb3NlKG06IFJlYWRvbmx5TWF0Miwgb3V0OiBNYXQyID0gY3JlYXRlKCkpOiBNYXQyIHtcbiAgcmV0dXJuIG1hdC50cmFuc3Bvc2UoMiwgbSwgb3V0KSBhcyBNYXQyO1xufVxuXG4vKipcbiAqIE11bHRpcGx5IDIge0BsaW5rIE1hdDJ9LlxuICogQHJldHVybnMgb3V0ID0gYSAqIGJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG11bChhOiBSZWFkb25seU1hdDIsIGI6IFJlYWRvbmx5TWF0Miwgb3V0OiBNYXQyID0gY3JlYXRlKCkpOiBNYXQyIHtcbiAgcmV0dXJuIG1hdC5tdWwoMiwgYSwgYiwgb3V0KSBhcyBNYXQyO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnQgb2YgYSB7QGxpbmsgTWF0Mn0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXQobTogUmVhZG9ubHlNYXQyKTogRmxvYXQge1xuICByZXR1cm4gdW5jaGVja2VkKG1bMF0gKiBtWzNdIC0gbVsyXSAqIG1bMV0pO1xufVxuXG4vKipcbiAqIFJldHVybnMgaW52ZXJzZSBvZiBhIHtAbGluayBNYXQyfSwgb3IgbnVsbCBpZiBtYXRyaXggaXMgbm90IGludmVydGlibGUuXG4gKiBAcGFyYW0gYSBpbnB1dCBtYXRyaXhcbiAqIEBwYXJhbSBvdXQgb3V0cHV0IG1hdHJpeFxuICogQHJldHVybnMgb3V0ID0gTV4tMSwgb3IgbnVsbCBpZiBtYXRyaXggaXMgbm90IGludmVydGlibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVydChhOiBSZWFkb25seU1hdDIsIG91dDogTWF0MiA9IGNyZWF0ZSgpKTogTWF0MiB8IG51bGwge1xuICBjb25zdCBkZXRBOiBGbG9hdCA9IGRldChhKTtcbiAgaWYgKCFkZXRBKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB1bmNoZWNrZWQobVswXSA9IGFbM10pO1xuICB1bmNoZWNrZWQobVsxXSA9IC1hWzFdKTtcbiAgdW5jaGVja2VkKG1bMl0gPSAtYVsyXSk7XG4gIHVuY2hlY2tlZChtWzNdID0gYVswXSk7XG5cbiAgcmV0dXJuIHNjYWxlKG0sIDEgLyBkZXRBLCBvdXQpO1xufVxuIl0sIm1hcHBpbmdzIjoiTUFDTyxHQUFLLENBQUFBLEdBQUcsZ0JBR2YsS0FBTSxDQUFBQyxDQUFPLENBQUdDLE1BQU0sQ0FBQyxDQUFDLENBTXhCLE1BQU8sU0FBUyxDQUFBQSxNQUFNQSxDQUFBLENBQVMsQ0FDN0IsTUFBTyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsQ0FDcEIsQ0FNQSxNQUFPLFNBQVMsQ0FBQUMsRUFBRUEsQ0FBQ0MsR0FBUyxDQUFRLENBQ3hCQSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUdBLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRyxDQUFDLENBQ25CQSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUdBLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRyxDQUFDLENBQzdCLE1BQU8sQ0FBQUEsR0FDVCxDQU1BLE1BQU8sU0FBUyxDQUFBQyxRQUFRQSxDQUFDSixDQUFlLENBQUVHLEdBQVMsQ0FBR0YsTUFBTSxDQUFDLENBQUMsQ0FBUSxDQUMxREUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFHSCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2JHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBR0gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNiRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUdILENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDYkcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFHSCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3ZCLE1BQU8sQ0FBQUcsR0FDVCxDQU1BLE1BQU8sU0FBUyxDQUFBRSxJQUFJQSxDQUFDQyxDQUFlLENBQUVILEdBQVMsQ0FBR0YsTUFBTSxDQUFDLENBQUMsQ0FBUSxDQUNoRSxNQUFPLENBQUFGLEdBQUcsQ0FBQ00sSUFBSSxDQUFDQyxDQUFDLENBQUVILEdBQUcsQ0FDeEIsQ0FNQSxNQUFPLFNBQVMsQ0FBQUksR0FBR0EsQ0FBQ0MsQ0FBZSxDQUFFQyxDQUFlLENBQUVOLEdBQVMsQ0FBR0YsTUFBTSxDQUFDLENBQUMsQ0FBUSxDQUNoRixNQUFPLENBQUFGLEdBQUcsQ0FBQ1EsR0FBRyxDQUFDQyxDQUFDLENBQUVDLENBQUMsQ0FBRU4sR0FBRyxDQUMxQixDQU1BLE1BQU8sU0FBUyxDQUFBTyxHQUFHQSxDQUFDRixDQUFlLENBQUVDLENBQWUsQ0FBRU4sR0FBUyxDQUFHRixNQUFNLENBQUMsQ0FBQyxDQUFRLENBQ2hGLE1BQU8sQ0FBQUYsR0FBRyxDQUFDVyxHQUFHLENBQUNGLENBQUMsQ0FBRUMsQ0FBQyxDQUFFTixHQUFHLENBQzFCLENBTUEsTUFBTyxTQUFTLENBQUFRLEtBQUtBLENBQUNYLENBQWUsQ0FBRVksQ0FBUSxDQUFFVCxHQUFTLENBQUdGLE1BQU0sQ0FBQyxDQUFDLENBQVEsQ0FDM0UsTUFBTyxDQUFBRixHQUFHLENBQUNZLEtBQUssQ0FBQ1gsQ0FBQyxDQUFFWSxDQUFDLENBQUVULEdBQUcsQ0FDNUIsQ0FNQSxNQUFPLFNBQVMsQ0FBQVUsU0FBU0EsQ0FBQ2IsQ0FBZSxDQUFFRyxHQUFTLENBQUdGLE1BQU0sQ0FBQyxDQUFDLENBQVEsQ0FDckUsTUFBTyxDQUFBRixHQUFHLENBQUNjLFNBQVMsQ0FBQyxDQUFDLENBQUViLENBQUMsQ0FBRUcsR0FBRyxDQUNoQyxDQU1BLE1BQU8sU0FBUyxDQUFBVyxHQUFHQSxDQUFDTixDQUFlLENBQUVDLENBQWUsQ0FBRU4sR0FBUyxDQUFHRixNQUFNLENBQUMsQ0FBQyxDQUFRLENBQ2hGLE1BQU8sQ0FBQUYsR0FBRyxDQUFDZSxHQUFHLENBQUMsQ0FBQyxDQUFFTixDQUFDLENBQUVDLENBQUMsQ0FBRU4sR0FBRyxDQUM3QixDQUtBLE1BQU8sU0FBUyxDQUFBWSxHQUFHQSxDQUFDZixDQUFlLENBQVMsQ0FDMUMsTUFBaUIsQ0FBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FDM0MsQ0FRQSxNQUFPLFNBQVMsQ0FBQWdCLE1BQU1BLENBQUNSLENBQWUsQ0FBRUwsR0FBUyxDQUFHRixNQUFNLENBQUMsQ0FBQyxDQUFlLENBQ3pFLEtBQU0sQ0FBQWdCLElBQVcsQ0FBR0YsR0FBRyxDQUFDUCxDQUFDLENBQUMsQ0FDMUIsR0FBSSxDQUFDUyxJQUFJLENBQUUsQ0FDVCxNQUFPLEtBQ1QsQ0FFVWpCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR1EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNYUixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUcsQ0FBQ1EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNaUixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUcsQ0FBQ1EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNaUixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FFckIsTUFBTyxDQUFBRyxLQUFLLENBQUNYLENBQUMsQ0FBRSxDQUFDLENBQUdpQixJQUFJLENBQUVkLEdBQUcsQ0FDL0IiLCJpZ25vcmVMaXN0IjpbXX0=