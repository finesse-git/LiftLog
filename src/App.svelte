<script>
  import { session } from './stores/auth.js';
  import { profile } from './stores/profile.js';
  import Login from './routes/Login.svelte';
  import Onboarding from './routes/Onboarding.svelte';
  import Dashboard from './routes/Dashboard.svelte';

  let lastUserId = null;

  $: {
    const userId = $session?.user?.id ?? null;
    if (userId && userId !== lastUserId) {
      lastUserId = userId;
      profile.refresh(userId);
    } else if (!userId && lastUserId) {
      lastUserId = null;
      profile.clear();
    }
  }

  function handleOnboardingComplete() {
    profile.refresh($session.user.id);
  }
</script>

<main class="min-h-screen bg-gray-50 text-gray-900">
  {#if !$session}
    <Login />
  {:else if $profile.loading}
    <div class="flex min-h-screen items-center justify-center text-sm text-gray-500">Loading…</div>
  {:else if !$profile.profile?.plan_style}
    <Onboarding userId={$session.user.id} onComplete={handleOnboardingComplete} />
  {:else}
    <Dashboard />
  {/if}
</main>
