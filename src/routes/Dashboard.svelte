<script>
  import { onMount } from 'svelte';
  import { exercises } from '../stores/exercises.js';

  onMount(() => {
    exercises.refresh();
  });
</script>

<div class="mx-auto max-w-lg px-4 py-8">
  <h1 class="mb-4 text-xl font-semibold">Week 1 plan</h1>

  <div class="space-y-3">
    {#each $exercises as ex (ex.id)}
      <div class="rounded border p-3">
        <div class="flex items-center justify-between">
          <span class="font-medium">{ex.name}</span>
          <span class="text-xs text-gray-500">{ex.sets}x{ex.reps}</span>
        </div>
        <div class="text-sm text-gray-600">Target: {ex.current_target}</div>
      </div>
    {:else}
      <p class="text-sm text-gray-500">No exercises yet.</p>
    {/each}
  </div>
</div>
