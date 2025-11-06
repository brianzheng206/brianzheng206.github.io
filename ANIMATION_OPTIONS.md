# Cool Math Animation Options

Here are 6 different mathematical animations you can swap in for your hero section! Each has a unique mathematical beauty.

## 🎨 Animation Options

### 1. **Lissajous Curves** (Parametric Equations)
**What it is:** Beautiful curves formed by combining sine waves  
**Math:** Parametric equations `x = sin(at + δ)`, `y = sin(bt)`  
**Visual:** Smooth, flowing figure-8 and infinity patterns  
**Best for:** Elegant, mathematical aesthetic

### 2. **Matrix Digital Rain** (Classic Effect)
**What it is:** The iconic "Matrix" falling code effect  
**Math:** Random character generation with physics  
**Visual:** Falling green (or brown!) characters  
**Best for:** Tech/cyberpunk aesthetic

### 3. **Spiral Wave Pattern**
**What it is:** Spirals with wave interference  
**Math:** Archimedean spiral + sine wave modulation  
**Visual:** Mesmerizing rotating spirals with ripples  
**Best for:** Organic, fluid motion

### 4. **Particle Flow Field**
**What it is:** Particles flowing through a vector field  
**Math:** Perlin noise-like flow calculations  
**Visual:** Flowing particles with trails  
**Best for:** Abstract, dynamic background

### 5. **3D Torus (Donut)**
**What it is:** The classic spinning donut!  
**Math:** 3D rotation matrices (like your cube)  
**Visual:** ASCII art style donut rotating in 3D  
**Best for:** Retro, nostalgic feel

### 6. **Fourier Series Visualization**
**What it is:** Circles within circles creating waves  
**Math:** Fourier series decomposition  
**Visual:** Rotating circles that sum to create waveforms  
**Best for:** Mathematical elegance, engineering appeal

---

## 🚀 How to Switch Animations

### Quick Switch (5 steps):

1. **Open** `assets/js/cube-animation.js`

2. **Find** the class definition (currently `CubeAnimation`)

3. **Replace** with one of these:
   ```javascript
   // Option 1: Lissajous Curves
   new LissajousAnimation('cubeCanvas');
   
   // Option 2: Matrix Rain
   new MatrixRainAnimation('cubeCanvas');
   
   // Option 3: Spiral Waves
   new SpiralWaveAnimation('cubeCanvas');
   
   // Option 4: Particle Field
   new ParticleFieldAnimation('cubeCanvas');
   
   // Option 5: Torus (Donut)
   new TorusAnimation('cubeCanvas');
   
   // Option 6: Fourier Series
   new FourierSeriesAnimation('cubeCanvas');
   ```

4. **Copy** the corresponding class from `assets/js/animation-options.js` into `cube-animation.js`

5. **Refresh** your browser!

---

## 📝 Detailed Instructions

### Method 1: Replace in cube-animation.js

1. Open `assets/js/cube-animation.js`
2. Delete the entire `CubeAnimation` class
3. Copy one of the animation classes from `assets/js/animation-options.js`
4. Paste it into `cube-animation.js`
5. Update the initialization at the bottom:
   ```javascript
   document.addEventListener('DOMContentLoaded', function() {
       if (document.getElementById('cubeCanvas')) {
           new YourChosenAnimation('cubeCanvas');
       }
   });
   ```

### Method 2: Add All Options (Advanced)

1. Copy all classes from `animation-options.js` into `cube-animation.js`
2. Add a selector to choose which one:
   ```javascript
   const animationType = 'lissajous'; // Change this
   
   let animation;
   switch(animationType) {
       case 'lissajous':
           animation = new LissajousAnimation('cubeCanvas');
           break;
       case 'matrix':
           animation = new MatrixRainAnimation('cubeCanvas');
           break;
       // ... etc
   }
   ```

---

## 🎯 Recommendations by Style

### For Engineering/Technical Portfolio:
- **Fourier Series** - Shows mathematical depth
- **Lissajous Curves** - Classic math visualization
- **Particle Field** - Abstract, modern

### For Retro/Tech Aesthetic:
- **Matrix Rain** - Iconic tech reference
- **Torus (Donut)** - Classic ASCII art

### For Elegant/Minimal:
- **Lissajous Curves** - Smooth, flowing
- **Spiral Waves** - Organic, beautiful

---

## ⚙️ Customization Tips

### Adjust Speed:
Look for `this.time += 0.02` or similar and change the increment:
- Smaller = slower
- Larger = faster

### Change Colors:
Find the `this.colors` array and update:
```javascript
this.colors = ['#6e5c54', '#584e49', '#4b3f3a'];
```

### Adjust Opacity:
Look for `this.ctx.globalAlpha = 0.5` and change:
- 0.0 = invisible
- 1.0 = fully opaque

### Change Size:
Look for `scale` or `radius` variables and adjust multipliers

---

## 🔬 Mathematical Details

### Lissajous Curves
- Frequency ratio `a/b` determines pattern
- `a=3, b=2` creates figure-8
- `a=1, b=1` creates circle
- Adjust `this.a` and `this.b` in code

### Fourier Series
- Each circle represents a harmonic
- More terms = more complex wave
- Adjust `this.numTerms` to add/remove circles

### Particle Field
- Flow field uses sine/cosine combinations
- Creates organic, natural-looking motion
- Adjust `scale` in `flowField()` for different patterns

---

## 💡 Combine Multiple Animations

You can layer animations by:
1. Creating multiple canvas elements
2. Using different z-index values
3. Adjusting opacity so they blend

Example:
```html
<canvas id="cubeCanvas" style="z-index: 0;"></canvas>
<canvas id="particleCanvas" style="z-index: 1;"></canvas>
```

---

## 🎨 Color Palette Integration

All animations use your brown/taupe palette:
- `#6e5c54` - Lightest (accent)
- `#584e49` - Medium-dark (cards)
- `#4b3f3a` - Medium (borders)
- `#3d332d` - Dark (sections)
- `#372c29` - Darkest (background)

They're already configured to match your site!

---

## 🐛 Troubleshooting

**Animation not showing?**
- Check browser console (F12) for errors
- Make sure canvas ID matches: `cubeCanvas`
- Verify JavaScript file is loaded

**Too fast/slow?**
- Adjust time increment in `animate()` method
- Look for `this.time +=` or `this.A +=` etc.

**Performance issues?**
- Reduce number of particles/points
- Lower frame rate by adding `setTimeout` wrapper
- Use `will-change: transform` in CSS

---

**Have fun experimenting!** Each animation has its own mathematical beauty. 🎲✨

