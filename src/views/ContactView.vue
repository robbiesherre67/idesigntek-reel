<template>
    <main class="min-h-[90svh] pt-28 pb-24">
      <section class="mx-auto max-w-3xl px-6">
        <div class="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-soft relative overflow-hidden">
          <!-- Ambient glow -->
          <div
            class="absolute -top-32 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style="background: radial-gradient(50% 50% at 50% 50%, #8affc1 0%, transparent 60%);"
          />
  
          <h1 class="text-4xl font-bold tracking-tight">Let’s talk.</h1>
          <p class="text-white/70 mt-2">Tell me about your project!, I'll reply quickly.</p>
  
          <form ref="formEl" class="mt-8 space-y-5" @submit.prevent="submit">
            <div class="grid md:grid-cols-2 gap-5">
              <div class="field">
                <input v-model="form.name" id="name" name="name" type="text" required class="input" placeholder=" " />
                <label for="name">Your name</label>
              </div>
              <div class="field">
                <input v-model="form.email" id="email" name="email" type="email" required class="input" placeholder=" " />
                <label for="email">Email</label>
              </div>
            </div>
  
            <div class="field">
              <input v-model="form.company" id="company" name="company" type="text" class="input" placeholder=" " />
              <label for="company">Company (optional)</label>
            </div>
  
            <div class="field">
              <input v-model="form.subject" id="subject" name="subject" type="text" class="input" placeholder=" " />
              <label for="subject">Subject (optional)</label>
            </div>
  
            <div class="field">
              <textarea v-model="form.message" id="message" name="message" rows="6" required class="input resize-y" placeholder=" "></textarea>
              <label for="message">Message</label>
            </div>
  
            <!-- Honeypot (spam trap) -->
            <input v-model="form.gotcha" type="text" name="_gotcha" class="hidden" tabindex="-1" autocomplete="off" />
  
            <!-- Optional subject shown in email -->
            <input type="hidden" name="_subject" :value="`New message — ${form.subject || 'iDesignTEK contact'}`" />
  
            <div class="flex items-center gap-3">
              <button
                :disabled="loading"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 disabled:opacity-50"
              >
                <span v-if="!loading">Send Message</span>
                <span v-else>Sending…</span>
              </button>
              <p v-if="status==='ok'"  class="text-sm text-green-300">Thanks! I’ll be in touch shortly.</p>
              <p v-if="status==='err'" class="text-sm text-red-300">Something went wrong. Please try again.</p>
            </div>
          </form>
        </div>
      </section>
    </main>
  </template>
  
  <script setup lang="ts">
  import { reactive, ref } from 'vue'
  
  const FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID
  const ENDPOINT = FORM_ID ? `https://formspree.io/f/${FORM_ID}` : ''
  
  const formEl = ref<HTMLFormElement|null>(null)
  const form = reactive({ name: '', email: '', company: '', subject: '', message: '', gotcha: '' })
  const loading = ref(false)
  const status = ref<'idle'|'ok'|'err'>('idle')
  
  async function submit() {
    status.value = 'idle'
    if (!FORM_ID) { console.error('Missing VITE_FORMSPREE_FORM_ID'); status.value = 'err'; return }
    if (!form.name || !form.email || !form.message) return
  
    loading.value = true
    try {
      const fd = new FormData(formEl.value!)
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' } // stay on page, get JSON (no redirect)
      })
      if (res.ok) {
        status.value = 'ok'
        form.name = form.email = form.company = form.subject = form.message = ''
        form.gotcha = ''
      } else {
        status.value = 'err'
      }
    } catch {
      status.value = 'err'
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .field { position: relative; }
  .input {
    width: 100%;
    padding: 1.1rem 1rem .9rem;
    border-radius: 1rem;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.12);
    color: #fff;
  }
  .input:focus {
    outline: none;
    border-color: rgba(138,255,193,.6);
    box-shadow: 0 0 0 3px rgba(138,255,193,.2);
  }
  .field > label {
    position: absolute; left: .9rem; top: .9rem;
    color: rgba(255,255,255,.55); pointer-events: none; transition: all .2s ease;
  }
  .input:focus + label,
  .input:not(:placeholder-shown) + label,
  textarea.input:not(:placeholder-shown) + label {
    top: -.55rem; left: .8rem; font-size: .75rem; background: #0b0b0c; padding: 0 .4rem; color: #8affc1;
  }
  .input::placeholder { color: transparent; }
  </style>  