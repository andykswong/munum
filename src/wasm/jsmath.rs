use crate::FloatOps;

#[link(wasm_import_module = "jsmath")]
extern "C" {
    pub fn acos(x: f64) -> f64;
    pub fn cos(x: f64) -> f64;
    pub fn sin(x: f64) -> f64;
    pub fn sqrt(x: f64) -> f64;
    pub fn tan(x: f64) -> f64;
}

impl FloatOps for f64 {
    #[inline]
    fn acos(self) -> f64 {
        unsafe { acos(self) }
    }

    #[inline]
    fn cos(self) -> f64 {
        unsafe { cos(self) }
    }

    #[inline]
    fn sin(self) -> f64 {
        unsafe { sin(self) }
    }

    #[inline]
    fn sqrt(self) -> f64 {
        unsafe { sqrt(self) }
    }

    #[inline]
    fn tan(self) -> f64 {
        unsafe { tan(self) }
    }
}

impl FloatOps for f32 {
    #[inline]
    fn acos(self) -> f32 {
        unsafe { acos(self.into()) as f32 }
    }

    #[inline]
    fn cos(self) -> f32 {
        unsafe { cos(self.into()) as f32 }
    }

    #[inline]
    fn sin(self) -> f32 {
        unsafe { sin(self.into()) as f32 }
    }

    #[inline]
    fn sqrt(self) -> f32 {
        unsafe { sqrt(self.into()) as f32 }
    }

    #[inline]
    fn tan(self) -> f32 {
        unsafe { tan(self.into()) as f32 }
    }
}
