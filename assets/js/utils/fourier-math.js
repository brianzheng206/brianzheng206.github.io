/**
 * Fourier Math Utilities
 * DFT computation, point resampling, and geometric algorithms
 */

/**
 * Compute Discrete Fourier Transform (DFT) for complex input
 * @param {Array<{re: number, im: number}>} input - Complex numbers as {re, im}
 * @returns {Array<{freq: number, re: number, im: number, amp: number, phase: number}>} DFT coefficients
 */
function dft(input) {
    const N = input.length;
    const TWO_PI = 2 * Math.PI;
    const out = [];
    
    for (let k = 0; k < N; k++) {
        let sumRe = 0, sumIm = 0;
        for (let n = 0; n < N; n++) {
            const phi = -TWO_PI * k * n / N;
            const cos = Math.cos(phi), sin = Math.sin(phi);
            sumRe += input[n].re * cos - input[n].im * sin;
            sumIm += input[n].re * sin + input[n].im * cos;
        }
        sumRe /= N;
        sumIm /= N;
        const amp = Math.hypot(sumRe, sumIm);
        const phase = Math.atan2(sumIm, sumRe);
        out.push({ freq: k, re: sumRe, im: sumIm, amp, phase });
    }
    
    // Convert to relative frequencies centered around 0
    const mid = Math.floor(N / 2);
    const reordered = [];
    
    // Add DC component first (if needed, but we'll filter it out)
    if (out[0]) {
        reordered.push({ ...out[0], freq: 0 });
    }
    
    // Add positive and negative frequencies in pairs
    for (let k = 1; k <= mid; k++) {
        // Positive frequency
        reordered.push({ ...out[k], freq: k });
        // Negative frequency (wraps around)
        const negK = N - k;
        if (negK < N) {
            reordered.push({ ...out[negK], freq: -k });
        }
    }
    
    return reordered;
}

/**
 * Resample points evenly along a path
 * @param {Array<{x: number, y: number}>} pts - Input points
 * @param {number} N - Target number of points
 * @returns {Array<{x: number, y: number}>} Resampled points centered at origin
 */
function resamplePoints(pts, N) {
    if (pts.length < 2) return pts;
    
    // Compute cumulative length
    const dists = [0];
    let L = 0;
    for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i - 1].x;
        const dy = pts[i].y - pts[i - 1].y;
        L += Math.hypot(dx, dy);
        dists.push(L);
    }
    
    // Close loop
    const dx0 = pts[0].x - pts[pts.length - 1].x;
    const dy0 = pts[0].y - pts[pts.length - 1].y;
    L += Math.hypot(dx0, dy0);
    
    const step = L / N;
    const out = [];
    let target = 0;
    let i = 0;
    
    const lerp = (a, b, t) => a + (b - a) * t;
    
    while (out.length < N) {
        target += step;
        let tt = target % L;
        
        while (i < dists.length - 1 && dists[i + 1] < tt) i++;
        
        const a = pts[i];
        const b = (i + 1 < pts.length) ? pts[i + 1] : pts[0];
        const segLen = ((i + 1 < dists.length) ? dists[i + 1] : L) - dists[i] || 1;
        const t = (tt - dists[i]) / segLen;
        
        out.push({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
    }
    
    // Center to (0,0)
    const cx = out.reduce((s, p) => s + p.x, 0) / out.length;
    const cy = out.reduce((s, p) => s + p.y, 0) / out.length;
    return out.map(p => ({ x: p.x - cx, y: p.y - cy }));
}

/**
 * Compute convex hull using Graham scan algorithm
 * @param {Array<{x: number, y: number}>} points - Input points
 * @returns {Array<{x: number, y: number}>} Convex hull points
 */
function convexHull(points) {
    if (points.length < 3) return [...points]; // Return copy
    
    // Make a copy to avoid mutating the input
    const pts = points.map(p => ({ x: p.x, y: p.y }));
    
    // Find bottom-most point (or leftmost in case of tie)
    let bottom = 0;
    for (let i = 1; i < pts.length; i++) {
        if (pts[i].y < pts[bottom].y || 
            (pts[i].y === pts[bottom].y && pts[i].x < pts[bottom].x)) {
            bottom = i;
        }
    }
    
    // Swap bottom point to first position
    [pts[0], pts[bottom]] = [pts[bottom], pts[0]];
    
    // Sort points by polar angle with respect to bottom point
    const bottomPoint = pts[0];
    pts.sort((a, b) => {
        const angleA = Math.atan2(a.y - bottomPoint.y, a.x - bottomPoint.x);
        const angleB = Math.atan2(b.y - bottomPoint.y, b.x - bottomPoint.x);
        if (angleA !== angleB) return angleA - angleB;
        // If same angle, use distance
        const distA = Math.hypot(a.x - bottomPoint.x, a.y - bottomPoint.y);
        const distB = Math.hypot(b.x - bottomPoint.x, b.y - bottomPoint.y);
        return distA - distB;
    });
    
    // Build hull
    const hull = [pts[0], pts[1]];
    
    for (let i = 2; i < pts.length; i++) {
        while (hull.length > 1) {
            const p1 = hull[hull.length - 2];
            const p2 = hull[hull.length - 1];
            const p3 = pts[i];
            
            // Check if p3 is to the left of line p1->p2
            const cross = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
            if (cross <= 0) {
                hull.pop();
            } else {
                break;
            }
        }
        hull.push(pts[i]);
    }
    
    return hull;
}

/**
 * Calculate signed area of polygon (positive = CCW)
 * @param {Array<{x: number, y: number}>} poly - Polygon points
 * @returns {number} Signed area
 */
function signedArea(poly) {
    let a = 0;
    for (let i = 0; i < poly.length - 1; i++) {
        a += poly[i].x * poly[i + 1].y - poly[i + 1].x * poly[i].y;
    }
    return a / 2;
}

// Expose functions globally for use in other modules
if (typeof window !== 'undefined') {
    window.dft = dft;
    window.resamplePoints = resamplePoints;
    window.convexHull = convexHull;
    window.signedArea = signedArea;
}

