use crate::Matrix;
use num::traits::NumAssign;

/// Trait for loading a value from a pointer.
pub trait Load<T> {
    /// Loads the value from the pointer.
    fn load(&self) -> T;
}

impl<T: Copy + NumAssign, const R: usize, const C: usize> Load<Matrix<T, R, C>>
    for *const Matrix<T, R, C>
{
    #[inline]
    fn load(&self) -> Matrix<T, R, C> {
        if let Some(&m) = unsafe { self.as_ref() } {
            m
        } else {
            Matrix::<T, R, C>::default()
        }
    }
}
