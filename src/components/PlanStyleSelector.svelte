<script>
  import { getPlanStyles } from '../lib/templates.js';

  export let selected = null;
  export let onSelect = () => {};

  const styles = getPlanStyles();
</script>

<div class="space-y-3">
  {#each styles as style (style.id)}
    <button
      type="button"
      on:click={() => onSelect(style.id)}
      class="block w-full rounded-lg border p-4 text-left transition
        {selected === style.id ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-400'}"
    >
      <div class="font-medium">{style.name}</div>
      <div class="text-sm text-gray-500">{style.description}</div>
    </button>
  {/each}
</div>
