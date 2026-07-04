import type { Deck } from '../types';
import { pythonBasics } from './pythonBasics';
import { pythonAdvanced } from './pythonAdvanced';
import { dsaInterview } from './dsaInterview';
import { patternsIntervals } from './patternsIntervals';
import { patternsGraphsDp } from './patternsGraphsDp';
import { sqlInterview } from './sqlInterview';
import { mlFundamentals } from './mlFundamentals';
import { mlMetrics } from './mlMetrics';
import { dataCleaning } from './dataCleaning';
import { pandasNumpy } from './pandasNumpy';
import { dlCore } from './dlCore';
import { llmTransformers } from './llmTransformers';
import { aiEngineering } from './aiEngineering';
import { pyPairs } from './pyPairs';
import { fastapiServing } from './fastapiServing';
import { llmEvalBias } from './llmEvalBias';
import { projSongcraft } from './projSongcraft';
import { projProsodyJudge } from './projProsodyJudge';
import { projLedgerlens } from './projLedgerlens';
import { credAi103 } from './credAi103';
import { credHfAgents } from './credHfAgents';

/** Curriculum order: decks appear grouped by track, in this sequence. */
export const decks: Deck[] = [
  pythonBasics,
  pythonAdvanced,
  pyPairs,
  dsaInterview,
  patternsIntervals,
  patternsGraphsDp,
  sqlInterview,
  mlFundamentals,
  mlMetrics,
  dataCleaning,
  pandasNumpy,
  dlCore,
  llmTransformers,
  aiEngineering,
  fastapiServing,
  llmEvalBias,
  projLedgerlens,
  projSongcraft,
  projProsodyJudge,
  credAi103,
  credHfAgents,
];

/** Virtual deck: every card in the curriculum, for cross-deck daily review. */
export const DAILY_REVIEW_ID = 'daily-review';

export function dailyReviewDeck(): Deck {
  return {
    id: DAILY_REVIEW_ID,
    title: 'Daily Review',
    description: 'Everything due today, across all decks.',
    icon: '📆',
    color: '#2dd4bf',
    track: '',
    cards: decks.flatMap((d) => d.cards),
  };
}
