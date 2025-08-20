<template>
  <footer class="relative overflow-hidden border-t border-white/10">
    <!-- cursor glow -->
    <div ref="glow"
         class="pointer-events-none absolute w-[42rem] h-[42rem] rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"
         style="background: radial-gradient(50% 50% at 50% 50%, #8affc1 0%, transparent 60%);">
    </div>

    <!-- ticker -->
    <div class="border-b border-white/10">
      <div class="relative overflow-hidden">
        <div class="flex items-center gap-8 whitespace-nowrap marquee py-3 text-sm text-white/70">
          <span v-for="(item, i) in marquee" :key="'a'+i" class="badge">{{ item }}</span>
          <span v-for="(item, i) in marquee" :key="'b'+i" class="badge">{{ item }}</span>
        </div>
      </div>
    </div>

    <!-- content -->
    <div class="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-3 gap-8">
      <!-- CTA -->
      <section class="lg:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 shadow-soft relative overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(100%_60%_at_30%_0%,rgba(138,255,193,.08),transparent_60%)]"></div>
        <h2 class="relative text-3xl md:text-4xl font-bold tracking-tight text-sky-300">
          Let’s build something fast, elegant, and impactful.
        </h2>
        <p class="relative mt-3 text-white/70 max-w-2xl">
          Vue 3, motion-driven UX, and clean architecture—crafted for performance and polish.
        </p>

        <div class="relative mt-8">
          <!-- BLUE GRADIENT CTA -->
          <button
            ref="magnet"
            @click="goContact"
            class="cta-btn group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl
                   text-sky-50 border border-sky-300/30
                   bg-gradient-to-br from-sky-500/20 via-indigo-500/10 to-cyan-400/10
                   hover:from-sky-400/30 hover:to-cyan-400/20
                   shadow-[0_10px_30px_-10px_rgba(56,189,248,.45)]
                   backdrop-blur-md transition"
          >
            <span class="font-semibold tracking-wide">Start a Project</span>
            <svg class="icon size-4 translate-y-[1px] transition"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M7 17L17 7M17 7H8M17 7v9" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <span class="ml-4 text-sm text-white/50">
            or email <button @click="copyEmail" class="underline/50 hover:underline">robbiesherre@idesigntek.com</button>
          </span>
        </div>
      </section>

      <!-- bento -->
      <aside class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
        <div class="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 class="font-semibold">Now</h3>
          <p class="text-white/70 mt-2">Accepting new projects. Turnkey builds, performance audits, and motion polish.</p>
        </div>

        <div class="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 class="font-semibold">Local Time (LA)</h3>
          <p class="text-2xl mt-2 tabular-nums">{{ time }}</p>
          <p class="text-white/50 text-sm">Los Angeles</p>
        </div>

        <div class="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 class="font-semibold">Connect</h3>
          <ul class="mt-3 space-y-2 text-white/80">
            <li><a class="link" href="https://github.com/your-username" target="_blank" rel="noopener">GitHub</a></li>
            <li><a class="link" href="https://www.linkedin.com/in/your-handle" target="_blank" rel="noopener">LinkedIn</a></li>
          </ul>
        </div>
      </aside>
    </div>

    <!-- bottom bar -->
    <div class="px-6 pb-8">
      <div class="mx-auto max-w-7xl flex items-center justify-between text-xs text-white/50">
        <p>© {{ new Date().getFullYear() }} iDesignTEK — Built with Vue 3 + Vite + GSAP</p>
        <button @click="scrollTop" class="inline-flex items-center gap-1 hover:text-white/80 transition">
          Back to top
          <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M6 15l6-6 6 6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { useRouter } from 'vue-router'

const router = useRouter()

const marquee = [
  'Vue 3', 'Vite', 'GSAP + ScrollTrigger', 'Lenis', 'Tailwind',
  'Headless WP', 'A11y', 'Lighthouse 95+', 'Motion Design', 'TypeScript'
]

const glow = ref<HTMLElement | null>(null)
const magnet = ref<HTMLElement | null>(null)

const email = 'robbiesherre@idesigntek.com' // updated to match visible text
const time = ref('—')

let raf = 0
const onMove = (e: PointerEvent) => {
  const g = glow.value
  if (!g) return
  gsap.to(g, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out' })
}

function goContact() {
  router.push('/contact')
}

async function copyEmail() {
  try { await navigator.clipboard.writeText(email) } catch {}
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function tick() {
  const fmt = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'America/Los_Angeles'
  })
  time.value = fmt.format(new Date())
  raf = window.setTimeout(tick, 1000)
}

onMounted(() => {
  window.addEventListener('pointermove', onMove)

  // Magnetic button micro-interaction
  const btn = magnet.value
  if (btn) {
    const strength = 40
    const handle = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect()
      const mx = e.clientX - (r.left + r.width / 2)
      const my = e.clientY - (r.top + r.height / 2)
      gsap.to(btn, {
        x: (mx / r.width) * strength,
        y: (my / r.height) * strength,
        duration: 0.3, ease: 'power3.out'
      })
    }
    const reset = () => gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' })
    btn.addEventListener('mousemove', handle)
    btn.addEventListener('mouseleave', reset)
  }
  tick()
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onMove)
  window.clearTimeout(raf)
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .35rem .75rem;
  border-radius: 999px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  margin-right: .75rem;
}
.link {
  position: relative;
}
.link::after {
  content: ''; position: absolute; left: 0; right: 100%; bottom: -2px; height: 1px;
  background: #8affc1; transition: right .35s ease;
}
.link:hover::after { right: 0; }

/* marquee loop */
.marquee { animation: scroll 22s linear infinite; }
@keyframes scroll { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }

/* ===== Blue Premium CTA Button ===== */
.cta-btn {
  position: relative;
  isolation: isolate;
  --ring: rgba(125, 211, 252, .6); /* sky-300 */
}

/* soft outer glow */
.cta-btn::before {
  content: "";
  position: absolute; inset: -2px;
  border-radius: 1rem;
  background: conic-gradient(from 180deg at 50% 50%,
              rgba(56,189,248,.0) 0deg,
              rgba(56,189,248,.25) 100deg,
              rgba(147,197,253,.25) 220deg,
              rgba(34,211,238,.25) 320deg,
              rgba(56,189,248,.0) 360deg);
  filter: blur(10px);
  opacity: .55;
  z-index: -1;
  transition: opacity .3s ease, filter .3s ease;
  pointer-events: none;
}
.cta-btn:hover::before { opacity: .8; filter: blur(12px); }

/* moving sheen */
.cta-btn::after {
  content: "";
  position: absolute; inset: 1px;
  border-radius: calc(1rem - 1px);
  background:
    linear-gradient(120deg, transparent 0%, rgba(255,255,255,.35) 15%, transparent 30%) no-repeat;
  background-size: 200% 100%;
  background-position: -120% 0;
  transition: background-position .8s cubic-bezier(.22,.61,.36,1);
  pointer-events: none;
  mix-blend-mode: screen;
}
.cta-btn:hover::after { background-position: 120% 0; }

/* icon nudge */
.cta-btn .icon { transform: translateX(0); }
.cta-btn:hover .icon { transform: translateX(.25rem); }

/* focus ring */
.cta-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--ring);
}
</style>