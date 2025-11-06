# Content Template Guide

Use this guide to replace placeholder content throughout the website.

## 📧 Contact Information

**Update in `index.html` (Contact Section):**
- Email: Replace `your.email@example.com`
- LinkedIn: Replace `https://linkedin.com/in/yourprofile`
- GitHub: Replace `https://github.com/yourusername`
- Devpost: Replace `https://devpost.com/yourusername` (if applicable)

## 👤 Profile Information

**Update in `index.html` (Hero Section):**
- Name: Already set to "Brian Zheng"
- Title: Currently "Mechatronics Engineer" - update if needed
- Tagline: "Building intelligent systems that bridge hardware and AI" - customize as needed
- Profile Image: Add `headshot.jpg` to `assets/images/profile/`

## 🎓 Education & Bio

**Update in `index.html` (About Section):**
- University: Currently mentions "University of Waterloo"
- Program: Currently mentions "Mechatronics Engineering"
- Bio paragraphs: Customize to reflect your actual experience
- Core interests: Update the list to match your specialties
- Fun fact: Personalize the outside interests section

## 💼 Projects

**For each project card in `index.html`:**

```html
<article class="project-card" data-category="robotics">
    <div class="project-image">
        <img src="assets/images/projects/project-1.jpg" alt="Project Name">
        <!-- Update image path -->
    </div>
    <div class="project-content">
        <h3 class="project-title">Your Project Title</h3>
        <p class="project-description">Brief 1-2 sentence description</p>
        <div class="project-tech">
            <span class="tech-badge">Tech 1</span>
            <span class="tech-badge">Tech 2</span>
            <!-- Add/remove tech badges -->
        </div>
        <div class="project-narrative">
            <div class="narrative-item">
                <strong>Problem:</strong> What challenge did you solve?
            </div>
            <div class="narrative-item">
                <strong>Approach:</strong> How did you tackle it?
            </div>
            <div class="narrative-item">
                <strong>Result:</strong> What were the outcomes?
            </div>
        </div>
    </div>
</article>
```

**Project Links** (update in each project card):
- GitHub: Add `href` attribute to GitHub link
- Demo: Add `href` attribute to demo/external link
- Video: Add `href` attribute to video link

## 📄 Resume

**Update:**
- Upload your resume PDF to `assets/docs/resume.pdf`
- Update the "Last Updated" text will be auto-generated
- Review the skills summary and update as needed

## 🔧 Skills Section

**Update tech icons and names** in `index.html` (Skills Section):
- Software Development: Add/remove technologies you use
- Hardware Design: Update CAD tools, PCB design tools
- Simulation & Analysis: Update simulation software
- Tools & Frameworks: Update development tools

**Note:** Font Awesome icons might need adjustment - check available icons at [fontawesome.com](https://fontawesome.com/icons)

## 🏆 Experience & Achievements

**For Work Experience:**
- Update job titles, dates, company names
- Add company logos to `assets/images/logos/`
- Update bullet points with actual achievements

**For Team Memberships:**
- Add team names (Baja SAE, F1TENTH, etc.)
- Add team logos
- Update contributions

**For Awards:**
- Add award names, competitions, dates
- Update award cards with actual achievements

## ✍️ Blog Posts

**Update existing posts:**
- `blog/posts/morse-code-robot.html`
- `blog/posts/lidar-camera-fusion.html`

**Create new posts:**
1. Create new HTML file in `blog/posts/`
2. Use existing posts as templates
3. Add entry to blog grid in `index.html`

## 🖼️ Images Needed

Create/add these images:

**Profile:**
- `assets/images/profile/headshot.jpg` - Professional headshot (300x300px minimum, square)
- `assets/images/profile/workspace.jpg` - Workspace photo (1200x800px recommended)

**Projects:**
- `assets/images/projects/project-1.jpg` - Project 1 image (1200x800px recommended)
- `assets/images/projects/project-2.jpg` - Project 2 image
- Add more as needed

**Logos:**
- `assets/images/logos/company-logo.png` - Company logos (transparent PNG recommended)
- `assets/images/logos/team-logo.png` - Team logos

**Blog:**
- `assets/images/blog/post-1.jpg` - Blog post 1 thumbnail (800x450px recommended)
- `assets/images/blog/post-2.jpg` - Blog post 2 thumbnail

**Favicon:**
- `assets/images/favicon.ico` - Website icon (16x16 or 32x32px)

## 🎨 Optional Customizations

### Colors
Edit CSS variables in `assets/css/style.css`:
```css
--primary-color: #2563eb;
--secondary-color: #10b981;
--accent-color: #f59e0b;
```

### Fonts
Change Google Fonts import in `index.html` and update `--font-family` in CSS.

### Contact Form
Configure form handler in `assets/js/contact.js`:
- Formspree: Get endpoint from formspree.io
- Netlify Forms: Works automatically on Netlify
- EmailJS: Configure EmailJS service
- Or use your own backend

## ✅ Pre-Launch Checklist

- [ ] All placeholder text replaced
- [ ] All images added
- [ ] Resume PDF uploaded
- [ ] Contact information updated
- [ ] Social media links verified
- [ ] Project links tested
- [ ] Form submission configured (if using)
- [ ] Mobile responsiveness tested
- [ ] Cross-browser testing completed
- [ ] All links work correctly
- [ ] SEO meta tags updated (in `<head>` of index.html)

## 🚀 Deployment Checklist

- [ ] Replace all placeholder content
- [ ] Test locally
- [ ] Configure form handler
- [ ] Set up custom domain (optional)
- [ ] Deploy to hosting service
- [ ] Submit to search engines (Google Search Console)
- [ ] Add to LinkedIn profile
- [ ] Share with network

