#[link(wasm_import_module = "jsmath")]
extern "C" {
    fn acos(x: f64) -> f64;
    fn cos(x: f64) -> f64;
    fn sin(x: f64) -> f64;
    fn sqrt(x: f64) -> f64;
    fn tan(x: f64) -> f64;
}
