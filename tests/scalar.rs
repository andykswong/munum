//! Integration tests for the public `munum::scalar` module.
//!
//! Only the crate's public API is exercised: the free functions
//! `neg`, `sign`, `max`, `copysign`, `lerp` from `munum::scalar`, plus the
//! `munum::assert_float_eq!` macro for the single inexact float case.
//!
//! Expected values are computed by hand from the definitions in
//! `src/scalar.rs`:
//!   neg::<T>()        = T::zero() - T::one()            = -1
//!   sign(a)           = -1 if a<0, 0 if a==0, else 1
//!   max(a, b)         = b if a<b else a
//!   copysign(a, b)    = sign(b) * |a|   (|a| via a*neg() when a<0)
//!   lerp(a, b, t)     = a - a*t + b*t

use munum::assert_float_eq;
use munum::scalar::{copysign, lerp, max, neg, sign};

// region: neg

#[test]
fn neg_i32_is_minus_one() {
    // neg = zero - one = 0 - 1 = -1
    assert_eq!(neg::<i32>(), -1);
}

#[test]
fn neg_float_is_minus_one() {
    // 0.0 - 1.0 = -1.0, bit-exact for f32 and f64.
    assert_eq!(neg::<f32>(), -1.0_f32);
    assert_eq!(neg::<f64>(), -1.0_f64);
}

// endregion: neg

// region: sign

#[test]
fn sign_i32_neg_zero_pos() {
    // -100 < 0 => -1 ; 0 == 0 => 0 ; 7 > 0 => 1
    assert_eq!(sign(-100_i32), -1);
    assert_eq!(sign(0_i32), 0);
    assert_eq!(sign(7_i32), 1);
    // i32::MIN is < 0 (no overflow: sign only returns -1/0/1)
    assert_eq!(sign(i32::MIN), -1);
}

#[test]
fn sign_f32_neg_zero_pos_and_signed_zero() {
    // -2.5 < 0 => -1 ; 3.7 > 0 => 1
    assert_eq!(sign(-2.5_f32), -1.0);
    assert_eq!(sign(3.7_f32), 1.0);
    // +0.0 : not < 0, == 0 => 0.0
    assert_eq!(sign(0.0_f32), 0.0);
    // -0.0 : (-0.0 < 0.0) is false, (-0.0 == 0.0) is true => 0.0
    assert_eq!(sign(-0.0_f32), 0.0);
}

#[test]
fn sign_f64_infinities_and_nan() {
    // +inf : not < 0, not == 0 => else branch => 1.0
    assert_eq!(sign(f64::INFINITY), 1.0);
    // -inf : -inf < 0 is true => neg() => -1.0
    assert_eq!(sign(f64::NEG_INFINITY), -1.0);
    // NaN : (NaN < 0) false, (NaN == 0) false => else branch => 1.0
    assert_eq!(sign(f64::NAN), 1.0);
}

// endregion: sign

// region: max

#[test]
fn max_i32_various() {
    assert_eq!(max(-2_i32, 0), 0); // -2 < 0 => b = 0
    assert_eq!(max(5_i32, 3), 5); // 5 < 3 false => a = 5
    assert_eq!(max(5_i32, 5), 5); // 5 < 5 false => a = 5 (ties return a)
    assert_eq!(max(-3_i32, -7), -3); // -3 < -7 false => a = -3
}

#[test]
fn max_float_various() {
    assert_eq!(max(3.2_f32, 4.5), 4.5); // 3.2 < 4.5 => 4.5
    assert_eq!(max(1.5_f32, 1.5), 1.5); // tie => a = 1.5
    assert_eq!(max(-2.0_f64, -8.0), -2.0); // -2 < -8 false => -2
}

#[test]
fn max_nan_behavior() {
    // max(1.0, NaN): 1.0 < NaN is false => returns a = 1.0
    assert_eq!(max(1.0_f32, f32::NAN), 1.0);
    // max(NaN, 1.0): NaN < 1.0 is false => returns a = NaN
    assert!(max(f32::NAN, 1.0_f32).is_nan());
}

// endregion: max

// region: copysign

#[test]
fn copysign_i32_all_sign_combos() {
    // sign(b) * |a|
    assert_eq!(copysign(3_i32, 4), 3); //  1 * 3 = 3   (a>0, b>0)
    assert_eq!(copysign(4_i32, -5), -4); // -1 * 4 = -4  (a>0, b<0)
    assert_eq!(copysign(-3_i32, 4), 3); //  1 * 3 = 3   (a<0, b>0)
    assert_eq!(copysign(-4_i32, -5), -4); // -1 * 4 = -4  (a<0, b<0)
}

