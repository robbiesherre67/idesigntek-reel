<template>
<main class="overflow-x-hidden">
<!-- Background stack (one wrapper) -->
<div class="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
<div class="absolute inset-0 bg-blobs"></div>
<div class="absolute inset-0 bg-grid"></div>
<!-- subtle border overlay -->
<div class="absolute inset-0 subtle-frame"></div>
</div>

<!-- HERO -->
<section ref="hero" class="relative z-10 flex items-center justify-center min-h-[88svh] md:min-h-[90svh]">
<!-- keep low opacity so floral edges show -->
<video class="absolute inset-0 w-full h-full object-cover opacity-20" autoplay muted loop playsinline>
<source src="" type="video/mp4" />
</video>

<!-- audio -->
<audio ref="audioEl" :src="introSound" preload="auto"></audio>

<div class="relative z-10 text-center px-6">
<h1 ref="headline" class="text-5xl md:text-7xl font-extrabold tracking-tight text-sky-300">
Fast. Elegant. Impactful.
</h1>
<p ref="kicker" class="mt-4 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
Premium interactive experiences with Vue 3, motion, and craft.
</p>
<div class="mt-10">
<RouterLink to="/work" class="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 shadow-soft">
See the Work
</RouterLink>
</div>
</div>

<!-- sound toggle -->
<button
@click="toggleSound"
class="absolute right-6 top-24 z-10 rounded-full border border-white/15 bg-white/10 backdrop-blur px-4 py-2 text-sm hover:bg-white/20 transition"
:aria-pressed="soundOn ? 'true' : 'false'"
>
{{ soundOn ? '🔊 Sound off' : '🔈 Sound on' }}
</button>

<!-- soft cursor glow -->
<div
ref="glow"
class="pointer-events-none absolute w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-40"
style="background: radial-gradient(60% 60% at 50% 50%, #8affc1 0%, transparent 60%);"
></div>
</section>
<!-- Divider between sections -->
<SectionDivider class="my-8 md:my-12" />
<!-- PINNED CASE STUDIES -->
<section ref="cases" class="relative z-10 pt-4 md:pt-6 pb-20 md:pb-24">
  <div class="mx-auto max-w-7xl px-6">
    <h2 class="text-3xl md:text-4xl font-bold mb-6 text-sky-300">Selected Work</h2>
  </div>
  <div ref="rail" class="flex justify-center gap-6 px-6 w-full" style="will-change: transform;">
    <div v-for="(p,i) in projects" :key="i" class="flex-none w-[320px] sm:w-[360px]">
      <ProjectCard v-bind="p" />
    </div>
  </div>
</section>

<!-- Divider between sections -->
<SectionDivider class="my-8 md:my-12" />
<!-- CAPABILITIES -->
<section class="relative z-10 py-32 border-t border-white/10">
<div class="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-6">
<CapCard title="Performance" desc="Lighthouse 95+, CLS < 0.1" />
<CapCard title="Motion" desc="GSAP, ScrollTrigger, Lenis" />
<CapCard title="CMS" desc="Custom WP + headless" />
</div>
</section>
</main>
</template>

<script setup lang="ts">
import SectionDivider from '../components/SectionDivider.vue'
import { ref, onMounted } from 'vue'
import introSound from '@/assets/media/intro.mp3'
import img1 from '@/assets/media/img-1.png?url'
import img2 from '@/assets/media/img-2.png?url'
import img3 from '@/assets/media/img-3.png?url'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '../utils/useLenis'
import ProjectCard from '../components/ProjectCard.vue'
import CapCard from '../components/CapCard.vue'

gsap.registerPlugin(ScrollTrigger)
useLenis()

const headline = ref<HTMLElement | null>(null)
const kicker = ref<HTMLElement | null>(null)
const glow = ref<HTMLElement | null>(null)
const cases = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)

const audioEl = ref<HTMLAudioElement | null>(null)
const soundOn = ref(false)

function toggleSound() {
const el = audioEl.value
if (!el) return
if (el.paused) el.play().then(() => (soundOn.value = true)).catch(() => {})
else { el.pause(); soundOn.value = false }
}

const projects = [
{ title: 'React Secure', tag: 'Single-page React application with custom styling, automated testing, and secure user authentication.', img: img1 },
{ title: 'TaskFlow', tag: 'TaskFlow - Vue 3 + Vite task manager with Pinia, Tailwind, drag-and-drop, and dark mode.', img: img2 },
{ title: 'WordPress Nextjs Portfolio', tag: 'WordPress, Reactjs, Nextjs Custom WordPress Application', img: img3 },
]

