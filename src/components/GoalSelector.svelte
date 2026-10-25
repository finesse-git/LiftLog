<script>
  export let selected = null;
  export let onSelect = () => {};

  const GOALS = [
    { id: 'strength',    name: 'Strength',    description: 'Heavier weight, fewer reps. 4x5 on compounds.' },
    { id: 'hypertrophy', name: 'Hypertrophy', description: 'Muscle growth. 3-4 sets of ~10 reps.' },
    { id: 'endurance',   name: 'Endurance',   description: 'Higher reps, lighter load. 15+ reps.' },
    { id: 'fatloss',     name: 'Fat loss',    description: 'Moderate load, higher volume, shorter rest.' },
  ];
</script>

<div class="grid gap-3 sm:grid-cols-2">
  {#each GOALS as goal (goal.id)}
    <button
      type="button"
      on:click={() => onSelect(goal.id)}
      class="rounded-lg border p-4 text-left transition
        {selected === goal.id ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-400'}"
    >
      <div class="font-medium">{goal.name}</div>
      <div class="text-sm text-gray-500">{goal.description}</div>
    </button>
  {/each}
</div>
