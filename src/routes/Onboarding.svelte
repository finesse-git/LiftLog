<script>
  import { buildPlan } from '../lib/templates.js';
  import { supabase } from '../lib/supabaseClient.js';
  import GoalSelector from '../components/GoalSelector.svelte';
  import PlanStyleSelector from '../components/PlanStyleSelector.svelte';

  export let userId;
  export let onComplete = () => {};

  let step = 'goal'; // goal | style | lifts | review | saving
  let goal = null;
  let styleId = null;
  let plan = []; // [{ name, movement_type, sets, reps, increment }]
  let lifts = {}; // name -> starting weight (string input)
  let targets = {}; // name -> editable increment
  let errorMessage = '';

  function pickGoal(id) {
    goal = id;
    step = 'style';
  }

  function pickStyle(id) {
    styleId = id;
    plan = buildPlan(goal, styleId);
    lifts = {};
    targets = {};
    for (const ex of plan) {
      lifts[ex.name] = '';
      targets[ex.name] = ex.increment;
    }
    step = 'lifts';
  }

  $: liftsComplete = plan.every(
    (ex) => lifts[ex.name] !== '' && !Number.isNaN(Number(lifts[ex.name]))
  );

  function goToReview() {
    if (!liftsComplete) return;
    step = 'review';
  }

  async function confirmPlan() {
    step = 'saving';
    errorMessage = '';

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: userId, goal, plan_style: styleId });

    if (profileError) {
      errorMessage = profileError.message;
      step = 'review';
      return;
    }

    const rows = plan.map((ex) => {
      const startWeight = Number(lifts[ex.name]);
      return {
        user_id: userId,
        name: ex.name,
        movement_type: ex.movement_type,
        sets: ex.sets,
        reps: ex.reps,
        start_weight: startWeight,
        increment: Number(targets[ex.name]),
        suggested_increment: ex.increment,
        current_week: 1,
        current_target: startWeight,
      };
    });

    const { error: exercisesError } = await supabase.from('exercises').insert(rows);

    if (exercisesError) {
      errorMessage = exercisesError.message;
      step = 'review';
      return;
    }

    onComplete();
  }
</script>

<div class="mx-auto max-w-lg px-4 py-8">
  <h1 class="mb-1 text-xl font-semibold">Set up your plan</h1>
  <p class="mb-6 text-sm text-gray-500">
    Step {step === 'goal' ? 1 : step === 'style' ? 2 : step === 'lifts' ? 3 : 4} of 4
  </p>

  {#if step === 'goal'}
    <h2 class="mb-3 font-medium">What's your goal?</h2>
    <GoalSelector selected={goal} onSelect={pickGoal} />
  {/if}

  {#if step === 'style'}
    <h2 class="mb-3 font-medium">Pick a plan style</h2>
    <PlanStyleSelector selected={styleId} onSelect={pickStyle} />
    <button type="button" class="mt-4 text-sm text-gray-500 underline" on:click={() => (step = 'goal')}>
      Back
    </button>
  {/if}

  {#if step === 'lifts'}
    <h2 class="mb-3 font-medium">Enter your current lifts</h2>
    <div class="space-y-3">
      {#each plan as ex (ex.name)}
        <div class="rounded border p-3">
          <div class="mb-1 flex items-center justify-between">
            <span class="font-medium">{ex.name}</span>
            <span class="text-xs text-gray-500">{ex.sets}x{ex.reps}</span>
          </div>
          <input
            type="number"
            step="0.5"
            inputmode="decimal"
            placeholder="Weight you can lift now"
            bind:value={lifts[ex.name]}
            class="w-full rounded border px-3 py-2"
          />
        </div>
      {/each}
    </div>
    <div class="mt-4 flex items-center justify-between">
      <button type="button" class="text-sm text-gray-500 underline" on:click={() => (step = 'style')}>
        Back
      </button>
      <button
        type="button"
        disabled={!liftsComplete}
        on:click={goToReview}
        class="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  {/if}

  {#if step === 'review' || step === 'saving'}
    <h2 class="mb-3 font-medium">Your Week 1 plan</h2>
    <div class="space-y-3">
      {#each plan as ex (ex.name)}
        <div class="rounded border p-3">
          <div class="mb-1 flex items-center justify-between">
            <span class="font-medium">{ex.name}</span>
            <span class="text-xs text-gray-500">{ex.sets}x{ex.reps}</span>
          </div>
          <div class="flex items-center justify-between text-sm text-gray-600">
            <span>Starting weight: {lifts[ex.name]}</span>
          </div>
          <label class="mt-2 block text-sm text-gray-600">
            Weekly increment
            <input
              type="number"
              step="0.25"
              inputmode="decimal"
              bind:value={targets[ex.name]}
              class="mt-1 w-full rounded border px-3 py-2"
            />
          </label>
        </div>
      {/each}
    </div>

    {#if errorMessage}
      <p class="mt-3 text-sm text-red-600">{errorMessage}</p>
    {/if}

    <div class="mt-4 flex items-center justify-between">
      <button
        type="button"
        class="text-sm text-gray-500 underline"
        disabled={step === 'saving'}
        on:click={() => (step = 'lifts')}
      >
        Back
      </button>
      <button
        type="button"
        disabled={step === 'saving'}
        on:click={confirmPlan}
        class="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {step === 'saving' ? 'Saving…' : 'Confirm plan'}
      </button>
    </div>
  {/if}
</div>
