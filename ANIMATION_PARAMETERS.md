# Fourier Animation - Tunable Parameters Guide

This guide lists all the parameters you can adjust to customize the animation's size, speed, number of epicycles, and visual appearance.

## 📏 Size Parameters

### Overall Animation Size
**Location:** Line 1798-1801 (initialization) and Line 28 (constructor)
```javascript
sizeScale: 0.8  // Overall scale of the animation (0.1 = tiny, 2.0 = huge)
```
- **Range:** 0.1 - 2.0
- **Default:** 0.8
- **Effect:** Scales the entire Fourier series animation

### Circle Size Multiplier
**Location:** Line 34
```javascript
this.circleScale = 2.0;  // Base visual multiplier for circle sizes
```
- **Range:** 0.5 - 5.0
- **Default:** 2.0
- **Effect:** Makes the epicycle circles bigger/smaller visually

### Circle Size Scaling Factor
**Location:** Line 1104, 1436, 1503
```javascript
const scaleFactor = 3.0 - (normalizedAmp * 1.5);  // Inverse scaling for circles
```
- **Range:** Adjust the `3.0` and `1.5` values
- **Default:** `3.0 - (normalizedAmp * 1.5)`
- **Effect:** Controls how circle sizes vary (smaller circles get bigger multiplier)

## ⚡ Speed Parameters

### Animation Speed (Rotation Speed)
**Location:** Line 24
```javascript
this.speed = 1.5 * Math.PI / samplePoints;  // Animation speed
```
- **Range:** 0.5 - 3.0 (multiply the `1.5` value)
- **Default:** 1.5
- **Effect:** How fast the Fourier series traces the path
- **Example:** `2.0 * Math.PI / samplePoints` = faster, `0.8 * Math.PI / samplePoints` = slower

### Cursor Following Speed
**Location:** Line 61
```javascript
this.cursorSmoothing = 0.15;  // How fast to follow cursor (0-1, higher = faster)
```
- **Range:** 0.05 - 0.5
- **Default:** 0.15
- **Effect:** How quickly the epicycle center follows your cursor

### Return to Center Speed
**Location:** Line 62
```javascript
this.returnToCenterSpeed = 0.10;  // Slower speed for returning to center
```
- **Range:** 0.05 - 0.2
- **Default:** 0.10
- **Effect:** How quickly the animation returns to center when cursor leaves

### Spring-Damper Parameters (Center Return)
**Location:** Line 1601-1603
```javascript
const spring = 30;   // stiffness (higher = snappier)
const damper = 2 * Math.sqrt(spring); // critical damping
const dt = 1 / 60;   // time step
```
- **Spring Range:** 10 - 50 (lower = smoother, higher = snappier)
- **Default:** 30
- **Effect:** Controls the smoothness of center return motion

### Curve Transition Speed
**Location:** Line 49
```javascript
this.transitionDuration = 3000;  // 3 seconds for full transition (in ms)
```
- **Range:** 1000 - 5000 (milliseconds)
- **Default:** 3000
- **Effect:** How long it takes to transition between different parametric curves

### Curve Change Interval
**Location:** Line 47
```javascript
this.curveChangeInterval = 12000;  // Change curve every 12 seconds
```
- **Range:** 5000 - 30000 (milliseconds)
- **Default:** 12000
- **Effect:** How often the parametric curve changes to a new random shape

## 🔄 Number of Epicycles

### Number of Epicycles
**Location:** Line 1663 (hardcoded loop)
```javascript
for (let e = 0; e < 4; e++) {  // Change 4 to desired number
```
- **Range:** 1 - 8 (more = more complex but slower)
- **Default:** 4
- **Effect:** Number of epicycle traces (main + smaller ones)

### Epicycle Phase Offsets
**Location:** Line 52
```javascript
this.epicycleOffsets = [0, Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.75];
```
- **Format:** Array of radians (0 to 2π)
- **Default:** `[0, π/4, π/2, 3π/4]`
- **Effect:** Phase offset for each epicycle (spacing between traces)
- **Example:** `[0, Math.PI * 0.5, Math.PI]` for 3 epicycles with 90° spacing

