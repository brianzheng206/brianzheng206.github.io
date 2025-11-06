# How to Change Website Colors

## 🎨 The Easiest Way to Change Colors

All colors are defined in **CSS variables** at the top of `assets/css/style.css`. This makes changing your entire color scheme as simple as updating a few values!

### 📍 Where to Change Colors

Open: `assets/css/style.css`

Look for the `:root` section (lines 11-38). This is where ALL colors are defined:

```css
:root {
    /* Color Palette - Brown/Taupe Theme */
    --color-lightest: #6e5c54;  /* Lightest brown - for accents */
    --color-medium-dark: #584e49;  /* Medium-dark brown - for cards */
    --color-medium: #4b3f3a;  /* Medium brown - for borders, secondary elements */
    --color-dark: #3d332d;  /* Dark brown - for sections */
    --color-darkest: #372c29;  /* Darkest brown - for main background */
    
    /* Derived Colors */
    --primary-color: #6e5c54;
    --primary-dark: #4b3f3a;
    --primary-light: #7a6b63;
    --text-primary:rgb(255, 255, 255);
    --text-secondary: #e8e6e4;
    /* ... etc */
}
```

## 🎯 Quick Color Change Guide

### Step 1: Choose Your Palette

You have 5 colors in your palette. Map them like this:

1. **Darkest** → Main background (`--bg-primary`)
2. **Dark** → Sections (`--bg-secondary`)
3. **Medium** → Cards, borders (`--bg-card`, `--border-color`)
4. **Medium-Dark** → Secondary cards (`--bg-tertiary`)
5. **Lightest** → Accents, buttons (`--primary-color`, `--color-lightest`)

### Step 2: Update the Variables

In `assets/css/style.css`, update the `:root` section:

```css
:root {
    /* Replace these with YOUR colors */
    --color-lightest: #YOUR_LIGHTEST_COLOR;
    --color-medium-dark: #YOUR_MEDIUM_DARK_COLOR;
    --color-medium: #YOUR_MEDIUM_COLOR;
    --color-dark: #YOUR_DARK_COLOR;
    --color-darkest: #YOUR_DARKEST_COLOR;
    
    /* Then update derived colors */
    --primary-color: var(--color-lightest);  /* Usually same as lightest */
    --primary-dark: var(--color-medium);     /* Usually same as medium */
    --bg-primary: var(--color-darkest);       /* Usually same as darkest */
    --bg-secondary: var(--color-dark);        /* Usually same as dark */
    --bg-card: var(--color-medium-dark);      /* Usually same as medium-dark */
    --border-color: var(--color-medium);      /* Usually same as medium */
}
```

### Step 3: Adjust Text Colors (If Needed)

If your background is very dark (like yours), use:
```css
--text-primary: #ffffff;      /* White for main text */
--text-secondary: #e8e6e4;    /* Light gray for secondary text */
--text-light: #c9c5c2;       /* Medium gray for muted text */
```

If your background is light, use:
```css
--text-primary: #000000;       /* Black for main text */
--text-secondary: #333333;    /* Dark gray for secondary text */
--text-light: #666666;         /* Medium gray for muted text */
```

## 📋 Example: Changing to a Blue Palette

```css
:root {
    /* Blue Palette */
    --color-lightest: #4a90e2;   /* Light blue */
    --color-medium-dark: #357abd; /* Medium blue */
    --color-medium: #2c5aa0;     /* Dark blue */
    --color-dark: #1e3d72;       /* Darker blue */
    --color-darkest: #0f2547;    /* Darkest blue */
    
    /* Derived colors */
    --primary-color: #4a90e2;
    --primary-dark: #2c5aa0;
    --bg-primary: #0f2547;
    --bg-secondary: #1e3d72;
    --bg-card: #357abd;
    --border-color: #2c5aa0;
    
    /* Text stays white for dark backgrounds */
    --text-primary: #ffffff;
    --text-secondary: #e8e6e4;
}
```

## 🎨 Color Mapping Reference

Here's what each color variable is used for:

### Background Colors
- `--bg-primary` → Main page background
- `--bg-secondary` → Section backgrounds (Projects, Resume, etc.)
- `--bg-card` → Card backgrounds (project cards, skill cards)
- `--bg-tertiary` → Alternative backgrounds

### Accent Colors
- `--primary-color` → Buttons, links, highlights
- `--primary-dark` → Button hover states
- `--color-lightest` → Accent elements (icons, borders)

### Text Colors
- `--text-primary` → Headings, important text
- `--text-secondary` → Body text, descriptions
- `--text-light` → Muted text, dates, metadata

### Border Colors
- `--border-color` → Default borders
- `--border-light` → Hover/focus borders

## 🔧 Advanced: Individual Component Colors

If you want to change a specific component's color, you can override it in `assets/css/components.css`:

```css
/* Example: Make project cards a different color */
.project-card {
    background-color: #YOUR_COLOR !important;
}
```

But it's better to use CSS variables so everything stays consistent!

## 🌈 Color Palette Tools

Use these tools to create palettes:

1. **Coolors.co** - Generate color palettes
   - https://coolors.co
   - Click spacebar to generate palettes
   - Export as hex codes

2. **Adobe Color** - Color wheel and harmony
   - https://color.adobe.com
   - Create monochromatic, complementary, etc.

3. **Paletton** - Palette generator
   - https://paletton.com
   - Great for creating variations of one color

## ✅ Testing Your Colors

After changing colors:

1. **Refresh your browser** (Ctrl+F5 or Cmd+Shift+R for hard refresh)
2. **Check contrast** - Make sure text is readable
   - Use: https://webaim.org/resources/contrastchecker/
   - Minimum: 4.5:1 for normal text, 3:1 for large text
3. **Test all sections** - Scroll through your site
4. **Test on mobile** - Resize browser window

## 💡 Pro Tips

1. **Start with 5 colors** - Lightest to darkest
2. **Use semantic names** - Instead of `--color-1`, use `--color-lightest`
3. **Test contrast** - Dark backgrounds need light text
4. **Keep it consistent** - Use the same variables throughout
5. **Document your choices** - Add comments in CSS explaining your palette

## 🎯 Your Current Palette (Brown/Taupe)

```css
--color-lightest: #6e5c54;   /* Accents, buttons */
--color-medium-dark: #584e49;  /* Cards */
--color-medium: #4b3f3a;    /* Borders */
--color-dark: #3d332d;      /* Sections */
--color-darkest: #372c29;   /* Main background */
```

To change to a new palette, just replace these 5 hex codes in `assets/css/style.css`!

---

**Remember:** CSS variables make it super easy - change once in `:root`, and it updates everywhere! 🎨

