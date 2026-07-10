import { useCallback, useMemo, useState } from 'react';
import type { AppState, Deck } from './types';
import type { Grade } from './srs';
import { applyGrade, newProgress } from './srs';
import {
  loadState,
  saveState,
  dayKey,
  yesterdayKey,
  loadCustomDecks,
  saveCustomDecks,
} from './storage';
import { decks as builtinDecks, DAILY_REVIEW_ID, dailyReviewDeck } from './data';
import { Home } from './components/Home';
import { Session } from './components/Session';
import { DeckDetail } from './components/DeckDetail';
import { StudyView } from './components/StudyView';
import { Stats } from './components/Stats';

const WEAK_ID = 'weak-cards';

type View =
  | { name: 'home' }
  | { name: 'stats' }
  | { name: 'deck'; deckId: string }
  | { name: 'browse'; deckId: string }
  | { name: 'study'; deckId: string };

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [customDecks, setCustomDecks] = useState<Deck[]>(loadCustomDecks);
  const [view, setView] = useState<View>({ name: 'home' });

  const allDecks = useMemo(() => [...builtinDecks, ...customDecks], [customDecks]);
  const reviewsToday = state.stats.reviewsByDay[dayKey()] ?? 0;

  const findDeck = useCallback(
    (deckId: string): Deck | undefined => {
      if (deckId === DAILY_REVIEW_ID) return dailyReviewDeck(allDecks);
      if (deckId === WEAK_ID) {
        const index = new Map(allDecks.flatMap((d) => d.cards).map((c) => [c.id, c]));
        const cards = Object.entries(state.progress)
          .filter(([id, p]) => p.lapses >= 2 && index.has(id))
          .sort((a, b) => b[1].lapses - a[1].lapses)
          .slice(0, 20)
          .map(([id]) => index.get(id)!);
        return {
          id: WEAK_ID,
          title: 'Weak Cards',
          description: 'The cards you keep missing.',
          icon: '🩹',
          color: '#f85149',
          track: '',
          cards,
        };
      }
      return allDecks.find((d) => d.id === deckId);
    },
    [allDecks, state.progress],
  );

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

  const addDeck = useCallback((deck: Deck) => {
    setCustomDecks((prev) => {
      const next = [...prev, deck];
      saveCustomDecks(next);
      return next;
    });
  }, []);

  const removeDeck = useCallback((deckId: string) => {
    setCustomDecks((prev) => {
      const next = prev.filter((d) => d.id !== deckId);
      saveCustomDecks(next);
      return next;
    });
    setView({ name: 'home' });
  }, []);

  if (view.name === 'study') {
    const deck = findDeck(view.deckId);
    if (deck) {
      const isVirtual = view.deckId === DAILY_REVIEW_ID || view.deckId === WEAK_ID;
      const back: View =
        view.deckId === WEAK_ID
          ? { name: 'stats' }
          : isVirtual
            ? { name: 'home' }
            : { name: 'deck', deckId: view.deckId };
      return (
        <Session
          deck={deck}
          progress={state.progress}
          forceAll={view.deckId === WEAK_ID}
          reviewsToday={reviewsToday}
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
          onRemove={deck.custom ? () => removeDeck(deck.id) : undefined}
          onBack={() => setView({ name: 'home' })}
        />
      );
    }
  }

  if (view.name === 'stats') {
    return (
      <Stats
        decks={allDecks}
        state={state}
        onPracticeWeak={() => setView({ name: 'study', deckId: WEAK_ID })}
        onBack={() => setView({ name: 'home' })}
      />
    );
  }

  return (
    <Home
      decks={allDecks}
      state={state}
      onImport={importState}
      onAddDeck={addDeck}
      onOpenStats={() => setView({ name: 'stats' })}
      onOpenDeck={(deckId) =>
        setView(deckId === DAILY_REVIEW_ID ? { name: 'study', deckId } : { name: 'deck', deckId })
      }
    />
  );
}
