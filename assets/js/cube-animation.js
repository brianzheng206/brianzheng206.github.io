/**
 * Fourier Epicycle Animation
 * Traces SVG paths or images using rotating circles (epicycles)
 * Demonstrates Fourier series decomposition
 */

class FourierImageAnimation {
    constructor(canvasId, { imageSrc = null, svgPath = null, terms = 80, samplePoints = 600, sizeScale = 1.5 } = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.colors = ['#6e5c54', '#584e49', '#4b3f3a'];
        this.bgColor = '#372c29';
        
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.time = 0;
        this.speed = 0.85 * Math.PI / samplePoints; // 1 full loop per ~samplePoints frames
        
        this.terms = terms;
        this.samplePoints = samplePoints;
        this.sizeScale = sizeScale;
        
        this.coeffs = null;
        this.trail = [];
        this.trails = [[], [], [], []]; // Multiple trails for multiple epicycles
        this.maxTrail = Math.floor(samplePoints * 0.8); // Longer trails (80% of original)
        this.circleScale = 1.5; // Base visual multiplier for circle sizes (for display only)
        this.maxAmplitude = 1; // Will be updated when DFT is calculated
        
        // Ripple effects for canvas clicks
        this.ripples = []; // Array of {x, y, radius, maxRadius, opacity, speed}
        
        // Cube rotation parameters
        this.cubeRotation = { A: 0, B: 0, C: 0 };
        this.cubeSize = 10; // Bigger cube
        this.baseRotation = { A: 0, B: 0, C: 0 }; // Canonical rotation
        
        // Curve transition parameters
        this.prevCoeffs = null;
        this.prevPath = null;
        this.transitionProgress = 1.0; // 0 = showing old, 1 = showing new
        this.transitionSpeed = 0.0001; // How fast to transition (much slower)
        this.curveChangeInterval = 5000; // Change curve every 5 seconds
        this.lastCurveChange = Date.now(); // When last transition completed (or animation started)
        this.transitionDuration = 3000; // 3 seconds for full transition (in ms)
        this.transitionStartTime = null; // Track when current transition started (null if no transition active)
        this.lastPathType = undefined; // Track last path type to ensure variety
        
        // Phase offsets for multiple epicycles (in radians, relative to full cycle)
        this.epicycleOffsets = [0, Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.75];
        this.epicycleScales = [1.0, 0.6, 0.7, 0.5]; // Size multipliers for smaller epicycles
        
        // Generate random parametric path and compute DFT once
        if (!svgPath && !imageSrc) {
            // Generate random parametric path
            this.parametricPath = this.generateRandomParametricPath();
            
            // Center the path around origin for the DFT
            const bx = this.parametricPath.reduce((s, p) => s + p.x, 0) / this.parametricPath.length;
            const by = this.parametricPath.reduce((s, p) => s + p.y, 0) / this.parametricPath.length;
            this.baseCentered = this.parametricPath.map(p => ({ x: p.x - bx, y: p.y - by }));
            
            // DFT once (stable coefficients)
            this.baseCoeffs = this.computeDFTForPoints(this.baseCentered);
            
            // Store max amplitude for epicycle scaling
            this.maxAmplitude = this.baseCoeffs.length > 0 ? Math.max(...this.baseCoeffs.map(c => c.amp)) : 1;
        }
        
        // Load data & start
        if (svgPath) {
            const pts = this.sampleSvgPath(svgPath, this.samplePoints);
            this.prepareDFT(pts);
            this.animate();
        } else if (imageSrc) {
            this.loadImageAndVectorize(imageSrc).then(pts => {
                this.prepareDFT(pts);
                this.animate();
            }).catch(err => {
                console.error('Error loading image:', err);
            });
        } else {
            // Start animation with transform-based approach
            this.animate();
        }
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.centerX = this.width / 2;
            this.centerY = this.height / 2;
        });
        
        // Setup canvas click ripples
        this.setupCanvasRipples();
    }
    
    setupCanvasRipples() {
        // Add click listener to canvas
        this.canvas.addEventListener('click', (e) => {
            // Get click position relative to canvas
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create ripple effect at click position
            this.createRipple(x, y);
        });
    }
    
    createRipple(x, y) {
        // Create multiple ripples in a wave pattern
        const maxRadius = Math.max(this.width, this.height) * 0.8; // Ripple expands to 80% of screen
        const speed = maxRadius / 120; // Slower: takes about 120 frames to complete
        const numRipples = 3; // Number of ripples in the wave
        const delayBetweenRipples = 15; // Frames between each ripple
        
        for (let i = 0; i < numRipples; i++) {
            this.ripples.push({
                x: x,
                y: y,
                radius: -delayBetweenRipples * i * speed, // Start with negative radius for delay
                maxRadius: maxRadius,
                opacity: 0.7,
                speed: speed,
                decay: 0.98 // Exponential decay factor
            });
        }
    }
    
    updateAndDrawRipples(ctx) {
        // Update and draw all active ripples
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const ripple = this.ripples[i];
            
            // Only update if ripple has started (radius >= 0)
            if (ripple.radius >= 0) {
                // Update ripple
                ripple.radius += ripple.speed;
                
                // Apply exponential decay to opacity
                ripple.opacity *= ripple.decay;
                
                // Calculate additional fade based on progress (for smoother fade-out)
                const progress = Math.min(1, ripple.radius / ripple.maxRadius);
                const progressFade = 1 - progress;
                
                // Combined opacity with decay and progress fade
                const finalOpacity = ripple.opacity * progressFade;
                
                // Draw ripple
                if (ripple.radius < ripple.maxRadius && finalOpacity > 0.01) {
                    ctx.strokeStyle = this.hexToRgba(this.colors[0], finalOpacity);
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Draw additional inner rings for more visual interest
                    if (ripple.radius > 30) {
                        const innerRadius = ripple.radius * 0.75;
                        ctx.strokeStyle = this.hexToRgba(this.colors[1], finalOpacity * 0.6);
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.arc(ripple.x, ripple.y, innerRadius, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        // Draw even smaller inner ring
                        if (ripple.radius > 60) {
                            const innerRadius2 = ripple.radius * 0.5;
                            ctx.strokeStyle = this.hexToRgba(this.colors[2], finalOpacity * 0.4);
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(ripple.x, ripple.y, innerRadius2, 0, Math.PI * 2);
                            ctx.stroke();
                        }
                    }
                } else {
                    // Remove completed ripples
                    this.ripples.splice(i, 1);
                }
            } else {
                // Ripple hasn't started yet, just increment radius
                ripple.radius += ripple.speed;
            }
        }
    }
    
    // Sample SVG path
    sampleSvgPath(pathStr, N) {
        const off = document.createElement('canvas');
        off.width = 512;
        off.height = 512;
        const c = off.getContext('2d');
        
        // Create path
        const p = new Path2D(pathStr);
        
        // Get bounding box
        const BB = this.pathBoundingBox(c, p, off.width, off.height);
        
        // Draw and trace
        c.clearRect(0, 0, off.width, off.height);
        c.fillStyle = '#000';
        c.translate(off.width/2, off.height/2);
        const scale = 0.8 * Math.min(off.width, off.height) / Math.max(BB.w, BB.h || 1);
        c.scale(scale, scale);
        c.translate(-(BB.x + BB.w/2), -(BB.y + BB.h/2));
        c.fill(p);
        
        const pts = this.traceLargestContour(off, 0.5);
        return this.resamplePoints(pts, N);
    }
    
    pathBoundingBox(ctx, path, w, h) {
        ctx.save();
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#000';
        ctx.fill(path);
        const img = ctx.getImageData(0, 0, w, h).data;
        
        let minX = w, minY = h, maxX = 0, maxY = 0, found = false;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const a = img[(y * w + x) * 4 + 3];
                if (a > 10) {
                    found = true;
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        ctx.restore();
        
        if (!found) return { x: 0, y: 0, w: 1, h: 1 };
        return { x: minX, y: minY, w: (maxX - minX + 1), h: (maxY - minY + 1) };
    }
    
    // Image vectorization
    async loadImageAndVectorize(src) {
        const img = await new Promise((resolve, reject) => {
            const im = new Image();
            im.crossOrigin = 'anonymous';
            im.onload = () => resolve(im);
            im.onerror = reject;
            im.src = src;
        });
        
        const off = document.createElement('canvas');
        off.width = Math.min(img.width, 900);
        off.height = Math.floor(off.width * (img.height / img.width));
        const c = off.getContext('2d');
        c.drawImage(img, 0, 0, off.width, off.height);
        
        const pts = this.traceLargestContour(off, 0.6);
        return this.resamplePoints(pts, this.samplePoints);
    }
    
    traceLargestContour(canvas, threshold = 0.5) {
        const w = canvas.width, h = canvas.height;
        const ctx = canvas.getContext('2d');
        const data = ctx.getImageData(0, 0, w, h);
        const A = data.data;
        const bin = new Uint8Array(w * h);
        
        // Binarize
        for (let i = 0; i < w * h; i++) {
            const r = A[i * 4], g = A[i * 4 + 1], b = A[i * 4 + 2], a = A[i * 4 + 3];
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const v = (a > 12 && lum < threshold) ? 1 : 0;
            bin[i] = v;
        }
        
        // Moore-Neighbor tracing
        const visited = new Uint8Array(w * h);
        const contours = [];
        const dirs = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
        
        const idx = (x, y) => y * w + x;
        const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
        
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const i = idx(x, y);
                if (bin[i] && !visited[i] && this.isBoundary(bin, w, h, x, y)) {
                    const contour = [];
                    let cx = x, cy = y;
                    let backDir = 0;
                    let loop = 0;
                    
                    do {
                        contour.push([cx, cy]);
                        visited[idx(cx, cy)] = 1;
                        
                        let found = false;
                        for (let k = 0; k < 8; k++) {
                            const d = (backDir + 6 + k) % 8;
                            const nx = cx + dirs[d][0], ny = cy + dirs[d][1];
                            if (inb(nx, ny) && bin[idx(nx, ny)]) {
                                backDir = d;
                                cx = nx; cy = ny;
                                found = true;
                                break;
                            }
                        }
                        if (!found) break;
                        loop++;
                        if (loop > w * h * 2) break;
                    } while (!(cx === x && cy === y && contour.length > 5));
                    
                    if (contour.length > 10) contours.push(contour);
                }
            }
        }
        
        // Pick longest
        let best = [];
        let bestLen = 0;
        for (const c of contours) {
            if (c.length > bestLen) {
                bestLen = c.length;
                best = c;
            }
        }
        
        return best.map(([px, py]) => ({ x: px, y: py }));
    }
    
    isBoundary(bin, w, h, x, y) {
        const i = y * w + x;
        if (!bin[i]) return false;
        return (
            (x > 0 && !bin[i - 1]) ||
            (x < w - 1 && !bin[i + 1]) ||
            (y > 0 && !bin[i - w]) ||
            (y < h - 1 && !bin[i + w])
        );
    }
    
    // Get cube vertices and project to 2D
    getCubeVertices() {
        const cubeSize = this.cubeSize;
        
        const vertices3D = [
            [-cubeSize, -cubeSize, -cubeSize],
            [cubeSize, -cubeSize, -cubeSize],
            [cubeSize, cubeSize, -cubeSize],
            [-cubeSize, cubeSize, -cubeSize],
            [-cubeSize, -cubeSize, cubeSize],
            [cubeSize, -cubeSize, cubeSize],
            [cubeSize, cubeSize, cubeSize],
            [-cubeSize, cubeSize, cubeSize]
        ];
        
        // Project vertices to 2D with proper perspective
        const distance = 400; // Distance from camera (increased for less distortion)
        const fov = 400; // Field of view factor
        
        const projected = vertices3D.map(v => {
            // Rotate in 3D space
            const x = this.calculateX(v[0], v[1], v[2], this.cubeRotation.A, this.cubeRotation.B, this.cubeRotation.C);
            const y = this.calculateY(v[0], v[1], v[2], this.cubeRotation.A, this.cubeRotation.B, this.cubeRotation.C);
            const z = this.calculateZ(v[0], v[1], v[2], this.cubeRotation.A, this.cubeRotation.B, this.cubeRotation.C);
            
            // Perspective projection (proper 3D to 2D)
            // Ensure z is always positive by adding distance
            const zPos = z + distance;
            // Use consistent perspective scaling
            const perspective = fov / zPos;
            
            return {
                x: this.centerX + x * perspective,
                y: this.centerY + y * perspective,
                z: zPos
            };
        });
        
        return projected;
    }
    
    // Helper: Calculate signed area of polygon (positive = CCW)
    signedArea(poly) {
        let a = 0;
        for (let i = 0; i < poly.length - 1; i++) {
            a += poly[i].x * poly[i + 1].y - poly[i + 1].x * poly[i].y;
        }
        return a / 2;
    }
    
    // Helper: Find index of point nearest to target
    nearestIndex(points, target) {
        let best = 0, bestD = Infinity;
        for (let i = 0; i < points.length; i++) {
            const dx = points[i].x - target.x;
            const dy = points[i].y - target.y;
            const d = dx * dx + dy * dy;
            if (d < bestD) {
                bestD = d;
                best = i;
            }
        }
        return best;
    }
    
    // Helper: Rotate array to start at given index
    rotateArray(arr, startIdx) {
        const n = arr.length;
        if (!n) return arr;
        const k = ((startIdx % n) + n) % n;
        return arr.slice(k).concat(arr.slice(0, k));
    }
    
    // Generate a random Lissajous curve
    generateRandomParametricPath() {
        const numPoints = this.samplePoints;
        const points = [];
        
        // Base size for the path
        const baseSize = Math.min(this.width, this.height) * 0.25;
        
        // Generate Lissajous curve with random parameters
        // Lissajous curves: x = A * cos(a*t + phase), y = B * sin(b*t)
        const a = 2 + Math.floor(Math.random() * 5); // Frequency ratio numerator (2-6)
        const b = 2 + Math.floor(Math.random() * 5); // Frequency ratio denominator (2-6)
        const phase = Math.random() * Math.PI * 2; // Phase offset
        const amplitudeX = baseSize * (0.6 + Math.random() * 0.4); // X amplitude
        const amplitudeY = baseSize * (0.6 + Math.random() * 0.4); // Y amplitude
        
        for (let i = 0; i < numPoints; i++) {
            const t = (i / numPoints) * Math.PI * 2;
            const x = amplitudeX * Math.cos(a * t + phase);
            const y = amplitudeY * Math.sin(b * t);
            points.push({ x: x + this.centerX, y: y + this.centerY });
        }
        
        return points;
    }
    
    // Generate a simple Fourier pattern for cursor following (circle/square-like)
    generateSimpleFourierPattern() {
        // Create a simple square-like pattern using Fourier series
        const numPoints = 200;
        const points = [];
        const size = 60; // Base size
        
        // Square pattern using Fourier series (approximation)
        // Using a square approximation with harmonics
        for (let i = 0; i < numPoints; i++) {
            const t = (i / numPoints) * Math.PI * 2;
            // Approximate square using Fourier series
            let x = 0, y = 0;
            
            // Square approximation: combine cos and sin terms
            // First few harmonics create a square-like shape
            for (let n = 1; n <= 7; n += 2) { // Odd harmonics only
                const amp = size / n;
                // Offset phases to create square shape
                x += amp * Math.cos(n * t);
                y += amp * Math.sin(n * t);
            }
            
            points.push({ x, y });
        }
        
        // Compute DFT for this simple pattern
        return this.computeDFTForPoints(points);
    }
    
    // Get the full outline of the cube for Fourier tracing
    getCubeOutline() {
        const projected = this.getCubeVertices();
        
        // Pick the vertex closest to the camera (smallest z)
        const closest = projected.reduce((a, p) => (p.z < a.z ? p : a), projected[0]);
        
        // Get the convex hull of all visible vertices to get the outline
        let hull = this.convexHull(projected.map(p => ({ x: p.x, y: p.y })));
        
        // Ensure closed loop
        if (hull.length > 0 && (hull[0].x !== hull[hull.length - 1].x || hull[0].y !== hull[hull.length - 1].y)) {
            hull.push({ x: hull[0].x, y: hull[0].y });
        }
        
        // Enforce CCW winding to avoid flips
        if (this.signedArea(hull) < 0) {
            hull.reverse();
        }
        
        // Rotate so we start at the hull point nearest to the chosen vertex
        const startIdx = this.nearestIndex(hull, { x: closest.x, y: closest.y });
        hull = this.rotateArray(hull, startIdx);
        
        // Resample the hull points evenly along the perimeter
        const resampledPoints = this.resampleOutline(hull, this.samplePoints);
        
        // Center the points for DFT
        const cx = resampledPoints.reduce((s, p) => s + p.x, 0) / resampledPoints.length;
        const cy = resampledPoints.reduce((s, p) => s + p.y, 0) / resampledPoints.length;
        return resampledPoints.map(p => ({ x: p.x - cx, y: p.y - cy }));
    }
    
    // Get cube outline in canvas coordinates (not centered)
    getCubeOutlineCanvas() {
        const projected = this.getCubeVertices();
        const closest = projected.reduce((a, p) => (p.z < a.z ? p : a), projected[0]);
        let hull = this.convexHull(projected.map(p => ({ x: p.x, y: p.y })));
        
        if (hull.length > 0 && (hull[0].x !== hull[hull.length - 1].x || hull[0].y !== hull[hull.length - 1].y)) {
            hull.push({ x: hull[0].x, y: hull[0].y });
        }
        
        if (this.signedArea(hull) < 0) {
            hull.reverse();
        }
        
        const startIdx = this.nearestIndex(hull, { x: closest.x, y: closest.y });
        hull = this.rotateArray(hull, startIdx);
        return this.resampleOutline(hull, this.samplePoints);
    }
    
    // Resample outline points evenly along the path
    resampleOutline(points, targetCount) {
        if (points.length < 2) return points;
        
        // Calculate cumulative distances along the path
        const distances = [0];
        let totalLength = 0;
        
        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i - 1].x;
            const dy = points[i].y - points[i - 1].y;
            const dist = Math.hypot(dx, dy);
            totalLength += dist;
            distances.push(totalLength);
        }
        
        if (totalLength === 0) return points; // Degenerate case
        
        // Sample evenly along the path
        const resampled = [];
        const step = totalLength / targetCount;
        
        for (let i = 0; i < targetCount; i++) {
            const targetDist = i * step;
            
            // Find the segment containing this distance
            let segIdx = 0;
            while (segIdx < distances.length - 1 && distances[segIdx + 1] < targetDist) {
                segIdx++;
            }
            
            if (segIdx >= points.length - 1) {
                // At or beyond the last point
                resampled.push({ x: points[points.length - 1].x, y: points[points.length - 1].y });
            } else {
                // Interpolate within the segment
                const segStart = distances[segIdx];
                const segEnd = distances[segIdx + 1];
                const segLength = segEnd - segStart;
                
                if (segLength === 0) {
                    resampled.push({ x: points[segIdx].x, y: points[segIdx].y });
                } else {
                    const t = (targetDist - segStart) / segLength;
                    const p1 = points[segIdx];
                    const p2 = points[segIdx + 1];
                    resampled.push({
                        x: p1.x + (p2.x - p1.x) * t,
                        y: p1.y + (p2.y - p1.y) * t
                    });
                }
            }
        }
        
        return resampled;
    }
    
    // Draw the rotating 3D cube
    drawCube() {
        const ctx = this.ctx;
        const projected = this.getCubeVertices();
        
        // Define cube edges
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Front face
            [4, 5], [5, 6], [6, 7], [7, 4], // Back face
            [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
        ];
        
        // Draw edges
        ctx.strokeStyle = this.colors[0];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        edges.forEach(([start, end]) => {
            const p1 = projected[start];
            const p2 = projected[end];
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        });
        
        // Draw vertices
        ctx.fillStyle = this.colors[1];
        ctx.globalAlpha = 0.8;
        projected.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
    }
    
    // 3D rotation using standard rotation matrices (preserves geometry)
    rotate3D(x, y, z, A, B, C) {
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
    
    // Legacy functions for compatibility
    calculateX(i, j, k, A, B, C) {
        const rotated = this.rotate3D(i, j, k, A, B, C);
        return rotated.x;
    }
    
    calculateY(i, j, k, A, B, C) {
        const rotated = this.rotate3D(i, j, k, A, B, C);
        return rotated.y;
    }
    
    calculateZ(i, j, k, A, B, C) {
        const rotated = this.rotate3D(i, j, k, A, B, C);
        return rotated.z;
    }
    
    // Convex hull algorithm (Graham scan)
    convexHull(points) {
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
    
    resamplePoints(pts, N) {
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
    
    // Compute DFT for points (without smoothing/windowing - for stable canonical coefficients)
    computeDFTForPoints(points) {
        // Scale to viewport (like prepareDFT but no smoothing/windowing, keep stable)
        const z = points.map(p => ({ re: p.x, im: p.y }));
        const maxR = Math.max(...z.map(p => Math.hypot(p.re, p.im))) || 1;
        const target = Math.min(this.width, this.height) * 0.45 * this.sizeScale;
        const s = target / maxR;
        for (const p of z) {
            p.re *= s;
            p.im *= s;
        }
        
        let coeffs = this.dft(z);
        coeffs = coeffs.filter(c => c.freq !== 0)
                       .sort((a, b) => b.amp - a.amp)
                       .slice(0, this.terms);
        return coeffs;
    }
    
    // DFT & animation (for SVG/image paths - keeps smoothing)
    prepareDFT(points) {
        const z = points.map(p => ({ re: p.x, im: p.y }));
        
        // Scale to fit viewport
        const maxR = Math.max(...z.map(p => Math.hypot(p.re, p.im))) || 1;
        const target = Math.min(this.width, this.height) * 0.45 * this.sizeScale;
        const s = target / maxR;
        
        for (const p of z) {
            p.re *= s;
            p.im *= s;
        }
        
        let coeffs = this.dft(z);
        
        // Drop DC, sort by amplitude, take top terms
        coeffs = coeffs.filter(c => c.freq !== 0)
                       .sort((a, b) => b.amp - a.amp)
                       .slice(0, this.terms);
        
        // Complex EMA per frequency (phase-aware smoothing)
        const merged = [];
        for (const c of coeffs) {
            const key = c.freq;
            const prev = this.prevCoeffByFreq.get(key);
            
            if (prev) {
                // Smooth real/imag directly
                const a = this.coeffSmoothing;
                const re = a * c.re + (1 - a) * prev.re;
                const im = a * c.im + (1 - a) * prev.im;
                const amp = Math.hypot(re, im);
                const phase = Math.atan2(im, re);
                merged.push({ freq: key, re, im, amp, phase });
                this.prevCoeffByFreq.set(key, { re, im });
            } else {
                merged.push(c);
                this.prevCoeffByFreq.set(key, { re: c.re, im: c.im });
            }
        }
        
        this.coeffs = merged;
        
        // Optional: gentle window to tame ringing on sharp corners
        this.coeffs.sort((a, b) => Math.abs(a.freq) - Math.abs(b.freq));
        const M = this.coeffs.length;
        if (M > 1) {
            for (let i = 0; i < M; i++) {
                const w = 0.85 + 0.15 * Math.cos(Math.PI * i / (M - 1)); // very gentle Hann window
                this.coeffs[i].re *= w;
                this.coeffs[i].im *= w;
                this.coeffs[i].amp *= w;
            }
        }
        
        // Store max amplitude for epicycle scaling
        this.maxAmplitude = this.coeffs.length > 0 ? Math.max(...this.coeffs.map(c => c.amp)) : 1;
    }
    
    dft(input) {
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
        // Keep DC (k=0) separate, map positive and negative frequencies
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
    
    // Helper function to convert hex color to rgba with alpha
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Compute best-fit similarity transform (scale + rotation + translation) from basePts to currPts
    bestSimilarityTransform(basePts, currPts) {
        const N = Math.min(basePts.length, currPts.length);
        if (N < 3) return { s: 1, R: [[1, 0], [0, 1]], t: { x: 0, y: 0 } };
        
        // Sample corresponding indices uniformly
        const idxs = [];
        for (let i = 0; i < 200; i++) idxs.push(Math.floor(i * (N - 1) / 199)); // 200 samples
        const B = idxs.map(i => basePts[i]);
        const C = idxs.map(i => currPts[i]);
        
        // Centroids
        const cb = B.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 });
        const cc = C.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 });
        cb.x /= B.length;
        cb.y /= B.length;
        cc.x /= C.length;
        cc.y /= C.length;
        
        // Centered
        const X = B.map(p => [p.x - cb.x, p.y - cb.y]);
        const Y = C.map(p => [p.x - cc.x, p.y - cc.y]);
        
        // Covariance 2x2: S = X^T Y
        let s11 = 0, s12 = 0, s21 = 0, s22 = 0, denom = 0;
        for (let i = 0; i < X.length; i++) {
            const [xb, yb] = X[i];
            const [xc, yc] = Y[i];
            s11 += xb * xc;
            s12 += xb * yc;
            s21 += yb * xc;
            s22 += yb * yc;
            denom += xb * xb + yb * yb;
        }
        
        // Rotation via polar decomposition of S
        const tr = s11 + s22;
        const norm = Math.hypot(s12 - s21, tr);
        let r11, r12, r21, r22;
        
        if (norm < 1e-8) {
            r11 = 1;
            r12 = 0;
            r21 = 0;
            r22 = 1;
        } else {
            // Closest orthogonal matrix to S
            r11 = tr / norm;
            r12 = (s12 - s21) / norm;
            r21 = (s21 - s12) / norm;
            r22 = tr / norm;
        }
        
        // Scale
        const s = denom > 1e-8 ? (s11 * r11 + s12 * r12 + s21 * r21 + s22 * r22) / denom : 1;
        
        // Translation: t = cc - s*R*cb
        const tx = cc.x - s * (r11 * cb.x + r12 * cb.y);
        const ty = cc.y - s * (r21 * cb.x + r22 * cb.y);
        
        const newTransform = { s, R: [[r11, r12], [r21, r22]], t: { x: tx, y: ty } };
        
        // Smooth the transform
        if (this.lastTransform) {
            const a = this.transformSmoothing;
            newTransform.s = a * newTransform.s + (1 - a) * this.lastTransform.s;
            newTransform.t.x = a * newTransform.t.x + (1 - a) * this.lastTransform.t.x;
            newTransform.t.y = a * newTransform.t.y + (1 - a) * this.lastTransform.t.y;
            
            // Smooth rotation matrix (interpolate angle)
            const oldAngle = Math.atan2(this.lastTransform.R[1][0], this.lastTransform.R[0][0]);
            const newAngle = Math.atan2(r21, r11);
            let angle = newAngle;
            const diff = ((newAngle - oldAngle + Math.PI) % (2 * Math.PI)) - Math.PI;
            angle = oldAngle + a * diff;
            
            newTransform.R[0][0] = Math.cos(angle);
            newTransform.R[0][1] = -Math.sin(angle);
            newTransform.R[1][0] = Math.sin(angle);
            newTransform.R[1][1] = Math.cos(angle);
        }
        
        this.lastTransform = { ...newTransform };
        return newTransform;
    }
    
    // Apply similarity transform to a point
    applySim(T, x, y) {
        const { s, R, t } = T;
        return {
            x: s * (R[0][0] * x + R[0][1] * y) + t.x,
            y: s * (R[1][0] * x + R[1][1] * y) + t.y
        };
    }
    
    // Draw epicycles centered at a point with uniform scaling (smooth and stable)
    // Returns the final point position
    drawEpicyclesCentered(t, centerX, centerY, scale, showCircles = true, opacity = 0.35, firstTipOverride = null) {
        const ctx = this.ctx;
        let x = 0, y = 0; // start at origin in canonical space
        ctx.globalAlpha = opacity;
        
        // Use interpolated coefficients if transitioning
        const coeffs = this.getInterpolatedCoeffs();
        
        // Alternating order (looks nicer)
        const sortedCoeffs = [...coeffs].sort((a, b) => {
            const fa = Math.abs(a.freq);
            const fb = Math.abs(b.freq);
            if (fa !== fb) return fa - fb;
            return b.freq - a.freq; // yields +1 before -1, +2 before -2, ...
        });
        
        for (let i = 0; i < sortedCoeffs.length; i++) {
            const c = sortedCoeffs[i];
            const ang = c.freq * t + c.phase;
            const vx = c.amp * Math.cos(ang);
            const vy = c.amp * Math.sin(ang);
            
            // Circle size scaling: smaller amplitudes get bigger multiplier, larger get smaller
            const normalizedAmp = this.maxAmplitude > 0 ? c.amp / this.maxAmplitude : 0;
            const scaleFactor = 3.0 - (normalizedAmp * 1.5);
            const visualRadius = c.amp * scaleFactor * scale;
            
            // Transform to canvas space (just scale and translate)
            const Pc = { x: centerX + x * scale, y: centerY + y * scale };
            
            // For the first epicycle, use override tip if provided (for cursor following)
            let Ptip;
            if (i === 0 && firstTipOverride !== null) {
                Ptip = firstTipOverride;
            } else {
                Ptip = { x: centerX + (x + vx) * scale, y: centerY + (y + vy) * scale };
            }
            
            if (showCircles) {
                // Circle
                ctx.beginPath();
                ctx.strokeStyle = this.colors[0];
                ctx.lineWidth = 2;
                ctx.arc(Pc.x, Pc.y, visualRadius, 0, Math.PI * 2);
                ctx.stroke();
                
                // Vector with white outline
                ctx.beginPath();
                ctx.moveTo(Pc.x, Pc.y);
                ctx.lineTo(Ptip.x, Ptip.y);
                // Draw white outline first
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 4.5; // Thicker white outline
                ctx.stroke();
                // Then draw the colored line on top
                ctx.beginPath();
                ctx.moveTo(Pc.x, Pc.y);
                ctx.lineTo(Ptip.x, Ptip.y);
                ctx.strokeStyle = this.colors[1];
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }
            
            // Advance in canonical space
            // If first tip was overridden, calculate the actual vector for chain continuity
            if (i === 0 && firstTipOverride !== null) {
                // Calculate the actual offset from center to override tip
                const actualVx = (firstTipOverride.x - centerX) / scale;
                const actualVy = (firstTipOverride.y - centerY) / scale;
                x += actualVx;
                y += actualVy;
            } else {
                x += vx;
                y += vy;
            }
        }
        
        ctx.globalAlpha = 1;
        return { x: centerX + x * scale, y: centerY + y * scale };
    }
    
    // Smooth easing function (ease-in-out)
    easeInOut(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
    
    // Get interpolated coefficients between cursor and parametric modes
    getInterpolatedCursorCoeffs(t, parametricCoeffs, currentTime) {
        // t: 0 = parametric, 1 = cursor
        // Use eased interpolation for smoother transitions
        const easedT = this.easeInOut(t);
        
        // Sync phases with current parametric state to handle curve transitions
        if (easedT <= 0) {
            // Clear phase offsets when fully back to parametric
            this.cursorPhaseOffsets = null;
            this.cursorPhaseOffsetsTime = null;
            this.lastParametricCoeffsHash = null;
            return parametricCoeffs;
        }
        
        if (easedT >= 1) {
            // Create a simple hash of parametric coefficients to detect changes
            const currentHash = parametricCoeffs.length + 
                              (parametricCoeffs[0]?.freq || 0) + 
                              (parametricCoeffs[0]?.amp || 0);
            
            // Only establish offsets once upon entering full cursor mode
            const inCursorMode = this.cursorModeProgress > 0.95;
            const haveOffsets = !!this.cursorPhaseOffsets;
            
            if (!haveOffsets && inCursorMode) {
                // Calculate phase offsets based on current parametric state
                this.cursorPhaseOffsets = new Map();
                this.cursorPhaseOffsetsTime = currentTime;
                this.lastParametricCoeffsHash = currentHash;
                
                this.cursorCoeffs.forEach(c => {
                    const m = parametricCoeffs.find(p => p.freq === c.freq);
                    if (m) {
                        const pe = m.phase + m.freq * currentTime;
                        const ce = c.phase + c.freq * currentTime;
                        let d = pe - ce;
                        while (d > Math.PI) d -= 2 * Math.PI;
                        while (d < -Math.PI) d += 2 * Math.PI;
                        this.cursorPhaseOffsets.set(c.freq, d);
                    }
                });
            }
            
            // While fully in cursor mode, ignore parametric changes to avoid re-sync jumps
            if (inCursorMode) {
                // Don't recompute offsets if base curve changes underneath
                // Fall through to apply existing offsets
            } else {
                // You're exiting back toward parametric — clear offsets once we're mostly out
                if (this.cursorModeProgress < 0.05) {
                    this.cursorPhaseOffsets = null;
                    this.cursorPhaseOffsetsTime = null;
                    this.lastParametricCoeffsHash = null;
                }
            }
            
            // Apply stored phase offsets to cursor coefficients
            return this.cursorCoeffs.map(c => {
                const phaseOffset = this.cursorPhaseOffsets.get(c.freq);
                if (phaseOffset !== undefined) {
                    const adjustedPhase = c.phase + phaseOffset;
                    let normalizedPhase = adjustedPhase;
                    while (normalizedPhase > Math.PI) normalizedPhase -= 2 * Math.PI;
                    while (normalizedPhase < -Math.PI) normalizedPhase += 2 * Math.PI;
                    
                    return {
                        freq: c.freq,
                        re: c.amp * Math.cos(normalizedPhase),
                        im: c.amp * Math.sin(normalizedPhase),
                        amp: c.amp,
                        phase: normalizedPhase
                    };
                }
                return c;
            });
        }
        
        const interpolated = [];
        const cursorMap = new Map();
        this.cursorCoeffs.forEach(c => {
            cursorMap.set(c.freq, c);
        });
        
        const parametricMap = new Map();
        parametricCoeffs.forEach(c => {
            parametricMap.set(c.freq, c);
        });
        
        // Get all unique frequencies
        const allFreqs = new Set();
        this.cursorCoeffs.forEach(c => allFreqs.add(c.freq));
        parametricCoeffs.forEach(c => allFreqs.add(c.freq));
        
        // Interpolate all frequencies using effective phase (phase + freq * time)
        allFreqs.forEach(freq => {
            const cursor = cursorMap.get(freq);
            const parametric = parametricMap.get(freq);
            
            if (cursor && parametric) {
                // Both exist: interpolate smoothly
                const amp = (1 - easedT) * parametric.amp + easedT * cursor.amp;
                
                // Use effective phase (phase + freq * time) for continuity
                // Always use current parametric state (not stored) to handle curve transitions
                const parametricEffectivePhase = parametric.phase + freq * currentTime;
                const cursorEffectivePhase = cursor.phase + freq * currentTime;
                
                // Interpolate effective phase taking shortest path
                let phaseDiff = cursorEffectivePhase - parametricEffectivePhase;
                while (phaseDiff > Math.PI) phaseDiff -= 2 * Math.PI;
                while (phaseDiff < -Math.PI) phaseDiff += 2 * Math.PI;
                const effectivePhase = parametricEffectivePhase + easedT * phaseDiff;
                
                // Convert back to base phase
                const phase = effectivePhase - freq * currentTime;
                // Normalize phase
                let normalizedPhase = phase;
                while (normalizedPhase > Math.PI) normalizedPhase -= 2 * Math.PI;
                while (normalizedPhase < -Math.PI) normalizedPhase += 2 * Math.PI;
                
                interpolated.push({
                    freq: freq,
                    re: amp * Math.cos(normalizedPhase),
                    im: amp * Math.sin(normalizedPhase),
                    amp: amp,
                    phase: normalizedPhase
                });
            } else if (cursor) {
                // Only in cursor: fade in smoothly
                // Use cursor phase as-is (will be synced when fully in cursor mode)
                const phase = cursor.phase;
                
                interpolated.push({
                    freq: freq,
                    re: cursor.amp * easedT * Math.cos(phase),
                    im: cursor.amp * easedT * Math.sin(phase),
                    amp: cursor.amp * easedT,
                    phase: phase
                });
            } else if (parametric) {
                // Only in parametric: fade out smoothly
                interpolated.push({
                    freq: freq,
                    re: parametric.re * (1 - easedT),
                    im: parametric.im * (1 - easedT),
                    amp: parametric.amp * (1 - easedT),
                    phase: parametric.phase
                });
            }
        });
        
        // Sort by amplitude (cache this if needed for performance)
        interpolated.sort((a, b) => b.amp - a.amp);
        
        return interpolated;
    }
    
    // Get interpolated coefficients for smooth transition (between parametric curves)
    getInterpolatedCoeffs() {
        if (!this.prevCoeffs || this.transitionProgress >= 1.0) {
            return this.baseCoeffs;
        }
        
        // Use eased interpolation for smoother transition
        const t = this.easeInOut(this.transitionProgress);
        const interpolated = [];
        
        // Create a map of frequencies for easy lookup
        const prevMap = new Map();
        this.prevCoeffs.forEach(c => {
            prevMap.set(c.freq, c);
        });
        
        // Get all unique frequencies from both sets
        const allFreqs = new Set();
        this.prevCoeffs.forEach(c => allFreqs.add(c.freq));
        this.baseCoeffs.forEach(c => allFreqs.add(c.freq));
        
        // Interpolate all frequencies
        allFreqs.forEach(freq => {
            const prev = prevMap.get(freq);
            const curr = this.baseCoeffs.find(c => c.freq === freq);
            
            if (prev && curr) {
                // Both exist: interpolate smoothly
                const amp = (1 - t) * prev.amp + t * curr.amp;
                
                // Interpolate phase taking shortest path around circle
                let phaseDiff = curr.phase - prev.phase;
                // Normalize to [-π, π]
                while (phaseDiff > Math.PI) phaseDiff -= 2 * Math.PI;
                while (phaseDiff < -Math.PI) phaseDiff += 2 * Math.PI;
                const phase = prev.phase + t * phaseDiff;
                
                interpolated.push({
                    freq: freq,
                    re: amp * Math.cos(phase),
                    im: amp * Math.sin(phase),
                    amp: amp,
                    phase: phase
                });
            } else if (prev) {
                // Only in previous: fade out
                const amp = prev.amp * (1 - t);
                interpolated.push({
                    freq: freq,
                    re: prev.re * (1 - t),
                    im: prev.im * (1 - t),
                    amp: amp,
                    phase: prev.phase
                });
            } else if (curr) {
                // Only in current: fade in
                const amp = curr.amp * t;
                interpolated.push({
                    freq: freq,
                    re: curr.re * t,
                    im: curr.im * t,
                    amp: amp,
                    phase: curr.phase
                });
            }
        });
        
        // Sort by amplitude (keep strongest terms)
        interpolated.sort((a, b) => b.amp - a.amp);
        
        return interpolated;
    }
    
    // Generate new curve and start transition
    transitionToNewCurve() {
        console.log('transitionToNewCurve called');
        // Store current state (deep copy)
        this.prevCoeffs = this.baseCoeffs.map(c => ({
            freq: c.freq,
            re: c.re,
            im: c.im,
            amp: c.amp,
            phase: c.phase
        }));
        this.prevPath = this.parametricPath.map(p => ({ x: p.x, y: p.y }));
        
        // Generate new curve
        this.parametricPath = this.generateRandomParametricPath();
        console.log('Generated new parametric path with', this.parametricPath.length, 'points');
        
        // Center the new path
        const bx = this.parametricPath.reduce((s, p) => s + p.x, 0) / this.parametricPath.length;
        const by = this.parametricPath.reduce((s, p) => s + p.y, 0) / this.parametricPath.length;
        this.baseCentered = this.parametricPath.map(p => ({ x: p.x - bx, y: p.y - by }));
        
        // Compute new DFT
        const newCoeffs = this.computeDFTForPoints(this.baseCentered);
        console.log('Computed new DFT with', newCoeffs.length, 'coefficients');
        
        // Update max amplitude (interpolate smoothly)
        const newMaxAmp = newCoeffs.length > 0 ? Math.max(...newCoeffs.map(c => c.amp)) : 1;
        
        // Start transition - reset progress and update lastCurveChange
        this.transitionProgress = 0.0;
        this.transitionStartTime = Date.now(); // Track when transition actually started
        this.baseCoeffs = newCoeffs;
        console.log('Transition started, progress:', this.transitionProgress, 'startTime:', this.transitionStartTime);
        // Don't update maxAmplitude immediately - let it interpolate
    }
    
    // Draw epicycles in canonical space, then transform to match current cube
    drawEpicyclesWithTransform(t, T) {
        const ctx = this.ctx;
        let x = 0, y = 0; // canonical center at origin
        ctx.globalAlpha = 0.35;
        
        // Alternating order (looks nicer)
        const coeffs = [...this.baseCoeffs].sort((a, b) => {
            const fa = Math.abs(a.freq);
            const fb = Math.abs(b.freq);
            if (fa !== fb) return fa - fb;
            // Put positive before negative when same magnitude
            return b.freq - a.freq; // yields +1 before -1, +2 before -2, ...
        });
        
        for (let i = 0; i < coeffs.length; i++) {
            const c = coeffs[i];
            const ang = c.freq * t + c.phase;
            const vx = c.amp * Math.cos(ang);
            const vy = c.amp * Math.sin(ang);
            
            // Circle size scaling: smaller amplitudes get bigger multiplier, larger get smaller
            const normalizedAmp = this.maxAmplitude > 0 ? c.amp / this.maxAmplitude : 0;
            const scaleFactor = 3.0 - (normalizedAmp * 1.5);
            const visualRadius = c.amp * scaleFactor;
            
            // Current center in canvas space
            const Pc = this.applySim(T, x, y);
            const Ptip = this.applySim(T, x + vx, y + vy);
            
            // Circle (approximate by scaling radius)
            const s = T.s;
            ctx.beginPath();
            ctx.strokeStyle = this.colors[0];
            ctx.lineWidth = 2;
            ctx.arc(Pc.x, Pc.y, visualRadius * s, 0, Math.PI * 2);
            ctx.stroke();
            
            // Vector with white outline
            ctx.beginPath();
            ctx.moveTo(Pc.x, Pc.y);
            ctx.lineTo(Ptip.x, Ptip.y);
            // Draw white outline first
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 4.5; // Thicker white outline
            ctx.stroke();
            // Then draw the colored line on top
            ctx.beginPath();
            ctx.moveTo(Pc.x, Pc.y);
            ctx.lineTo(Ptip.x, Ptip.y);
            ctx.strokeStyle = this.colors[1];
            ctx.lineWidth = 2.5;
            ctx.stroke();
            
            // Advance in canonical
            x += vx;
            y += vy;
        }
        
        ctx.globalAlpha = 1;
        return this.applySim(T, x, y);
    }
    
    drawEpicycles(t) {
        const ctx = this.ctx;
        // Start from single center point
        let x = this.centerX;
        let y = this.centerY;
        
        ctx.globalAlpha = 0.35; // Increased opacity for better visibility
        
        // Sort coefficients with alternating order (0, +1, -1, +2, -2, ...)
        const sortedCoeffs = [...this.coeffs].sort((a, b) => {
            const fa = Math.abs(a.freq);
            const fb = Math.abs(b.freq);
            if (fa !== fb) return fa - fb;
            // Put positive before negative when same magnitude
            return b.freq - a.freq; // yields +1 before -1, +2 before -2, ...
        });
        
        for (let i = 0; i < sortedCoeffs.length; i++) {
            const c = sortedCoeffs[i];
            const ang = c.freq * t + c.phase;
            const vx = c.amp * Math.cos(ang);
            const vy = c.amp * Math.sin(ang);
            
            // Circle size scaling: smaller amplitudes get bigger multiplier, larger get smaller
            // Normalize amplitude (0 to 1 based on max amplitude)
            const normalizedAmp = this.maxAmplitude > 0 ? c.amp / this.maxAmplitude : 0;
            // Inverse scaling: small amps (0.1) get 3x, large amps (1.0) get 1.5x
            const scaleFactor = 3.0 - (normalizedAmp * 1.5);
            const visualRadius = c.amp * scaleFactor;
            
            ctx.beginPath();
            ctx.strokeStyle = this.colors[0];
            ctx.lineWidth = 2; // Thicker lines for better visibility
            ctx.arc(x, y, visualRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Vector line with white outline
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + vx, y + vy);
            // Draw white outline first
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 4.5; // Thicker white outline
            ctx.stroke();
            // Then draw the colored line on top
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + vx, y + vy);
            ctx.strokeStyle = this.colors[1];
            ctx.lineWidth = 2.5; // Slightly thicker
            ctx.stroke();
            
            // Use actual (non-scaled) values for tracing - chain from single center
            x += vx;
            y += vy;
        }
        
        ctx.globalAlpha = 1;
        return { x, y };
    }
    
    animate() {
        const ctx = this.ctx;
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Update and draw ripples
        this.updateAndDrawRipples(ctx);
        
        // Use parametric path approach (if baseCoeffs exists)
        if (this.baseCoeffs) {
            const now = Date.now();
            
            // Update transition progress (time-based for consistency)
            if (this.transitionProgress < 1.0 && this.transitionStartTime) {
                // Calculate elapsed time since transition started
                const elapsed = now - this.transitionStartTime;
                this.transitionProgress = Math.min(1.0, elapsed / this.transitionDuration);
                
                // When transition completes, update lastCurveChange to track when we can start next one
                if (this.transitionProgress >= 1.0) {
                    this.lastCurveChange = now;
                    this.transitionStartTime = null; // Clear transition start time
                }
            } else {
                // Ensure transitionProgress stays at 1.0 when complete
                if (this.transitionProgress >= 1.0) {
                    this.transitionProgress = 1.0;
                }
            }
            
            // Check if enough time has passed since last curve change (or transition completion)
            // Also ensure we're not currently in a transition
            const timeSinceLastChange = now - this.lastCurveChange;
            if (timeSinceLastChange >= this.curveChangeInterval && this.transitionProgress >= 1.0 && !this.transitionStartTime) {
                console.log('Starting new curve transition at', now, 'time since last:', timeSinceLastChange);
                this.transitionToNewCurve();
            }
            
            // Smoothly interpolate max amplitude during transition
            if (this.prevCoeffs && this.transitionProgress < 1.0) {
                const prevMaxAmp = this.prevCoeffs.length > 0 ? Math.max(...this.prevCoeffs.map(c => c.amp)) : 1;
                const newMaxAmp = this.baseCoeffs.length > 0 ? Math.max(...this.baseCoeffs.map(c => c.amp)) : 1;
                const t = this.easeInOut(this.transitionProgress);
                this.maxAmplitude = (1 - t) * prevMaxAmp + t * newMaxAmp;
            }
            
            // Draw interpolated target path (ghost outline)
            if (this.parametricPath && this.parametricPath.length > 1) {
                ctx.globalAlpha = 0.2 * (1 - this.transitionProgress * 0.5);
                ctx.beginPath();
                ctx.moveTo(this.parametricPath[0].x, this.parametricPath[0].y);
                for (let i = 1; i < this.parametricPath.length; i++) {
                    ctx.lineTo(this.parametricPath[i].x, this.parametricPath[i].y);
                }
                ctx.strokeStyle = this.hexToRgba(this.colors[2], 0.2);
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
            
            // Main animation: Always draw epicycles from screen center, following parametric path only
            const epicycleCenterX = this.centerX;
            const epicycleCenterY = this.centerY;
            
            // Get current parametric coefficients (may be interpolated if transitioning between curves)
            const currentParametricCoeffs = this.getInterpolatedCoeffs();
            const originalCoeffs = this.baseCoeffs;
            const originalMaxAmp = this.maxAmplitude;
            
            // Use parametric coefficients only (no cursor interpolation for main animation)
            this.baseCoeffs = currentParametricCoeffs;
            
            // Use parametric max amplitude
            const parametricMaxAmp = currentParametricCoeffs.length > 0 ? 
                Math.max(...currentParametricCoeffs.map(c => c.amp)) : 1;
            this.maxAmplitude = parametricMaxAmp;
            
            // Draw main animation epicycles (1 main + 3 smaller ones) with different phase offsets
            const points = [];
            for (let e = 0; e < 3; e++) {
                const offset = this.epicycleOffsets[e];
                const scale = this.epicycleScales[e];
                // Offset is in radians - add directly to time (time is already in parameter space)
                // Convert offset to match the parameter space: offset of 2π = samplePoints frames
                const tOffset = this.time + offset * (this.samplePoints / (2 * Math.PI)) * this.speed;
                
                // Only show circles for the main one (first)
                const showCircles = (e === 0);
                const opacity = e === 0 ? 0.40 : 0.2;
                
                // Draw epicycles normally (no cursor override for main animation)
                const p = this.drawEpicyclesCentered(tOffset, epicycleCenterX, epicycleCenterY, scale, showCircles, opacity);
                
                // Smooth the point during transition to prevent jitter
                if (this.transitionProgress < 1.0 && this.trails[e].length > 0) {
                    const lastPoint = this.trails[e][0];
                    // More smoothing early in transition, less as it progresses
                    const transitionSmoothing = 0.6 * (1 - this.transitionProgress);
                    p.x = transitionSmoothing * lastPoint.x + (1 - transitionSmoothing) * p.x;
                    p.y = transitionSmoothing * lastPoint.y + (1 - transitionSmoothing) * p.y;
                }
                
                points.push(p);
                
                // Add to trail
                this.trails[e].unshift(p);
                if (this.trails[e].length > this.maxTrail) this.trails[e].pop();
            }
            
            // Restore original coefficients and max amplitude
            this.baseCoeffs = originalCoeffs;
            this.maxAmplitude = originalMaxAmp;
            
            // Draw trails for all epicycles (main animation)
            for (let e = 0; e < 4; e++) {
                const trail = this.trails[e];
                if (trail.length > 1) {
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.lineWidth = e === 0 ? 2.5 : 1.5; // Thicker for main trail
                    
                    ctx.beginPath();
                    ctx.moveTo(trail[0].x, trail[0].y);
                    
                    for (let i = 1; i < trail.length; i++) {
                        const pt = trail[i];
                        if (i === 1) {
                            ctx.lineTo(pt.x, pt.y);
                        } else if (i < trail.length - 1) {
                            const nxt = trail[i + 1];
                            ctx.quadraticCurveTo(pt.x, pt.y, (pt.x + nxt.x) / 2, (pt.y + nxt.y) / 2);
                        } else {
                            ctx.lineTo(pt.x, pt.y);
                        }
                    }
                    
                    const start = trail[0];
                    const end = trail[trail.length - 1];
                    const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
                    
                    // Different opacity for smaller trails
                    const baseOpacity = e === 0 ? 0.9 : 0.6;
                    for (let i = 0; i <= 10; i++) {
                        const t = i / 10;
                        // Slower fade: goes from 1.0 to 0.0 more gradually (0.6 instead of 1.2)
                        const a = Math.max(0, (1 - t * 0.6)) * baseOpacity;
                        grad.addColorStop(t, this.hexToRgba(this.colors[2], a));
                    }
                    ctx.strokeStyle = grad;
                    ctx.stroke();
                }
            }
        } else {
            // Legacy approach for SVG/image paths
            this.dftUpdateCounter++;
            if (!this.coeffs || this.dftUpdateCounter >= this.dftUpdateInterval) {
                const cubeOutline = this.getCubeOutline();
                this.prepareDFT(cubeOutline);
                this.dftUpdateCounter = 0;
            }
            
            if (!this.coeffs) {
                requestAnimationFrame(() => this.animate());
                return;
            }
            
            // Draw epicycles and trace
            const p = this.drawEpicycles(this.time);
            this.trail.unshift(p);
            if (this.trail.length > this.maxTrail) this.trail.pop();
            
            // Draw trail with decay and smooth curves
            if (this.trail.length > 1) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 2.5;
                
                ctx.beginPath();
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
                
                for (let i = 1; i < this.trail.length; i++) {
                    const pt = this.trail[i];
                    if (i === 1) {
                        ctx.lineTo(pt.x, pt.y);
                    } else if (i < this.trail.length - 1) {
                        const nxt = this.trail[i + 1];
                        ctx.quadraticCurveTo(pt.x, pt.y, (pt.x + nxt.x) / 2, (pt.y + nxt.y) / 2);
                    } else {
                        ctx.lineTo(pt.x, pt.y);
                    }
                }
                
                const start = this.trail[0];
                const end = this.trail[this.trail.length - 1];
                const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
                for (let i = 0; i <= 10; i++) {
                    const t = i / 10;
                    const a = Math.max(0, 1 - t * 0.6); // Slower fade
                    grad.addColorStop(t, this.hexToRgba(this.colors[2], a));
                }
                ctx.strokeStyle = grad;
                ctx.stroke();
            }
        }
        
        ctx.globalAlpha = 1;
        this.time += this.speed;
        requestAnimationFrame(() => this.animate());
    }
}

