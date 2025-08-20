// src/utils/useLenis.ts
import Lenis from '@studio-freight/lenis'
import { onMounted, onUnmounted } from 'vue'

export function useLenis() {
  let lenis: any
  onMounted(() => {
    lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    function raf(time: number){ lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
  })
  onUnmounted(() => { lenis?.destroy?.() })
}