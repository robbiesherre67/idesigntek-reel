<template>
  <!-- Trigger button near the menu (top-right) -->
  <button
    class="fixed top-3 right-4 md:top-4 md:right-6 z-[1300] h-9 px-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur hover:bg-white/20 transition"
    title="Toggle QuickNav (⌘/Ctrl + K)"
    aria-label="Toggle QuickNav"
    @click="state.open ? closeQuickNav() : openQuickNav()"
  >
    <span class="text-sm font-medium">QuickNav</span>
  </button>

  <!-- Palette -->
  <Teleport to="body">
    <div v-if="state.open" class="fixed inset-0 z-[1250]">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeQuickNav()"></div>

      <div
        class="absolute left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-xl rounded-2xl border border-white/10 bg-[#0b0b0c]/95 shadow-soft"
        role="dialog" aria-modal="true" aria-label="QuickNav"
        @keydown.stop
      >
        <div class="p-3 border-b border-white/10">
          <input
            id="quicknav-input"
            v-model="state.query"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            @keydown.enter.prevent="activate"
            @keydown.esc.prevent="closeQuickNav()"
            type="text" placeholder="Search: pages, actions, links…"
            class="w-full bg-transparent outline-none text-base placeholder-white/40"
            autocomplete="off"
          />
        </div>

        <ul class="max-h-[60vh] overflow-auto py-2">
          <template v-for="group in grouped" :key="group.label">
            <li class="px-3 py-1 text-xs uppercase tracking-widest text-white/40">{{ group.label }}</li>
            <li v-for="(cmd, i) in group.items" :key="cmd.key">
              <button
                type="button"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 focus:bg-white/5',
                  indexFor(group, i) === selected ? 'bg-white/10' : ''
                ]"
                @mouseenter="selected = indexFor(group, i)"
                @click="cmd.run()"
              >
                <div class="flex items-center justify-between gap-3">
                  <span class="text-sm">{{ cmd.title }}</span>
                  <span v-if="cmd.kbd" class="text-[10px] text-white/40 border border-white/20 rounded px-1 py-0.5">{{ cmd.kbd }}</span>
                </div>
                <p v-if="cmd.note" class="text-xs text-white/50 mt-0.5">{{ cmd.note }}</p>
              </button>
            </li>
          </template>

          <li v-if="flat.length === 0" class="px-3 py-6 text-center text-white/50">
            No matches. Try “work”, “contact”, “github”…
          </li>
        </ul>

        <div class="flex items-center justify-between px-3 py-2 text-xs text-white/40 border-t border-white/10">
          <span>↑/↓ to navigate • Enter to open • Esc to close</span>
          <span><kbd class="border border-white/20 rounded px-1">⌘</kbd>+<kbd class="border border-white/20 rounded px-1">K</kbd></span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { quickNav as state, openQuickNav, closeQuickNav } from '@/stores/quickNav'

type CommandGroup = 'Navigate' | 'Sections' | 'Contact' | 'Social'
type Command = { key: string; title: string; group: CommandGroup; note?: string; kbd?: string; run: () => void }

const router = useRouter()
const selected = ref(0)

/* Commands (Home first so index 0 = Home) */
function goto(path: string) { return async () => { await router.push(path); closeQuickNav() } }
function gotoAndScroll(path: string, hashId: string) {
  return async () => {
    await router.push(path)
    requestAnimationFrame(() => {
      document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    closeQuickNav()
  }
}
const BASE_COMMANDS: Command[] = [
  { key: 'home',    title: 'Home',    group: 'Navigate', run: goto('/') },
  { key: 'work',    title: 'Work',    group: 'Navigate', run: goto('/work') },
  { key: 'contact', title: 'Contact', group: 'Navigate', run: goto('/contact') },
  { key: 'selwork', title: 'Home → Selected Work', group: 'Sections', note: 'Jump to the case study rail', run: gotoAndScroll('/', 'selected-work') },
  { key: 'github',   title: 'GitHub: RobbieSherre67', group: 'Social', run: () => { window.open('https://github.com/robbiesherre67', '_blank', 'noopener'); closeQuickNav() } },
  { key: 'linkedin', title: 'LinkedIn: Robbie-Sherre', group: 'Social', run: () => { window.open('https://www.linkedin.com/in/robbie-sherre', '_blank', 'noopener'); closeQuickNav() } },
]

/* Filtering */
function score(text: string, q: string) {
  const t = text.toLowerCase(), qq = q.toLowerCase()
  if (!qq) return 0
  if (t === qq) return 3
  if (t.startsWith(qq)) return 2
  if (t.includes(qq)) return 1
  return 0
}
const flat = computed(() => {
  const q = state.query.trim()
  if (!q) return BASE_COMMANDS
  return BASE_COMMANDS
    .map(cmd => ({ cmd, s: score(cmd.title, q) + score(cmd.group, q) + score(cmd.note || '', q) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map(x => x.cmd)
})

/* Stable group order */
const GROUP_ORDER: CommandGroup[] = ['Navigate', 'Sections', 'Contact', 'Social']
const grouped = computed(() => {
  const buckets = new Map<CommandGroup, Command[]>()
  for (const g of GROUP_ORDER) buckets.set(g, [])
  for (const c of flat.value) buckets.get(c.group)!.push(c)
  return GROUP_ORDER.map(label => ({ label, items: buckets.get(label)! })).filter(g => g.items.length)
})

/* Keyboard nav + hotkey */
function indexFor(group: { items: Command[] }, i: number) {
  let n = 0
  for (const g of grouped.value) { if (g === group) return n + i; n += g.items.length }
  return 0
}
function move(delta: number) {
  const n = flat.value.length
  if (!n) return
  selected.value = (selected.value + delta + n) % n
}
function activate() { flat.value[selected.value]?.run() }
function onGlobalKey(e: KeyboardEvent) {
  const metaK = (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))
  if (metaK) { e.preventDefault(); state.open ? closeQuickNav() : openQuickNav() }
}

/* Reset highlight to Home on open/clear */
watch(() => state.open, (v) => { if (v) selected.value = 0 })
watch(() => state.query, (q) => { if (!q) selected.value = 0 })

onMounted(() => window.addEventListener('keydown', onGlobalKey))
onUnmounted(() => window.removeEventListener('keydown', onGlobalKey))
</script>