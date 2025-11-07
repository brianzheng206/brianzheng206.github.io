/**
 * 3D Utility Functions
 * Shared 3D rotation and projection utilities
 */

/**
 * Rotate a 3D point around X, Y, and Z axes
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @param {number} A - Rotation around X axis (radians)
 * @param {number} B - Rotation around Y axis (radians)
 * @param {number} C - Rotation around Z axis (radians)
 * @returns {{x: number, y: number, z: number}} Rotated point
 */
function rotate3D(x, y, z, A, B, C) {
    // Rotate around X axis
    let x1 = x;
    let y1 = y * Math.cos(A) - z * Math.sin(A);
    let z1 = y * Math.sin(A) + z * Math.cos(A);
    
    // Rotate around Y axis
    let x2 = x1 * Math.cos(B) + z1 * Math.sin(B);
    let y2 = y1;
    let z2 = -x1 * Math.sin(B) + z1 * Math.cos(B);
    
    // Rotate around Z axis
    let x3 = x2 * Math.cos(C) - y2 * Math.sin(C);
    let y3 = x2 * Math.sin(C) + y2 * Math.cos(C);
    let z3 = z2;
    
    return { x: x3, y: y3, z: z3 };
}

/**
 * Project a 3D point to 2D using perspective projection
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @param {number} distance - Distance from camera
 * @param {number} fov - Field of view factor
 * @param {number} scale - Scale factor
 * @returns {{x: number, y: number, z: number}} Projected point
 */
function project3D(x, y, z, distance = 60, fov = null, scale = 1.0) {
    if (fov === null) fov = distance;
    const px = (x * fov) / (z + distance) * scale;
    const py = (y * fov) / (z + distance) * scale;
    return { x: px, y: py, z: z };
}

// Expose functions globally for use in other modules
if (typeof window !== 'undefined') {
    window.rotate3D = rotate3D;
    window.project3D = project3D;
}

