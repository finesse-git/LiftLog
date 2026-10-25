<script>
  import { supabase } from '../lib/supabaseClient.js';

  let email = '';
  let status = 'idle'; // idle | sending | sent | error
  let errorMessage = '';

  async function sendMagicLink() {
    if (!email) return;
    status = 'sending';
    errorMessage = '';

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      status = 'error';
      errorMessage = error.message;
      return;
    }

    status = 'sent';
  }
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
  <div class="w-full max-w-sm rounded-lg bg-white p-6 shadow">
    <h1 class="mb-1 text-xl font-semibold">LiftLog</h1>
    <p class="mb-6 text-sm text-gray-500">Sign in with a magic link.</p>

    {#if status === 'sent'}
      <p class="text-sm text-green-700">
        Check <strong>{email}</strong> for a sign-in link.
      </p>
    {:else}
      <form on:submit|preventDefault={sendMagicLink} class="space-y-3">
        <input
          type="email"
          bind:value={email}
          placeholder="you@example.com"
          required
          class="w-full rounded border px-3 py-2 text-base"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          class="w-full rounded bg-gray-900 px-3 py-2 text-white disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending…' : 'Send magic link'}
        </button>
        {#if status === 'error'}
          <p class="text-sm text-red-600">{errorMessage}</p>
        {/if}
      </form>
    {/if}
  </div>
</div>
