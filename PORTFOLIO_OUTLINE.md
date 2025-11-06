# Personal Portfolio Website - Complete Outline

## Table of Contents
1. [Site Structure](#site-structure)
2. [Section Details](#section-details)
3. [Design Guidelines](#design-guidelines)
4. [Technical Specifications](#technical-specifications)
5. [Content Checklist](#content-checklist)

---

## Site Structure

### Navigation Structure
```
Home
├── Hero/Intro Section
├── Projects/Portfolio Section
├── About Me Section
├── Resume Section
├── Skills/Tech Stack Section
├── Achievements/Experience Section
├── Blog/Writing Section (Optional)
└── Contact Section
```

---

## Section Details

### 🧭 (1) Hero / Intro Section

**Purpose**: First impression - critical 5-second window to capture attention

**Content Elements**:
- **Name**: Display prominently (large, bold typography)
- **Title/Role**: 
  - "Mechatronics Engineer"
  - "Robotics Developer"
  - Or your specific specialization
- **Tagline/One-liner**: 
  - Example: "Building intelligent systems that bridge hardware and AI"
  - Should be concise, memorable, and reflect your focus
- **Professional Image**:
  - Headshot or silhouette (high quality, professional)
  - Positioned strategically (left or right side, or centered)
- **Call-to-Action Buttons**:
  1. "View Projects" → Smooth scroll to Portfolio Section
  2. "Resume" → Opens PDF in new tab or downloads
  3. "Contact Me" → Jumps to Contact Section

**Design Notes**:
- Subtle background animation or gradient (no gimmicks)
- Clean, modern aesthetic
- Mobile-responsive layout
- High contrast for readability

---

### 💼 (2) Projects / Portfolio Section

**Purpose**: Showcase your technical abilities and problem-solving process

**Content Structure** (for each project):

1. **Project Header**:
   - Title (prominent)
   - Short description (1-2 sentences)

2. **Visual Elements**:
   - Image / GIF / Video demo
   - Multiple angles or views if applicable
   - Screenshots of code, UI, or hardware

3. **Tech Stack Display**:
   - Badges/icons for technologies used
   - Format: "ROS 2 • Python • TensorRT • C++"
   - Visual badges/icons (e.g., GitHub style)

4. **Project Narrative**:
   - **Problem**: What challenge did you solve?
   - **Approach**: How did you tackle it?
   - **Result**: What were the outcomes/metrics?

5. **Links** (always include where applicable):
   - 🔗 GitHub repository
   - 🎥 Demo video (YouTube/Vimeo embed)
   - 📄 Paper/Publication link
   - 🏆 Devpost submission
   - 🌐 Live deployment/demo

**Design Recommendations**:
- Grid layout (2-3 columns desktop, 1 column mobile)
- Hover effects for interactivity
- Filter/tag system by technology or project type
- Process documentation is highly valued (show your thinking)

**Example Project Categories** (optional filters):
- Robotics
- Embedded Systems
- AI/ML Projects
- Hardware Design
- Software Development

---

### 🧠 (3) About Me Section

**Purpose**: Add personality, credibility, and human connection

**Content Elements**:

1. **Short Bio** (2-3 paragraphs):
   - Introduction: "I'm a Mechatronics Engineering student at the University of Waterloo..."
   - What drives you: Passion for robotics, embedded systems, etc.
   - Current focus/studies

2. **Core Interests / Specialties**:
   - Perception systems
   - Embedded systems
   - AI-driven control
   - Drone autonomy
   - Computer vision
   - Sensor fusion
   - (Your specific areas)

3. **Visual Elements**:
   - Photo of you working or in your workspace/lab
   - Environment that shows your work style
   - Optional: Team photos or collaboration shots

4. **Personal Touch**:
   - Fun fact or hobby outside engineering
   - Example: "Outside of engineering, I love design, chess, and time-management education projects"
   - Makes you memorable and relatable

**Writing Style**:
- Professional but personable
- Show enthusiasm without being overly casual
- Highlight unique perspectives or experiences

---

### 📜 (4) Resume Section / Download

**Purpose**: Quick access to your professional credentials

**Content Elements**:

1. **Download Link**:
   - Prominent button/link to PDF
   - Path: `/assets/docs/resume.pdf`
   - Opens in new tab or downloads directly

2. **Interactive Preview** (Optional):
   - Embedded PDF viewer using `<object>` or PDF.js
   - Allows viewing without leaving the page
   - Still provide download option

3. **Quick Summary** (Text-based skills grid):

   **Languages**:
   - C++, Python, MATLAB
   - JavaScript, ROS 2, etc.

   **Tools**:
   - ROS 2, TensorRT, OpenCV
   - SolidWorks, KiCAD
   - Simulink, Gazebo, etc.

   **Hardware**:
   - Arduino, Raspberry Pi
   - NVIDIA Jetson
   - LiDAR, IMU sensors
   - Custom PCB design tools

**Design Notes**:
- Keep it clean and scannable
- Make PDF easily accessible from any page (consider sticky header link)
- Update regularly - indicate "Last Updated" date

---

### 🔧 (5) Skills / Tech Stack Section

**Purpose**: Visual snapshot of technical capabilities

**Content Organization**:

**Option 1: Icon Grid**
- Logos/icons for technologies
- GitHub-style icons
- Hover effects showing name/tooltip
- Organized by category or alphabetically

**Option 2: Categorized Layout**

1. **Software Development**
   - Languages, frameworks, libraries
   - Version control, testing tools

2. **Hardware Design**
   - CAD software (SolidWorks, Fusion 360)
   - PCB design (KiCAD, Altium)
   - Simulation tools

3. **Simulation & Analysis**
   - Gazebo, MATLAB/Simulink
   - Physics simulators
   - Data analysis tools

4. **Tools & Frameworks**
   - ROS 2, TensorRT
   - OpenCV, PyTorch, TensorFlow
   - Embedded development tools

**Visual Style**:
- Clean badges or icons (no fake progress bars/percentages)
- Consistent visual language
- Grouped logically
- Responsive grid layout

---

### 🏆 (6) Achievements / Experience Section

**Purpose**: Demonstrate real-world application and teamwork

**Content Elements**:

1. **Work Experience**:
   - Co-op positions
   - Internships
   - Research roles
   - Include company logos where possible
   - Brief description of role and contributions

2. **Team Memberships**:
   - Design teams (Baja SAE, F1TENTH, Formula Student)
   - Robotics teams
   - Engineering societies
   - Include team logos/photos

3. **Awards & Competitions**:
   - Hackathons (winners, participants)
   - Competitions (Baja SAE, F1TENTH, etc.)
   - Academic honors
   - Recognition/awards

4. **Media & Features**:
   - Press mentions
   - Publications
   - Blog features
   - Conference presentations

**Format Recommendations**:
- Timeline view (vertical or horizontal)
- Card-based layout with logos
- Bullet points highlighting key contributions
- Emphasis on collaboration and impact

**Key Message**: Show that you work well with teams and apply engineering principles in real settings

---

### ✍️ (7) Blog / Writing Section (Optional but High-Value)

**Purpose**: Demonstrate communication skills and technical depth

**Content Strategy**:

**Why Include It**:
- Shows ability to explain complex topics
- Demonstrates reflection and learning
- Differentiates you from other candidates
- Can improve SEO

**Post Topics** (2-3 initial posts recommended):

1. **"Building a Morse Code Robot with LEGO EV3"**
   - Process breakdown
   - Challenges faced
   - Solutions implemented
   - Lessons learned

2. **"Improving LiDAR–Camera Fusion in ROS 2"**
   - Technical deep-dive
   - Before/after comparisons
   - Code snippets/examples
   - Results and metrics

3. **"How We Built a 3.5-Inch Drone with ArduPilot"**
   - Project narrative
   - Technical decisions
   - Team collaboration
   - Outcomes

**Post Structure**:
- Concise (500-1000 words)
- Clear headings and sections
- Diagrams/photos embedded
- Code examples with syntax highlighting
- Tags/categories for organization

**Design**:
- Simple blog layout
- List view with preview cards
- Individual post pages
- Reading time estimates
- Share buttons

---

### 📬 (8) Contact Section

**Purpose**: Make it dead simple for people to reach you

**Content Elements**:

1. **Primary Contact**:
   - Email address (use custom domain if possible: e.g., brian@brianzheng.com)
   - Large, clickable mailto link

2. **Professional Links**:
   - LinkedIn (professional profile)
   - GitHub (code repositories)
   - GitLab (if you use it)
   - Devpost (hackathon projects)
   - Personal website URL

3. **Contact Form** (Optional but Recommended):
   - Name field
   - Email field
   - Subject field
   - Message field
   - Submit button
   - Use Formspree, Netlify Forms, or similar service
   - Include spam protection (honeypot or reCAPTCHA)

4. **Social Links** (Minimal - Only if Relevant):
   - Keep it professional-focused
   - Avoid clutter
   - Consider: Twitter/X (if used professionally), Medium (if you write)

**Design Notes**:
- Clean, minimal layout
- Icons for each platform (Font Awesome, etc.)
- Smooth hover effects
- Mobile-friendly touch targets

---

### 🧭 (9) Footer

**Purpose**: Clean closing touch and site information

**Content Elements**:

1. **Copyright Notice**:
   - "© 2025 Brian Zheng" or current year
   - Update dynamically

2. **Social Icons**:
   - Small, subtle icons
   - Links to LinkedIn, GitHub, Email
   - Consistent with contact section

3. **Credits/Acknowledgment**:
   - "Built from scratch with HTML, CSS, and JavaScript"
   - Or acknowledge frameworks used (React, Next.js, etc.)
   - Shows technical competence and attention to detail

4. **Optional Links**:
   - Back to top button
   - Sitemap link
   - Privacy policy (if collecting form data)

**Design**:
- Minimal, unobtrusive
- Consistent with overall site aesthetic
- Subtle background or border
- Full-width or contained

---

## Design Guidelines

### Overall Aesthetic

**Color Palette**:
- Professional, modern colors
- Dark mode option (highly recommended)
- High contrast for accessibility
- Consistent throughout

**Typography**:
- Clean, readable fonts
- Clear hierarchy (H1, H2, H3)
- Good line spacing
- Font loading optimization

**Layout Principles**:
- White space is your friend
- Consistent spacing system
- Mobile-first responsive design
- Smooth scrolling between sections

**Animations**:
- Subtle transitions (hover effects, scroll animations)
- No gimmicky animations
- Performance-conscious (GPU-accelerated where possible)
- Respects user's motion preferences (prefers-reduced-motion)

### Responsive Breakpoints

**Mobile**: < 768px
**Tablet**: 768px - 1024px
**Desktop**: > 1024px
**Large Desktop**: > 1440px

### Performance Targets

- Page load time: < 3 seconds
- Lighthouse score: 90+ across all metrics
- Optimize images (WebP format, lazy loading)
- Minimize JavaScript bundles
- Use CDN for assets

---

## Technical Specifications

### Recommended Tech Stack

**Option 1: Static Site**
- HTML5, CSS3, JavaScript (Vanilla)
- Or use a static site generator (Jekyll, Hugo, 11ty)

**Option 2: Modern Framework**
- React/Next.js (for dynamic content)
- Vue/Nuxt.js
- Svelte/SvelteKit

**Option 3: Full-Featured**
- Next.js with MDX (for blog)
- Tailwind CSS or styled-components
- Framer Motion for animations

### File Structure (Recommended)

```
portfolio/
├── index.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── [component].css
│   ├── js/
│   │   ├── main.js
│   │   └── [component].js
│   ├── images/
│   │   ├── profile/
│   │   ├── projects/
│   │   └── logos/
│   └── docs/
│       └── resume.pdf
├── blog/
│   ├── index.html
│   └── posts/
│       └── [post-slug].html
└── README.md
```

### Features to Implement

1. **Smooth Scrolling**:
   - Navigation jumps to sections smoothly
   - CSS `scroll-behavior: smooth` or JS implementation

2. **Active Navigation**:
   - Highlight current section in nav menu
   - Sticky/fixed navigation bar

3. **Image Optimization**:
   - Responsive images (srcset)
   - Lazy loading
   - WebP format with fallbacks

4. **SEO Optimization**:
   - Meta tags (title, description, Open Graph)
   - Semantic HTML
   - Structured data (JSON-LD)

5. **Accessibility**:
   - ARIA labels
   - Keyboard navigation
   - Screen reader friendly
   - WCAG 2.1 AA compliance

6. **Analytics** (Optional):
   - Google Analytics
   - Plausible Analytics (privacy-friendly)
   - Track page views and engagement

---

## Content Checklist

### Before Launch

**Hero Section**:
- [ ] Professional headshot ready
- [ ] Tagline finalized
- [ ] CTA buttons functional

**Projects**:
- [ ] At least 3-5 projects documented
- [ ] Project images/demos prepared
- [ ] Tech stack badges created
- [ ] All links verified (GitHub, demos, etc.)
- [ ] Problem/Approach/Result written for each

**About Me**:
- [ ] Bio written and proofread
- [ ] Core interests listed
- [ ] Professional photo selected
- [ ] Personal touch included

**Resume**:
- [ ] PDF updated and optimized
- [ ] Skills grid completed
- [ ] Last updated date added

**Skills**:
- [ ] All technologies listed
- [ ] Icons/logos collected or created
- [ ] Categorized logically

**Achievements**:
- [ ] Work experience listed
- [ ] Team memberships documented
- [ ] Awards/competitions included
- [ ] Logos/photos added where available

**Blog** (if included):
- [ ] At least 1-2 posts written
- [ ] Images/diagrams created
- [ ] Code syntax highlighting setup
- [ ] RSS feed configured (optional)

**Contact**:
- [ ] Email address verified
- [ ] All social links tested
- [ ] Contact form configured and tested
- [ ] Spam protection enabled

**Footer**:
- [ ] Copyright year set
- [ ] Social icons linked
- [ ] Credits/acknowledgment added

### General

- [ ] Mobile responsiveness tested
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] All links work correctly
- [ ] Images optimized
- [ ] Loading performance checked
- [ ] Accessibility audit completed
- [ ] SEO meta tags added
- [ ] Favicon created and added
- [ ] 404 page created (if needed)

---

## Content Writing Tips

### For Each Section

**Be Specific**: 
- Instead of "worked on robots" → "Designed perception system for autonomous drone using ROS 2 and LiDAR"

**Show Impact**:
- Include metrics: "Improved processing speed by 40%"
- Quantify achievements: "Led team of 5 engineers"

**Tell Stories**:
- Projects should have a narrative arc
- Show challenges overcome, not just successes

**Be Authentic**:
- Don't oversell or undersell yourself
- Match your writing to your experience level

**Proofread**:
- No typos or grammatical errors
- Consistency in style and formatting
- Get someone else to review

---

## Launch Checklist

### Pre-Deployment

1. **Choose Hosting**:
   - GitHub Pages (free, easy)
   - Netlify (free tier, great for static sites)
   - Vercel (free tier, excellent for React/Next.js)
   - Your own domain (recommended)

2. **Set Up Domain** (if using custom domain):
   - Purchase domain (Namecheap, Google Domains, etc.)
   - Configure DNS settings
   - SSL certificate (should be automatic)

3. **Version Control**:
   - Initialize git repository
   - Push to GitHub/GitLab
   - Set up CI/CD if using automated deployment

4. **Final Testing**:
   - Test on multiple devices
   - Check all links
   - Verify form submissions
   - Test loading speed

### Post-Launch

1. **Submit to Search Engines**:
   - Google Search Console
   - Bing Webmaster Tools

2. **Share**:
   - Add link to LinkedIn profile
   - Update GitHub profile README
   - Include in email signature

3. **Monitor**:
   - Check analytics (after a few days)
   - Review form submissions
   - Monitor for broken links

---

## Maintenance Schedule

### Monthly

- Review and update resume PDF if needed
- Check for broken links
- Update "Last Updated" date if changes made

### Quarterly

- Add new projects
- Update skills section if learned new technologies
- Write new blog post (if maintaining blog)
- Review and refresh content

### Annually

- Complete redesign if needed
- Update all content and projects
- Review and refresh all sections
- Update technologies and tools

---

## Additional Recommendations

### Optional Enhancements

1. **Dark Mode Toggle**:
   - Preferred by many users
   - Shows attention to UX detail

2. **Language Switcher** (if multilingual):
   - English/French/Chinese
   - Useful for international opportunities

3. **Print Stylesheet**:
   - Resume section prints nicely
   - Useful for interviews

4. **Search Functionality** (if blog is large):
   - Helps users find specific content

5. **Newsletter Signup** (if blogging regularly):
   - Build audience
   - Optional, don't push too hard

---

## Resources & Inspiration

### Design Inspiration

- Behance portfolios
- Awwwards (for award-winning sites)
- Dribbble (for UI/UX ideas)

### Technical Resources

- MDN Web Docs (for HTML/CSS/JS)
- React documentation (if using React)
- Tailwind CSS (for utility-first styling)
- Framer Motion (for animations)

### Content Resources

- Writing about technical projects (GitHub guides)
- Resume/CV templates for engineers
- Portfolio best practices articles

---

## Success Metrics

### After Launch, Track:

1. **Traffic**:
   - Unique visitors
   - Page views
   - Bounce rate

2. **Engagement**:
   - Time on site
   - Most viewed sections
   - Contact form submissions

3. **Conversion**:
   - Resume downloads
   - Project GitHub clicks
   - Contact form submissions

4. **Feedback**:
   - Ask peers for honest feedback
   - Iterate based on responses
   - Improve based on user behavior

---

## Final Notes

Remember: Your portfolio is a living document. It should evolve as you grow professionally. Start with the essentials, launch quickly, and iterate based on feedback and new projects.

**Priority Order for MVP (Minimum Viable Portfolio)**:

1. Hero Section
2. Projects Section (at least 3 projects)
3. About Me
4. Resume Download
5. Contact Section
6. Footer

**Nice to Have (Version 2)**:

1. Skills Section (detailed)
2. Achievements Section
3. Blog Section
4. Enhanced animations
5. Dark mode

Good luck building your portfolio! This outline should serve as your comprehensive blueprint. 🚀

