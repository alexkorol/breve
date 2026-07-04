import { useCallback, useState } from 'react';
import type { AppState } from './types';
import type { Grade } from './srs';
import { applyGrade, newProgress } from './srs';
import { loadState, saveState, dayKey, yesterdayKey } from './storage';
import { decks } from './data';
import { Home } from './components/Home';
import { Session } from './components/Session';

type View = { name: 'home' } | { name: 'study'; deckId: string };

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

  if (view.name === 'study') {
    const deck = decks.find((d) => d.id === view.deckId);
    if (deck) {
      return (
        <Session
          deck={deck}
          progress={state.progress}
          onReview={recordReview}
          onExit={() => setView({ name: 'home' })}
        />
      );
    }
  }

  return <Home decks={decks} state={state} onOpenDeck={(deckId) => setView({ name: 'study', deckId })} />;
}
