A modern **Vue 3** + **Vite** single-page site showcasing interactive work, motion design, and custom components.  
Built with **TailwindCSS**, **GSAP** animations, and a custom **QuickNav** command palette.

---

## 🚀 Features

- **Vue 3 + Vite** – fast development + build setup
- **TailwindCSS** – utility-first responsive styling
- **GSAP + ScrollTrigger** – smooth hero intro + horizontal scroll for case studies
- **QuickNav (⌘/Ctrl + K)** – searchable navigation and external links
- **Responsive Header**
  - Gear icon + gradient “iDesignTEK” wordmark
  - Centered nav inside a bordered/blurred box
  - Mobile hamburger + slide-down menu
  - Animated underline that persists on active route
- **Sound Toggle (Home only)** – play/pause intro sound
- **Sections**
  - Hero intro with glowing cursor
  - Selected Work cards (stack on mobile, pinned horizontal rail on desktop)
  - Capabilities grid (Performance, Motion, CMS)

---

## 📂 Project Structure

src/
assets/ # Media (images, audio, logo, etc.)
components/
AppHeader.vue # Header with nav, mobile menu, sound toggle
QuickPalette.vue# Command palette (QuickNav)
ProjectCard.vue # Individual project cards
CapCard.vue # Capability highlight cards
SectionDivider.vue
stores/
quickNav.ts # Reactive store for QuickNav open/query state
utils/
useLenis.ts # Smooth scrolling hook
views/
HomeView.vue # Landing page
WorkView.vue # Work showcase (to be expanded)
ContactView.vue # Contact form/page
App.vue # Root app shell
main.ts # Vite entrypoint
