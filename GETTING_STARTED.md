# Getting Started - How to Run & Customize Your Portfolio

## 🚀 How to Run the Website (3 Options)

### Option 1: Simple Browser Open (Quickest)
1. Open your file explorer
2. Navigate to `/home/brianzheng/brianzheng-website`
3. Double-click `index.html`
4. It will open in your default browser

**Note:** Some features (like smooth scrolling) work better with a local server, but this works for initial viewing.

### Option 2: Python HTTP Server (Recommended)
Open your terminal and run:

```bash
cd /home/brianzheng/brianzheng-website
python3 -m http.server 8000
```

Then open your browser and go to:
```
http://localhost:8000
```

To stop the server, press `Ctrl+C` in the terminal.

### Option 3: VS Code Live Server (If using VS Code)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## ✅ Next Steps: Customize Your Content

### Step 1: Update Contact Information (5 minutes)

Open `index.html` and find the Contact section (around line 450). Update:

```html
<!-- Find these lines and replace: -->
<a href="mailto:your.email@example.com">your.email@example.com</a>
<a href="https://linkedin.com/in/yourprofile">...</a>
<a href="https://github.com/yourusername">...</a>
```

**Quick Find:** Press `Ctrl+F` in your editor and search for "your.email@example.com"

### Step 2: Add Your Images (10 minutes)

Create or gather these images:

1. **Profile Photo:**
   - Save as: `assets/images/profile/headshot.jpg`
   - Size: Square image, at least 300x300px
   - Professional headshot

2. **Workspace Photo:**
   - Save as: `assets/images/profile/workspace.jpg`
   - Size: 1200x800px recommended

3. **Project Images:**
   - Save as: `assets/images/projects/project-1.jpg`, `project-2.jpg`, etc.
   - Size: 1200x800px recommended
   - Screenshots or photos of your projects

4. **Optional - Favicon:**
   - Save as: `assets/images/favicon.ico`
   - Size: 32x32px or 16x16px

**Image Tips:**
- Use JPG for photos
- Use PNG for logos/transparent images
- Compress images before uploading (use tools like TinyPNG or Squoosh)

### Step 3: Add Your Resume (2 minutes)

1. Save your resume as PDF
2. Place it in: `assets/docs/resume.pdf`
3. The website will automatically link to it

### Step 4: Update Projects Section (15-30 minutes)

In `index.html`, find the Projects section (around line 100). You'll see placeholder project cards like:

```html
<article class="project-card" data-category="robotics">
    <!-- Update this entire card with your project info -->
</article>
```

For each project, update:
- **Title:** Change "Project Title" to your actual project name
- **Description:** Write 1-2 sentences about the project
- **Tech Badges:** Update the tech stack (ROS 2, Python, C++, etc.)
- **Problem/Approach/Result:** Fill in your actual narrative
- **Links:** Add GitHub, demo, or video links (replace `#` with actual URLs)
- **Image:** Update `src="assets/images/projects/project-1.jpg"` to your image

**To add more projects:** Copy an entire `<article class="project-card">...</article>` block and paste it before `</div>` closing the projects grid.

### Step 5: Update About Section (10 minutes)

Find the About section (around line 220) and update:

1. **Bio paragraphs:** Replace with your actual story
2. **University/Program:** Update if different
3. **Core Interests:** Update the list items
4. **Fun Fact:** Personalize it

### Step 6: Update Skills Section (10 minutes)

Find the Skills section (around line 370). Update the tech icons and names:

- **Software Development:** Add languages/tools you use
- **Hardware Design:** Update CAD tools
- **Simulation & Analysis:** Update software you know
- **Tools & Frameworks:** Add development tools

**Note:** The icons use Font Awesome classes. If an icon doesn't look right, check [fontawesome.com/icons](https://fontawesome.com/icons) for alternatives.

### Step 7: Update Experience/Achievements (15 minutes)

Find the Achievements section (around line 400) and:

1. **Work Experience:**
   - Update job titles, dates, company names
   - Replace bullet points with your achievements
   - Add company logos to `assets/images/logos/` and update image path

2. **Team Memberships:**
   - Add team names, roles, dates
   - Add team logos if available

3. **Awards:**
   - Add actual awards and competitions
   - Update dates

### Step 8: Customize Blog Posts (Optional, 15 minutes)

