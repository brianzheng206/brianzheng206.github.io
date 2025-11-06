/**
 * Math Animation Options
 * Multiple cool math-based animations you can swap in
 */

// ============================================
// OPTION 1: Lissajous Curves (Parametric Equations)
// ============================================
class LissajousAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.t = 0;
        this.points = [];
        this.maxPoints = 200;
        this.a = 3; // Frequency ratio
        this.b = 2;
        this.delta = Math.PI / 2;
        
        this.colors = ['#6e5c54', '#584e49'];
        this.bgColor = '#372c29';
        
        this.animate();
    }
    
    animate() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const scale = Math.min(this.width, this.height) * 0.3;
        
        // Calculate new point
        const x = centerX + scale * Math.sin(this.a * this.t + this.delta);
        const y = centerY + scale * Math.sin(this.b * this.t);
        
        this.points.push({ x, y, t: this.t });
        if (this.points.length > this.maxPoints) {
            this.points.shift();
        }
        
        // Draw trail
        this.ctx.strokeStyle = this.colors[0];
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let i = 1; i < this.points.length; i++) {
            const alpha = i / this.points.length;
            this.ctx.globalAlpha = alpha * 0.8;
            if (i === 1) {
                this.ctx.moveTo(this.points[i-1].x, this.points[i-1].y);
            }
            this.ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        this.ctx.stroke();
        
        // Draw current point
        this.ctx.fillStyle = this.colors[1];
        this.ctx.globalAlpha = 1;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.t += 0.02;
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// OPTION 2: Matrix Digital Rain Effect
// ============================================
class MatrixRainAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.fontSize = 14;
        this.columns = Math.floor(this.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        this.bgColor = '#372c29';
        this.textColor = '#6e5c54';
        
        this.animate();
    }
    
    animate() {
        this.ctx.fillStyle = this.bgColor + '80';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = this.textColor;
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            this.ctx.fillText(text, x, y);
            
            if (y > this.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// OPTION 3: Spiral Wave Pattern
// ============================================
class SpiralWaveAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.time = 0;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        
        this.colors = ['#6e5c54', '#584e49', '#4b3f3a'];
        this.bgColor = '#372c29';
        
        this.animate();
    }
    
    animate() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const maxRadius = Math.min(this.width, this.height) * 0.6;
        const numSpirals = 3;
        
        for (let spiral = 0; spiral < numSpirals; spiral++) {
            this.ctx.strokeStyle = this.colors[spiral % this.colors.length];
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = 0.6;
            this.ctx.beginPath();
            
            const offset = (spiral * Math.PI * 2) / numSpirals;
            
            for (let angle = 0; angle < Math.PI * 8; angle += 0.1) {
                const radius = (angle / (Math.PI * 8)) * maxRadius;
                const wave = Math.sin(angle * 2 + this.time + offset) * 20;
                const r = radius + wave;
                const x = this.centerX + r * Math.cos(angle + offset);
                const y = this.centerY + r * Math.sin(angle + offset);
                
                if (angle === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
        }
        
        this.time += 0.05;
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// OPTION 4: Particle Flow Field
// ============================================
class ParticleFieldAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.particles = [];
        this.numParticles = 100;
        this.time = 0;
        
        // Initialize particles
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: 0,
                vy: 0,
                trail: []
            });
        }
        
        this.colors = ['#6e5c54', '#584e49'];
        this.bgColor = '#372c29';
        
        this.animate();
    }
    
    flowField(x, y, time) {
        // Perlin noise-like flow field
        const scale = 0.01;
        const angle = Math.sin(x * scale + time) * Math.cos(y * scale + time) * Math.PI * 2;
        return angle;
    }
    
    animate() {
        this.ctx.fillStyle = this.bgColor + '20';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.particles.forEach(particle => {
            const angle = this.flowField(particle.x, particle.y, this.time);
            particle.vx = Math.cos(angle) * 0.5;
            particle.vy = Math.sin(angle) * 0.5;
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around
            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;
            
            // Draw trail
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > 20) {
                particle.trail.shift();
            }
            
            // Draw particle
            this.ctx.strokeStyle = this.colors[0];
            this.ctx.lineWidth = 1;
            this.ctx.globalAlpha = 0.3;
            this.ctx.beginPath();
            for (let i = 1; i < particle.trail.length; i++) {
                const alpha = i / particle.trail.length;
                this.ctx.globalAlpha = alpha * 0.3;
                if (i === 1) {
                    this.ctx.moveTo(particle.trail[i-1].x, particle.trail[i-1].y);
                }
                this.ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
            }
            this.ctx.stroke();
            
            // Draw head
            this.ctx.fillStyle = this.colors[1];
            this.ctx.globalAlpha = 0.8;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.time += 0.01;
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// OPTION 5: 3D Torus (Donut) - Like the classic!
// ============================================
class TorusAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.A = 0;
        this.B = 0;
        this.C = 0;
        this.R1 = 1; // Inner radius
        this.R2 = 2; // Outer radius
        this.K1 = 150; // Distance from camera
        this.K2 = 5; // Light distance
        
        this.colors = ['#6e5c54', '#584e49'];
        this.bgColor = '#372c29';
        
        this.animate();
    }
    
    calculateX(i, j, k, A, B, C) {
        return j * Math.sin(A) * Math.sin(B) * Math.cos(C) - 
               k * Math.cos(A) * Math.sin(B) * Math.cos(C) +
               j * Math.cos(A) * Math.sin(C) + 
               k * Math.sin(A) * Math.sin(C) + 
               i * Math.cos(B) * Math.cos(C);
    }
    
    calculateY(i, j, k, A, B, C) {
        return j * Math.cos(A) * Math.cos(C) + 
               k * Math.sin(A) * Math.cos(C) -
               j * Math.sin(A) * Math.sin(B) * Math.sin(C) + 
               k * Math.cos(A) * Math.sin(B) * Math.sin(C) -
               i * Math.cos(B) * Math.sin(C);
    }
    
    calculateZ(i, j, k, A, B, C) {
        return k * Math.cos(A) * Math.cos(B) - 
               j * Math.sin(A) * Math.cos(B) + 
               i * Math.sin(B);
    }
    
    animate() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const output = Array(this.width * this.height).fill('.');
        const zBuffer = Array(this.width * this.height).fill(0);
        
        const chars = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];
        
        for (let theta = 0; theta < Math.PI * 2; theta += 0.07) {
            for (let phi = 0; phi < Math.PI * 2; phi += 0.02) {
                const x = (this.R2 + this.R1 * Math.cos(theta)) * Math.cos(phi);
                const y = this.R1 * Math.sin(theta);
                const z = (this.R2 + this.R1 * Math.cos(theta)) * Math.sin(phi);
                
                const rotX = this.calculateX(x, y, z, this.A, this.B, this.C);
                const rotY = this.calculateY(x, y, z, this.A, this.B, this.C);
                const rotZ = this.calculateZ(x, y, z, this.A, this.B, this.C) + this.K1;
                
                const ooz = 1 / rotZ;
                const xp = Math.floor(this.width / 2 + this.K2 * ooz * rotX * 2);
                const yp = Math.floor(this.height / 2 + this.K2 * ooz * rotY);
                
                const idx = xp + yp * this.width;
                
                if (idx >= 0 && idx < this.width * this.height) {
                    const L = Math.cos(theta) * Math.cos(phi) * Math.cos(this.B) - 
                             Math.sin(phi) * Math.sin(this.B);
                    const lumIdx = Math.floor(L * 8);
                    
                    if (ooz > zBuffer[idx]) {
                        zBuffer[idx] = ooz;
                        output[idx] = chars[Math.max(0, lumIdx)];
                    }
                }
            }
        }
        
        // Draw ASCII art
        this.ctx.fillStyle = this.colors[0];
        this.ctx.font = '10px monospace';
        let text = '';
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                text += output[i * this.width + j];
            }
            this.ctx.fillText(text, 0, i * 10);
            text = '';
        }
        
        this.A += 0.07;
        this.B += 0.03;
        this.C += 0.01;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// OPTION 6: Fourier Series Visualization
