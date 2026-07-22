import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AppState, Card, CardKind, Deck } from './types';
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
  setSetting,
} from './storage';
import { deckJsonFromHash } from './share';
import { loadPlan } from './membership';
import { gateDecks, gatingActive } from './gating';
import { reconcileEntitlement } from './iap';
import { Paywall } from './components/Paywall';
import { Welcome } from './components/Welcome';
import { decks as builtinDecks, DAILY_REVIEW_ID, dailyReviewDeck } from './data';
import { Home } from './components/Home';
import { Session } from './components/Session';
import { DeckDetail } from './components/DeckDetail';
import { StudyView } from './components/StudyView';
import { Stats } from './components/Stats';
import { Settings } from './components/Settings';
import { Generate } from './components/Generate';
import { Postmortem } from './components/Postmortem';
import { SurgeToast } from './components/SurgeToast';
import { crossedCheckpoint, dayIntensity } from './flame';

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
  | { name: 'study'; deckId: string; kind?: CardKind };

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [customDecks, setCustomDecks] = useState<Deck[]>(loadCustomDecks);
  const [view, setView] = useState<View>({ name: 'home' });
  const [shareNotice, setShareNotice] = useState('');
  const [pendingShared, setPendingShared] = useState<Deck | null>(null);
  const [plan, setPlan] = useState(loadPlan);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showWelcome, setShowWelcome] = useState(
    () => getSetting('onboarded') !== 'done' && loadState().stats.totalReviews === 0,
  );
  const finishWelcome = (startSession: boolean) => {
    setSetting('onboarded', 'done');
    setShowWelcome(false);
    if (startSession) setView({ name: 'study', deckId: 'big-o' });
  };

  // Fresh install or restored backup: StoreKit may know about a purchase the
  // local plan doesn't. Grant it silently.
  useEffect(() => {
    void reconcileEntitlement().then((restored) => {
      if (restored) setPlan(restored);
    });
  }, []);

  const gated = gatingActive(plan);
  const allDecks = useMemo(
    () => gateDecks([...builtinDecks, ...customDecks], gated),
    [customDecks, gated],
  );

  const reviewsToday = state.stats.reviewsByDay[dayKey()] ?? 0;

  // Quick, non-invasive celebration when today's intensity crosses a checkpoint.
  const [surge, setSurge] = useState<{ checkpoint: number; at: number } | null>(null);
  const intensityToday = dayIntensity(state.stats);
  const prevIntensity = useRef(intensityToday);
  useEffect(() => {
    const checkpoint = crossedCheckpoint(prevIntensity.current, intensityToday);
    prevIntensity.current = intensityToday;
    if (checkpoint !== undefined) setSurge({ checkpoint, at: Date.now() });
  }, [intensityToday]);

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

  /** A full deck read counts as 1 toward daily intensity, once per deck per day. */
  const recordDeckRead = useCallback((deckId: string) => {
    setState((prev) => {
      const today = dayKey();
      const read = prev.stats.readsByDay[today] ?? [];
      if (read.includes(deckId)) return prev;
      const next: AppState = {
        ...prev,
        stats: {
          ...prev.stats,
          readsByDay: { ...prev.stats.readsByDay, [today]: [...read, deckId] },
        },
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
              description: 'Drills built from your own postmortems: never stumble twice.',
              icon: '🎯',
              color: '#f85149',
              track: 'Imported',
              custom: true,
              cards,
            },
          ];
      saveCustomDecks(next);
      return next;
    });
    setView({ name: 'deck', deckId: MISSES_ID });
  }, []);

  const screen = (() => {
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
          sourceDecks={isVirtual ? allDecks : undefined}
          options={{
            kind: view.kind,
            // Daily Review never introduces new cards — it can only shrink.
            includeNew: view.deckId !== DAILY_REVIEW_ID,
          }}
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
      return (
        <StudyView
          deck={deck}
          onRead={() => recordDeckRead(deck.id)}
          onBack={() => setView({ name: 'deck', deckId: view.deckId })}
        />
      );
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
          onUnlock={deck.locked ? () => setShowPaywall(true) : undefined}
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
        onUnlock={gated ? () => setShowPaywall(true) : undefined}
        onPlanChange={setPlan}
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
      onOpenDeck={(deckId, kind) =>
        setView(
          deckId === DAILY_REVIEW_ID ? { name: 'study', deckId, kind } : { name: 'deck', deckId },
        )
      }
    />
  );
  })();

  return (
    <>
      {screen}
      {showWelcome && (
        <Welcome onStart={() => finishWelcome(true)} onDismiss={() => finishWelcome(false)} />
      )}
      {showPaywall && (
        <Paywall
          deckCount={builtinDecks.length}
          cardCount={builtinDecks.reduce((n, d) => n + d.cards.length, 0)}
          onUnlocked={(p) => {
            setPlan(p);
            setShowPaywall(false);
          }}
          onClose={() => setShowPaywall(false)}
        />
      )}
      {surge && (
        <SurgeToast
          key={surge.at}
          checkpoint={surge.checkpoint}
          streak={state.stats.streak}
          intensity={intensityToday}
          onDone={() => setSurge(null)}
        />
      )}
    </>
  );
}