If keeping the blog:

1. Update `blog/posts/morse-code-robot.html` with your actual post
2. Update `blog/posts/lidar-camera-fusion.html` with your actual post
3. Or create new blog posts by copying these templates

If removing the blog:
- Remove the Blog section from `index.html`
- Remove the Blog link from the navigation menu

### Step 9: Test Everything (5 minutes)

1. **Test all links:** Click every button and link
2. **Test on mobile:** Resize browser or use dev tools
3. **Test contact form:** Try submitting (it won't send yet)
4. **Check images:** Make sure all images load
5. **Test navigation:** Click through all sections

---

## 🎨 Optional: Customize Appearance

### Change Colors

Open `assets/css/style.css` and find the `:root` section (around line 13):

```css
:root {
    --primary-color: #2563eb;      /* Change this to your brand color */
    --secondary-color: #10b981;    /* Accent color */
    --accent-color: #f59e0b;       /* Highlight color */
}
```

Use a color picker like [coolors.co](https://coolors.co) to find colors you like.

### Change Fonts

1. Go to [Google Fonts](https://fonts.google.com)
2. Pick a font family
3. Update the Google Fonts link in `index.html` (around line 32)
4. Update `--font-family` in `assets/css/style.css`

---

## 📧 Setting Up Contact Form (Optional but Recommended)

The contact form is currently client-side only. To make it actually send emails:

### Option 1: Formspree (Easiest)
1. Sign up at [formspree.io](https://formspree.io) (free tier available)
2. Create a form and get your endpoint URL
3. Open `assets/js/contact.js`
4. Find the commented fetch code (around line 30)
5. Uncomment and replace `YOUR_FORM_ID` with your Formspree endpoint

### Option 2: Netlify Forms (If deploying on Netlify)
1. Just add `netlify` attribute to form: `<form ... netlify>`
2. Works automatically when deployed on Netlify

### Option 3: EmailJS
1. Sign up at [emailjs.com](https://emailjs.com)
2. Configure service
3. Update `contact.js` with EmailJS code

---

## 🌐 Deploying Your Website

Once you've customized everything:

### Deploy to GitHub Pages (Free)

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial portfolio website"

# Create GitHub repository, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# Then in GitHub:
# Settings → Pages → Source: main branch → Save
# Your site will be at: https://YOUR_USERNAME.github.io/YOUR_REPO
```

### Deploy to Netlify (Recommended - Free)

1. Sign up at [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Netlify auto-deploys
5. Optionally add custom domain

---

## ✅ Pre-Launch Checklist

Before deploying, make sure:

- [ ] All placeholder text replaced with your content
- [ ] All images added and displaying correctly
- [ ] Resume PDF uploaded
- [ ] Contact information updated
- [ ] Social media links verified (they work when clicked)
- [ ] Project links point to actual GitHub repos/demos
- [ ] Contact form configured (if using)
- [ ] Tested on mobile/responsive
- [ ] Tested in Chrome, Firefox, Safari
- [ ] No broken images or links

---

## 🆘 Troubleshooting

**Images not showing?**
- Check file paths are correct (case-sensitive on Linux)
- Make sure images are in the right folders
- Check file extensions (.jpg vs .JPG)

**Styles not loading?**
- Make sure you're running from a local server (Option 2 or 3 above)
- Check browser console for errors (F12 → Console tab)

**Contact form not working?**
- Check browser console for errors
- Make sure you configured a form handler (Formspree, Netlify, etc.)

**Navigation not working?**
- Make sure JavaScript is enabled in your browser
- Check browser console for errors

---

## 📚 Helpful Resources

- **HTML/CSS Reference:** [MDN Web Docs](https://developer.mozilla.org)
- **Color Schemes:** [Coolors.co](https://coolors.co)
- **Icons:** [Font Awesome](https://fontawesome.com/icons)
- **Fonts:** [Google Fonts](https://fonts.google.com)
- **Image Optimization:** [Squoosh](https://squoosh.app)

---

## 🎉 You're Ready!

Start with Step 1 (contact info) and work through the steps. The website works even with placeholder content, so you can test as you go.

**Need help?** Check the other documentation files:
- `README.md` - Full documentation
- `CONTENT_TEMPLATE.md` - Detailed content replacement guide
- `QUICK_START.md` - Quick reference

Good luck! 🚀