// ============================================
class FourierSeriesAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.time = 0;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.numTerms = 5;
        
        this.colors = ['#6e5c54', '#584e49', '#4b3f3a'];
        this.bgColor = '#372c29';
        
        this.animate();
    }
    
    animate() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        let x = this.centerX;
        let y = this.centerY;
        const scale = 80;
        
        // Draw circles
        this.ctx.strokeStyle = this.colors[0];
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.3;
        
        let currentX = this.centerX;
        let currentY = this.centerY;
        
        for (let n = 1; n <= this.numTerms; n++) {
            const radius = scale / (n * 2);
            const angle = this.time * n;
            
            // Draw circle
            this.ctx.beginPath();
            this.ctx.arc(currentX, currentY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Update position
            const newX = currentX + radius * Math.cos(angle);
            const newY = currentY + radius * Math.sin(angle);
            
            // Draw line to next center
            this.ctx.beginPath();
            this.ctx.moveTo(currentX, currentY);
            this.ctx.lineTo(newX, newY);
            this.ctx.stroke();
            
            currentX = newX;
            currentY = newY;
        }
        
        // Draw resulting path
        this.ctx.strokeStyle = this.colors[1];
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.8;
        this.ctx.beginPath();
        this.ctx.moveTo(currentX, currentY);
        
        // Draw wave pattern
        const wavePoints = [];
        for (let i = 0; i < 200; i++) {
            const t = this.time + i * 0.1;
            let waveX = this.centerX + 200;
            let waveY = this.centerY;
            
            for (let n = 1; n <= this.numTerms; n++) {
                const radius = scale / (n * 2);
                waveY += radius * Math.sin(n * t);
            }
            
            wavePoints.push({ x: waveX + i * 2, y: waveY });
            
            if (i === 0) {
                this.ctx.moveTo(waveX + i * 2, waveY);
            } else {
                this.ctx.lineTo(waveX + i * 2, waveY);
            }
        }
        this.ctx.stroke();
        
        this.time += 0.02;
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// Export for use
// To use any of these, replace the CubeAnimation initialization in cube-animation.js
// with: new LissajousAnimation('cubeCanvas');
// or: new MatrixRainAnimation('cubeCanvas');
// etc.

