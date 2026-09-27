import { writable } from 'svelte/store';
import { supabase } from '../lib/supabaseClient.js';

function createHistoryStore() {
  const { subscribe, set } = writable([]);

  async function refresh() {
    const { data, error } = await supabase
      .from('weekly_logs')
      .select('*')
      .order('week_number', { ascending: false });

    if (error) throw error;
    set(data ?? []);
  }

  return { subscribe, refresh };
}

export const history = createHistoryStore();
