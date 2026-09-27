<script>
  import { session } from './stores/auth.js';
</script>

<main class="min-h-screen bg-gray-50 text-gray-900">
  <header class="border-b bg-white px-4 py-3">
    <h1 class="text-lg font-semibold">LiftLog</h1>
  </header>

  <div class="p-4">
    {#if $session}
      <p>Signed in as {$session.user.email}</p>
    {:else}
      <p>Not signed in.</p>
    {/if}
  </div>
</main>