### Epicycle Size Multipliers
**Location:** Line 53
```javascript
this.epicycleScales = [1.0, 0.6, 0.5, 0.4];  // Size multipliers
```
- **Format:** Array matching number of epicycles
- **Default:** `[1.0, 0.6, 0.5, 0.4]` (main is 100%, others are smaller)
- **Effect:** Relative size of each epicycle trace
- **Example:** `[1.0, 0.8, 0.6, 0.4]` makes them closer in size

## 🎨 Visual Parameters

### Number of Fourier Terms
**Location:** Line 1799 (initialization) and Line 26 (constructor)
```javascript
terms: 60  // Number of Fourier coefficients to use
```
- **Range:** 20 - 150 (more = more detail but slower)
- **Default:** 60
- **Effect:** More terms = smoother, more detailed curves

### Sample Points
**Location:** Line 1800 (initialization) and Line 27 (constructor)
```javascript
samplePoints: 500  // Number of points to sample from path
```
- **Range:** 200 - 1000 (more = smoother path but slower)
- **Default:** 500
- **Effect:** Resolution of the path being traced

### Trail Length
**Location:** Line 33
```javascript
this.maxTrail = Math.floor(samplePoints * 0.4);  // Trail length multiplier
```
- **Range:** Change `0.4` to 0.2 - 0.8
- **Default:** 0.4 (40% of samplePoints)
- **Effect:** How long the trail/decay lasts

### Circle Opacity
**Location:** Line 1671
```javascript
const opacity = e === 0 ? 0.40 : 0.2;  // Main: 0.40, Others: 0.2
```
- **Range:** 0.1 - 1.0
- **Default:** Main: 0.40, Others: 0.2
- **Effect:** Visibility of the epicycle circles

### Line Width
**Location:** Line 1701, 1758
```javascript
ctx.lineWidth = e === 0 ? 2.5 : 1.5;  // Main: 2.5, Others: 1.5
```
- **Range:** 1.0 - 5.0
- **Default:** Main: 2.5, Others: 1.5
- **Effect:** Thickness of the trail lines

## 🎯 Cursor Interaction Parameters

### Cursor Timeout
**Location:** Line 64
```javascript
this.cursorTimeout = 7000;  // 7 seconds before fade starts
```
- **Range:** 3000 - 15000 (milliseconds)
- **Default:** 7000
- **Effect:** How long before cursor mode starts fading out

### Cursor Mode Transition Speed
**Location:** Line 66
```javascript
this.cursorModeTransitionSpeed = 0.005;  // Blend speed
```
- **Range:** 0.001 - 0.02
- **Default:** 0.005
- **Effect:** How fast it transitions between cursor and parametric modes

## 📝 Quick Reference: Where to Change

### In Constructor (Lines 8-80):
- `sizeScale` - Overall size
- `terms` - Number of Fourier terms
- `samplePoints` - Path resolution
- `speed` - Animation speed
- `epicycleOffsets` - Phase offsets
- `epicycleScales` - Size multipliers
- `circleScale` - Circle size multiplier
- `cursorSmoothing` - Cursor follow speed
- `returnToCenterSpeed` - Return speed

### In Initialization (Lines 1797-1802):
```javascript
new FourierImageAnimation('cubeCanvas', {
    terms: 60,           // ← Change here
    samplePoints: 500,  // ← Change here
    sizeScale: 0.8      // ← Change here
});
```

### To Change Number of Epicycles:
1. **Line 32:** Update `this.trails = [[], [], [], []]` - add/remove arrays
2. **Line 52:** Update `epicycleOffsets` array length
3. **Line 53:** Update `epicycleScales` array length
4. **Line 1663:** Change `for (let e = 0; e < 4; e++)` to your number
5. **Line 1697:** Change `for (let e = 0; e < 4; e++)` to your number

## 💡 Recommended Presets

### Small & Fast
```javascript
sizeScale: 0.5
terms: 40
samplePoints: 400
speed: 2.0 * Math.PI / samplePoints
epicycles: 2
```

### Large & Detailed
```javascript
sizeScale: 1.2
terms: 100
samplePoints: 800
speed: 1.0 * Math.PI / samplePoints
epicycles: 6
```

### Smooth & Slow
```javascript
sizeScale: 0.8
terms: 80
samplePoints: 600
speed: 0.8 * Math.PI / samplePoints
epicycles: 4
cursorModeTransitionSpeed: 0.003
```

