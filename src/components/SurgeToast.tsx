import { useEffect } from 'react';
import { Flame } from './Flame';

const LABELS: Record<number, string> = {
  1: 'First spark of the day',
  5: 'Warming up',
  10: 'Catching fire',
  20: 'Steady burn',
  30: 'Daily goal — full flame',
  40: 'Roaring',
  60: 'Inferno',
  100: 'Supernova',
};

interface Props {
  checkpoint: number;
  streak: number;
  intensity: number;
  onDone: () => void;
}

/**
 * Quick, non-blocking flash when a daily-intensity checkpoint is crossed.
 * Deliberately small and self-dismissing — the big celebrations belong to
 * rare streak milestones, not the daily grind.
 */
export function SurgeToast({ checkpoint, streak, intensity, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="surge-toast" role="status">
      <Flame streak={streak} intensity={intensity} size={26} />
      <div>
        <strong>{LABELS[checkpoint] ?? `Intensity ${checkpoint}`}</strong>
        <span>{checkpoint} today — the flame burns brighter</span>
      </div>
    </div>
  );
}
