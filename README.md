# Brian Zheng - Personal Portfolio Website

my cool website

## 📁 Repository Structure

```
brianzheng-website/
├── index.html                    # Main HTML file
├── ascii-cube-matrix.html        # ASCII cube matrix visualization
├── fourier-visualization.html    # Fourier series visualization
├── PORTFOLIO_OUTLINE.md          # Portfolio content outline
├── README.md                      # This file
├── assets/
│   ├── css/
│   │   ├── style.css            # Base styles, variables, and layout
│   │   └── components.css        # Component-specific styles (projects, skills, etc.)
│   ├── js/
│   │   ├── main.js              # General site functionality
│   │   ├── navigation.js        # Navigation and scroll behavior
│   │   ├── projects.js          # Project filtering and modal functionality
│   │   ├── contact.js           # Contact form handling
│   │   ├── utils/               # Shared utility functions
│   │   │   ├── 3d-utils.js      # 3D rotation and projection utilities
│   │   │   └── fourier-math.js  # DFT, resampling, and geometric algorithms
│   │   └── animations/          # Animation classes
│   │       ├── fourier-animation.js  # Fourier series epicycle animation
│   │       └── nav-cube-animation.js # Navigation bar cube animation
│   ├── images/
│   │   ├── profile/             # Profile photos
│   │   ├── projects/            # Project screenshots/demos
│   │   └── logos/               # Company/team logos
│   └── docs/
│       └── resume.pdf           # Resume PDF
└── blog/
    └── posts/                   # Blog post HTML files
```

## 🏗️ Architecture Overview

### HTML Structure
- **index.html**: Main entry point containing all sections (hero, projects, experience, skills, resume, about, blog, contact)
- **ascii-cube-matrix.html**: Standalone page for ASCII cube matrix visualization
- **fourier-visualization.html**: Standalone page for Fourier series visualization

### CSS Organization
- **style.css**: 
  - CSS custom properties (variables) for colors, spacing, typography
  - Global styles and resets
  - Layout utilities
  - Responsive breakpoints
- **components.css**: 
  - Section-specific styles (projects, skills, resume, etc.)
  - Component styles (cards, buttons, modals, carousels)
  - Animation definitions

### JavaScript Modules
- **main.js**: General site initialization and utilities
- **navigation.js**: Smooth scrolling, active section highlighting, mobile menu
- **projects.js**: Project filtering, carousel navigation, modal popups
- **contact.js**: Contact form validation and submission
- **utils/3d-utils.js**: Shared 3D rotation and projection functions
- **utils/fourier-math.js**: DFT computation, point resampling, convex hull algorithms
- **animations/fourier-animation.js**: Fourier series epicycle animation with shape morphing
- **animations/nav-cube-animation.js**: Navigation bar rotating cube animation

## 🛠️ Technologies

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)**: Vanilla JavaScript, no frameworks
- **Font Awesome**: Icon library
- **Google Fonts**: Typography

## 📋 General Information

### Features
- Responsive design for all screen sizes
- Horizontal scrolling project carousel with filters
- Interactive modal popups for project details
- Smooth scroll navigation
- Fourier series animation with shape selector
- ASCII cube matrix visualization
- Skills showcase with categorized tech stack
- Resume PDF preview
- Contact form

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Development
- Pure HTML/CSS/JavaScript - no build process required
- Can be served statically
- Compatible with GitHub Pages, Netlify, Vercel, etc.

---

**Note**: This is a personal portfolio website. All content and images are specific to the portfolio owner.
