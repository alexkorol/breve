import { useCallback, useState } from 'react';
import type { AppState } from './types';
import type { Grade } from './srs';
import { applyGrade, newProgress } from './srs';
import { loadState, saveState, dayKey, yesterdayKey } from './storage';
import { decks, DAILY_REVIEW_ID, dailyReviewDeck } from './data';
import { Home } from './components/Home';
import { Session } from './components/Session';
import { DeckDetail } from './components/DeckDetail';
import { StudyView } from './components/StudyView';

type View =
  | { name: 'home' }
  | { name: 'deck'; deckId: string }
  | { name: 'browse'; deckId: string }
  | { name: 'study'; deckId: string };

function findDeck(deckId: string) {
  return deckId === DAILY_REVIEW_ID ? dailyReviewDeck() : decks.find((d) => d.id === deckId);
}

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [view, setView] = useState<View>({ name: 'home' });

  const recordReview = useCallback((cardId: string, grade: Grade) => {
    setState((prev) => {
      const current = prev.progress[cardId] ?? newProgress();
      const today = dayKey();
      const stats = { ...prev.stats };
      stats.totalReviews += 1;
      stats.reviewsByDay = {
        ...stats.reviewsByDay,
        [today]: (stats.reviewsByDay[today] ?? 0) + 1,
      };
      if (stats.lastStudyDay !== today) {
        stats.streak = stats.lastStudyDay === yesterdayKey() ? stats.streak + 1 : 1;
        stats.lastStudyDay = today;
      }
      const next: AppState = {
        progress: { ...prev.progress, [cardId]: applyGrade(current, grade) },
        stats,
      };
      saveState(next);
      return next;
    });
  }, []);

  const importState = useCallback((imported: AppState) => {
    saveState(imported);
    setState(imported);
  }, []);

  if (view.name === 'study') {
    const deck = findDeck(view.deckId);
    if (deck) {
      const back = view.deckId === DAILY_REVIEW_ID ? { name: 'home' as const } : { name: 'deck' as const, deckId: view.deckId };
      return (
        <Session
          deck={deck}
          progress={state.progress}
          onReview={recordReview}
          onExit={() => setView(back)}
        />
      );
    }
  }

  if (view.name === 'browse') {
    const deck = findDeck(view.deckId);
    if (deck) {
      return <StudyView deck={deck} onBack={() => setView({ name: 'deck', deckId: view.deckId })} />;
    }
  }

  if (view.name === 'deck') {
    const deck = findDeck(view.deckId);
    if (deck) {
      return (
        <DeckDetail
          deck={deck}
          progress={state.progress}
          onPractice={() => setView({ name: 'study', deckId: view.deckId })}
          onStudy={() => setView({ name: 'browse', deckId: view.deckId })}
          onBack={() => setView({ name: 'home' })}
        />
      );
    }
  }

  return (
    <Home
      decks={decks}
      state={state}
      onImport={importState}
      onOpenDeck={(deckId) =>
        setView(deckId === DAILY_REVIEW_ID ? { name: 'study', deckId } : { name: 'deck', deckId })
      }
    />
  );
}
