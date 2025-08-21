<template>
  <main class="overflow-x-hidden">
    <!-- Background stack -->
    <div class="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <div class="absolute inset-0 bg-blobs"></div>
      <div class="absolute inset-0 bg-grid"></div>
      <div class="absolute inset-0 subtle-frame"></div>
    </div>

    <!-- HERO -->
    <section class="relative z-10 flex items-center justify-center min-h-[88svh] md:min-h-[90svh]">
      <video class="absolute inset-0 w-full h-full object-cover opacity-20" autoplay muted loop playsinline>
        <source src="" type="video/mp4" />
      </video>

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

      <!-- (Removed the in-hero sound button; header now owns the sound toggle) -->

      <div
        ref="glow"
        class="pointer-events-none absolute w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-40"
        style="background: radial-gradient(60% 60% at 50% 50%, #8affc1 0%, transparent 60%);"
      ></div>
    </section>

    <!-- Divider -->
    <SectionDivider class="my-8 md:my-12" />

    <!-- SELECTED WORK -->
    <section ref="workSection" class="relative z-10 pt-4 md:pt-6 pb-20 md:pb-24">
      <div class="mx-auto max-w-7xl px-6">
        <h2 id="selected-work" class="text-3xl md:text-4xl font-bold mb-6 text-sky-300">Selected Work</h2>
      </div>

      <!-- Stack on mobile; horizontal rail on md+ -->
      <div
        ref="track"
        class="px-6 w-full grid grid-cols-1 gap-6 md:flex md:justify-center md:gap-6"
        style="will-change: transform;"
      >
        <div v-for="(p,i) in projects" :key="i" class="flex-none w-full md:w-[360px]">
          <ProjectCard v-bind="p" />
        </div>
      </div>
    </section>

    <!-- Divider -->
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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
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
const kicker   = ref<HTMLElement | null>(null)
const glow     = ref<HTMLElement | null>(null)

const workSection = ref<HTMLElement | null>(null)
const track       = ref<HTMLElement | null>(null)

const audioEl = ref<HTMLAudioElement | null>(null)
const soundOn = ref(false)
const isMobile = ref(false)

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

const computeIsMobile = () => window.matchMedia('(max-width: 767.98px)').matches

function onResize(){
  const next = computeIsMobile()
  if (next !== isMobile.value){
    isMobile.value = next
    teardownHorizontalScroll()
    requestAnimationFrame(() => setupHorizontalScroll())
  }
}

onMounted(async () => {
  isMobile.value = computeIsMobile()
  window.addEventListener('resize', onResize)

  // Listen to the header's sound button
  window.addEventListener('toggle-sound', toggleSound)

  await nextTick()

  const heroBits = [headline.value, kicker.value].filter(Boolean) as HTMLElement[]
  if (heroBits.length) {
    gsap.from(heroBits, { y: 14, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 })
  }

  if (audioEl.value) {
    audioEl.value.volume = 0.7
    try { await audioEl.value.play(); soundOn.value = true } catch { soundOn.value = false }
  }

  if (glow.value) {
    const moveX = gsap.quickTo(glow.value, 'x', { duration: 0.4, ease: 'power2.out' })
    const moveY = gsap.quickTo(glow.value, 'y', { duration: 0.4, ease: 'power2.out' })
    window.addEventListener('pointermove', (e) => { moveX(e.clientX); moveY(e.clientY) })
  }

  await preloadImages([img1, img2, img3])

  requestAnimationFrame(() => setupHorizontalScroll())
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('toggle-sound', toggleSound)
  ScrollTrigger.getAll().forEach(st => st.kill())
})

function preloadImages(srcs: string[]) {
  return Promise.all(
    srcs.map(src => new Promise<void>(resolve => {
      const im = new Image()
      im.onload = im.onerror = () => resolve()
      im.src = src
    }))
  )
}

function teardownHorizontalScroll(){
  const el = track.value
  if (!el) return
  gsap.set(el, { clearProps: 'x' })
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger === workSection.value) st.kill()
  })
}

function setupHorizontalScroll(){
  const trackEl   = track.value
  const sectionEl = workSection.value
  if (!trackEl || !sectionEl) return

  teardownHorizontalScroll()
  if (isMobile.value) return // stack on mobile—no pin

  const getDist = () => Math.max(0, trackEl.scrollWidth - trackEl.clientWidth)

  gsap.to(trackEl, {
    x: () => -getDist(),
    ease: 'none',
    scrollTrigger: {
      trigger: sectionEl,
      start: 'top top',
      end: () => `+=${getDist()}`,
      scrub: 0.5,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: () => gsap.set(trackEl, { x: 0 })
    }
  })
}
</script>

<style scoped>
.bg-blobs {
  background:
    radial-gradient(60% 60% at 18% 10%, rgba(56,189,248,.22) 0%, rgba(56,189,248,0) 60%),
    radial-gradient(45% 45% at 82% 6%,  rgba(165,180,252,.20) 0%, rgba(165,180,252,0) 60%),
    linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,0) 18%, rgba(255,255,255,.03) 82%, rgba(255,255,255,0)),
    #0b0b0c;
}
.bg-grid {
  background-image:
    linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 80px 80px, 80px 80px;
  opacity: .12;
}
.subtle-frame {
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.07),
    inset 0 0 60px rgba(56,189,248,.05),
    inset 0 0 120px rgba(165,180,252,.04);
  border-radius: 14px;
}
@media (min-width: 768px) {
  .subtle-frame { border-radius: 18px; }
}
</style>