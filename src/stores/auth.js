import { readable } from 'svelte/store';
import { supabase } from '../lib/supabaseClient.js';

export const session = readable(null, (set) => {
  supabase.auth.getSession().then(({ data }) => set(data.session));

  const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
    set(newSession);
  });

  return () => sub.subscription.unsubscribe();
});