onMounted(async () => {
// entrance
gsap.from([headline.value, kicker.value], {
y: 14, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08
})

// Try to autoplay audio (ignored if blocked)
if (audioEl.value) {
audioEl.value.volume = 0.7
try { await audioEl.value.play(); soundOn.value = true } catch { soundOn.value = false }
}

// --- Cursor glow with quickTo (less jank than spawning tweens per move) ---
const glowEl = glow.value!
const moveX = gsap.quickTo(glowEl, "x", { duration: 0.4, ease: "power2.out" })
const moveY = gsap.quickTo(glowEl, "y", { duration: 0.4, ease: "power2.out" })
window.addEventListener('pointermove', (e) => { moveX(e.clientX); moveY(e.clientY) })

// --- Preload rail images before measuring widths (prevents initial "stuck") ---
await preloadImages([img1, img2, img3])

// Give layout a tick to settle, then initialize
requestAnimationFrame(() => setupPinnedRail())

// Refresh on full window load as a safety (fonts/video/etc.)
window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
})

// helper: preload images
function preloadImages(srcs: string[]) {
return Promise.all(
srcs.map(src => new Promise<void>(resolve => {
const im = new Image()
im.onload = im.onerror = () => resolve()
im.src = src
}))
)
}

// set up or re-set the horizontal pinned rail
function setupPinnedRail() {
const railEl = rail.value!
const triggerEl = cases.value!
// clear previous instances on HMR
ScrollTrigger.getAll().forEach(st => {
if (st.trigger === triggerEl) st.kill()
})
// dynamic width calc on refresh
const getDist = () => Math.max(0, railEl.scrollWidth - railEl.clientWidth)

gsap.to(railEl, {
x: () => -getDist(),
ease: 'none',
scrollTrigger: {
trigger: triggerEl,
start: 'top top',
end: () => `+=${getDist()}`,
scrub: 0.5,             // smoother catch-up
pin: true,
anticipatePin: 1,       // reduces initial jump
invalidateOnRefresh: true,
onRefresh: () => gsap.set(railEl, { x: 0 }) // reset before new measurement
}
})
}
</script>

<style scoped>
/* ===== Base + soft blobs (unchanged) ===== */
.bg-blobs {
background:
radial-gradient(60% 60% at 18% 10%, rgba(56,189,248,.22) 0%, rgba(56,189,248,0) 60%),
radial-gradient(45% 45% at 82% 6%,  rgba(165,180,252,.20) 0%, rgba(165,180,252,0) 60%),
linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,0) 18%, rgba(255,255,255,.03) 82%, rgba(255,255,255,0)),
#0b0b0c;
}

/* Subtle grid */
.bg-grid {
background-image:
linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
background-size: 30px 30px, 30px 30px;
opacity: .12;
}


/* Base + soft blobs (keep yours if already present) */
.bg-blobs {
background:
radial-gradient(60% 60% at 18% 10%, rgba(56,189,248,.22) 0%, rgba(56,189,248,0) 60%),
radial-gradient(45% 45% at 82% 6%,  rgba(165,180,252,.20) 0%, rgba(165,180,252,0) 60%),
linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,0) 18%, rgba(255,255,255,.03) 82%, rgba(255,255,255,0)),
#0b0b0c;
}

/* Subtle grid (keep yours if already present) */
.bg-grid {
background-image:
linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
background-size: 80px 80px, 80px 80px;
opacity: .12;
}

/* ---- Minimal, tasteful border (no visible “lines”) ---- */
.subtle-frame {
/* crisp hairline */
box-shadow:
inset 0 0 0 1px rgba(255,255,255,.07),
/* gentle cyan/indigo falloff at edges */
inset 0 0 60px rgba(56,189,248,.05),
inset 0 0 120px rgba(165,180,252,.04);
border-radius: 14px;              /* soften corners a touch */
}

/* Slightly larger radius on bigger screens */
@media (min-width: 768px) {
.subtle-frame { border-radius: 18px; }
}

/* ===== Corner SVG placement ===== */
.corner {
position: absolute;
opacity: .9;
filter: drop-shadow(0 2px 4px rgba(56,189,248,.25));
pointer-events: none;
}
.corner.tl { top: 10px; left: 10px; }
.corner.tr { top: 10px; right: 10px; }
.corner.br { bottom: 10px; right: 10px; }
.corner.bl { bottom: 10px; left: 10px; }

</style>