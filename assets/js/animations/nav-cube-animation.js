/**
 * Navigation Cube Animation
 * Simple rotating cube for the navigation bar
 */

// Use global rotate3D utility (loaded from 3d-utils.js)

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
            const rotated = window.rotate3D(v[0], v[1], v[2], 
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

// Initialize navigation cube when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('navCubeCanvas')) {
        new NavCubeAnimation('navCubeCanvas');
    }
});

