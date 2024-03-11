//! Float type helpers.

use crate::{Matrix, Quaternion};
use num::{traits::{float::FloatCore, NumAssign, NumCast}, Zero};

/// Standard tolerance epsilon
pub const EPSILON: f32 = 128. * f32::EPSILON;

/// Returns a standard tolerance epsilon
pub fn epsilon<T: NumCast + Zero>() -> T {
    NumCast::from(EPSILON).unwrap_or(T::zero())
}

/// Trait for float operations
pub trait FloatOps: Copy {
    /// Returns arc cosine of self.
    fn acos(self) -> Self;

    /// Returns cosine of self.
    fn cos(self) -> Self;

    /// Returns sine of self.
    fn sin(self) -> Self;

    /// Returns square root of self.
    fn sqrt(self) -> Self;

    /// Returns tangent of self.
    fn tan(self) -> Self;
}

#[cfg(all(any(feature = "std", feature = "libm"), not(feature = "jsmath")))]
impl<T: num::traits::Float> FloatOps for T {
    #[inline]
    fn acos(self) -> T {
        T::acos(self)
    }

    #[inline]
    fn cos(self) -> T {
        T::cos(self)
    }

    #[inline]
    fn sin(self) -> T {
        T::sin(self)
    }

    #[inline]
    fn sqrt(self) -> T {
        T::sqrt(self)
    }

    #[inline]
    fn tan(self) -> T {
        T::tan(self)
    }
}

/// Trait for checking if 2 floats or float arrays are equal within an epsilon.
pub trait FloatEq<T: Copy> {
    /// Checks if self equals to RHS within an epsilon.
    /// # Examples
    /// ```
    /// # use munum::FloatEq;
    /// assert!(1_f32.float_eq(1.000001, 0.0001));
    /// assert!(!1_f32.float_eq(1.1, 0.0001));
    /// ```
    fn float_eq(&self, rhs: Self, epsilon: T) -> bool;
}

impl FloatEq<f32> for f32 {
    fn float_eq(&self, rhs: Self, epsilon: f32) -> bool {
        FloatCore::abs(*self - rhs) < epsilon
    }
}

impl FloatEq<f64> for f64 {
    fn float_eq(&self, rhs: Self, epsilon: f64) -> bool {
        FloatCore::abs(*self - rhs) < epsilon
    }
}

impl<T: Copy, V: Copy + FloatEq<T>> FloatEq<T> for &[V] {
    fn float_eq(&self, rhs: Self, epsilon: T) -> bool {
        if self.len() != rhs.len() {
            return false;
        }

        for i in 0..self.len() {
            if !self[i].float_eq(rhs[i], epsilon) {
                return false;
            }
        }

        true
    }
}

impl<T: Copy + FloatEq<T> + NumAssign, const R: usize, const C: usize> FloatEq<T>
    for Matrix<T, R, C>
{
    #[inline]
    fn float_eq(&self, rhs: Self, epsilon: T) -> bool {
        self.as_ref().float_eq(rhs.as_ref(), epsilon)
    }
}

impl<T: Copy + FloatEq<T> + NumAssign> FloatEq<T> for Quaternion<T> {
    #[inline]
    fn float_eq(&self, rhs: Self, epsilon: T) -> bool {
        self.as_ref().float_eq(rhs.as_ref(), epsilon)
    }
}

/// Asserts two floats or float arrays are equal within an epsilon.
/// # Examples
/// ```
/// # use munum::assert_float_eq;
/// assert_float_eq!(1.0, 1.000001, 0.0001);
/// ```
#[macro_export]
macro_rules! assert_float_eq {
    ($left:expr, $right:expr) => {
        assert_float_eq!(($left), ($right), $crate::float::epsilon())
    };

    ($left:expr, $right:expr, $epsilon:expr) => {
        match (&($left), &($right), ($epsilon)) {
            (left_val, right_val, epsilon_val) => {
                if !$crate::FloatEq::float_eq(left_val, *right_val, epsilon_val) {
                    panic!(
                        "assertion failed: `left.float_eq(right, epsilon)` \
                                (left: `{:?}`, right: `{:?}`, epsilon: `{:?}`)",
                        *left_val, *right_val, epsilon_val
                    );
                }
            }
        }
    };
}
