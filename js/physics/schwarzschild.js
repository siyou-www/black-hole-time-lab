
/**
 * Gravitational time dilation for a static observer
 * outside a Schwarzschild black hole.
 *
 * @param {number} distance - Radius in Schwarzschild radii (r / Rs)
 * @returns {number} Time dilation factor
 */

export function calculateTimeDilation(distance) {
    if (!Number.isFinite(distance) || distance <= 1) {
        throw new RangeError(
            "Distance must be greater than 1 Schwarzschild radius."
        );
    }

    return Math.sqrt(1 - 1 / distance);
}

/**
 * Convert elapsed time far away to local elapsed time.
 *
 * @param {number} farTime - Elapsed time in seconds
 * @param {number} distance - Radius in Schwarzschild radii
 * @returns {number} Local elapsed time in seconds
 */

export function calculateNearTime(farTime, distance) {
    return farTime * calculateTimeDilation(distance);
}

/**
 * Physical constants (SI units)
 */
export const G = 6.67430e-11;
export const C = 299792458;

/**
 * Calculate Schwarzschild radius.
 *
 * @param {number} mass - Mass in kilograms
 * @returns {number} Schwarzschild radius in meters
 */
export function calculateSchwarzschildRadius(mass) {
    if (!Number.isFinite(mass) || mass <= 0) {
        throw new RangeError("Mass must be positive.");
    }

    return (2 * G * mass) / (C ** 2);
}

/**
 * Calculate gravitational time dilation at radius r.
 *
 * Assumes a static observer outside a
 * Schwarzschild spacetime.
 *
 * @param {number} mass - Mass in kilograms
 * @param {number} radius - Radial coordinate in meters
 * @returns {number} Time dilation factor
 */
export function calculateTimeDilationAtRadius(mass, radius) {
    const rs = calculateSchwarzschildRadius(mass);

    if (!Number.isFinite(radius) || radius <= rs) {
        throw new RangeError(
            "Radius must be greater than Schwarzschild radius."
        );
    }

    return Math.sqrt(1 - rs / radius);
}