#[test]
fn copysign_i32_zero_operands() {
    // b == 0 => sign(b) = 0 => result 0 regardless of a
    assert_eq!(copysign(-2_i32, 0), 0);
    assert_eq!(copysign(9_i32, 0), 0);
    // a == 0 => |a| = 0 => result 0 regardless of sign(b)
    assert_eq!(copysign(0_i32, 4), 0); //  1 * 0 = 0
    assert_eq!(copysign(0_i32, -4), 0); // -1 * 0 = 0
}

#[test]
fn copysign_float_all_sign_combos() {
    assert_eq!(copysign(3.0_f32, 4.0), 3.0); //  1 * 3 = 3
    assert_eq!(copysign(4.0_f32, -5.0), -4.0); // -1 * 4 = -4
    assert_eq!(copysign(-3.0_f32, 4.0), 3.0); //  1 * 3 = 3
    assert_eq!(copysign(-4.0_f32, -5.0), -4.0); // -1 * 4 = -4
    // f64 variety
    assert_eq!(copysign(-2.5_f64, 10.0), 2.5); //  1 * 2.5 = 2.5
    assert_eq!(copysign(2.5_f64, -10.0), -2.5); // -1 * 2.5 = -2.5
}

#[test]
fn copysign_float_signed_zero() {
    // copysign(+0.0, +4.0): sign(4)=+1, |0|=+0 => +1 * +0.0 = +0.0
    let pos = copysign(0.0_f32, 4.0);
    assert_eq!(pos, 0.0);
    assert!(pos.is_sign_positive());

    // copysign(+0.0, -4.0): sign(-4)=-1, |0|=+0 => -1 * +0.0 = -0.0
    let negz = copysign(0.0_f32, -4.0);
    assert_eq!(negz, 0.0); // -0.0 == 0.0 compares equal
    assert!(negz.is_sign_negative());

    // b == -0.0: sign(-0.0) == 0 (not < 0, == 0), so result is +0.0,
    // NOT -3.0 (this differs from IEEE/std copysign which copies the bit).
    let from_neg_zero_b = copysign(3.0_f32, -0.0);
    assert_eq!(from_neg_zero_b, 0.0);
    assert!(from_neg_zero_b.is_sign_positive());
}

// endregion: copysign

// region: lerp

#[test]
fn lerp_i32_boundaries_and_extrapolation() {
    // lerp(a,b,t) = a - a*t + b*t, exact integer arithmetic
    assert_eq!(lerp(3_i32, 7, 0), 3); // 3 - 0 + 0   = 3  (== a)
    assert_eq!(lerp(3_i32, 7, 1), 7); // 3 - 3 + 7   = 7  (== b)
    assert_eq!(lerp(3_i32, 7, 2), 11); // 3 - 6 + 14  = 11 (extrapolate)
    assert_eq!(lerp(3_i32, 7, -1), -1); // 3 + 3 - 7   = -1 (extrapolate)
}

#[test]
fn lerp_f32_boundaries() {
    // t=0 => a, t=1 => b, t=0.5 => midpoint. All bit-exact (halves).
    assert_eq!(lerp(3.0_f32, 5.0, 0.0), 3.0); // 3 - 0 + 0     = 3
    assert_eq!(lerp(3.0_f32, 5.0, 1.0), 5.0); // 3 - 3 + 5     = 5
    assert_eq!(lerp(3.0_f32, 5.0, 0.5), 4.0); // 3 - 1.5 + 2.5 = 4
}

#[test]
fn lerp_f32_extrapolation() {
    // t outside [0,1]; still exact for these operands.
    assert_eq!(lerp(3.0_f32, 5.0, 2.0), 7.0); // 3 - 6 + 10  = 7
    assert_eq!(lerp(3.0_f32, 5.0, -1.0), 1.0); // 3 + 3 - 5   = 1
}

#[test]
fn lerp_f64_exact_quarter() {
    // t=0.25 exactly representable => bit-exact result.
    // 2 - 2*0.25 + 4*0.25 = 2 - 0.5 + 1.0 = 2.5
    assert_eq!(lerp(2.0_f64, 4.0, 0.25), 2.5);
}

#[test]
fn lerp_f64_inexact_uses_float_eq() {
    // t=0.1 is NOT exactly representable, so use assert_float_eq.
    // 1 - 1*0.1 + 2*0.1 = 1 - 0.1 + 0.2 = 1.1
    assert_float_eq!(lerp(1.0_f64, 2.0, 0.1), 1.1, 1e-6);
}

// endregion: lerp
