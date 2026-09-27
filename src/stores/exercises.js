import { writable } from 'svelte/store';
import { supabase } from '../lib/supabaseClient.js';

function createExercisesStore() {
  const { subscribe, set } = writable([]);

  async function refresh() {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('archived', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    set(data ?? []);
  }

  return { subscribe, refresh };
}

export const exercises = createExercisesStore();