// Simple rotating cube for navigation bar
class NavCubeAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.size = 48; // Larger canvas to accommodate bigger cube
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        
        this.cubeSize = 10; // Bigger cube
        this.rotation = { A: 0, B: 0, C: 0 };
        this.rotationSpeed = { A: 0.02, B: 0.03, C: 0.01 };
        
        this.colors = ['#6e5c54', '#584e49', '#4b3f3a'];
        this.bgColor = 'transparent';
        
        this.animate();
    }
    
    rotate3D(x, y, z, A, B, C) {
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
    
    project3D(x, y, z) {
        const distance = 60; // Increased distance for better perspective
        const scale = 1.0; // Scale to fit within bounds
        const fov = distance;
        const px = (x * fov) / (z + distance) * scale;
        const py = (y * fov) / (z + distance) * scale;
        return { x: px, y: py, z: z };
    }
    
    drawCube() {
        const ctx = this.ctx;
        const centerX = this.size / 2;
        const centerY = this.size / 2;
        const s = this.cubeSize;
        
        // Cube vertices
        const vertices = [
            [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
            [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
        ];
        
        // Project vertices
        const projected = vertices.map(v => {
            const rotated = this.rotate3D(v[0], v[1], v[2], 
                this.rotation.A, this.rotation.B, this.rotation.C);
            const proj = this.project3D(rotated.x, rotated.y, rotated.z);
            return {
                x: centerX + proj.x,
                y: centerY + proj.y,
                z: proj.z
            };
        });
        
        // Clear canvas
        ctx.clearRect(0, 0, this.size, this.size);
        
        // Draw cube edges (wireframe style)
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Front face
            [4, 5], [5, 6], [6, 7], [7, 4], // Back face
            [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
        ];
        
        ctx.strokeStyle = this.colors[0];
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.9;
        
        edges.forEach(([start, end]) => {
            const p1 = projected[start];
            const p2 = projected[end];
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        });
        
        ctx.globalAlpha = 1;
    }
    
    animate() {
        // Update rotation
        this.rotation.A += this.rotationSpeed.A;
        this.rotation.B += this.rotationSpeed.B;
        this.rotation.C += this.rotationSpeed.C;
        
        // Draw cube
        this.drawCube();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cubeCanvas')) {
        // Generate rotating cube outline with Fourier epicycles
        new FourierImageAnimation('cubeCanvas', {
            terms: 80,
            samplePoints: 600,
            sizeScale: 0.8
        });
    }
    
    // Initialize navigation cube animation
    if (document.getElementById('navCubeCanvas')) {
        new NavCubeAnimation('navCubeCanvas');
    }
});

