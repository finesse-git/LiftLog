export const SUGGESTIONS = {
  strength:    { compound_lower: { increment: 2.5,  sets: 4, reps: 5  },
                 compound_upper: { increment: 1.25, sets: 4, reps: 5  },
                 isolation:      { increment: 0.5,  sets: 3, reps: 6  } },
  hypertrophy: { compound_lower: { increment: 1.25, sets: 4, reps: 10 },
                 compound_upper: { increment: 0.5,  sets: 3, reps: 10 },
                 isolation:      { increment: 0.25, sets: 3, reps: 12 } },
  endurance:   { compound_lower: { increment: 0.5,  sets: 3, reps: 15 },
                 compound_upper: { increment: 0.25, sets: 3, reps: 15 },
                 isolation:      { increment: 0.25, sets: 2, reps: 18 } },
  fatloss:     { compound_lower: { increment: 0.5,  sets: 3, reps: 12 },
                 compound_upper: { increment: 0.25, sets: 3, reps: 12 },
                 isolation:      { increment: 0.25, sets: 3, reps: 15 } },
};

export function getSuggestion(goal, type) {
  const g = SUGGESTIONS[goal] ? goal : 'hypertrophy';
  const t = SUGGESTIONS[g][type] ? type : 'compound_lower';
  return SUGGESTIONS[g][t];
}
