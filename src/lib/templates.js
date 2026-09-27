import { getSuggestion } from './suggestions.js';

export const PLAN_STYLES = [
  {
    id: 'full_body',
    name: 'Full-Body',
    description: '3x/week, hits everything each session. Best for beginners or limited time.',
    exercises: [
      { name: 'Back Squat',        movement_type: 'compound_lower' },
      { name: 'Bench Press',       movement_type: 'compound_upper' },
      { name: 'Barbell Row',       movement_type: 'compound_upper' },
      { name: 'Romanian Deadlift', movement_type: 'compound_lower' },
      { name: 'Overhead Press',    movement_type: 'compound_upper' },
    ],
  },
  {
    id: 'upper_lower',
    name: 'Upper / Lower',
    description: '4x/week split, more volume per muscle group than full-body.',
    exercises: [
      { name: 'Bench Press',        movement_type: 'compound_upper' },
      { name: 'Overhead Press',     movement_type: 'compound_upper' },
      { name: 'Barbell Row',        movement_type: 'compound_upper' },
      { name: 'Lat Pulldown',       movement_type: 'compound_upper' },
      { name: 'Back Squat',         movement_type: 'compound_lower' },
      { name: 'Romanian Deadlift',  movement_type: 'compound_lower' },
      { name: 'Leg Press',          movement_type: 'compound_lower' },
    ],
  },
  {
    id: 'push_pull_legs',
    name: 'Push / Pull / Legs',
    description: '6x/week, highest volume — for intermediate/advanced lifters.',
    exercises: [
      { name: 'Bench Press',       movement_type: 'compound_upper' },
      { name: 'Overhead Press',    movement_type: 'compound_upper' },
      { name: 'Triceps Pressdown', movement_type: 'isolation' },
      { name: 'Barbell Row',       movement_type: 'compound_upper' },
      { name: 'Lat Pulldown',      movement_type: 'compound_upper' },
      { name: 'Bicep Curl',        movement_type: 'isolation' },
      { name: 'Back Squat',        movement_type: 'compound_lower' },
      { name: 'Romanian Deadlift', movement_type: 'compound_lower' },
      { name: 'Leg Curl',          movement_type: 'isolation' },
    ],
  },
];

export function getPlanStyles() {
  return PLAN_STYLES.map(({ id, name, description }) => ({ id, name, description }));
}

export function buildPlan(goal, styleId) {
  const style = PLAN_STYLES.find(s => s.id === styleId) || PLAN_STYLES[0];
  return style.exercises.map(ex => ({
    ...ex,
    ...getSuggestion(goal, ex.movement_type),
  }));
}
