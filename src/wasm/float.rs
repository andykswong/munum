use super::jsmath;
use crate::FloatOps;

impl FloatOps for f64 {
    #[inline]
    fn acos(self) -> f64 {
        jsmath::acos(self)
    }

    #[inline]
    fn cos(self) -> f64 {
        jsmath::cos(self)
    }

    #[inline]
    fn sin(self) -> f64 {
        jsmath::sin(self)
    }

    #[inline]
    fn sqrt(self) -> f64 {
        jsmath::sqrt(self)
    }

    #[inline]
    fn tan(self) -> f64 {
        jsmath::tan(self)
    }
}

impl FloatOps for f32 {
    #[inline]
    fn acos(self) -> f32 {
        jsmath::acos(self.into()) as f32
    }

    #[inline]
    fn cos(self) -> f32 {
        jsmath::cos(self.into()) as f32
    }

    #[inline]
    fn sin(self) -> f32 {
        jsmath::sin(self.into()) as f32
    }

    #[inline]
    fn sqrt(self) -> f32 {
        jsmath::sqrt(self.into()) as f32
    }

    #[inline]
    fn tan(self) -> f32 {
        jsmath::tan(self.into()) as f32
    }
}
