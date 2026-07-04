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
import { pyStrings } from './pyStrings';
import { pyGotchas } from './pyGotchas';
import { pyOopTesting } from './pyOopTesting';
import { bigO } from './bigO';
import { patternsBinsearch } from './patternsBinsearch';
import { patternsLinked } from './patternsLinked';
import { patternsStringsHash } from './patternsStringsHash';
import { statsProb } from './statsProb';
import { featureEng } from './featureEng';
import { sklearnWorkflow } from './sklearnWorkflow';
import { promptEng } from './promptEng';
import { finetuning } from './finetuning';
import { embeddingsDeep } from './embeddingsDeep';
import { inferenceOpt } from './inferenceOpt';
import { aiSysDesign } from './aiSysDesign';
import { azureAiServices } from './azureAiServices';

/** Curriculum order: decks appear grouped by track, in this sequence. */
export const decks: Deck[] = [
  pythonBasics,
  pythonAdvanced,
  pyPairs,
  pyStrings,
  pyGotchas,
  pyOopTesting,
  bigO,
  dsaInterview,
  patternsIntervals,
  patternsBinsearch,
  patternsLinked,
  patternsStringsHash,
  patternsGraphsDp,
  sqlInterview,
  mlFundamentals,
  statsProb,
  mlMetrics,
  dataCleaning,
  pandasNumpy,
  sklearnWorkflow,
  featureEng,
  dlCore,
  llmTransformers,
  promptEng,
  embeddingsDeep,
  aiEngineering,
  fastapiServing,
  inferenceOpt,
  llmEvalBias,
  finetuning,
  aiSysDesign,
  projLedgerlens,
  projSongcraft,
  projProsodyJudge,
  credAi103,
  credHfAgents,
  azureAiServices,
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
