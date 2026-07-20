import { useEffect, useRef, useState } from 'react';
import type { FlashCard } from '../types';
import type { Grade } from '../srs';
import { gradeRecall, type RecallResult } from '../ai';
import { getSetting } from '../storage';
import { Rich, CodeBlock } from './Rich';

interface Props {
  card: FlashCard;
  onGrade: (grade: Grade, recallScore?: number) => void;
  /** Fall back to classic flip mode (API failed / user opted out). */
  onFallback: () => void;
}

const GRADE_LABELS = ['Missed', 'Almost', 'Got it', 'Nailed it'] as const;
const TIMER_SECONDS = 60;

type SpeechRecognitionCtor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

function speechCtor(): SpeechRecognitionCtor | undefined {
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as SpeechRecognitionCtor | undefined;
}

export function RecallView({ card, onGrade, onFallback }: Props) {
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<'answering' | 'grading' | 'graded'>('answering');
  const [result, setResult] = useState<RecallResult | null>(null);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const timerEnabled = getSetting('recallTimer') === 'on';
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const recognition = useRef<InstanceType<SpeechRecognitionCtor> | null>(null);
  const submitted = useRef(false);

  // Interview-pressure timer: auto-submits whatever is typed when it expires.
  useEffect(() => {
    if (!timerEnabled || phase !== 'answering') return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timerEnabled, phase]);

  useEffect(() => {
    if (timerEnabled && secondsLeft === 0 && phase === 'answering') void submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const toggleMic = () => {
    const Ctor = speechCtor();
    if (!Ctor) return;
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (e) => {
      const parts: string[] = [];
      for (let i = 0; i < e.results.length; i++) parts.push(e.results[i][0].transcript);
      setAnswer((prev) => (prev ? `${prev} ` : '') + parts.join(' '));
    };
    rec.onend = () => setListening(false);
    recognition.current = rec;
    rec.start();
    setListening(true);
  };

  const submit = async () => {
    if (submitted.current) return;
    submitted.current = true;
    recognition.current?.stop();
    setPhase('grading');
    try {
      const r = await gradeRecall(card.front, card.back, answer.trim() || '(no answer given)');
      setResult(r);
      setPhase('graded');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Grading failed.');
      submitted.current = false;
      setPhase('answering');
    }
  };

  return (
    <div className="card-view">
      <p className="prompt">
        <Rich text={card.front} />
      </p>
      {card.code && <CodeBlock code={card.code} />}

      {phase === 'answering' && (
        <>
          {timerEnabled && (
            <div className="recall-timer">
              <div
                className={`recall-timer-fill ${secondsLeft <= 10 ? 'low' : ''}`}
                style={{ width: `${(secondsLeft / TIMER_SECONDS) * 100}%` }}
              />
            </div>
          )}
          <textarea
            className="recall-input"
            placeholder="Answer from memory — as you would say it in the interview…"
            value={answer}
            rows={6}
            autoFocus
            onChange={(e) => setAnswer(e.target.value)}
          />
          {error && <p className="import-error">{error}</p>}
          <div className="recall-actions">
            {speechCtor() && (
              <button className={`btn ghost ${listening ? 'listening' : ''}`} onClick={toggleMic}>
                {listening ? '⏹ Stop dictating' : '🎙 Dictate'}
              </button>
            )}
            <button className="btn primary" disabled={!answer.trim()} onClick={() => void submit()}>
              Grade my answer
            </button>
          </div>
          <button className="link-btn" onClick={onFallback}>
            Skip — just show the answer
          </button>
        </>
      )}

      {phase === 'grading' && <div className="recall-grading">Grading against the rubric…</div>}

      {phase === 'graded' && result && (
        <>
          <div className={`recall-score ${result.grade >= 2 ? 'ok' : 'bad'}`}>
            <span className="recall-score-num">{result.score}</span>
            <div className="recall-score-info">
              <strong>{GRADE_LABELS[result.grade]}</strong>
              <p>{result.feedback}</p>
            </div>
          </div>
          <div className="flash-back">
            <Rich text={card.back} />
          </div>
          <div className="grade-actions">
            <button
              className="btn primary block"
              onClick={() => onGrade(result.grade, result.score)}
            >
              Continue
            </button>
            <div className="grade-overrides">
              {result.grade >= 2 ? (
                <button className="link-btn" onClick={() => onGrade(0, result.score)}>
                  Actually, I missed it
                </button>
              ) : (
                <button className="link-btn" onClick={() => onGrade(2, result.score)}>
                  Actually, I knew it
                </button>
              )}
              {result.grade === 2 && (
                <button className="link-btn" onClick={() => onGrade(3, result.score)}>
                  Too easy
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
