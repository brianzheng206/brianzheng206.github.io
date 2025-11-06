# Cube Animation Background Guide

## What Was Implemented

Added a 3D rotating cube animation to the hero/intro section background, inspired by the classic ASCII cube animation but rendered on HTML5 Canvas.

## Files Modified/Created

### Created:
- `assets/js/cube-animation.js` - The animation engine

### Modified:
- `index.html` - Added canvas element to hero section
- `assets/css/style.css` - Updated hero section layering

## How It Works

### The Animation
- **Three rotating cubes** of different sizes rotating in 3D space
- Uses the same mathematical calculations as the ASCII version (3D rotation matrices)
- Rendered on HTML5 Canvas for smooth performance
- Colors match your brown/taupe palette

### Layering (z-index)
```
Canvas (z-index: 0) - Background animation
↓
Gradient overlay (z-index: 1) - Subtle overlay for depth
↓
Content (z-index: 2) - Hero text and buttons
↓
Profile image (z-index: 3) - Profile photo on top
```

## Customization Options

### In `assets/js/cube-animation.js`:

#### Adjust Cube Sizes and Positions:
```javascript
this.cubes = [
    { width: 40, offsetX: -200, char: '@' },  // Large left cube
    { width: 25, offsetX: 0, char: '#' },      // Medium center cube
    { width: 15, offsetX: 200, char: '+' }     // Small right cube
];
```

#### Change Animation Speed:
```javascript
// In the animate() method:
this.A += 0.03;  // X-axis rotation speed
this.B += 0.02;  // Y-axis rotation speed
this.C += 0.01;  // Z-axis rotation speed
```
Higher numbers = faster rotation.

#### Change Opacity:
```javascript
// In drawCube() calls:
this.drawCube(cube.width, cube.offsetX, this.colors[index], 0.4);
//                                                           ^^^ Change this (0.0 to 1.0)
```

#### Change Colors:
```javascript
this.colors = ['#6e5c54', '#584e49', '#4b3f3a'];  // Use your palette colors
```

## Performance

- Uses `requestAnimationFrame` for smooth 60fps animation
- Canvas is only rendered once (on the hero section)
- Automatically adjusts to window resize
- Lightweight and performant on all devices

## Disable Animation (If Needed)

### Option 1: Remove completely
1. Remove `<canvas id="cubeCanvas" class="hero-canvas"></canvas>` from `index.html`
2. Remove `<script src="assets/js/cube-animation.js"></script>` from `index.html`

### Option 2: Pause on mobile
Add to `cube-animation.js` constructor:
```javascript
if (window.innerWidth < 768) {
    return; // Don't animate on mobile
}
```

## Troubleshooting

**Animation not showing?**
- Check browser console for errors (F12)
- Make sure JavaScript is enabled
- Refresh page with Ctrl+F5 (hard refresh)

**Animation too fast/slow?**
- Adjust the rotation increments in `animate()` method
- Change `incrementSpeed` property

**Colors not matching?**
- Update the `colors` array with your hex codes
- Make sure they contrast with the background

**Profile image not visible?**
- Check that `z-index: 3` is set on `.hero-image img`
- Verify image path is correct

## Advanced Customization

### Add More Cubes:
```javascript
this.cubes = [
    { width: 40, offsetX: -200, char: '@' },
    { width: 25, offsetX: 0, char: '#' },
    { width: 15, offsetX: 200, char: '+' },
    { width: 20, offsetX: -100, char: '$' }  // NEW CUBE
];

// Add corresponding color:
this.colors = ['#6e5c54', '#584e49', '#4b3f3a', '#YOUR_COLOR'];
```

### Change Drawing Style:
Currently uses:
- Points (dots) for the cube surfaces
- Wireframe edges

You can modify the `drawCube()` and `drawCubeEdges()` methods to:
- Use only wireframes (comment out the points loop)
- Use filled faces
- Add particles instead of points

### Adjust Perspective:
```javascript
const distanceFromCam = 200;  // Change this (higher = further away)
const K1 = 100;  // Projection constant (affects size)
```

## Browser Compatibility

Works on all modern browsers:
- Chrome ✓
- Firefox ✓
- Safari ✓
- Edge ✓
- Mobile browsers ✓

## Fun Facts

This animation is based on the classic "Donut" and "Cube" ASCII animations by Andy Sloane, converted to work on HTML5 Canvas with your color palette!

---

**Enjoy your animated background!** 🎨✨

