import*as vec3 from"./vec3.js";import*as plane from"./plane.js";const FRUSTUM_PLANES=6;const v0=vec3.create();export function create(left=plane.create(),right=plane.create(),bottom=plane.create(),top=plane.create(),near=plane.create(),far=plane.create()){return[left,right,bottom,top,near,far]}export function copy(a,out=create()){for(let i=0;i<FRUSTUM_PLANES;++i){plane.copy(a[i],out[i])}return out}export function fromViewProj(m,out=create()){plane.set(out[0],m[3]+m[0],m[7]+m[4],m[11]+m[8],m[15]+m[12]);plane.set(out[1],m[3]-m[0],m[7]-m[4],m[11]-m[8],m[15]-m[12]);plane.set(out[2],m[3]+m[1],m[7]+m[5],m[11]+m[9],m[15]+m[13]);plane.set(out[3],m[3]-m[1],m[7]-m[5],m[11]-m[9],m[15]-m[13]);plane.set(out[4],m[3]+m[2],m[7]+m[6],m[11]+m[10],m[15]+m[14]);plane.set(out[5],m[3]-m[2],m[7]-m[6],m[11]-m[10],m[15]-m[14]);for(let i=0;i<FRUSTUM_PLANES;++i){plane.norm(out[i],out[i])}return out}export function containsPoint(f,center,radius=0){for(let i=0;i<FRUSTUM_PLANES;++i){if(plane.dist(f[i],center)<-radius){return false}}return true}export function containsAABB(f,box){for(let i=0;i<FRUSTUM_PLANES;++i){v0[0]=f[i][0]>0?box.max[0]:box.min[0];v0[1]=f[i][1]>0?box.max[1]:box.min[1];v0[2]=f[i][2]>0?box.max[2]:box.min[2];if(plane.dist(f[i],v0)<0){return false}}return true}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ2ZWMzIiwicGxhbmUiLCJGUlVTVFVNX1BMQU5FUyIsInYwIiwiY3JlYXRlIiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwidG9wIiwibmVhciIsImZhciIsImNvcHkiLCJhIiwib3V0IiwiaSIsImZyb21WaWV3UHJvaiIsIm0iLCJzZXQiLCJub3JtIiwiY29udGFpbnNQb2ludCIsImYiLCJjZW50ZXIiLCJyYWRpdXMiLCJkaXN0IiwiY29udGFpbnNBQUJCIiwiYm94IiwibWF4IiwibWluIl0sInNvdXJjZXMiOlsiLi4vYXNzZW1ibHkvZnJ1c3R1bS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBGbG9hdCwgRnJ1c3R1bSwgUGxhbmUsIFJlYWRvbmx5QUFCQiwgUmVhZG9ubHlGcnVzdHVtLCBSZWFkb25seU1hdDQsIFJlYWRvbmx5VmVjMywgVmVjM1xufSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCAqIGFzIHZlYzMgZnJvbSAnLi92ZWMzJztcbmltcG9ydCAqIGFzIHBsYW5lIGZyb20gJy4vcGxhbmUnO1xuXG5jb25zdCBGUlVTVFVNX1BMQU5FUyA9IDY7XG5cbi8vIFRlbXAgdmFyaWFibGVzXG5jb25zdCB2MDogVmVjMyA9IHZlYzMuY3JlYXRlKCk7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IHtAbGluayBGcnVzdHVtfSBmcm9tIHRoZSA2IG5vcm1hbGl6ZWQgcGxhbmVzOiBsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShcbiAgbGVmdDogUGxhbmUgPSBwbGFuZS5jcmVhdGUoKSwgcmlnaHQ6IFBsYW5lID0gcGxhbmUuY3JlYXRlKCksXG4gIGJvdHRvbTogUGxhbmUgPSBwbGFuZS5jcmVhdGUoKSwgdG9wOiBQbGFuZSA9IHBsYW5lLmNyZWF0ZSgpLFxuICBuZWFyOiBQbGFuZSA9IHBsYW5lLmNyZWF0ZSgpLCBmYXI6IFBsYW5lID0gcGxhbmUuY3JlYXRlKClcbik6IEZydXN0dW0ge1xuICByZXR1cm4gW2xlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyXTtcbn1cblxuLyoqXG4gKiBDb3B5IGEge0BsaW5rIEZydXN0dW19LlxuICovXG4gZXhwb3J0IGZ1bmN0aW9uIGNvcHkoYTogUmVhZG9ubHlGcnVzdHVtLCBvdXQ6IEZydXN0dW0gPSBjcmVhdGUoKSk6IEZydXN0dW0ge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IEZSVVNUVU1fUExBTkVTOyArK2kpIHtcbiAgICBwbGFuZS5jb3B5KGFbaV0sIG91dFtpXSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIHtAbGluayBGcnVzdHVtfSBpbiB3b3JsZCBzcGFjZSBmcm9tIGEgdmlldy1wcm9qZWN0aW9uIG1hdHJpeCAodmlld1Byb2ogPSBwcm9qICogdmlldykgdXNpbmcgR3JpYmIvSGFydG1hbm4gbWV0aG9kLlxuICogQHNlZSBodHRwOi8vd3d3OC5jcy51bXUuc2Uva3Vyc2VyLzVEVjA1MS9IVDEyL2xhYi9wbGFuZV9leHRyYWN0aW9uLnBkZlxuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbVZpZXdQcm9qKG06IFJlYWRvbmx5TWF0NCwgb3V0OiBGcnVzdHVtID0gY3JlYXRlKCkpOiBGcnVzdHVtIHtcbiAgdW5jaGVja2VkKHBsYW5lLnNldChvdXRbMF0sIG1bM10gKyBtWzBdLCBtWzddICsgbVs0XSwgbVsxMV0gKyBtWzhdLCBtWzE1XSArIG1bMTJdKSk7IC8vIGxlZnRcbiAgdW5jaGVja2VkKHBsYW5lLnNldChvdXRbMV0sIG1bM10gLSBtWzBdLCBtWzddIC0gbVs0XSwgbVsxMV0gLSBtWzhdLCBtWzE1XSAtIG1bMTJdKSk7IC8vIHJpZ2h0XG5cbiAgdW5jaGVja2VkKHBsYW5lLnNldChvdXRbMl0sIG1bM10gKyBtWzFdLCBtWzddICsgbVs1XSwgbVsxMV0gKyBtWzldLCBtWzE1XSArIG1bMTNdKSk7IC8vIGJvdHRvbVxuICB1bmNoZWNrZWQocGxhbmUuc2V0KG91dFszXSwgbVszXSAtIG1bMV0sIG1bN10gLSBtWzVdLCBtWzExXSAtIG1bOV0sIG1bMTVdIC0gbVsxM10pKTsgLy8gdG9wXG5cbiAgdW5jaGVja2VkKHBsYW5lLnNldChvdXRbNF0sIG1bM10gKyBtWzJdLCBtWzddICsgbVs2XSwgbVsxMV0gKyBtWzEwXSwgbVsxNV0gKyBtWzE0XSkpOyAvLyBuZWFyXG4gIHVuY2hlY2tlZChwbGFuZS5zZXQob3V0WzVdLCBtWzNdIC0gbVsyXSwgbVs3XSAtIG1bNl0sIG1bMTFdIC0gbVsxMF0sIG1bMTVdIC0gbVsxNF0pKTsgLy8gZmFyXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBGUlVTVFVNX1BMQU5FUzsgKytpKSB7ICAvLyBub3JtYWxpemUgYWxsIHBsYW5lc1xuICAgIHBsYW5lLm5vcm0ob3V0W2ldLCBvdXRbaV0pO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gcG9pbnQgLyBzcGhlcmUgZGVmaW5lZCBieSBjZW50ZXIgYW5kIHJhZGl1cyBpbnRlcnNlY3RzIHdpdGggZ2l2ZW4ge0BsaW5rIFJlYWRvbmx5RnJ1c3R1bX0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb250YWluc1BvaW50KGY6IFJlYWRvbmx5RnJ1c3R1bSwgY2VudGVyOiBSZWFkb25seVZlYzMsIHJhZGl1czogRmxvYXQgPSAwKTogYm9vbGVhbiB7XG4gIC8vIENoZWNrIHRoZSBkaXN0YW5jZSBvZiB0aGUgY2VudGVyIHRvIHRoZSBwbGFuZXNcbiAgLy8gUG9pbnQgaXMgb3V0c2lkZSBmcnVzdHVtIGlmIGl0IGZhbGxzIGludG8gdGhlIG5lZ2F0aXZlIGhhbGYtc3BhY2Ugb2YgYW55IHBsYW5lXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgRlJVU1RVTV9QTEFORVM7ICsraSkge1xuICAgIGlmIChwbGFuZS5kaXN0KGZbaV0sIGNlbnRlcikgPCAtcmFkaXVzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiB7QGxpbmsgQUFCQn0gaW50ZXJzZWN0cyB3aXRoIGdpdmVuIHtAbGluayBSZWFkb25seUZydXN0dW19LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnNBQUJCKGY6IFJlYWRvbmx5RnJ1c3R1bSwgYm94OiBSZWFkb25seUFBQkIpOiBib29sZWFuIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBGUlVTVFVNX1BMQU5FUzsgKytpKSB7XG4gICAgLy8gRmluZCB0aGUgY29ybmVyIGF0IG1heCBkaXN0YW5jZVxuICAgIHVuY2hlY2tlZCh2MFswXSA9IChmW2ldWzBdID4gMCkgPyBib3gubWF4WzBdIDogYm94Lm1pblswXSk7XG4gICAgdW5jaGVja2VkKHYwWzFdID0gKGZbaV1bMV0gPiAwKSA/IGJveC5tYXhbMV0gOiBib3gubWluWzFdKTtcbiAgICB1bmNoZWNrZWQodjBbMl0gPSAoZltpXVsyXSA+IDApID8gYm94Lm1heFsyXSA6IGJveC5taW5bMl0pO1xuICAgIGlmIChwbGFuZS5kaXN0KGZbaV0sIHYwKSA8IDApIHsgLy8gbWF4IHBvaW50IGlzIHN0aWxsIG91dHNpZGUgdGhlIHBsYW5lXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuIl0sIm1hcHBpbmdzIjoiTUFHTyxHQUFLLENBQUFBLElBQUksdUJBQ1QsR0FBSyxDQUFBQyxLQUFLLGtCQUVqQixLQUFNLENBQUFDLGNBQWMsQ0FBRyxDQUFDLENBR3hCLEtBQU0sQ0FBQUMsRUFBUSxDQUFHSCxJQUFJLENBQUNJLE1BQU0sQ0FBQyxDQUFDLENBSzlCLE1BQU8sU0FBUyxDQUFBQSxNQUFNQSxDQUNwQkMsSUFBVyxDQUFHSixLQUFLLENBQUNHLE1BQU0sQ0FBQyxDQUFDLENBQUVFLEtBQVksQ0FBR0wsS0FBSyxDQUFDRyxNQUFNLENBQUMsQ0FBQyxDQUMzREcsTUFBYSxDQUFHTixLQUFLLENBQUNHLE1BQU0sQ0FBQyxDQUFDLENBQUVJLEdBQVUsQ0FBR1AsS0FBSyxDQUFDRyxNQUFNLENBQUMsQ0FBQyxDQUMzREssSUFBVyxDQUFHUixLQUFLLENBQUNHLE1BQU0sQ0FBQyxDQUFDLENBQUVNLEdBQVUsQ0FBR1QsS0FBSyxDQUFDRyxNQUFNLENBQUMsQ0FBQyxDQUNoRCxDQUNULE1BQU8sQ0FBQ0MsSUFBSSxDQUFFQyxLQUFLLENBQUVDLE1BQU0sQ0FBRUMsR0FBRyxDQUFFQyxJQUFJLENBQUVDLEdBQUcsQ0FDN0MsQ0FLQyxNQUFPLFNBQVMsQ0FBQUMsSUFBSUEsQ0FBQ0MsQ0FBa0IsQ0FBRUMsR0FBWSxDQUFHVCxNQUFNLENBQUMsQ0FBQyxDQUFXLENBQzFFLElBQUssR0FBSSxDQUFBVSxDQUFDLENBQUcsQ0FBQyxDQUFFQSxDQUFDLENBQUdaLGNBQWMsQ0FBRSxFQUFFWSxDQUFDLENBQUUsQ0FDdkNiLEtBQUssQ0FBQ1UsSUFBSSxDQUFDQyxDQUFDLENBQUNFLENBQUMsQ0FBQyxDQUFFRCxHQUFHLENBQUNDLENBQUMsQ0FBQyxDQUN6QixDQUNBLE1BQU8sQ0FBQUQsR0FDVCxDQU1BLE1BQU8sU0FBUyxDQUFBRSxZQUFZQSxDQUFDQyxDQUFlLENBQUVILEdBQVksQ0FBR1QsTUFBTSxDQUFDLENBQUMsQ0FBVyxDQUNwRUgsS0FBSyxDQUFDZ0IsR0FBRyxDQUFDSixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUVHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3hFZixLQUFLLENBQUNnQixHQUFHLENBQUNKLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUVBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFHQSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FFeEVmLEtBQUssQ0FBQ2dCLEdBQUcsQ0FBQ0osR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFFRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUdBLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUN4RWYsS0FBSyxDQUFDZ0IsR0FBRyxDQUFDSixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUVHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUdBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBRXhFZixLQUFLLENBQUNnQixHQUFHLENBQUNKLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBRUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUVBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBR0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUdBLENBQUMs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