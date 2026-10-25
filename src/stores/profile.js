import { writable } from 'svelte/store';
import { supabase } from '../lib/supabaseClient.js';

function createProfileStore() {
  const { subscribe, set } = writable({ loading: true, profile: null });

  async function refresh(userId) {
    set({ loading: true, profile: null });

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    set({ loading: false, profile: data });
  }

  function clear() {
    set({ loading: false, profile: null });
  }

  return { subscribe, refresh, clear };
}

export const profile = createProfileStore();
