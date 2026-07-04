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

/** Curriculum order: decks appear grouped by track, in this sequence. */
export const decks: Deck[] = [
  pythonBasics,
  pythonAdvanced,
  dsaInterview,
  patternsIntervals,
  patternsGraphsDp,
  sqlInterview,
  mlFundamentals,
  mlMetrics,
  dataCleaning,
  pandasNumpy,
];
