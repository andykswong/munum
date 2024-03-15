import*as mat from"./mat.js";const m=create();export function create(){return[1,0,0,0,1,0,0,0,1]}export function id(out){for(let i=0;i<9;++i){out[i]=i%4?0:1}return out}export function copy(v,out=create()){return mat.copy(v,out)}export function add(a,b,out=create()){return mat.add(a,b,out)}export function sub(a,b,out=create()){return mat.sub(a,b,out)}export function scale(m,s,out=create()){return mat.scale(m,s,out)}export function transpose(m,out=create()){return mat.transpose(3,m,out)}export function mul(a,b,out=create()){return mat.mul(3,a,b,out)}export function det(m){return m[0]*+(m[4]*m[8]-m[7]*m[5])+m[3]*-(m[1]*m[8]-m[7]*m[2])+m[6]*+(m[1]*m[5]-m[4]*m[2])}export function invert(a,out=create()){const detA=det(a);if(!detA){return null}m[0]=+(a[4]*a[8]-a[7]*a[5]);m[1]=-(a[1]*a[8]-a[7]*a[2]);m[2]=+(a[1]*a[5]-a[4]*a[2]);m[3]=-(a[3]*a[8]-a[6]*a[5]);m[4]=+(a[0]*a[8]-a[6]*a[2]);m[5]=-(a[0]*a[5]-a[3]*a[2]);m[6]=+(a[3]*a[7]-a[6]*a[4]);m[7]=-(a[0]*a[7]-a[6]*a[1]);m[8]=+(a[0]*a[4]-a[3]*a[1]);return scale(m,1/detA,out)}export function nmat(a,out=create()){if(!invert(a,out)){return null}return transpose(out,out)}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJtYXQiLCJtIiwiY3JlYXRlIiwiaWQiLCJvdXQiLCJpIiwiY29weSIsInYiLCJhZGQiLCJhIiwiYiIsInN1YiIsInNjYWxlIiwicyIsInRyYW5zcG9zZSIsIm11bCIsImRldCIsImludmVydCIsImRldEEiLCJubWF0Il0sInNvdXJjZXMiOlsiLi4vYXNzZW1ibHkvbWF0My50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGbG9hdCwgUmVhZG9ubHlNYXQzLCBNYXQzIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgKiBhcyBtYXQgZnJvbSAnLi9tYXQnO1xuXG4vLyBUZW1wIHZhcmlhYmxlc1xuY29uc3QgbTogTWF0MyA9IGNyZWF0ZSgpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpZGVudGl0eSB7QGxpbmsgTWF0M30uXG4gKiBAcmV0dXJucyBpZGVudGl0eSBtYXQzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoKTogTWF0MyB7XG4gIHJldHVybiBbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMV07XG59XG5cbi8qKlxuICogU2V0IGEge0BsaW5rIE1hdDN9IHRvIGlkZW50aXR5LlxuICogQHJldHVybnMgb3V0ID0gSTNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlkKG91dDogTWF0Myk6IE1hdDMge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDk7ICsraSkge1xuICAgIHVuY2hlY2tlZChvdXRbaV0gPSAoaSAlIDQpID8gMCA6IDEpO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogQ29weSBhIHtAbGluayBNYXQzfS5cbiAqIEByZXR1cm5zIG91dFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weSh2OiBSZWFkb25seU1hdDMsIG91dDogTWF0MyA9IGNyZWF0ZSgpKTogTWF0MyB7XG4gIHJldHVybiBtYXQuY29weSh2LCBvdXQpIGFzIE1hdDM7XG59XG5cbi8qKlxuICogU3VtIDIge0BsaW5rIE1hdDN9LlxuICogQHJldHVybnMgb3V0ID0gYSArIGJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZChhOiBSZWFkb25seU1hdDMsIGI6IFJlYWRvbmx5TWF0Mywgb3V0OiBNYXQzID0gY3JlYXRlKCkpOiBNYXQzIHtcbiAgcmV0dXJuIG1hdC5hZGQoYSwgYiwgb3V0KSBhcyBNYXQzO1xufVxuXG4vKipcbiAqIFN1YnRyYWN0IDIge0BsaW5rIE1hdDN9LlxuICogQHJldHVybnMgb3V0ID0gYSAtIGJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1YihhOiBSZWFkb25seU1hdDMsIGI6IFJlYWRvbmx5TWF0Mywgb3V0OiBNYXQzID0gY3JlYXRlKCkpOiBNYXQzIHtcbiAgcmV0dXJuIG1hdC5zdWIoYSwgYiwgb3V0KSBhcyBNYXQzO1xufVxuXG4vKipcbiAqIE11bHRpcGx5IGEge0BsaW5rIE1hdDN9IGJ5IGEgY29uc3RhbnQuXG4gKiBAcmV0dXJucyBvdXQgPSBzICogTVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2NhbGUobTogUmVhZG9ubHlNYXQzLCBzOiBGbG9hdCwgb3V0OiBNYXQzID0gY3JlYXRlKCkpOiBNYXQzIHtcbiAgcmV0dXJuIG1hdC5zY2FsZShtLCBzLCBvdXQpIGFzIE1hdDM7XG59XG5cbi8qKlxuICogVHJhbnNwb3NlIGEge0BsaW5rIE1hdDN9LlxuICogQHJldHVybnMgW01dVFxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwb3NlKG06IFJlYWRvbmx5TWF0Mywgb3V0OiBNYXQzID0gY3JlYXRlKCkpOiBNYXQzIHtcbiAgcmV0dXJuIG1hdC50cmFuc3Bvc2UoMywgbSwgb3V0KSBhcyBNYXQzO1xufVxuXG4vKipcbiAqIE11bHRpcGx5IDIge0BsaW5rIE1hdDN9LlxuICogQHJldHVybnMgb3V0ID0gYSAqIGJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG11bChhOiBSZWFkb25seU1hdDMsIGI6IFJlYWRvbmx5TWF0Mywgb3V0OiBNYXQzID0gY3JlYXRlKCkpOiBNYXQzIHtcbiAgcmV0dXJuIG1hdC5tdWwoMywgYSwgYiwgb3V0KSBhcyBNYXQzO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnQgb2YgYSB7QGxpbmsgTWF0M30uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXQobTogUmVhZG9ubHlNYXQzKTogRmxvYXQge1xuICByZXR1cm4gdW5jaGVja2VkKFxuICAgIG1bMF0gKiArKG1bNF0gKiBtWzhdIC0gbVs3XSAqIG1bNV0pICtcbiAgICBtWzNdICogLShtWzFdICogbVs4XSAtIG1bN10gKiBtWzJdKSArXG4gICAgbVs2XSAqICsobVsxXSAqIG1bNV0gLSBtWzRdICogbVsyXSlcbiAgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGludmVyc2Ugb2YgYSB7QGxpbmsgTWF0M30sIG9yIG51bGwgaWYgbWF0cml4IGlzIG5vdCBpbnZlcnRpYmxlLlxuICogQHNlZSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JbnZlcnRpYmxlX21hdHJpeCNJbnZlcnNpb25fb2ZfM18lQzMlOTdfM19tYXRyaWNlc1xuICogQHBhcmFtIGEgaW5wdXQgbWF0cml4XG4gKiBAcGFyYW0gb3V0IG91dHB1dCBtYXRyaXhcbiAqIEByZXR1cm5zIG91dCA9IE1eLTEsIG9yIG51bGwgaWYgbWF0cml4IGlzIG5vdCBpbnZlcnRpYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnQoYTogUmVhZG9ubHlNYXQzLCBvdXQ6IE1hdDMgPSBjcmVhdGUoKSk6IE1hdDMgfCBudWxsIHtcbiAgY29uc3QgZGV0QTogRmxvYXQgPSBkZXQoYSk7XG4gIGlmICghZGV0QSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdW5jaGVja2VkKG1bMF0gPSArKGFbNF0gKiBhWzhdIC0gYVs3XSAqIGFbNV0pKTtcbiAgdW5jaGVja2VkKG1bMV0gPSAtKGFbMV0gKiBhWzhdIC0gYVs3XSAqIGFbMl0pKTtcbiAgdW5jaGVja2VkKG1bMl0gPSArKGFbMV0gKiBhWzVdIC0gYVs0XSAqIGFbMl0pKTtcbiAgdW5jaGVja2VkKG1bM10gPSAtKGFbM10gKiBhWzhdIC0gYVs2XSAqIGFbNV0pKTtcbiAgdW5jaGVja2VkKG1bNF0gPSArKGFbMF0gKiBhWzhdIC0gYVs2XSAqIGFbMl0pKTtcbiAgdW5jaGVja2VkKG1bNV0gPSAtKGFbMF0gKiBhWzVdIC0gYVszXSAqIGFbMl0pKTtcbiAgdW5jaGVja2VkKG1bNl0gPSArKGFbM10gKiBhWzddIC0gYVs2XSAqIGFbNF0pKTtcbiAgdW5jaGVja2VkKG1bN10gPSAtKGFbMF0gKiBhWzddIC0gYVs2XSAqIGFbMV0pKTtcbiAgdW5jaGVja2VkKG1bOF0gPSArKGFbMF0gKiBhWzRdIC0gYVszXSAqIGFbMV0pKTtcblxuICByZXR1cm4gc2NhbGUobSwgMSAvIGRldEEsIG91dCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbm9ybWFsIG1hdHJpeCwgd2hpY2ggaXMgdGhlIGludmVyc2UgdHJhbnNwb3NlIG1hdHJpeCwgZnJvbSBhIHtAbGluayBSZWFkb25seU1hdDN9LlxuICogQHBhcmFtIGEgaW5wdXQgbWF0cml4XG4gKiBAcGFyYW0gb3V0IG91dHB1dCBtYXRyaXhcbiAqIEByZXR1cm5zIG91dCA9IChNXi0xKVQsIG9yIG51bGwgaWYgbWF0cml4IGlzIG5vdCBpbnZlcnRpYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBubWF0KGE6IFJlYWRvbmx5TWF0Mywgb3V0OiBNYXQzID0gY3JlYXRlKCkpOiBNYXQzIHwgbnVsbCB7XG4gIGlmICghaW52ZXJ0KGEsIG91dCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gdHJhbnNwb3NlKG91dCwgb3V0KTtcbn1cbiJdLCJtYXBwaW5ncyI6Ik1BQ08sR0FBSyxDQUFBQSxHQUFHLGdCQUdmLEtBQU0sQ0FBQUMsQ0FBTyxDQUFHQyxNQUFNLENBQUMsQ0FBQyxDQU14QixNQUFPLFNBQVMsQ0FBQUEsTUFBTUEsQ0FBQSxDQUFTLENBQzdCLE1BQU8sQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQyxDQUFFLENBQUMs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QUUsQ0FDVCxNQUFPLEtBQ1QsQ0FFVWpCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxFQUFFUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkNSLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxFQUFFUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkNSLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxFQUFFUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkNSLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxFQUFFUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkNSLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxFQUFFUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkNSLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxFQUFFUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkNSLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxFQUFFUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkNSLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxFQUFFUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkNSLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxFQUFFUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FFN0MsTUFBTyxDQUFBRyxLQUFLLENBQUNYLENBQUMsQ0FBRSxDQUFDLENBQUdpQixJQUFJLENBQUVkLEdBQUcsQ0FDL0IsQ0FRQSxNQUFPLFNBQVMsQ0FBQWUsSUFBSUEsQ0FBQ1YsQ0FBZSxDQUFFTCxHQUFTLENBQUdGLE1BQU0sQ0FBQyxDQUFDLENBQWUsQ0FDdkUsR0FBSSxDQUFDZSxNQUFNLENBQUNSLENBQUMsQ0FBRUwsR0FBRyxDQUFDLENBQUUsQ0FDbkIsTUFBTyxLQUNULENBQ0EsTUFBTyxDQUFBVSxTQUFTLENBQUNWLEdBQUcsQ0FBRUEsR0FBRyxDQUMzQiIsImlnbm9yZUxpc3QiOltdfQ==