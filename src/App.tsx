import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppState, Card, Deck } from './types';
import type { Grade } from './srs';
import { applyGrade, newProgress } from './srs';
import {
  loadState,
  saveState,
  dayKey,
  yesterdayKey,
  loadCustomDecks,
  saveCustomDecks,
  parseDeckFile,
  getSetting,
} from './storage';
import { deckJsonFromHash } from './share';
import { decks as builtinDecks, DAILY_REVIEW_ID, dailyReviewDeck } from './data';
import { Home } from './components/Home';
import { Session } from './components/Session';
import { DeckDetail } from './components/DeckDetail';
import { StudyView } from './components/StudyView';
import { Stats } from './components/Stats';
import { Settings } from './components/Settings';
import { Generate } from './components/Generate';
import { Postmortem } from './components/Postmortem';

const WEAK_ID = 'weak-cards';
const MISSES_ID = 'misses';

type View =
  | { name: 'home' }
  | { name: 'stats' }
  | { name: 'settings' }
  | { name: 'generate' }
  | { name: 'postmortem' }
  | { name: 'deck'; deckId: string }
  | { name: 'browse'; deckId: string }
  | { name: 'study'; deckId: string };

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [customDecks, setCustomDecks] = useState<Deck[]>(loadCustomDecks);
  const [view, setView] = useState<View>({ name: 'home' });
  const [hidePersonal, setHidePersonal] = useState(getSetting('hidePersonal') === 'on');
  const [shareNotice, setShareNotice] = useState('');
  const [pendingShared, setPendingShared] = useState<Deck | null>(null);

  const allDecks = useMemo(() => {
    const decks = [...builtinDecks, ...customDecks];
    return hidePersonal ? decks.filter((d) => d.track !== 'My Projects') : decks;
  }, [customDecks, hidePersonal]);

  const reviewsToday = state.stats.reviewsByDay[dayKey()] ?? 0;

  const addDeck = useCallback((deck: Deck) => {
    setCustomDecks((prev) => {
      const next = [...prev, deck];
      saveCustomDecks(next);
      return next;
    });
  }, []);

  // Shared-deck links: #deck=gz.… — validate and offer to import.
  useEffect(() => {
    if (!location.hash.startsWith('#deck=')) return;
    void (async () => {
      try {
        const json = await deckJsonFromHash(location.hash);
        if (!json) return;
        const deck = parseDeckFile(json, [...builtinDecks, ...loadCustomDecks()]);
        setPendingShared(deck);
      } catch (e) {
        setShareNotice(
          `Couldn’t import shared deck: ${e instanceof Error ? e.message : 'invalid link'}`,
        );
      } finally {
        history.replaceState(null, '', location.pathname + location.search);
      }
    })();
  }, [addDeck]);

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

  const recordReview = useCallback((cardId: string, grade: Grade, recallScore?: number) => {
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
      const applied = applyGrade(current, grade);
      const recall = recallScore ?? current.recall;
      const next: AppState = {
        progress: { ...prev.progress, [cardId]: recall === undefined ? applied : { ...applied, recall } },
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

  const removeDeck = useCallback((deckId: string) => {
    setCustomDecks((prev) => {
      const next = prev.filter((d) => d.id !== deckId);
      saveCustomDecks(next);
      return next;
    });
    setView({ name: 'home' });
  }, []);

  const appendToMisses = useCallback((cards: Card[]) => {
    setCustomDecks((prev) => {
      const existing = prev.find((d) => d.id === MISSES_ID);
      const next = existing
        ? prev.map((d) => (d.id === MISSES_ID ? { ...d, cards: [...d.cards, ...cards] } : d))
        : [
            ...prev,
            {
              id: MISSES_ID,
              title: 'Interview Misses',
              description: 'Drills built from your own postmortems — never stumble twice.',
              icon: '🎯',
              color: '#f85149',
              track: 'My Projects',
              custom: true,
              cards,
            },
          ];
      saveCustomDecks(next);
      return next;
    });
    setView({ name: 'deck', deckId: MISSES_ID });
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

  if (view.name === 'settings') {
    return (
      <Settings
        state={state}
        onImport={importState}
        onHidePersonalChange={setHidePersonal}
        onBack={() => setView({ name: 'home' })}
      />
    );
  }

  if (view.name === 'generate') {
    return (
      <Generate
        decks={allDecks}
        onSave={(deck) => {
          addDeck(deck);
          setView({ name: 'deck', deckId: deck.id });
        }}
        onOpenSettings={() => setView({ name: 'settings' })}
        onBack={() => setView({ name: 'home' })}
      />
    );
  }

  if (view.name === 'postmortem') {
    return (
      <Postmortem
        onSave={appendToMisses}
        onOpenSettings={() => setView({ name: 'settings' })}
        onBack={() => setView({ name: 'home' })}
      />
    );
  }

  return (
    <Home
      decks={allDecks}
      state={state}
      shareNotice={shareNotice}
      pendingShared={pendingShared}
      onAcceptShared={() => {
        if (pendingShared) {
          addDeck(pendingShared);
          setShareNotice(`Added "${pendingShared.title}" — find it under ${pendingShared.track}.`);
          setPendingShared(null);
        }
      }}
      onDismissShared={() => setPendingShared(null)}
      onAddDeck={addDeck}
      onOpenStats={() => setView({ name: 'stats' })}
      onOpenSettings={() => setView({ name: 'settings' })}
      onOpenGenerate={() => setView({ name: 'generate' })}
      onOpenPostmortem={() => setView({ name: 'postmortem' })}
      onOpenDeck={(deckId) =>
        setView(deckId === DAILY_REVIEW_ID ? { name: 'study', deckId } : { name: 'deck', deckId })
      }
    />
  );
}
