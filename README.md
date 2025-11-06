# Brian Zheng - Personal Portfolio Website

A modern, responsive personal portfolio website showcasing my work as a Mechatronics Engineer and Robotics Developer.

## 🚀 Features

- **Responsive Design**: Works beautifully on all devices (mobile, tablet, desktop)
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Smooth Scrolling**: Seamless navigation between sections
- **Project Showcase**: Highlight your projects with images, descriptions, and tech stacks
- **Interactive Contact Form**: Contact form with spam protection
- **Dark Mode Support**: Automatically adapts to user preferences
- **SEO Optimized**: Meta tags and semantic HTML for better search visibility
- **Accessible**: WCAG 2.1 AA compliant with proper ARIA labels

## 📁 Project Structure

```
brianzheng-website/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   ├── style.css         # Base styles and layout
│   │   └── components.css    # Component-specific styles
│   ├── js/
│   │   ├── main.js           # General site functionality
│   │   ├── navigation.js     # Navigation and scroll behavior
│   │   ├── projects.js       # Project filtering
│   │   └── contact.js        # Contact form handling
│   ├── images/
│   │   ├── profile/          # Profile photos
│   │   ├── projects/         # Project screenshots/demos
│   │   └── logos/            # Company/team logos
│   └── docs/
│       └── resume.pdf        # Resume PDF
├── blog/
│   └── posts/                # Blog post HTML files
└── README.md                  # This file
```

## 🛠️ Setup Instructions

1. **Clone or Download** this repository
   ```bash
   git clone <your-repo-url>
   cd brianzheng-website
   ```

2. **Replace Placeholder Content**:
   - Update all personal information in `index.html`
   - Add your profile images to `assets/images/profile/`
   - Add project images to `assets/images/projects/`
   - Replace `assets/docs/resume.pdf` with your actual resume
   - Update contact information and social links

3. **Configure Contact Form** (Optional):
   - The contact form currently uses client-side validation
   - To enable form submission, configure a service like:
     - **Formspree**: Add your Formspree endpoint URL in `contact.js`
     - **Netlify Forms**: Works automatically if deployed on Netlify
     - **EmailJS**: Configure EmailJS service

4. **Add Your Projects**:
   - Edit the project cards in the Projects section of `index.html`
   - Add project images to `assets/images/projects/`
   - Update GitHub links, demo links, and descriptions

5. **Customize Styling** (Optional):
   - Modify CSS variables in `assets/css/style.css` to change colors, fonts, spacing
   - Update component styles in `assets/css/components.css`

## 📝 Content Checklist

Before launching, make sure to:

- [ ] Replace all placeholder text with your actual information
- [ ] Add professional headshot to `assets/images/profile/headshot.jpg`
- [ ] Add workspace photo to `assets/images/profile/workspace.jpg`
- [ ] Upload your resume PDF to `assets/docs/resume.pdf`
- [ ] Add project images and update project details
- [ ] Update contact email and social media links
- [ ] Add company/team logos if applicable
- [ ] Create at least 1-2 blog posts
- [ ] Test all links and forms
- [ ] Verify mobile responsiveness
- [ ] Test in different browsers

## 🌐 Deployment Options

### GitHub Pages (Free & Easy)

1. Push your code to a GitHub repository
2. Go to Repository Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be live at `https://yourusername.github.io/repository-name`

### Netlify (Recommended)

1. Sign up for free at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Netlify will automatically deploy
4. Add custom domain if desired

### Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy automatically

## 🎨 Customization Guide

### Changing Colors

Edit CSS variables in `assets/css/style.css`:

```css
:root {
    --primary-color: #2563eb;    /* Main brand color */
    --secondary-color: #10b981;  /* Secondary accent */
    --accent-color: #f59e0b;     /* Highlight color */
}
```

### Changing Fonts

The site uses Inter font by default. To change:

1. Update the Google Fonts link in `index.html`
2. Update `--font-family` in `assets/css/style.css`

### Adding Sections

1. Add HTML structure in `index.html`
2. Add corresponding styles in `assets/css/components.css`
3. Update navigation links if needed

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with custom properties, Grid, Flexbox
- **JavaScript (Vanilla)**: No frameworks, pure JS for performance
- **Font Awesome**: Icons
- **Google Fonts**: Inter font family

## 📄 License

This project is open source and available for personal use. Feel free to customize it for your own portfolio!

## 🙏 Credits

Built from scratch with HTML, CSS, and JavaScript.

---

**Note**: This is a skeleton structure. Make sure to replace all placeholder content with your actual information before deploying!

