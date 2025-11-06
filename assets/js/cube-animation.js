/**
 * 3D Rotating Cube Animation
 * Inspired by ASCII cube animation, rendered on canvas
 */

class CubeAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Set canvas size
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Animation parameters
        this.A = 0;
        this.B = 0;
        this.C = 0;
        this.incrementSpeed = 0.6;
        
        // Cube configurations (size, x offset)
        this.cubes = [
            { width: 120, offsetX: 0, char: '@' }  // One large centered cube
        ];
        
        // Colors from palette
        this.colors = ['#6e5c54'];
        this.bgColor = '#372c29';
        
        // Start animation
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    // 3D rotation calculations
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
    
    projectPoint(x, y, z, offsetX) {
        const distanceFromCam = 200;
        const K1 = 100;
        const zPos = z + distanceFromCam;
        const ooz = 1 / zPos;
        
        return {
            x: this.width / 2 + offsetX + K1 * ooz * x * 2,
            y: this.height / 2 + K1 * ooz * y,
            z: ooz
        };
    }
    
    drawCube(cubeWidth, offsetX, color, opacity = 0.3) {
        const points = [];
        
        // Generate cube vertices
        for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += this.incrementSpeed * 3) {
            for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += this.incrementSpeed * 3) {
                // Front face
                const x1 = this.calculateX(cubeX, cubeY, -cubeWidth, this.A, this.B, this.C);
                const y1 = this.calculateY(cubeX, cubeY, -cubeWidth, this.A, this.B, this.C);
                const z1 = this.calculateZ(cubeX, cubeY, -cubeWidth, this.A, this.B, this.C);
                points.push(this.projectPoint(x1, y1, z1, offsetX));
                
                // Back face
                const x2 = this.calculateX(cubeX, cubeY, cubeWidth, this.A, this.B, this.C);
                const y2 = this.calculateY(cubeX, cubeY, cubeWidth, this.A, this.B, this.C);
                const z2 = this.calculateZ(cubeX, cubeY, cubeWidth, this.A, this.B, this.C);
                points.push(this.projectPoint(x2, y2, z2, offsetX));
            }
        }
        
        // Draw points
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = opacity;
        
        points.forEach(point => {
            if (point.x >= 0 && point.x < this.width && point.y >= 0 && point.y < this.height) {
                this.ctx.fillRect(point.x, point.y, 2, 2);
            }
        });
        
        // Draw edges (wireframe effect)
        this.drawCubeEdges(cubeWidth, offsetX, color, opacity * 0.5);
    }
    
    drawCubeEdges(cubeWidth, offsetX, color, opacity) {
        this.ctx.strokeStyle = color;
        this.ctx.globalAlpha = opacity;
        this.ctx.lineWidth = 1;
        
        // Define cube corners
        const corners = [
            [-cubeWidth, -cubeWidth, -cubeWidth],
            [cubeWidth, -cubeWidth, -cubeWidth],
            [cubeWidth, cubeWidth, -cubeWidth],
            [-cubeWidth, cubeWidth, -cubeWidth],
            [-cubeWidth, -cubeWidth, cubeWidth],
            [cubeWidth, -cubeWidth, cubeWidth],
            [cubeWidth, cubeWidth, cubeWidth],
            [-cubeWidth, cubeWidth, cubeWidth]
        ];
        
        // Project corners
        const projectedCorners = corners.map(([i, j, k]) => {
            const x = this.calculateX(i, j, k, this.A, this.B, this.C);
            const y = this.calculateY(i, j, k, this.A, this.B, this.C);
            const z = this.calculateZ(i, j, k, this.A, this.B, this.C);
            return this.projectPoint(x, y, z, offsetX);
        });
        
        // Draw edges
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Front face
            [4, 5], [5, 6], [6, 7], [7, 4], // Back face
            [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
        ];
        
        edges.forEach(([start, end]) => {
            const p1 = projectedCorners[start];
            const p2 = projectedCorners[end];
            
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        });
    }
    
    animate() {
        // Clear canvas
        this.ctx.fillStyle = this.bgColor;
        this.ctx.globalAlpha = 1;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw cubes
        this.cubes.forEach((cube, index) => {
            this.drawCube(cube.width, cube.offsetX, this.colors[index], 0.5);
        });
        
        // Update rotation angles (slower for larger cube)
        this.A += 0.02;
        this.B += 0.015;
        this.C += 0.008;
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on a page with the hero section
    if (document.getElementById('cubeCanvas')) {
        new CubeAnimation('cubeCanvas');
    }
});

